# 👟 Tokomu — Blueprint Toko Online dengan AI

> **Single-Vendor E-Commerce Blueprint by Stack Plus Studio**  
> Dibangun di atas **Stack Plus Studio Core Engine V1.0 (Maincore)**. Dimulai sebagai toko sepatu, teruji kelas produksi, dan dirancang untuk portofolio teknis serta reusabilitas klien.

---

## 🚀 Status Implementasi: Fase 1 Selesai (Static Storefront MVP)

- ✅ **Storefront Publik Berbasis Route Group (storefront)**: Akses bebas tanpa login ke Beranda, Katalog, dan Detail Produk.
- ✅ **Design System Terstandarisasi (docs/ui.md)**: Warm background #FCFBF6, warna aksen biru #0053F1, typography Plus Jakarta Sans, card-hover, dan tombol pill.
- ✅ **Store Config Terpusat (src/config/store.ts)**: Konfigurasi nama toko, kategori, hero, dan aset terpisah dari komponen UI.
- ✅ **Katalog & Pencarian Interaktif**: Pencarian case-insensitive, filter multi-kategori, pengurutan harga/terbaru, dan sinkronisasi query params URL.
- ✅ **Fallback Gambar Otomatis & Anti-CLS**: Area kartu produk mempertahankan rasio tetap 4:3 tanpa pergeseran layout.
- ✅ **Quality Gates 100% Hijau**: Typecheck, Lint, Coverage (> 70%), dan Next.js Turbopack Production Build berhasil.

---

# 🚀 Stack Plus Studio - Core Engine V1.0 (Fullstack Monorepo)

Boilerplate Fullstack Web Development kelas *Enterprise* dan *Production-Ready* yang dirancang khusus untuk mempercepat inisiasi proyek klien di **Stack Plus Studio**.

Dibangun dengan arsitektur **Monorepo (Turborepo)** yang memisahkan:

* **Frontend**: **Next.js 16** (App Router, Tailwind CSS, Axios Interceptors, React Hot Toast)
* **Backend**: **NestJS 11** (Modular Architecture, Helmet, Rate Limiter Throttler, RolesGuard RBAC, IDOR Protection)
* **Database**: **PostgreSQL** (Supabase / Neon / Docker Local) via **Prisma ORM v5**
* **Testing & QA**: **Jest** (Unit & Coverage > 70%), **Supertest** (API E2E & SQLi Injection Prevention), **Playwright** (Web Smoke Tests), dan **k6** (Load & Performance Testing)
* **CI/CD & Security**: **GitHub Actions** (Quality Gate, Docker Validation, Gitleaks Secret Detection, Trivy Vulnerability Scan)
* **Workspace Management**: **pnpm workspaces** & **Turborepo**

Seluruh komponen berada dalam satu *repository* terintegrasi sehingga proses pengembangan, pengujian otomatis, audit keamanan, hingga deployment dapat dikelola secara terstruktur, aman, dan konsisten.

---

# 📚 Indeks Dokumentasi Lengkap (`docs/`)

Maincore dilengkapi rangkaian dokumentasi operasional dan teknis yang berada di direktori [`docs/`](./docs):

| Dokumen | Deskripsi |
|---|---|
| 🏛️ [**`docs/architecture.md`**](./docs/architecture.md) | **Arsitektur Sistem Menyeluruh**: Diagram topologi, aliran data, lapisan keamanan, auth flow, dan skema deployment. |
| 🎨 [**`docs/ui.md`**](./docs/ui.md) | **UI Design System**: Single source of truth untuk token warna, tipografi Plus Jakarta Sans, tombol pill, dan aturan UI. |
| 📋 [**`docs/newproject.md`**](./docs/newproject.md) | **SOP Memulai Proyek Baru**: Panduan langkah demi langkah inisiasi proyek klien dari template Core System. |
| 🤝 [**`docs/handover.md`**](./docs/handover.md) | **Protokol Serah-Terima (Handover)**: Prosedur handover requirement, PRD parsing, dan rules of engagement engineer. |
| 🧪 [**`docs/testing-runbook.md`**](./docs/testing-runbook.md) | **Buku Panduan Testing**: Panduan eksekusi Unit Test, Coverage, E2E Security, dan safety guard database. |
| ⚡ [**`docs/perf-testing.md`**](./docs/perf-testing.md) | **Metodologi Performance Testing**: Panduan pengujian beban menggunakan k6 (smoke, load, stress, spike, soak). |
| 🛡️ [**`docs/security-scanning.md`**](./docs/security-scanning.md) | **Security Scanning**: Panduan audit secret detection (Gitleaks) dan vulnerability scan (Trivy). |
| 🔄 [**`docs/ci-cd.md`**](./docs/ci-cd.md) | **Pipeline CI/CD**: Rincian alur otomatisasi GitHub Actions (`ci.yml` dan `security.yml`). |

---

# 🛠️ Tech Stack Utama

## Arsitektur & Tooling
| Teknologi | Fungsi |
|---|---|
| **Turborepo** | Orkestrasi build, caching, dan pipeline task monorepo |
| **pnpm** | Package manager efisien dan workspace boundary management |
| **Docker** | Multi-stage hardened build dengan non-root user `node` & healthcheck probe |
| **GitHub Actions** | Otomasi quality gate, build validation, dan security scanning |

## Frontend — `apps/web`
| Teknologi | Fungsi |
|---|---|
| **Next.js 16** | Framework frontend React dengan App Router |
| **Tailwind CSS** | Styling berbasis utility class sesuai token [`docs/ui.md`](./docs/ui.md) |
| **Axios** | HTTP client terpusat dengan automatic Bearer cookie injection |
| **React Hot Toast** | Notifikasi umpan balik aksi pengguna (tanpa `alert()`) |
| **Playwright** | Browser end-to-end testing untuk frontend |

## Backend — `apps/api`
| Teknologi | Fungsi |
|---|---|
| **NestJS 11** | Framework backend modular enterprise |
| **Passport & JWT** | Dual-token authentication (Access Token + Refresh Token HttpOnly) |
| **Helmet** | HTTP security headers (CSP, XSS, Clickjacking defense) |
| **Throttler** | Rate limiting (Global 100 req/min, Login endpoint 5 req/min) |
| **class-validator** | Mass-assignment defense & strict request payload validation |
| **Jest & Supertest** | Unit testing (coverage threshold > 70%) & E2E API security tests |

## Database — `packages/database`
| Teknologi | Fungsi |
|---|---|
| **Prisma ORM v5** | Object-Relational Mapping & query builder aman |
| **PostgreSQL** | Database relasional (Supabase, Neon, atau Local Docker) |
| **Prisma Migrations** | Version control skema SQL database |

---

# 📁 Struktur Direktori Monorepo

```text
stackplus-core/
├── apps/
│   ├── api/                    # Backend API (NestJS 11)
│   │   ├── src/
│   │   │   ├── auth/           # Modul Auth, JWT, Guards, Decorators
│   │   │   ├── users/          # Modul Users (Blueprint CRUD, RBAC, IDOR fix)
│   │   │   ├── health/         # Endpoint GET /health
│   │   │   ├── prisma/         # PrismaService singleton
│   │   │   ├── app.module.ts   # Root Module (Config & Throttler global)
│   │   │   └── main.ts         # Bootstrap (Helmet, CORS, ValidationPipe)
│   │   ├── test/               # E2E Supertest & Test Safety Guard
│   │   └── Dockerfile          # Hardened multi-stage container build
│   │
│   └── web/                    # Frontend Web (Next.js 16)
│       ├── src/
│       │   ├── app/            # App Router pages & route groups
│       │   ├── components/     # UI Design System components
│       │   ├── lib/            # Axios API client (@/lib/axios)
│       │   └── proxy.ts        # Route protection proxy
│       └── e2e/                # Playwright smoke test specs
│
├── packages/
│   └── database/               # Shared Database Package
│       ├── prisma/
│       │   ├── schema.prisma   # Skema Prisma terpusat
│       │   ├── migrations/     # Riwayat migrasi SQL
│       │   └── seed.ts         # Database seeder awal
│       └── index.ts            # Prisma client export
│
├── perf/                       # Performance Testing Suite (k6)
│   └── k6/
│       ├── scenarios/          # smoke.js, load.js, stress.js, spike.js, soak.js
│       └── lib/                # Config & safety guard pencegah target produksi
│
├── docs/                       # Dokumentasi arsitektur, UI, dan SOP
├── .github/workflows/          # CI/CD Workflows (ci.yml & security.yml)
├── .env.example                # Template konfigurasi environment terpadu
├── .gitleaks.toml              # Allowlist aturan scan rahasia Gitleaks
├── .trivyignore                # Rule ignore scanner Trivy
├── turbo.json                  # Konfigurasi pipeline Turborepo
└── pnpm-workspace.yaml         # Definisi workspace pnpm
```

---

# ⌨️ Daftar Perintah Utama (Workspace Scripts)

Seluruh perintah dijalankan dari **root folder monorepo**:

### Pengembangan & Build
```bash
# Menjalankan frontend (localhost:3000) dan backend (localhost:3001) secara bersamaan
pnpm dev

# Membangun build produksi untuk semua aplikasi
pnpm build
```

### Quality Gates & Validasi Kode
```bash
# Memeriksa integritas tipe TypeScript di semua paket
pnpm typecheck

# Menjalankan linting (gate checking tanpa autofix)
pnpm lint

# Menjalankan linting dengan perbaikan otomatis (khusus developer lokal)
pnpm --filter api run lint:fix
```

### Pengujian Otomatis (Automated Tests)
```bash
# Menjalankan seluruh unit test backend
pnpm test

# Menjalankan unit test dengan laporan cakupan kode (coverage gate > 70%)
pnpm test:cov

# Menjalankan API E2E & security integration tests
pnpm test:e2e

# Menjalankan frontend E2E browser tests (Playwright)
pnpm --filter web test:e2e
```

### Database Management (Prisma)
```bash
# Generate Prisma Client setelah mengubah schema.prisma
pnpm db:generate

# Mendorong perubahan schema.prisma ke database pengembangan
pnpm db:push

# Mengisi database dengan akun seeder default
pnpm --filter @cahyodev/database prisma db seed
```

### Pengujian Beban & Performa (k6)
```bash
pnpm perf:smoke    # Uji verifikasi dasar (1-5 VU)
pnpm perf:load     # Uji beban target normal
pnpm perf:stress   # Uji batas daya tahan sistem
pnpm perf:spike    # Uji lonjakan trafik mendadak
pnpm perf:soak     # Uji ketahanan memori jangka panjang
```

---

# ⚙️ Panduan Setup Cepat (Quick Start)

### 1. Prasyarat Sistem
Pastikan lingkungan lokal memiliki:
* **Node.js**: versi 20 LTS atau lebih baru (`node -v`)
* **pnpm**: versi 9.x (`pnpm -v`)
* **Git**: (`git -v`)
* **Database PostgreSQL**: Supabase, Neon, atau Docker container lokal

### 2. Instalasi Dependensi
```bash
git clone git@github.com-stackplustudio:stackplustudio/stackplustudio-core.git
cd stackplus-core
pnpm install
```

### 3. Konfigurasi Environment Variables
Salin template environment di root folder:
```bash
cp .env.example .env
```
Sesuaikan nilainya:
```env
# Database PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/maincore_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/maincore_db?schema=public"

# Keamanan JWT (Ganti dengan string acak minimal 32 karakter)
JWT_SECRET="ganti_dengan_jwt_secret_rahasia_minimal_32_karakter!"
JWT_REFRESH_SECRET="ganti_dengan_refresh_secret_rahasia_minimal_32_karakter!"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Port & URL
PORT=3001
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Setup Database & Seeding
```bash
# Generate client dan sinkronkan schema
pnpm db:generate
pnpm db:push

# Jalankan seeder akun awal
pnpm --filter @cahyodev/database prisma db seed
```

Akun default hasil seeding:
* **Super Admin**: `stackplustudio@gmail.com` / `stackplustudio06` (Role: `ADMIN`)
* **User Reguler**: `budicahyono@gmail.com` / `stackplustudio3` (Role: `USER`)

### 5. Jalankan Development Server
```bash
pnpm dev
```
Akses di browser:
* **Frontend Web**: `http://localhost:3000`
* **Backend API**: `http://localhost:3001`
* **Health Check Probe**: `http://localhost:3001/health`

---

# 🔐 Arsitektur Keamanan yang Diterapkan

Sistem keamanan Maincore telah melalui audit komprehensif dan *hardening* berlapis:

1. **Helmet HTTP Headers**: Menyematkan header keamanan browser (CSP, HSTS, X-Content-Type-Options, X-Frame-Options).
2. **Rate Limiting Terisolasi**: Dilindungi oleh `ThrottlerGuard` global (100 req/menit) dan proteksi khusus brute-force pada `POST /auth/login` (maksimal 5 req/menit).
3. **Mass-Assignment Defense**: `ValidationPipe` disetel dengan `whitelist: true` dan `forbidNonWhitelisted: true` untuk menolak request dengan parameter tak dikenal.
4. **IDOR & Authorization Control**: Pengguna ber-role `USER` hanya dapat membaca dan mengubah profil miliknya sendiri (`assertSelfOrAdmin`), sedangkan operasi massal/manajemen role dikunci khusus untuk `@Roles('ADMIN')`.
5. **Safe Secret Management**: Semua kunci JWT divalidasi saat startup melalui `ConfigService.getOrThrow()` tanpa fallback hardcoded.
6. **Hardened Docker Container**: Image backend berjalan menggunakan unprivileged user `USER node` dan dilengkapi pemeriksaan kesehatan berkala via `HEALTHCHECK`.
7. **Test Isolation Guard**: Pengujian lokal dilindungi oleh `test-safety.guard.ts` yang membatalkan eksekusi jika `DATABASE_URL` terdeteksi mengarah ke database cloud produksi.

---

# 🚀 SOP Pengembangan Fitur Baru

Untuk menambahkan modul bisnis baru (misal: Courses, Products), **WAJIB** mengikuti alur kerja berikut:

1. **Definisikan Skema Database**:
   Tambahkan model baru di [`packages/database/prisma/schema.prisma`](./packages/database/prisma/schema.prisma), lalu jalankan `pnpm db:push` dan `pnpm db:generate`.
2. **Generate Modul Backend**:
   Masuk ke folder `apps/api` dan gunakan CLI NestJS:
   ```bash
   cd apps/api
   npx @nestjs/cli g resource <nama_modul>
   ```
3. **Amankan Endpoint**:
   Tambahkan `@UseGuards(JwtAuthGuard, RolesGuard)` pada controller dan terapkan `@Roles('ADMIN')` jika rute memerlukan hak akses khusus.
4. **Bangun Tampilan Frontend**:
   Gunakan Route Groups di `apps/web/src/app/(dashboard)/<nama_modul>/` sesuai visual identity di [`docs/ui.md`](./docs/ui.md). Selalu gunakan `import { api } from "@/lib/axios"` dan `import toast from 'react-hot-toast'`.
5. **Validasi Quality Gates**:
   Jalankan `pnpm typecheck`, `pnpm lint`, dan `pnpm test:cov` sebelum membuat commit atau Pull Request.

Panduan detail tersedia di [**`docs/newproject.md`**](./docs/newproject.md).

---

# ❤️ Credits & Kontribusi

Dikembangkan dan dipelihara secara resmi oleh **Stack Plus Studio Core Engineering Team**.
Hak Cipta © 2026 Stack Plus Studio. Seluruh hak cipta dilindungi undang-undang.
