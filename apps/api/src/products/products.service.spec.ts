import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return paginated active products with search and category', async () => {
      prisma.product.findMany.mockResolvedValue([
        { id: 'p-1', name: 'AirMax', priceIdr: 1000000, isActive: true },
      ]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({
        search: 'Air',
        category: 'sneakers',
        sort: 'price_asc',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.product.findMany).toHaveBeenCalled();
    });

    it('should handle sorting by price_desc', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      const result = await service.findAll({ sort: 'price_desc' });
      expect(result.data).toEqual([]);
    });

    it('should handle price range filters', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      const result = await service.findAll({
        minPrice: 500000,
        maxPrice: 1500000,
      });
      expect(result.data).toEqual([]);
    });
  });

  describe('findBySlug', () => {
    it('should return product when found and active', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'p-1',
        slug: 'airmax',
        name: 'AirMax',
        isActive: true,
      });

      const result = await service.findBySlug('airmax');
      expect(result.slug).toBe('airmax');
    });

    it('should throw NotFoundException if product not found or inactive', async () => {
      prisma.product.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return product by id', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'p-1',
        name: 'AirMax',
      });
      const result = await service.findOne('p-1');
      expect(result.id).toBe('p-1');
    });

    it('should throw NotFoundException if id not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.findOne('p-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create product if slug is unique', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      prisma.product.create.mockResolvedValue({
        id: 'p-2',
        slug: 'speed-runner',
        name: 'Speed Runner',
      });

      const result = await service.create({
        name: 'Speed Runner',
        slug: 'speed-runner',
        description: 'Sepatu lari',
        priceIdr: 1200000,
        categoryId: 'cat-1',
      });
      expect(result.id).toBe('p-2');
    });

    it('should throw ConflictException if slug already exists', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'p-1',
        slug: 'existing',
      });

      await expect(
        service.create({
          name: 'Existing',
          slug: 'existing',
          description: 'Desc',
          priceIdr: 1000,
          categoryId: 'cat-1',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update product if exists', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'p-1' });
      prisma.product.update.mockResolvedValue({
        id: 'p-1',
        name: 'Updated Name',
      });

      const result = await service.update('p-1', { name: 'Updated Name' });
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('remove (soft delete)', () => {
    it('should set isActive to false', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'p-1',
        isActive: true,
      });
      prisma.product.update.mockResolvedValue({ id: 'p-1', isActive: false });

      const result = await service.remove('p-1');
      expect(result.isActive).toBe(false);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { isActive: false },
      });
    });
  });
});
