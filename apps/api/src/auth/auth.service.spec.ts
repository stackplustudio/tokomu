import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

describe('AuthService (Security Unit Tests)', () => {
  let authService: AuthService;
  let prismaService: jest.Mocked<Pick<PrismaService, 'user'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;
  let configService: jest.Mocked<Pick<ConfigService, 'get' | 'getOrThrow'>>;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      } as unknown as PrismaService['user'],
    } as unknown as jest.Mocked<Pick<PrismaService, 'user'>>;

    jwtService = {
      sign: jest.fn((payload: unknown, options?: { secret?: string }) => {
        if (options?.secret) {
          return `signed-with-${options.secret}`;
        }
        return 'signed-access-token';
      }),
    } as unknown as jest.Mocked<Pick<JwtService, 'sign'>>;

    configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return 'custom-refresh-secret-123';
        if (key === 'JWT_SECRET') return 'custom-jwt-secret-123';
        throw new Error(`Missing config: ${key}`);
      }),
      get: jest.fn((key: string) => {
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return null;
      }),
    } as unknown as jest.Mocked<Pick<ConfigService, 'get' | 'getOrThrow'>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return AuthUser without password when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('validPassword123', 10);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@stackplus.studio',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      });

      const result = await authService.validateUser(
        'test@stackplus.studio',
        'validPassword123',
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe('user-1');
      expect(result?.email).toBe('test@stackplus.studio');
      // Password MUST NOT be present in AuthUser
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('validPassword123', 10);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@stackplus.studio',
        password: hashedPassword,
        role: 'USER',
      });

      const result = await authService.validateUser(
        'test@stackplus.studio',
        'wrongPassword',
      );

      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistent@stackplus.studio',
        'somePassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login (C-2 regression test)', () => {
    it('should use ConfigService to sign refresh token without hardcoded secrets', () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@stackplus.studio',
        role: 'USER',
      };

      const result = authService.login(mockUser);

      expect(result.access_token).toBe('signed-access-token');
      expect(result.refreshToken).toBe('signed-with-custom-refresh-secret-123');
      expect(configService.getOrThrow).toHaveBeenCalledWith(
        'JWT_REFRESH_SECRET',
      );
    });
  });
});
