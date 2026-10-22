import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar!');
    }

    // C-3 / M-3 fix: password is required in DTO; no 'password123' fallback
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        // L-2 / H-5 fix: default to USER, only ADMIN if explicitly set
        role: createUserDto.role ?? 'USER',
      },
      select: USER_SELECT,
    });
  }

  // M-2 fix: paginated findAll — never returns unbounded rows
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        select: USER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  // Self-update: cannot change role
  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id); // throws NotFoundException if not found

    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(hashedPassword !== undefined && { password: hashedPassword }),
      },
      select: USER_SELECT,
    });
  }

  // Admin-update: can change role
  async adminUpdate(id: string, dto: AdminUpdateUserDto) {
    await this.findOne(id); // throws NotFoundException if not found

    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(hashedPassword !== undefined && { password: hashedPassword }),
      },
      select: USER_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws NotFoundException if not found

    return this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true },
    });
  }
}
