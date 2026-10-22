/**
 * Shared k6 configuration.
 * Every scenario script imports this so target / credential / duration
 * settings stay in one place and are driven by environment variables.
 */

// ── Target ────────────────────────────────────────────────────────────────────
// Environment (env var)    Default                Description
// BASE_URL                 http://localhost:3001  API base URL
// API_PREFIX               /api                   Nest global prefix ("" if none)
export const BASE_URL = (typeof __ENV.BASE_URL !== 'undefined' ? __ENV.BASE_URL : 'http://localhost:3001').replace(/\/+$/, '');
export const API_PREFIX = typeof __ENV.API_PREFIX !== 'undefined' ? __ENV.API_PREFIX : '/api';

function envOr(key, fallback) {
  return typeof __ENV[key] !== 'undefined' && __ENV[key] !== '' ? __ENV[key] : fallback;
}

function envInt(key, fallback) {
  const parsed = parseInt(envOr(key, String(fallback)), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

// ── Credentials (optional; leave empty to run unauthenticated flows only) ────
export const AUTH_EMAIL = envOr('K6_EMAIL', '');
export const AUTH_PASSWORD = envOr('K6_PASSWORD', '');

// ── Tunables ──────────────────────────────────────────────────────────────────
export const BASE_VUS = envInt('K6_VUS', 20);            // steady-state vus
export const MAX_VUS = envInt('K6_MAX_VUS', 100);        // stress ceiling
export const SPIKE_VUS = envInt('K6_SPIKE_VUS', 50);     // spike peak
export const DURATION = envOr('K6_DURATION', '2m');      // load-test length
export const SOAK_RATE = envInt('K6_RATE', 20);          // arrival rate (per second)
export const SOAK_DURATION = envOr('K6_SOAK_DURATION', '5m');
export const THINK_TIME = parseFloat(envOr('K6_PAUSE', '1'));

// ── Endpoints ────────────────────────────────────────────────────────────────
export const url = (path) => `${BASE_URL}${API_PREFIX}${path}`;

export const endpoints = {
  login: url('/auth/login'),
  me: url('/users/me'),
  list: (page = 1, limit = 10) => url(`/users?page=${page}&limit=${limit}`),
};

// ── Thresholds (shared baseline; each scenario can extend) ───────────────────
export const baseThresholds = {
  http_req_failed: ['rate<0.01'],       // <1% failed requests
  http_req_duration: ['p(95)<800'],     // 95% under 800 ms (local baseline)
};
