import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy (Unit Tests)', () => {
  let strategy: JwtStrategy;
  let configService: any;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('mock-jwt-secret-for-strategy'),
    };
    strategy = new JwtStrategy(configService as ConfigService);
  });

  it('should validate and extract user payload correctly', async () => {
    const payload = {
      sub: 'user-id-123',
      email: 'user@stackplus.studio',
      role: 'ADMIN',
    };

    const result = await strategy.validate(payload);
    expect(result).toEqual({
      id: 'user-id-123',
      email: 'user@stackplus.studio',
      role: 'ADMIN',
    });
  });
});
