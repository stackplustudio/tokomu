/**
 * Safety guard: refuse to load-test production / remote cloud hosts.
 * Called from setup() in aggressive scenarios (stress, spike, soak).
 */
const FORBIDDEN = [
  'vercel.app',
  'railway.app',
  'herokuapp.com',
  'amazonaws.com',
  'azurewebsites.net',
  'cloudrun',
  'netlify.app',
  'supabase.co',
  'neon.tech',
  'render.com',
  'fly.dev',
];

export function assertLocalTarget(baseUrl) {
  for (const host of FORBIDDEN) {
    if (baseUrl && baseUrl.includes(host)) {
      throw new Error(
        `[k6-safety] FATAL: refusing to load-test "${baseUrl}" — host pattern "${host}" looks like a production/remote host.\n` +
          'Point BASE_URL at a local dev server or an explicitly authorized isolated staging target instead.\n' +
          'Example: BASE_URL=http://localhost:3001 k6 run perf/k6/scenarios/stress.js',
      );
    }
  }
}
