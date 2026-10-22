import { assertSafeTestDatabase } from './test-safety.guard';

describe('TestSafetyGuard', () => {
  it('should abort if DATABASE_URL contains supabase.co', () => {
    const remoteUrl =
      'postgresql://postgres:pass@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres';
    expect(() => assertSafeTestDatabase(remoteUrl)).toThrow(
      /points to a remote\/cloud host/,
    );
  });

  it('should abort if DATABASE_URL contains neon.tech', () => {
    const remoteUrl = 'postgresql://user:pass@ep-cool-db.neon.tech/neondb';
    expect(() => assertSafeTestDatabase(remoteUrl)).toThrow(
      /points to a remote\/cloud host/,
    );
  });

  it('should abort if DATABASE_URL points to non-local IP/host', () => {
    const nonLocalUrl = 'postgresql://user:pass@192.168.1.50:5432/mydb';
    expect(() => assertSafeTestDatabase(nonLocalUrl)).toThrow(
      /does not point to a verified local host/,
    );
  });

  it('should allow localhost connection strings', () => {
    const localUrl = 'postgresql://postgres:postgres@localhost:5432/testdb';
    expect(() => assertSafeTestDatabase(localUrl)).not.toThrow();
  });

  it('should allow 127.0.0.1 connection strings', () => {
    const localUrl = 'postgresql://postgres:postgres@127.0.0.1:5432/testdb';
    expect(() => assertSafeTestDatabase(localUrl)).not.toThrow();
  });
});
