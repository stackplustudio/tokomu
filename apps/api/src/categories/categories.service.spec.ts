import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('findAll', () => {
    it('should return categories with productCount', async () => {
      prisma.category.findMany.mockResolvedValue([
        {
          id: 'cat-1',
          name: 'Sneakers',
          slug: 'sneakers',
          description: 'Sepatu sneakers',
          _count: { products: 5 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].productCount).toBe(5);
      expect(result[0].name).toBe('Sneakers');
    });
  });

  describe('findOne', () => {
    it('should return category when found by id or slug', async () => {
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Sepatu sneakers',
        _count: { products: 3 },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.findOne('sneakers');
      expect(result.id).toBe('cat-1');
      expect(result.productCount).toBe(3);
    });

    it('should throw NotFoundException if category not found', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create new category if name/slug not taken', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({
        id: 'cat-2',
        name: 'Running',
        slug: 'running',
      });

      const result = await service.create({
        name: 'Running',
        slug: 'running',
      });
      expect(result.id).toBe('cat-2');
    });

    it('should throw ConflictException if category name/slug exists', async () => {
      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });

      await expect(
        service.create({ name: 'Running', slug: 'running' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update category if exists', async () => {
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        name: 'Running',
        slug: 'running',
        _count: { products: 0 },
      });
      prisma.category.update.mockResolvedValue({
        id: 'cat-1',
        name: 'Running Shoes',
        slug: 'running',
      });

      const result = await service.update('cat-1', { name: 'Running Shoes' });
      expect(result.name).toBe('Running Shoes');
    });
  });

  describe('remove', () => {
    it('should delete category if found', async () => {
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        name: 'Running',
        slug: 'running',
        _count: { products: 0 },
      });
      prisma.category.delete.mockResolvedValue({ id: 'cat-1' });

      const result = await service.remove('cat-1');
      expect(result.id).toBe('cat-1');
    });
  });
});
