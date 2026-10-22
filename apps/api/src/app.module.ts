import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Load env vars from .env; validate at startup via validateConfig()
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),

    // Global rate limiter: 100 requests per minute per IP by default.
    // Login endpoint overrides this with a stricter limit (see AuthController).
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000, // 1 minute window (ms)
        limit: 100,
      },
    ]),

    AuthModule,
    UsersModule,
    PrismaModule,
    HealthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// ---------------------------------------------------------------------------
// Startup env-var validation — throws immediately if required vars are missing
// ---------------------------------------------------------------------------
function validateConfig(
  config: Record<string, unknown>,
): Record<string, unknown> {
  // During tests NODE_ENV === 'test', default fallbacks can be supplied if not set
  if (config.NODE_ENV === 'test') {
    return config;
  }

  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `[AppModule] Missing required environment variables: ${missing.join(', ')}.\n` +
        'Copy .env.example to .env and set all required values before starting the server.',
    );
  }

  return config;
}
