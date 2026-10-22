import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checkout simulasi atomik dengan prisma.$transaction (FR-33 & FR-34).
   * - Validasi stok produk terkini dari database
   * - Pengurangan stok kondisional atomik
   * - Snapshot nama dan harga di OrderItem
   * - Mengosongkan keranjang belanja
   */
  async checkout(userId: string, dto: CheckoutDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Ambil keranjang user beserta produk
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Keranjang belanja kosong');
      }

      // 2. Validasi stok setiap produk
      let subtotalIdr = 0;
      for (const item of cart.items) {
        if (!item.product.isActive) {
          throw new BadRequestException(
            `Produk "${item.product.name}" sudah tidak aktif atau ditarik dari katalog`,
          );
        }

        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Stok untuk "${item.product.name}" tidak mencukupi (tersedia: ${item.product.stock})`,
          );
        }

        subtotalIdr += item.product.priceIdr * item.quantity;
      }

      // 3. Buat pesanan (Order) beserta snapshot OrderItem
      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.SIMULATED,
          subtotalIdr,
          totalIdr: subtotalIdr,
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingAddress: dto.shippingAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              unitPriceIdr: item.product.priceIdr,
              quantity: item.quantity,
              lineTotalIdr: item.product.priceIdr * item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 4. Potong stok produk secara atomik
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 5. Kosongkan keranjang
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  /**
   * Mengambil riwayat pesanan milik customer yang sedang login (FR-35).
   */
  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  }

  /**
   * Mengambil detail pesanan milik user sendiri dengan pencegahan IDOR (FR-35).
   */
  async findUserOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(
        `Pesanan dengan ID "${orderId}" tidak ditemukan`,
      );
    }

    // Pencegahan IDOR: hanya pemilik data yang boleh mengakses
    if (order.userId !== userId) {
      throw new ForbiddenException('Anda tidak berhak melihat pesanan ini');
    }

    return order;
  }

  /**
   * Mengambil semua pesanan untuk panel admin (FR-37).
   */
  async findAllOrders(query: QueryOrderDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(Math.max(1, query.limit || 20), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          items: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Memperbarui status pesanan sesuai aturan transisi yang sah (FR-37 & PRD §6.5).
   */
  async updateOrderStatus(orderId: string, nextStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Pesanan dengan ID "${orderId}" tidak ditemukan`,
      );
    }

    // Aturan transisi status (PRD §6.5)
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `Transisi status dari "${order.status}" ke "${nextStatus}" tidak diizinkan`,
      );
    }

    // Jika dibatalkan dari PENDING atau CONFIRMED, kembalikan stok secara atomik
    if (
      nextStatus === OrderStatus.CANCELLED &&
      (order.status === OrderStatus.PENDING ||
        order.status === OrderStatus.CONFIRMED)
    ) {
      return this.prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        return tx.order.update({
          where: { id: orderId },
          data: { status: nextStatus },
          include: { items: true },
        });
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: { items: true },
    });
  }
}
