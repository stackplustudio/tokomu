import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockService = {
    findAll: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated products', async () => {
    mockService.findAll.mockResolvedValue({
      data: [{ id: 'p-1', name: 'AirMax' }],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    });

    const result = await controller.findAll({});
    expect(result.data).toHaveLength(1);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return product by slug', async () => {
    mockService.findBySlug.mockResolvedValue({ id: 'p-1', slug: 'airmax' });
    const result = await controller.findBySlug('airmax');
    expect(result.slug).toBe('airmax');
  });

  it('should create product', async () => {
    const dto = {
      name: 'AirMax',
      slug: 'airmax',
      description: 'Desc',
      priceIdr: 1000,
      categoryId: 'cat-1',
    };
    mockService.create.mockResolvedValue({ id: 'p-1', ...dto });
    const result = await controller.create(dto);
    expect(result.id).toBe('p-1');
  });

  it('should update product', async () => {
    mockService.update.mockResolvedValue({ id: 'p-1', name: 'Updated' });
    const result = await controller.update('p-1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should remove product', async () => {
    mockService.remove.mockResolvedValue({ id: 'p-1', isActive: false });
    const result = await controller.remove('p-1');
    expect(result.isActive).toBe(false);
  });
});
