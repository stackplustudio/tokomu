import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('CartController', () => {
  let controller: CartController;

  const mockUser: AuthUser = {
    id: 'u-1',
    email: 'user@tokomu.com',
    role: 'USER',
  };

  const mockService = {
    getCart: jest.fn(),
    addItem: jest.fn(),
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get cart', async () => {
    mockService.getCart.mockResolvedValue({ id: 'cart-1', items: [] });
    const result = await controller.getCart(mockUser);
    expect(result.id).toBe('cart-1');
    expect(mockService.getCart).toHaveBeenCalledWith('u-1');
  });

  it('should add item', async () => {
    mockService.addItem.mockResolvedValue({ id: 'cart-1' });
    const result = await controller.addItem(mockUser, {
      productId: 'p-1',
      quantity: 2,
    });
    expect(result.id).toBe('cart-1');
  });

  it('should update quantity', async () => {
    mockService.updateQuantity.mockResolvedValue({ id: 'cart-1' });
    const result = await controller.updateQuantity(mockUser, 'p-1', {
      quantity: 3,
    });
    expect(result.id).toBe('cart-1');
  });

  it('should remove item', async () => {
    mockService.removeItem.mockResolvedValue({ id: 'cart-1' });
    const result = await controller.removeItem(mockUser, 'p-1');
    expect(result.id).toBe('cart-1');
  });

  it('should clear cart', async () => {
    mockService.clearCart.mockResolvedValue({ id: 'cart-1', items: [] });
    const result = await controller.clearCart(mockUser);
    expect(result.items).toHaveLength(0);
  });
});
