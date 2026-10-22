/**
 * Test Safety Guard
 *
 * Mandatory safety check: Aborts test execution if DATABASE_URL points
 * to a remote host (e.g., Supabase, RDS, Neon) to prevent accidental
 * mutation of staging or production data.
 */
export function assertSafeTestDatabase(url?: string): void {
  const dbUrl = url || process.env.DATABASE_URL || '';

  if (!dbUrl) {
    throw new Error(
      '[TestSafetyGuard] DATABASE_URL is not set. Integration tests require a dedicated local test database.',
    );
  }

  const forbiddenPatterns = [
    'supabase.co',
    'pooler.supabase.com',
    'neon.tech',
    'rds.amazonaws.com',
    'azure.com',
    'cockroachlabs.cloud',
  ];

  for (const pattern of forbiddenPatterns) {
    if (dbUrl.includes(pattern)) {
      throw new Error(
        `[TestSafetyGuard] FATAL: DATABASE_URL points to a remote/cloud host (${pattern}).\n` +
          'Tests MUST ONLY run against a local test database (localhost / 127.0.0.1 / test container).\n' +
          'Aborting test run immediately to protect data integrity.',
      );
    }
  }

  // Must match localhost or 127.0.0.1 or local docker hostname
  const isLocal =
    dbUrl.includes('localhost') ||
    dbUrl.includes('127.0.0.1') ||
    dbUrl.includes('host.docker.internal');

  if (!isLocal) {
    throw new Error(
      `[TestSafetyGuard] FATAL: DATABASE_URL does not point to a verified local host.\n` +
        `Current URL: ${dbUrl}\n` +
        'Aborting test run immediately to protect data integrity.',
    );
  }
}
