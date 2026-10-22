# k6 Performance Testing (Maincore)

Performance scenarios for the Maincore API, written with [k6](https://k6.io).
All targets, virtual users, and durations are configured through environment
variables — no scenario file needs to be edited to retune a run.

## Prerequisite

Install the k6 binary (does **not** go into `package.json` — it is a
platform binary, not a node dependency):

```bash
# Windows (PowerShell)
winget install k6.k6

# macOS
brew install k6

# Linux (Debian/Ubuntu)
sudo apt install k6
```

Verify: `k6 version`

## Prerequisites for the target API

1. Local API running (`pnpm --filter api start:dev`, default `http://localhost:3001`).
2. The `/users` endpoints under test need valid credentials issued on this
   environment (never reuse production credentials here).

## Environment variables

| Variable            | Default                  | Description                              |
| ------------------- | ------------------------ | ---------------------------------------- |
| `BASE_URL`          | `http://localhost:3001`  | API base URL                             |
| `API_PREFIX`        | `/api`                   | Nest global prefix (`""` if none)        |
| `K6_EMAIL`          | _(empty)_                | Login email (optional per scenario)      |
| `K6_PASSWORD`       | _(empty)_                | Login password (never commit it)         |
| `K6_VUS`            | `20`                     | Steady-state VUs (load/stress)           |
| `K6_MAX_VUS`        | `100`                    | Stress ceiling VUs                       |
| `K6_SPIKE_VUS`      | `50`                     | Spike peak VUs                           |
| `K6_DURATION`       | `2m`                     | Load steady-state duration               |
| `K6_RATE`           | `20`                     | Soak arrival rate (req/s)                |
| `K6_SOAK_DURATION`  | `5m`                     | Soak length                              |
| `K6_PAUSE`          | `1`                      | Think time between iterations (seconds)  |

## Scenarios

| Script                          | Purpose                                        | Duration (default) |
| ------------------------------- | ---------------------------------------------- | ------------------ |
| `scenarios/smoke.js`            | Correctness at minimal load                    | ~10 iterations     |
| `scenarios/load.js`             | Expected-traffic simulation                    | ~2m                |
| `scenarios/stress.js`           | Ramp past capacity to find degradation point   | ~3m                |
| `scenarios/spike.js`            | Sudden burst + recovery                        | ~3m                |
| `scenarios/soak.js`             | Long sustained load (arrival-rate driven)      | 5m+                |

Run examples (PowerShell-compatible):

```powershell
# smoke (fast)
pnpm perf:smoke

# expected load
pnpm perf:load

# explicit target + credentials
$env:BASE_URL="http://localhost:3001"; $env:K6_EMAIL="you@example.com"; $env:K6_PASSWORD="..."; pnpm perf:stress
```

## Thresholds & metrics

Every scenario asserts:

- `http_req_failed` rate (per-scenario error budget: 0–10%).
- `http_req_duration` percentiles `p(95)`, and `p(99)` where relevant.
- Throughput (`http_reqs` per second), plus named per-request timings.

k6 exits non-zero when any threshold is breached, making these usable as a
regression gate (see `docs/perf-testing.md`).

## Safety guarantees

1. `lib/safety.js` blocks aggressive scenarios (stress, spike, soak) from
   targeting known production/remote hosts (vercel.app, amazonaws.com, etc.).
2. Never point `BASE_URL` at any environment you are not authorized to load-test.
3. Credentials are read from env vars, never committed to the repo.

## Requirements checklist for future scenarios

- One file per scenario under `scenarios/`, importing config from `lib/config.js`.
- Export `options` (stages/scenarios + thresholds) and a `default` function.
- For aggressive scenarios, add `setup()` calling `assertLocalTarget(BASE_URL)`.
- Document the scenario in the table above, including its env variables.
