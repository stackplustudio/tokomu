/**
 * k6 Soak Test — sustained load to surface leaks / drift
 *
 * Purpose : long steady traffic (memory leaks, connection-pool drift,
 *           pagination slowdown) using a constant arrival rate.
 * Usage   : k6 run perf/k6/scenarios/soak.js
 * Env vars: BASE_URL, API_PREFIX, K6_EMAIL, K6_PASSWORD,
 *           K6_RATE (arrivals per second, default 20), K6_SOAK_DURATION (default 5m)
 * Safety  : isolated local/staging target only. Long-runtime guard applies.
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import {
  BASE_URL,
  baseThresholds,
  endpoints,
  SOAK_RATE,
  SOAK_DURATION,
  THINK_TIME,
} from '../lib/config.js';
import { assertLocalTarget } from '../lib/safety.js';

export const options = {
  scenarios: {
    soak: {
      executor: 'constant-arrival-rate',
      rate: SOAK_RATE,
      timeUnit: '1s',
      duration: SOAK_DURATION,
      preAllocatedVUs: Math.max(50, SOAK_RATE),
      maxVUs: Math.max(200, SOAK_RATE * 3),
    },
  },
  thresholds: {
    ...baseThresholds,
    'http_req_duration{scenario:soak}': ['p(95)<800', 'p(99)<1500'],
  },
};

export function setup() {
  assertLocalTarget(BASE_URL);
}

export default function () {
  const user = login();

  group('users list (soak)', () => {
    const res = http.get(endpoints.list(), { headers: authHeaders(user) });
    check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  });

  group('own profile (soak)', () => {
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
