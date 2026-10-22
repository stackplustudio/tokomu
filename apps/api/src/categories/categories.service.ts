import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mengambil semua kategori beserta jumlah produk aktif (FR-23).
   */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      productCount: cat._count.products,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Kategori dengan id/slug "${id}" tidak ditemukan`,
      );
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [
          { name: createCategoryDto.name },
          { slug: createCategoryDto.slug },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Nama atau slug kategori sudah digunakan');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
