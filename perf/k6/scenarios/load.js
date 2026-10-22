/**
 * k6 Load Test — expected traffic
 *
 * Purpose : Simulate realistic expected load against the API.
 * Usage   : k6 run perf/k6/scenarios/load.js
 * Env vars: BASE_URL, API_PREFIX, K6_EMAIL, K6_PASSWORD,
 *           K6_VUS (default 20), K6_DURATION (default 2m)
 * Safe for: local / isolated staging ONLY.
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import {
  baseThresholds,
  endpoints,
  url,
  BASE_VUS,
  DURATION,
  THINK_TIME,
} from '../lib/config.js';

export const options = {
  stages: [
    { duration: '15s', target: BASE_VUS }, // ramp-up
    { duration: DURATION, target: BASE_VUS }, // steady state
    { duration: '15s', target: 0 }, // ramp-down
  ],
  thresholds: {
    ...baseThresholds,
    'http_req_duration{scenario:default}': ['p(95)<800', 'p(99)<1500'],
  },
};

export default function () {
  const user = login();

  group('users list (authenticated)', () => {
    const res = http.get(endpoints.list());
    check(res, {
      'status is 200': (r) => r.status === 200,
      'list body is not empty': (r) => r.body && r.body.length > 0,
    });
  });

  group('own profile', () => {
    const res = http.get(endpoints.me, { headers: authHeaders(user) });
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  });

  group('health check', () => {
    const res = http.get(url('/health'));
    check(res, { 'health is 200': (r) => r.status === 200 });
  });

  sleep(THINK_TIME);
}

// ── helpers (kept per-file so each scenario runs standalone) ─────────────────
function login() {
  if (!__ENV.K6_EMAIL || !__ENV.K6_PASSWORD) {
    return null; // unauthenticated mode
  }
  const res = http.post(
    endpoints.login,
    JSON.stringify({ email: __ENV.K6_EMAIL, password: __ENV.K6_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'login' } },
  );
  check(res, { 'login succeeded': (r) => r.status === 200 || r.status === 201 });
  try {
    return res.json();
  } catch {
    return null;
  }
}

function authHeaders(user) {
  const token = user && (user.accessToken || user.access_token || user.token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
