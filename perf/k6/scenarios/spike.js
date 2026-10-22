/**
 * k6 Spike Test — sudden traffic burst
 *
 * Purpose : simulate a short traffic burst (e.g. after a notification)
 *           to verify the API recovers gracefully.
 * Usage   : k6 run perf/k6/scenarios/spike.js
 * Env vars: BASE_URL, API_PREFIX, K6_EMAIL, K6_PASSWORD, K6_SPIKE_VUS (default 50)
 * Safety  : isolated local/staging target only.
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { BASE_URL, endpoints, SPIKE_VUS, THINK_TIME } from '../lib/config.js';
import { assertLocalTarget } from '../lib/safety.js';

export const options = {
  stages: [
    { duration: '10s', target: 5 }, // baseline
    { duration: '30s', target: SPIKE_VUS }, // spike up
    { duration: '1m', target: SPIKE_VUS }, // hold peak
    { duration: '10s', target: 5 }, // back to baseline
    { duration: '30s', target: 5 }, // recovery window — watch latency here
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    'http_req_duration{scenario:default}': ['p(95)<2000'],
  },
};

export function setup() {
  assertLocalTarget(BASE_URL);
}

export default function () {
  const user = login();

  group('users list during spike', () => {
    const res = http.get(endpoints.list(), { headers: authHeaders(user) });
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
