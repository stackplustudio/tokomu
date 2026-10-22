/**
 * k6 Smoke Test
 *
 * Purpose : Verify the API works at minimal load (correctness, not capacity).
 * Usage   : k6 run perf/k6/scenarios/smoke.js
 * Safe for: local dev server. Still never point at production.
 * Env vars: BASE_URL, API_PREFIX, K6_EMAIL, K6_PASSWORD  (see lib/config.js)
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { baseThresholds, endpoints, url, THINK_TIME } from '../lib/config.js';

export const options = {
  vus: 1,
  iterations: 10,
  thresholds: {
    ...baseThresholds,
    'http_req_duration{scenario:default}': ['p(95)<1500'], // loose: smoke cares about correctness
  },
};

export default function () {
  group('health', () => {
    const res = http.get(url('/health'));
    check(res, {
      'health returns 200': (r) => r.status === 200,
      'health responds < 1s': (r) => r.timings.duration < 1000,
    });
  });

  group('login (optional)', () => {
    if (__ENV.K6_EMAIL && __ENV.K6_PASSWORD) {
      const res = http.post(
        endpoints.login,
        JSON.stringify({ email: __ENV.K6_EMAIL, password: __ENV.K6_PASSWORD }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      check(res, {
        'login returns 2xx': (r) => r.status >= 200 && r.status < 300,
        'login returns a token': (r) => {
          try {
            return !!r.json('accessToken') || !!r.json('access_token') || !!r.json('token');
          } catch {
            return false;
          }
        },
      });
    }
  });

  sleep(THINK_TIME);
}
