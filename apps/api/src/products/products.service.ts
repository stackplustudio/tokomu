import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mengambil daftar produk aktif dengan filter, pencarian, dan paginasi (FR-21).
   */
  async findAll(query: QueryProductDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(Math.max(1, query.limit || 20), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (query.search && query.search.trim() !== '') {
      where.name = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    if (query.category) {
      where.category = {
        slug: query.category,
      };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.priceIdr = {};
      if (query.minPrice !== undefined) {
        where.priceIdr.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.priceIdr.lte = query.maxPrice;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    if (query.sort === 'price_asc') {
      orderBy = { priceIdr: 'asc' };
    } else if (query.sort === 'price_desc') {
      orderBy = { priceIdr: 'desc' };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Mengambil detail produk aktif berdasarkan slug (FR-22).
   */
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Produk dengan slug "${slug}" tidak ditemukan atau tidak aktif`,
      );
    }

    return product;
  }

  /**
   * Mengambil produk berdasarkan ID internal (untuk admin).
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produk dengan ID "${id}" tidak ditemukan`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Slug "${createProductDto.slug}" sudah digunakan`,
      );
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: { category: true },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: { category: true },
    });
  }

  /**
   * Soft-delete: menonaktifkan produk, bukan menghapus fisik (FR-36).
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
