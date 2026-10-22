import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

describe('UsersService (Unit Tests)', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create user with hashed password and default role USER', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation((args: any) =>
        Promise.resolve({ id: 'new-id', ...args.data }),
      );

      const result = await service.create({
        email: 'new@stackplus.studio',
        name: 'New User',
        password: 'securePassword123',
      });

      expect(result.id).toBe('new-id');
      expect(prisma.user.create).toHaveBeenCalled();
      const createArgs = prisma.user.create.mock.calls[0][0];
      expect(createArgs.data.role).toBe('USER'); // Default must be USER
      expect(
        await bcrypt.compare('securePassword123', createArgs.data.password),
      ).toBe(true);
    });

    it('should throw ConflictException if email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create({
          email: 'duplicate@stackplus.studio',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll (M-2 pagination test)', () => {
    it('should query with correct skip/take and return pagination metadata', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'u1' }, { id: 'u2' }]);
      prisma.user.count.mockResolvedValue(25);

      const result = await service.findAll(2, 10);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page 2 - 1) * 10
          take: 10,
        }),
      );
      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });
      expect(result.data).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 'u1', email: 'u1@test.com' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('u1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update name without password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
      prisma.user.update.mockResolvedValue({ id: 'u1', name: 'New Name' });

      const result = await service.update('u1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should update password with bcrypt hash', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
      prisma.user.update.mockImplementation((args: any) =>
        Promise.resolve({ id: 'u1', ...args.data }),
      );

      await service.update('u1', { password: 'newPassword123' });
      const updateArgs = prisma.user.update.mock.calls[0][0];
      expect(
        await bcrypt.compare('newPassword123', updateArgs.data.password),
      ).toBe(true);
    });
  });

  describe('adminUpdate', () => {
    it('should allow admin to update role and password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
      prisma.user.update.mockImplementation((args: any) =>
        Promise.resolve({ id: 'u1', ...args.data }),
      );

      await service.adminUpdate('u1', {
        role: UserRole.ADMIN,
        password: 'adminPassword123',
      });
      const updateArgs = prisma.user.update.mock.calls[0][0];
      expect(updateArgs.data.role).toBe('ADMIN');
      expect(
        await bcrypt.compare('adminPassword123', updateArgs.data.password),
      ).toBe(true);
    });
  });

  describe('remove', () => {
    it('should delete existing user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
      prisma.user.delete.mockResolvedValue({ id: 'u1', email: 'u1@test.com' });

      const result = await service.remove('u1');
      expect(result.id).toBe('u1');
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'u1' },
        select: { id: true, email: true },
      });
    });
  });
});
