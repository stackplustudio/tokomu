import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { OrderStatus } from '@prisma/client';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockUser: AuthUser = {
    id: 'u-1',
    email: 'user@tokomu.com',
    role: 'USER',
  };

  const mockService = {
    checkout: jest.fn(),
    findUserOrders: jest.fn(),
    findUserOrderById: jest.fn(),
    findAllOrders: jest.fn(),
    updateOrderStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should checkout order', async () => {
    const dto = {
      shippingName: 'Budi',
      shippingPhone: '081234',
      shippingAddress: 'Jl. Sudirman',
    };
    mockService.checkout.mockResolvedValue({ id: 'order-1' });
    const result = await controller.checkout(mockUser, dto);
    expect(result.id).toBe('order-1');
  });

  it('should find user orders', async () => {
    mockService.findUserOrders.mockResolvedValue([{ id: 'order-1' }]);
    const result = await controller.findUserOrders(mockUser);
    expect(result).toHaveLength(1);
  });

  it('should find user order by id', async () => {
    mockService.findUserOrderById.mockResolvedValue({ id: 'order-1' });
    const result = await controller.findUserOrderById(mockUser, 'order-1');
    expect(result.id).toBe('order-1');
  });

  it('should find all orders for admin', async () => {
    mockService.findAllOrders.mockResolvedValue({ data: [], meta: {} });
    const result = await controller.findAllOrders({});
    expect(result.data).toBeDefined();
  });

  it('should update order status for admin', async () => {
    mockService.updateOrderStatus.mockResolvedValue({
      id: 'order-1',
      status: OrderStatus.CONFIRMED,
    });
    const result = await controller.updateOrderStatus('order-1', {
      status: OrderStatus.CONFIRMED,
    });
    expect(result.status).toBe(OrderStatus.CONFIRMED);
  });
});
