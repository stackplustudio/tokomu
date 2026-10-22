import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // 1. Validasi kredensial (Email & Password)
  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      return { id: user.id, email: user.email, role: user.role };
    }
    return null;
  }

  // 2. Generate Tokens (Access & Refresh)
  login(user: AuthUser) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    // Access token — short-lived, sent in response body for memory storage
    const accessToken = this.jwtService.sign(payload);

    // Refresh token — long-lived, stored in HTTP-Only Cookie
    // C-2 fix: no hardcoded fallback; JWT_REFRESH_SECRET validated at startup
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ??
        '7d') as any,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      access_token: accessToken,
      refreshToken,
    };
  }
}
