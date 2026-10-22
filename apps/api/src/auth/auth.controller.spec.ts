import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthUser } from './interfaces/auth-user.interface';
import type { Response } from 'express';

describe('AuthController (Unit Tests)', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'validateUser' | 'login'>>;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    } as unknown as jest.Mocked<Pick<AuthService, 'validateUser' | 'login'>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should set refresh_token cookie and return access_token when credentials are valid', async () => {
      const mockUser: AuthUser = {
        id: 'u-1',
        email: 'user@stackplus.studio',
        role: 'USER',
      };
      (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.login as jest.Mock).mockReturnValue({
        user: mockUser,
        access_token: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
      });

      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.login(
        { email: 'user@stackplus.studio', password: 'password123' },
        mockRes,
      );

      expect(result.message).toBe('Login berhasil');
      expect(result.access_token).toBe('valid-access-token');
      expect(result.user).toEqual(mockUser);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'valid-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue(null);
      const mockRes = { cookie: jest.fn() } as unknown as Response;

      await expect(
        controller.login(
          { email: 'user@stackplus.studio', password: 'wrongPassword' },
          mockRes,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
