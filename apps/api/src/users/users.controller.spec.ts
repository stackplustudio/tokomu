import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('UsersController (IDOR & Authorization Regression Tests)', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<
    Pick<
      UsersService,
      'create' | 'findAll' | 'findOne' | 'update' | 'adminUpdate' | 'remove'
    >
  >;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      adminUpdate: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<
      Pick<
        UsersService,
        'create' | 'findAll' | 'findOne' | 'update' | 'adminUpdate' | 'remove'
      >
    >;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }, Reflector],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('IDOR Protection on findOne', () => {
    it('should ALLOW USER to read their own record', async () => {
      const currentUser: AuthUser = {
        id: 'user-1',
        email: 'u@test.com',
        role: 'USER',
      };
      (usersService.findOne as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'Own Profile',
      });

      const result = await controller.findOne('user-1', currentUser);
      expect(result).toEqual({ id: 'user-1', name: 'Own Profile' });
      expect(usersService.findOne).toHaveBeenCalledWith('user-1');
    });

    it('should FORBID USER from reading another user record (IDOR Prevention)', () => {
      const currentUser: AuthUser = {
        id: 'user-1',
        email: 'u@test.com',
        role: 'USER',
      };

      expect(() => controller.findOne('user-2', currentUser)).toThrow(
        ForbiddenException,
      );
      expect(usersService.findOne).not.toHaveBeenCalled();
    });

    it('should ALLOW ADMIN to read any user record', async () => {
      const currentAdmin: AuthUser = {
        id: 'admin-1',
        email: 'a@test.com',
        role: 'ADMIN',
      };
      (usersService.findOne as jest.Mock).mockResolvedValue({
        id: 'user-2',
        name: 'Other User',
      });

      const result = await controller.findOne('user-2', currentAdmin);
      expect(result).toEqual({ id: 'user-2', name: 'Other User' });
      expect(usersService.findOne).toHaveBeenCalledWith('user-2');
    });
  });

  describe('IDOR Protection on update', () => {
    it('should ALLOW USER to update their own record', async () => {
      const currentUser: AuthUser = {
        id: 'user-1',
        email: 'u@test.com',
        role: 'USER',
      };
      const dto = { name: 'Updated Name' };
      (usersService.update as jest.Mock).mockResolvedValue({
        id: 'user-1',
        ...dto,
      });

      const result = await controller.update('user-1', dto, currentUser);
      expect(result).toEqual({ id: 'user-1', ...dto });
      expect(usersService.update).toHaveBeenCalledWith('user-1', dto);
    });

    it('should FORBID USER from updating another user record (IDOR Prevention)', () => {
      const currentUser: AuthUser = {
        id: 'user-1',
        email: 'u@test.com',
        role: 'USER',
      };
      const dto = { name: 'Malicious Update' };

      expect(() => controller.update('user-2', dto, currentUser)).toThrow(
        ForbiddenException,
      );
      expect(usersService.update).not.toHaveBeenCalled();
    });
  });

  describe('findAll pagination', () => {
    it('should pass sanitized pagination numbers to service', async () => {
      (usersService.findAll as jest.Mock).mockResolvedValue({
        data: [],
        meta: {},
      });

      await controller.findAll('2', '10');
      expect(usersService.findAll).toHaveBeenCalledWith(2, 10);
    });

    it('should enforce fallback limits against negative or excessive limits', async () => {
      (usersService.findAll as jest.Mock).mockResolvedValue({
        data: [],
        meta: {},
      });

      await controller.findAll('-5', '9999');
      // limit is capped at 100, page at minimum 1
      expect(usersService.findAll).toHaveBeenCalledWith(1, 100);
    });
  });
});
