import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
      },
      cartItem: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('getCart', () => {
    it('should return cart with calculated subtotal and total', async () => {
      prisma.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        userId: 'u-1',
        items: [
          {
            id: 'item-1',
            productId: 'p-1',
            quantity: 2,
            createdAt: new Date(),
            product: {
              id: 'p-1',
              priceIdr: 500000,
              name: 'AirMax',
              stock: 10,
              isActive: true,
            },
          },
        ],
      });

      const result = await service.getCart('u-1');
      expect(result.subtotalIdr).toBe(1000000);
      expect(result.totalIdr).toBe(1000000);
      expect(result.totalQuantity).toBe(2);
    });

    it('should create new cart if user does not have one yet', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      prisma.cart.create.mockResolvedValue({
        id: 'new-cart',
        userId: 'u-2',
        items: [],
      });

      const result = await service.getCart('u-2');
      expect(result.id).toBe('new-cart');
      expect(result.subtotalIdr).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should throw NotFoundException if product does not exist or inactive', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(
        service.addItem('u-1', { productId: 'p-none', quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'p-1',
        stock: 2,
        isActive: true,
      });

      await expect(
        service.addItem('u-1', { productId: 'p-1', quantity: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create new CartItem when product not in cart', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'p-1',
        stock: 10,
        isActive: true,
      });
      prisma.cart.upsert.mockResolvedValue({ id: 'cart-1', userId: 'u-1' });
      prisma.cartItem.findUnique.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({ id: 'ci-1' });

      // Mock getCart returning the updated cart
      prisma.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        userId: 'u-1',
        items: [],
      });

      const result = await service.addItem('u-1', {
        productId: 'p-1',
        quantity: 1,
      });
      expect(prisma.cartItem.create).toHaveBeenCalled();
      expect(result.id).toBe('cart-1');
    });

    it('should update quantity when product already in cart', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'p-1',
        stock: 10,
        isActive: true,
      });
      prisma.cart.upsert.mockResolvedValue({ id: 'cart-1', userId: 'u-1' });
      prisma.cartItem.findUnique.mockResolvedValue({
        id: 'ci-1',
        quantity: 2,
      });

      prisma.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        userId: 'u-1',
        items: [],
      });

      await service.addItem('u-1', { productId: 'p-1', quantity: 1 });
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'ci-1' },
        data: { quantity: 3 },
      });
    });
  });

  describe('updateQuantity', () => {
    const cartWithItems = {
      id: 'cart-1',
      userId: 'u-1',
      items: [],
    };

    it('should delete item if quantity <= 0', async () => {
      prisma.cart.findUnique
        .mockResolvedValueOnce({ id: 'cart-1', userId: 'u-1' })
        .mockResolvedValueOnce(cartWithItems);
      prisma.cartItem.findUnique.mockResolvedValue({
        id: 'ci-1',
        product: { stock: 10 },
      });

      await service.updateQuantity('u-1', 'p-1', 0);
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'ci-1' },
      });
    });

    it('should update quantity if within stock', async () => {
      prisma.cart.findUnique
        .mockResolvedValueOnce({ id: 'cart-1', userId: 'u-1' })
        .mockResolvedValueOnce(cartWithItems);
      prisma.cartItem.findUnique.mockResolvedValue({
        id: 'ci-1',
        product: { stock: 10 },
      });

      await service.updateQuantity('u-1', 'p-1', 4);
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'ci-1' },
        data: { quantity: 4 },
      });
    });
  });

  describe('removeItem and clearCart', () => {
    const cartWithItems = {
      id: 'cart-1',
      userId: 'u-1',
      items: [],
    };

    it('should remove item', async () => {
      prisma.cart.findUnique
        .mockResolvedValueOnce({ id: 'cart-1', userId: 'u-1' })
        .mockResolvedValueOnce(cartWithItems);
      await service.removeItem('u-1', 'p-1');
      expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    });

    it('should clear cart', async () => {
      prisma.cart.findUnique
        .mockResolvedValueOnce({ id: 'cart-1', userId: 'u-1' })
        .mockResolvedValueOnce(cartWithItems);
      await service.clearCart('u-1');
      expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    });
  });
});
