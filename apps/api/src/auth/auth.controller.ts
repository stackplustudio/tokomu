import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // H-2 fix: strict rate limit on login — 5 attempts per minute per IP
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. Cek kredensial via Service
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Email atau Password salah');
    }

    // 2. Jika valid, buat token
    const tokens = this.authService.login(user);

    // 3. Simpan Refresh Token ke HTTP-Only Cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 4. Kembalikan Access Token ke frontend
    return {
      message: 'Login berhasil',
      user: tokens.user,
      access_token: tokens.access_token,
    };
  }
}
