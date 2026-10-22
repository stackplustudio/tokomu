import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      order: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      cart: {
        findUnique: jest.fn(),
      },
      cartItem: {
        deleteMany: jest.fn(),
      },
      product: {
        update: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('checkout', () => {
    it('should throw BadRequestException if cart is empty or not found', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);

      await expect(
        service.checkout('u-1', {
          shippingName: 'Budi',
          shippingPhone: '08123456789',
          shippingAddress: 'Jakarta',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if item stock is insufficient', async () => {
      prisma.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        items: [
          {
            productId: 'p-1',
            quantity: 5,
            product: { name: 'AirMax', stock: 2, isActive: true },
          },
        ],
      });

      await expect(
        service.checkout('u-1', {
          shippingName: 'Budi',
          shippingPhone: '08123456789',
          shippingAddress: 'Jakarta',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should succeed in transaction and decrement stock', async () => {
      prisma.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        items: [
          {
            productId: 'p-1',
            quantity: 2,
            product: {
              id: 'p-1',
              name: 'AirMax',
              priceIdr: 1000000,
              stock: 10,
              isActive: true,
            },
          },
        ],
      });

      prisma.order.create.mockResolvedValue({
        id: 'order-1',
        subtotalIdr: 2000000,
        totalIdr: 2000000,
        status: OrderStatus.PENDING,
      });

      const result = await service.checkout('u-1', {
        shippingName: 'Budi',
        shippingPhone: '08123456789',
        shippingAddress: 'Jakarta',
      });

      expect(result.id).toBe('order-1');
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { stock: { decrement: 2 } },
      });
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
    });
  });

  describe('findUserOrderById (IDOR Defense)', () => {
    it('should return order if caller is the owner', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        userId: 'u-1',
      });

      const result = await service.findUserOrderById('u-1', 'order-1');
      expect(result.id).toBe('order-1');
    });

    it('should throw ForbiddenException if order belongs to another user', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        userId: 'u-victim',
      });

      await expect(
        service.findUserOrderById('u-attacker', 'order-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.findUserOrderById('u-1', 'order-nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrderStatus (State Machine & Stock Restoration)', () => {
    it('should allow valid transition PENDING -> CONFIRMED', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
        items: [],
      });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CONFIRMED,
      });

      const result = await service.updateOrderStatus(
        'order-1',
        OrderStatus.CONFIRMED,
      );
      expect(result.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should reject invalid transition PENDING -> SHIPPED', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
        items: [],
      });

      await expect(
        service.updateOrderStatus('order-1', OrderStatus.SHIPPED),
      ).rejects.toThrow(BadRequestException);
    });

    it('should restore stock when order is CANCELLED from PENDING', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PENDING,
        items: [{ productId: 'p-1', quantity: 2 }],
      });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CANCELLED,
      });

      await service.updateOrderStatus('order-1', OrderStatus.CANCELLED);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { stock: { increment: 2 } },
      });
    });
  });
});
