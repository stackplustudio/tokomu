import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mengambil keranjang user beserta rincian harga terkini dan total (FR-31 & FR-39).
   */
  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                name: true,
                priceIdr: true,
                stock: true,
                imageUrls: true,
                isActive: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  priceIdr: true,
                  stock: true,
                  imageUrls: true,
                  isActive: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    // Hitung subtotal & total di backend secara otoritatif (FR-25 & FR-31)
    let subtotalIdr = 0;
    const formattedItems = cart.items.map((item) => {
      const lineTotalIdr = item.product.priceIdr * item.quantity;
      subtotalIdr += lineTotalIdr;
      return {
        id: item.id,
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        lineTotalIdr,
        createdAt: item.createdAt,
      };
    });

    return {
      id: cart.id,
      userId: cart.userId,
      items: formattedItems,
      subtotalIdr,
      totalIdr: subtotalIdr, // MVP: belum ada pajak/ongkir
      totalQuantity: formattedItems.reduce((acc, it) => acc + it.quantity, 0),
    };
  }

  /**
   * Menambahkan produk ke keranjang belanja (FR-31 & FR-32).
   */
  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(
        'Produk tidak ditemukan atau sudah tidak aktif',
      );
    }

    const quantityToAdd = dto.quantity || 1;

    if (product.stock < quantityToAdd) {
      throw new BadRequestException(
        `Stok produk tidak mencukupi (tersedia: ${product.stock})`,
      );
    }

    // Pastikan cart ada
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantityToAdd;
      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `Jumlah melebihi stok yang tersedia (tersedia: ${product.stock})`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: quantityToAdd,
        },
      });
    }

    return this.getCart(userId);
  }

  /**
   * Mengubah jumlah kuantitas item dalam keranjang.
   */
  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Keranjang tidak ditemukan');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      include: { product: true },
    });

    if (!existingItem) {
      throw new NotFoundException('Produk tidak ada di dalam keranjang');
    }

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      if (quantity > existingItem.product.stock) {
        throw new BadRequestException(
          `Jumlah melebihi stok yang tersedia (tersedia: ${existingItem.product.stock})`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    }

    return this.getCart(userId);
  }

  /**
   * Menghapus produk tertentu dari keranjang.
   */
  async removeItem(userId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Keranjang tidak ditemukan');
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return this.getCart(userId);
  }

  /**
   * Mengosongkan keranjang belanja.
   */
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(userId);
  }
}
