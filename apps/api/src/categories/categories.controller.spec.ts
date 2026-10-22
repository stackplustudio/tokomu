import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all categories', async () => {
    mockService.findAll.mockResolvedValue([{ id: '1', name: 'Sneakers' }]);
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return one category', async () => {
    mockService.findOne.mockResolvedValue({ id: '1', name: 'Sneakers' });
    const result = await controller.findOne('1');
    expect(result.id).toBe('1');
    expect(mockService.findOne).toHaveBeenCalledWith('1');
  });

  it('should create category', async () => {
    const dto = { name: 'Sneakers', slug: 'sneakers' };
    mockService.create.mockResolvedValue({ id: '1', ...dto });
    const result = await controller.create(dto);
    expect(result.id).toBe('1');
  });

  it('should update category', async () => {
    mockService.update.mockResolvedValue({ id: '1', name: 'Updated' });
    const result = await controller.update('1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should delete category', async () => {
    mockService.remove.mockResolvedValue({ id: '1' });
    const result = await controller.remove('1');
    expect(result.id).toBe('1');
  });
});
