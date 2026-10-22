/**
 * k6 Stress Test — find the breaking point (GRAPHITE/local only)
 *
 * Purpose : ramp past expected capacity to observe where latency or
 *           error rate degrades. Aggressive; requires an isolated target.
 * Usage   : k6 run perf/k6/scenarios/stress.js
 * Env vars: BASE_URL, API_PREFIX, K6_EMAIL, K6_PASSWORD,
 *           K6_VUS (base, default 20), K6_MAX_VUS (default 100)
 * Safety  : the guard in lib/safety.js refuses to run against production hosts.
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { assertLocalTarget } from '../lib/safety.js';
import {
  BASE_URL,
  baseThresholds,
  endpoints,
  BASE_VUS,
  MAX_VUS,
  THINK_TIME,
} from '../lib/config.js';

export const options = {
  stages: [
    { duration: '30s', target: BASE_VUS }, // warm-up
    { duration: '1m', target: Math.round(MAX_VUS / 2) }, // moderate stress
    { duration: '1m', target: MAX_VUS }, // heavy stress
    { duration: '30s', target: MAX_VUS }, // hold to observe saturation
    { duration: '30s', target: 0 }, // ramp-down
  ],
  thresholds: {
    // stress runs are allowed a higher error budget to observe degradation
    http_req_failed: ['rate<0.10'],
    'http_req_duration{scenario:default}': ['p(95)<2000'],
  },
};

export function setup() {
  assertLocalTarget(BASE_URL);
}

export default function () {
  const user = login();

  group('users list under stress', () => {
    const res = http.get(endpoints.list(), { headers: authHeaders(user) });
    check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  });

  group('own profile under stress', () => {
    const res = http.get(endpoints.me, { headers: authHeaders(user) });
    check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  });

  sleep(THINK_TIME);
}

function login() {
  if (!__ENV.K6_EMAIL || !__ENV.K6_PASSWORD) return null;
  const res = http.post(
    endpoints.login,
    JSON.stringify({ email: __ENV.K6_EMAIL, password: __ENV.K6_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'login' } },
  );
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
