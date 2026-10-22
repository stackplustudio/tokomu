import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('API & Security Integration Tests (E2E)', () => {
  let app: INestApplication;
  let mockPrisma: any;

  beforeAll(async () => {
    // Set safe test environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key-32-chars-long-minimum!';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-chars-long!';

    mockPrisma = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();

    // Replicate production main.ts configuration
    app.use(helmet());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health (Security Headers & Availability)', () => {
    it('should return 200 OK with security headers enforced by Helmet', async () => {
      const res = await request(app.getHttpServer()).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.database).toBe('connected');

      // Security headers validation (Helmet H-3)
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-download-options']).toBe('noopen');
    });
  });

  describe('POST /auth/login (Input Validation & SQLi Protection)', () => {
    it('should reject invalid email format with 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Format email tidak valid');
    });

    it('should reject password shorter than 6 characters with 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@stackplus.studio', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Password minimal 6 karakter');
    });

    it('should reject request with non-whitelisted fields (Mass Assignment C-3)', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'user@stackplus.studio',
        password: 'password123',
        isAdmin: true, // Malicious non-whitelisted property
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('property isAdmin should not exist');
    });

    it('should safely handle SQL Injection attack payloads without leaking database errors', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const sqliPayloads = [
        "' OR '1'='1",
        "admin' --",
        '\'; DROP TABLE "User"; --',
      ];

      for (const payload of sqliPayloads) {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: payload,
            password: 'somePassword',
          });

        // Rejected as invalid email format by ValidationPipe
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Bad Request');
        // Must never leak database stack traces
        expect(JSON.stringify(res.body)).not.toContain('SQL');
        expect(JSON.stringify(res.body)).not.toContain('syntax error');
      }
    });
  });

  describe('Unauthenticated Protected Routes (Auth Guard Enforcement)', () => {
    it('GET /users without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.status).toBe(401);
    });

    it('POST /users without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer()).post('/users').send({
        email: 'test@stackplus.studio',
        password: 'password123',
      });
      expect(res.status).toBe(401);
    });

    it('DELETE /users/some-id without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer()).delete('/users/some-id');
      expect(res.status).toBe(401);
    });
  });
});
