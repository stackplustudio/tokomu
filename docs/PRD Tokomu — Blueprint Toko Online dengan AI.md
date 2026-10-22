# PRD Tokomu — Blueprint Toko Online dengan AI

Stack Plus Studio · Versi 1.0 (Draft) · Oct 22, 2026 · @Budi Cahono

## 1. Ringkasan Eksekutif

Tokomu adalah blueprint toko online single-vendor milik Stack Plus Studio, dibangun di atas Maincore, dimulai sebagai toko sepatu, dan dipublikasikan di tokomu.stackplustudio.com sebagai portofolio yang bisa dijelaskan penuh saat interview.

### 1.1 Latar belakang

- Pemilik proyek baru selesai interview dan banyak konsep yang tidak sempat dijelaskan dengan percaya diri.
- Tokomu dibuat sebagai karya nyata yang bisa dibuka, dijalankan, dan dibedah pada interview berikutnya.
- Domain e-commerce dengan AI/otomasi dipilih karena menyentuh frontend, backend, database, keamanan, testing, dan integrasi AI dalam satu proyek.
- Maincore (Stack Plus Studio Core Engine V1.0) sudah menyediakan fondasi: autentikasi JWT, RBAC, rate limiting, Helmet, Prisma, CI/CD, dan lapisan testing. Pekerjaan Tokomu fokus ke fitur bisnis, bukan membangun ulang fondasi.

### 1.2 Toko online vs e-commerce

| Istilah | Arti | Posisi Tokomu |
| --- | --- | --- |
| Toko online | Satu bisnis menjual produknya sendiri lewat website | Model bisnis Tokomu (single-vendor) |
| E-commerce | Payung lebih luas: toko tunggal, marketplace, multi-vendor, komisi, logistik | Tokomu tetap e-commerce, tetapi marketplace di luar scope |

Definisi produk: Tokomu adalah aplikasi web e-commerce dengan model single-vendor online store, berbentuk blueprint yang dapat diganti jenis tokonya (sepatu, busana, buku, batik) lewat konfigurasi dan data, dengan AI Shopping Assistant sebagai nilai pembeda pada fase lanjutan.

### 1.3 Visi

Menjadi blueprint toko online yang kecil, rapi, teruji, dan mudah dijelaskan: pengunjung melihat toko sepatu yang bersih, reviewer melihat arsitektur dan kualitas kode yang bisa dipertanggungjawabkan, dan Stack Plus Studio mendapat fondasi yang bisa dipakai ulang untuk klien.

### 1.4 Keputusan yang sudah diambil

| Keputusan | Nilai |
| --- | --- |
| Nama produk | Tokomu (by Stack Plus Studio) |
| Domain target | tokomu.stackplustudio.com |
| Model bisnis | Single-vendor online store |
| Tema demo awal | Toko sepatu |
| Fondasi teknis | Maincore (Next.js, NestJS, Prisma, PostgreSQL, Turborepo, pnpm) |
| Tampilan awal | Blueprint: kartu produk dengan gambar placeholder, logo StackPlus putih dan biru |
| Urutan | Storefront dulu, lalu backend dan database, lalu commerce, lalu AI |
| Cara belajar | Understand, Design, Implement, Test, Explain, Review untuk setiap fitur |

## 2. Tujuan, Non-Tujuan, dan Metrik Keberhasilan

Proyek dianggap berhasil bila pemilik bisa membuka kode sendiri, menjalankan aplikasinya, dan menjelaskan setiap keputusan teknis tanpa membaca catatan.

### 2.1 Tujuan

| ID | Tujuan | Cara membuktikan |
| --- | --- | --- |
| G-01 | Belajar fundamental software engineering lewat proyek nyata | Setiap fitur melewati siklus Understand, Design, Implement, Test, Explain, Review dan punya catatan penjelasan |
| G-02 | Punya portofolio publik di tokomu.stackplustudio.com | Situs online, responsif, dan bisa diakses reviewer tanpa login |
| G-03 | Menyediakan blueprint toko yang reusable | Ganti jenis toko (sepatu ke batik) hanya lewat konfigurasi, data, dan aset |
| G-04 | Menunjukkan praktik profesional | Quality gate Maincore hijau: typecheck, lint, test:cov (70%+), test:e2e, build, security scan |
| G-05 | Menunjukkan integrasi AI yang terkendali | AI hanya membaca data katalog lewat tool backend, dengan guardrail dan evaluasi terukur |
| G-06 | Siap dijadikan bahan interview | README, diagram arsitektur, catatan keputusan teknis, dan demo skenario tersedia |

### 2.2 Non-tujuan

- Bukan marketplace multi-vendor dan tidak ada komisi atau settlement.
- Tidak memproses pembayaran sungguhan pada MVP.
- Tidak membangun ulang autentikasi, RBAC, rate limiting, atau pipeline CI/CD yang sudah disediakan Maincore.
- Tidak menciptakan design system baru; Tokomu mengikuti `docs/ui.md`.
- Tidak melatih model AI sendiri.

### 2.3 Metrik keberhasilan

Target numerik performa dan kualitas AI ditetapkan setelah baseline pertama diukur. Klaim pada README harus berasal dari hasil pengujian aktual.

| Metrik | Target | Kapan diukur |
| --- | --- | --- |
| Coverage unit test (statements, branches, functions, lines) | 70% atau lebih (threshold Maincore) | Setiap PR lewat `pnpm test:cov` |
| Quality gate CI | Hijau pada branch `main` | Setiap push dan PR |
| Security scan | Tidak ada kredensial di repo; tidak ada temuan HIGH/CRITICAL terbuka | Mingguan dan tiap PR ke `main` |
| Halaman storefront utama | Tampil benar di mobile, tablet, desktop tanpa horizontal overflow | Akhir Fase 1 |
| Pencarian dan filter | Hasil benar pada kasus ada hasil, tanpa hasil, dan kombinasi pencarian + kategori | Akhir Fase 1 |
| Latensi API katalog (p95) | Ditetapkan setelah baseline `pnpm perf:load` | Fase 3 |
| Kepatuhan AI terhadap budget dan katalog | Ditetapkan setelah set evaluasi pertama | Fase 6 |
| Kemampuan menjelaskan | Pemilik dapat menjelaskan arsitektur, alur checkout, dan alur AI tanpa catatan | Latihan akhir tiap fase |

## 3. Pengguna dan Persona

Tokomu melayani empat peran: customer, admin toko, developer, dan reviewer portofolio. Dua peran pertama sesuai role Maincore (`USER` dan `ADMIN`).

### 3.1 Persona

| Persona | Siapa | Kebutuhan utama | Role sistem |
| --- | --- | --- | --- |
| Customer | Pengunjung atau pembeli toko sepatu | Melihat katalog, mencari dan memfilter, membuka detail, kelak belanja dan bertanya ke AI | Anonim di Fase 1; `USER` setelah login |
| Store Admin | Pengelola toko | Mengelola produk, stok, kategori, dan pesanan | `ADMIN` |
| Developer / Maintainer | Pemilik proyek, AI agent, atau engineer lain | Mengganti jenis toko, tema, data, dan menambah fitur tanpa merusak fondasi | Akses repo |
| Reviewer / Interviewer | Recruiter atau technical interviewer | Menilai kualitas kode, arsitektur, testing, dan integrasi AI dengan cepat | Anonim (demo publik) |

Catatan: Maincore memberi `User` role default `USER`. Pada Tokomu, `USER` dipakai sebagai customer; tidak dibuat role baru kecuali ada kebutuhan yang jelas.

### 3.2 User stories

**Customer**

- US-01: Sebagai customer, saya ingin melihat katalog sepatu agar bisa membandingkan pilihan.
- US-02: Sebagai customer, saya ingin mencari sepatu berdasarkan nama agar cepat menemukan yang dituju.
- US-03: Sebagai customer, saya ingin memfilter berdasarkan kategori dan harga agar daftar lebih relevan.
- US-04: Sebagai customer, saya ingin membuka halaman detail agar tahu harga, deskripsi, dan ukuran.
- US-05: Sebagai customer, saya ingin tetap melihat tampilan rapi walaupun foto produk belum ada.
- US-06: Sebagai customer, saya ingin menambah ke keranjang dan checkout simulasi agar paham alur belanja.
- US-07: Sebagai customer, saya ingin bertanya ke asisten AI (misalnya "sepatu lari maksimal Rp500.000") agar menemukan produk tanpa menyaring manual.

**Store Admin**

- US-08: Sebagai admin, saya ingin menambah, mengubah, dan menonaktifkan produk agar katalog selalu terbaru.
- US-09: Sebagai admin, saya ingin mengelola stok agar tidak terjadi oversell.
- US-10: Sebagai admin, saya ingin melihat pesanan dan memperbarui statusnya sesuai aturan transisi.

**Developer / Maintainer**

- US-11: Sebagai developer, saya ingin mengganti jenis toko lewat konfigurasi agar blueprint bisa dipakai ulang.
- US-12: Sebagai developer, saya ingin dokumen yang jelas agar AI agent bisa melanjutkan pekerjaan tanpa menebak.

**Reviewer**

- US-13: Sebagai reviewer, saya ingin membuka demo publik dan README agar bisa menilai proyek dalam beberapa menit.
- US-14: Sebagai reviewer, saya ingin melihat bukti testing dan keputusan teknis agar bisa menilai kedalaman pemahaman.

## 4. Scope

MVP adalah storefront publik dengan data contoh (Fase 1); backend, commerce, dan AI masuk bertahap setelah fondasi dipahami dan teruji.

### 4.1 Scope per fase

| Fase | Nama | Isi utama | Status scope |
| --- | --- | --- | --- |
| 0 | Setup dan pemahaman | Repo baru dari template Maincore, baca docs, jalankan quality gate awal, breakdown dari PRD ini | Wajib |
| 1 | Static Storefront (MVP) | Landing, katalog, kartu produk, placeholder gambar, pencarian, filter kategori, detail produk, responsif, konfigurasi toko, data contoh bertipe | Wajib, dipublikasikan |
| 2 | Katalog berbasis database | Model Prisma Product dan Category, seed sepatu, REST API katalog, storefront membaca dari API | Wajib |
| 3 | Commerce inti | Login customer, keranjang, checkout simulasi, order, stok transaksional, admin produk dan pesanan | Wajib |
| 4 | Testing dan hardening | Integration test, test negatif, audit akses, baseline performa k6 | Wajib |
| 5 | AI Shopping Assistant | Function calling `search_products` dan `get_product_details`, guardrail, evaluasi | Wajib untuk nilai jual |
| 6 | Production readiness | Deployment, domain, dokumentasi, diagram, demo, materi interview | Wajib |

### 4.2 In scope MVP (Fase 1)

- Homepage storefront: navbar, hero, produk unggulan, kategori, bagian informasi, footer dengan atribusi StackPlus.
- Katalog dengan kartu produk reusable dan fallback gambar.
- Pencarian berdasarkan nama dan filter kategori yang bisa digabung.
- Halaman detail produk dengan penanganan produk tidak ditemukan.
- Layout responsif desktop, tablet, mobile.
- Konfigurasi toko (nama, tipe, kategori, aset, kontak) terpisah dari komponen UI.
- State loading, kosong, dan error.
- Logo StackPlus versi putih dan biru sesuai latar.
- Test awal untuk logika reusable (pencarian, filter, format harga, fallback).
- Dokumentasi menjalankan proyek.

### 4.3 Fase lanjutan (setelah MVP stabil)

- Rekomendasi produk personal, semantic search berbasis embedding, dan RAG, hanya jika Shopping Assistant dasar menunjukkan keterbatasan yang nyata.
- Visual search, analitik penjualan, payment gateway mode sandbox.
- Konfigurasi toko lain: busana, buku, batik.
- Varian produk (ukuran, warna) dengan stok per varian.

### 4.4 Out of scope

- Pembayaran sungguhan, pengiriman, dan integrasi logistik.
- Marketplace multi-vendor, dashboard penjual, komisi, settlement.
- Pelatihan model AI dari nol.
- Dark mode (tidak didukung design system Stack Plus saat ini).
- Perubahan arsitektur inti Maincore tanpa konfirmasi owner.

## 5. Blueprint dan Konfigurasi Toko

Tokomu berbentuk blueprint: struktur, komponen, dan alur tetap sama, sedangkan identitas toko, kategori, dan data produk diganti lewat konfigurasi. Toko sepatu adalah implementasi demo pertama.

### 5.1 Identitas toko awal

| Item | Nilai |
| --- | --- |
| Nama toko | Tokomu |
| Jenis toko | Toko sepatu |
| Kategori produk | Sneakers, Casual Shoes, Running Shoes, Formal Shoes |
| Mata uang | IDR (format Rp, tanpa desimal) |
| Bahasa | Bahasa Indonesia |
| Gaya visual | Bersih, modern, fokus produk, mengikuti `docs/ui.md` |
| Atribusi | StackPlus Studio |

### 5.2 Konfigurasi toko (store config)

Semua konten khusus toko berada di satu tempat bertipe TypeScript; komponen UI hanya membaca konfigurasi ini. Lokasi dan nama file final mengikuti struktur `apps/web/src` yang ada.

```ts
// Gambaran bentuk konfigurasi, bukan kode final
export type StoreConfig = {
  name: string;               // "Tokomu"
  type: "shoes" | "fashion" | "books" | "batik";
  tagline: string;
  description: string;
  currency: "IDR";
  locale: "id-ID";
  categories: { id: string; name: string; slug: string; description?: string }[];
  hero: { title: string; highlight: string; subtitle: string; ctaLabel: string };
  contact: { email?: string; phone?: string; address?: string };
  assets: { storeLogo?: string; productPlaceholder: string };
  footer: { about: string; links: { label: string; href: string }[] };
};
```

Aturan: mengganti dari toko sepatu ke toko batik hanya boleh mengubah file konfigurasi, data produk, dan aset, bukan komponen UI.

### 5.3 Placeholder dan fallback gambar

- Setiap kartu produk punya area gambar dengan rasio tetap, sehingga grid tidak bergeser ketika foto belum ada.
- Bila URL gambar kosong atau gagal dimuat, tampilkan satu gambar pengganti netral bertema sepatu (ilustrasi sederhana, latar netral dari token `surface-alt`).
- Placeholder adalah aset yang bisa diganti per toko lewat `assets.productPlaceholder`.
- Komponen yang bertanggung jawab: `ProductImage` (memuat gambar) dan `ProductImageFallback` (menampilkan pengganti).

### 5.4 Logo StackPlus

| Latar | Versi logo |
| --- | --- |
| Terang (navbar putih, footer terang, halaman login) | Biru |
| Gelap atau biru (blok CTA biru, band charcoal) | Putih |

Kedua versi harus berasal dari logo resmi yang sama dan hanya berbeda warna. Lokasi aset logo di repo belum diketahui (lihat Open Decisions).

### 5.5 Catatan konsistensi dengan design system

`docs/ui.md` melarang warna, font, dan style baru, dan `docs/handover.md` melarang mengubah konfigurasi dasar tanpa konfirmasi owner. Karena itu:

- Konfigurasi "warna tema" pada Tokomu hanya memilih token yang sudah ada (`primary`, `background`, `surface`, `surface-alt`, `line`, `ink`), tidak membuat hex baru.
- Pergantian aksen per toko (misalnya hijau untuk toko buku) baru boleh dibuat setelah owner menyetujui perluasan token.
- Dark mode tidak didukung.

## 6. Functional Requirements

Setiap requirement punya ID, prioritas (Must, Should, Could), dan acceptance criteria yang bisa diuji. Fase 1 adalah MVP yang dirilis lebih dulu.

### 6.1 Fase 1: Static Storefront (MVP)

| ID | Requirement | Prioritas | Acceptance criteria |
| --- | --- | --- | --- |
| FR-01 | Homepage storefront berisi navbar, hero, produk unggulan, daftar kategori, bagian informasi, dan footer dengan atribusi StackPlus | Must | Semua section tampil pada desktop dan mobile; satu CTA utama per halaman; urutan section mengikuti ritme di `docs/ui.md` |
| FR-02 | Kartu produk menampilkan gambar atau placeholder, nama, harga IDR, kategori, dan badge opsional (New, Featured) | Must | Harga diformat `Rp 1.299.000`; kartu dengan dan tanpa foto memiliki tinggi gambar yang sama |
| FR-03 | Fallback gambar untuk URL kosong atau gambar gagal dimuat | Must | Tidak ada ikon gambar rusak; layout grid tidak bergeser; ada test untuk URL kosong dan error muat |
| FR-04 | Pencarian produk berdasarkan nama | Must | Pencarian tidak sensitif huruf besar-kecil; input kosong menampilkan semua produk; tanpa hasil menampilkan empty state |
| FR-05 | Filter kategori yang dapat digabung dengan pencarian | Must | Kombinasi kata kunci + kategori memberi irisan yang benar; ada tombol reset |
| FR-06 | Filter rentang harga dan pengurutan (harga naik/turun, terbaru) | Should | Urutan stabil; rentang tidak valid (min lebih besar dari max) ditangani |
| FR-07 | Halaman detail produk (gambar, nama, harga, deskripsi, kategori, atribut) | Must | URL berbasis slug; slug tidak dikenal menampilkan halaman not-found; produk tidak aktif tidak dapat dibuka |
| FR-08 | Layout responsif | Must | Grid 1, 2, 3 kolom; tidak ada horizontal overflow pada lebar 360 px sampai 1440 px; target sentuh minimal 44 px |
| FR-09 | Konfigurasi toko terpisah dari komponen UI (lihat bagian 5) | Must | Mengubah nama, kategori, hero, dan aset hanya lewat file konfigurasi |
| FR-10 | State loading, empty, dan error | Must | Setiap daftar dan halaman detail punya ketiganya sesuai pola `docs/ui.md` bagian 12 |
| FR-11 | Logo StackPlus mengikuti latar | Must | Biru pada latar terang, putih pada latar gelap atau biru |
| FR-12 | Akses data lewat lapisan abstraksi (misalnya `ProductRepository`) dengan implementasi data contoh | Should | Mengganti data contoh ke API pada Fase 2 tidak mengubah komponen UI |

### 6.2 Fase 2: Katalog berbasis database dan API

| ID | Requirement | Prioritas | Acceptance criteria |
| --- | --- | --- | --- |
| FR-20 | Model `Category` dan `Product` di `packages/database/prisma/schema.prisma` dengan migrasi dan seed sepatu | Must | `pnpm db:generate` dan migrasi berjalan bersih; seed idempoten; harga disimpan sebagai integer rupiah |
| FR-21 | `GET /products` dengan pencarian, filter kategori, rentang harga, pengurutan, dan paginasi | Must | Default 20 item, maksimal 100; respons memuat `total`, `page`, `limit`, `totalPages`; hanya produk aktif untuk publik |
| FR-22 | `GET /products/:slug` | Must | 404 bila tidak ada atau tidak aktif |
| FR-23 | `GET /categories` | Must | Mengembalikan kategori beserta jumlah produk aktif |
| FR-24 | Storefront membaca data dari API lewat `@/lib/axios` | Must | Tidak ada `fetch()` langsung; error jaringan menampilkan error state |
| FR-25 | Harga dan stok hanya bersumber dari database | Must | Frontend tidak pernah menentukan harga atau stok |

### 6.3 Fase 3: Commerce inti

| ID | Requirement | Prioritas | Acceptance criteria |
| --- | --- | --- | --- |
| FR-30 | Registrasi, login, dan logout memakai `AuthModule` Maincore | Must | Password bcrypt; refresh token di cookie HttpOnly; login dibatasi 5 request per menit |
| FR-31 | Keranjang: tambah, ubah kuantitas, hapus | Must | Kuantitas bilangan bulat positif; subtotal dan total dihitung backend dari harga database |
| FR-32 | Validasi stok dan ketersediaan saat menambah ke keranjang dan saat checkout | Must | Produk nonaktif atau stok kurang ditolak dengan pesan jelas |
| FR-33 | Checkout simulasi membuat order dan mengurangi stok dalam satu transaksi database | Must | Gagal di tengah jalan tidak meninggalkan order atau perubahan stok; dua checkout bersamaan tidak membuat stok negatif |
| FR-34 | `OrderItem` menyimpan snapshot nama dan harga saat order dibuat | Must | Mengubah harga produk setelahnya tidak mengubah riwayat order |
| FR-35 | Customer melihat daftar dan detail order miliknya sendiri | Must | Akses ke order orang lain ditolak (cek IDOR, `assertSelfOrAdmin`) |
| FR-36 | Admin mengelola produk (buat, ubah, nonaktifkan) dan stok | Must | Hanya `ADMIN`; validasi DTO dengan `whitelist` dan `forbidNonWhitelisted`; produk dinonaktifkan, bukan dihapus |
| FR-37 | Admin melihat daftar order dan mengubah status sesuai transisi | Must | Transisi tidak sah ditolak (lihat 6.5) |
| FR-38 | Status pembayaran tampil jelas sebagai simulasi | Must | Label "Simulasi, tidak ada pembayaran sungguhan" muncul di checkout dan detail order |
| FR-39 | Keranjang tersimpan di database untuk user login | Should | Keranjang bertahan setelah logout dan login ulang |

### 6.4 Fase 5: AI Shopping Assistant

Requirement lengkap (FR-50 sampai FR-59) ada di bagian 12 agar alur, guardrail, dan evaluasinya terbaca dalam satu tempat.

### 6.5 Aturan transisi status order

| Dari | Ke yang diizinkan |
| --- | --- |
| PENDING | CONFIRMED, CANCELLED |
| CONFIRMED | PROCESSING, CANCELLED |
| PROCESSING | SHIPPED |
| SHIPPED | COMPLETED |
| COMPLETED | tidak ada (final) |
| CANCELLED | tidak ada (final); stok dikembalikan saat pembatalan dari PENDING atau CONFIRMED |

Nama status dan aturan pengembalian stok adalah usulan dan perlu dikonfirmasi sebelum skema dikunci.

## 7. Non-Functional Requirements

Requirement non-fungsional Tokomu mewarisi pertahanan Maincore dan menambahkan aturan khusus e-commerce: harga, stok, dan order harus konsisten.

| ID | Area | Requirement | Cara verifikasi |
| --- | --- | --- | --- |
| NFR-01 | Keamanan: autentikasi | Password di-hash bcrypt; access token berumur pendek; refresh token 7 hari di cookie HttpOnly, Secure, SameSite Lax | Test E2E auth; review konfigurasi |
| NFR-02 | Keamanan: otorisasi | Endpoint privat memakai `JwtAuthGuard`; endpoint admin memakai `RolesGuard` dan `@Roles('ADMIN')`; akses data milik sendiri diperiksa dengan `assertSelfOrAdmin` | Test negatif 401, 403, dan IDOR |
| NFR-03 | Keamanan: input | `ValidationPipe` dengan `whitelist`, `forbidNonWhitelisted`, `transform`; payload asing ditolak 400; query lewat Prisma (terparameter) | Test E2E mass-assignment dan payload SQL injection |
| NFR-04 | Keamanan: infrastruktur | Helmet, CORS whitelist `FRONTEND_URL`, rate limit global 100/menit per IP dan 5/menit untuk login; tambahan limit khusus endpoint AI | Test E2E dan konfigurasi Throttler |
| NFR-05 | Keamanan: rahasia | Tidak ada rahasia di repo; `JWT_SECRET`, `JWT_REFRESH_SECRET`, dan API key LLM dibaca lewat `ConfigService.getOrThrow()`; API key LLM tidak pernah dikirim ke browser | Gitleaks, review kode |
| NFR-06 | Integritas data | Relasi dengan constraint; harga dan stok ditentukan backend; checkout atomik lewat transaksi | Integration test transaksi dan konkurensi |
| NFR-07 | Reliabilitas | Error ditangani konsisten dengan status HTTP yang tepat; kegagalan layanan AI tidak mengganggu katalog dan checkout; endpoint `GET /health` tersedia | Test kegagalan provider; health probe |
| NFR-08 | Performa | Paginasi wajib (default 20, maksimal 100); indeks pada kolom pencarian dan filter; timeout pemanggilan AI; target numerik ditetapkan setelah baseline k6 | `pnpm perf:smoke` dan `pnpm perf:load` pada mesin lokal yang sama |
| NFR-09 | Aksesibilitas | Kontras cukup, label atau `aria-label` pada input, alt pada gambar, fokus terlihat, navigasi keyboard, target sentuh minimal 44 px, hormati `prefers-reduced-motion` | Checklist `docs/ui.md` bagian 11 |
| NFR-10 | Maintainability | Business logic terpisah dari UI dan controller; modul per domain; penamaan konsisten; konfigurasi lewat environment variable | Code review, lint |
| NFR-11 | Testability | Logika bisa diuji terpisah; dependensi eksternal (LLM) di-mock; test mencakup kasus normal, input tidak valid, dan kegagalan | Coverage 70% atau lebih |
| NFR-12 | Portabilitas | Berjalan lokal dengan `pnpm install`, `.env`, `pnpm db:generate`, `pnpm db:push`, `pnpm dev`; backend dapat dibangun sebagai image Docker | CI `docker-validate` |
| NFR-13 | Privasi | Data percakapan AI mengikuti minimisasi data dan tidak menyimpan informasi sensitif; data customer tidak muncul di log | Review log dan skema |
| NFR-14 | Observabilitas | Logging terstruktur untuk error, checkout, dan pemanggilan AI (tanpa data sensitif) | Review log saat debugging skenario gagal |

## 8. Arsitektur dan Tech Stack

Tokomu memakai stack Maincore apa adanya; yang baru hanyalah modul domain toko, tanpa mengubah fondasi.

### 8.1 Gambaran arsitektur

&#91;embedded content: arsitektur Tokomu · 3 lapis, 1 provider eksternal\]

Browser hanya berbicara dengan `apps/web`, yang memanggil `apps/api` lewat REST. Backend memegang semua aturan bisnis dan akses database; AI Assistant hanya memanggil tool yang disediakan backend, lalu meneruskan hasilnya ke LLM provider.

### 8.2 Tech stack

| Lapisan | Teknologi | Tanggung jawab di Tokomu |
| --- | --- | --- |
| Monorepo | pnpm workspaces + Turborepo | Orkestrasi task (`dev`, `build`, `lint`, `typecheck`, `test:cov`) |
| Frontend | Next.js 16 (App Router), React, TypeScript | Storefront publik, dashboard admin, routing, rendering |
| Styling | Tailwind CSS v3 lewat `tailwind.config.ts`, Plus Jakarta Sans, Lucide | Tampilan sesuai `docs/ui.md`; sintaks Tailwind v4 tidak dipakai |
| UI feedback | React Hot Toast | Notifikasi hasil aksi; `alert()` dilarang |
| HTTP client | Axios instance `@/lib/axios` | Satu-satunya jalur panggilan API dari frontend; `fetch()` langsung dilarang |
| Backend | NestJS 11, class-validator | REST API, DTO, guard, service |
| Autentikasi | Passport JWT, bcrypt | Login, access dan refresh token |
| ORM | Prisma 5.22 | Skema, migrasi, query terparameter |
| Database | PostgreSQL (Supabase atau Neon, SSL) | Data relasional dan transaksi |
| Testing | Jest, Supertest, Playwright, k6 | Unit, API E2E, smoke test web, performa |
| CI/CD | GitHub Actions (`ci.yml`, `security.yml`) | Quality gate, Gitleaks, `pnpm audit`, Trivy |
| Deployment | Vercel untuk `apps/web`; Docker dan Nginx untuk `apps/api`; database terkelola | Hosting dan domain |
| AI | LLM API dengan function calling | Shopping Assistant; penyedia belum dipilih |

Catatan: shadcn/ui pada draft awal tidak ter-theme di Maincore (tidak ada variabel CSS shadcn). Komponen shadcn atau Radix hanya dipakai bila tampilannya disamakan dengan token `docs/ui.md`.

### 8.3 Penempatan kode

| Kebutuhan | Lokasi |
| --- | --- |
| Skema dan migrasi database | `packages/database/prisma/schema.prisma` dan `migrations/` |
| Modul backend baru | `apps/api/src/<nama>` dibuat dengan `npx @nestjs/cli g resource <nama>` |
| Halaman storefront publik | `apps/web/src/app/` (route group publik); struktur final diputuskan di Fase 0 setelah memeriksa `apps/web` |
| Dashboard admin | `apps/web/src/app/(dashboard)/admin/` |
| Komponen UI | `apps/web/src/components/` (`layout/`, `ui/`, section); periksa komponen yang ada sebelum membuat baru |
| Store config dan data contoh | Folder konfigurasi di `apps/web/src/`; nama final diputuskan di Fase 0 |
| Test API, test E2E web | `apps/api/test/`, `apps/web/e2e/` |
| Dokumen | `PRD.md` di root repo dan `docs/` |

### 8.4 Keputusan arsitektur

1. **Repo baru dari template Maincore.** Mengikuti `docs/newproject.md` Opsi A ("Use this template") agar riwayat git bersih dan repo tidak menempel ke core. Ini usulan yang menutup open decision soal monorepo vs repo terpisah.
2. **Backend adalah sumber kebenaran** untuk harga, stok, dan order. Frontend dan AI tidak pernah menentukannya.
3. **Fase 1 tanpa backend.** Data contoh bertipe berada di balik abstraksi `ProductRepository` agar pindah ke API tidak mengubah komponen.
4. **Harga disimpan sebagai integer rupiah** (sejalan dengan contoh `price Int` di `docs/newproject.md`) untuk menghindari galat pembulatan.
5. **Migrasi Prisma mulai Fase 2.** `docs/newproject.md` memakai `pnpm db:push`, tetapi CI menjalankan `prisma migrate deploy`; skema yang menyangkut transaksi dan stok harus punya riwayat migrasi. Nama script migrasi dicek di `package.json` saat Fase 0.
6. **AI mulai dari function calling**, tanpa vector database atau RAG, sampai keterbatasannya terbukti.
7. **Tidak mengubah arsitektur, stack, atau konfigurasi dasar** tanpa konfirmasi owner (aturan `docs/handover.md`).

## 9. Model Data

Model data berikut adalah usulan awal yang dikunci pada Fase 2 (katalog) dan Fase 3 (commerce) setelah desain database ditinjau. Semua tabel mengikuti konvensi Maincore: id UUID, `createdAt`, `updatedAt`, dan model `User` yang sudah ada.

### 9.1 Entitas per fase

| Entitas | Fase | Tujuan |
| --- | --- | --- |
| User | Sudah ada | Identitas; role `USER` (default) atau `ADMIN` |
| Category | 2 | Klasifikasi produk |
| Product | 2 | Produk, harga, stok, dan status aktif |
| Cart, CartItem | 3 | Keranjang milik satu user dan isinya |
| Order, OrderItem | 3 | Pesanan dan snapshot item saat dibeli |
| OrderStatusHistory | 3 (Should) | Jejak perubahan status untuk audit |
| AIConversation, AIMessage | 5 (opsional) | Riwayat percakapan AI, hanya bila diputuskan disimpan |

### 9.2 Field utama

**Category**

| Field | Tipe | Aturan |
| --- | --- | --- |
| id | String (UUID) | Primary key |
| name | String | Unik |
| slug | String | Unik, dipakai di URL dan filter |
| description | String? | Opsional |

**Product**

| Field | Tipe | Aturan |
| --- | --- | --- |
| id | String (UUID) | Primary key |
| slug | String | Unik, dipakai di URL detail |
| name | String | Wajib |
| description | String | Wajib |
| priceIdr | Int | Rupiah penuh, tidak negatif |
| stock | Int | Default 0, tidak boleh negatif (constraint CHECK lewat migrasi SQL) |
| sku | String? | Unik bila diisi |
| imageUrls | String\[\] | Kosong berarti placeholder dipakai |
| badge | String? | Misalnya New atau Featured |
| isFeatured | Boolean | Default false |
| isActive | Boolean | Default true; produk tidak dihapus, hanya dinonaktifkan |
| attributes | Json? | Atribut tambahan (merek, bahan, warna) |
| categoryId | String | Foreign key ke Category |

Indeks: `slug` (unik), `categoryId`, gabungan `isActive` + `categoryId`. Pencarian nama awalnya `ILIKE`; evaluasi `pg_trgm` bila lambat pada data uji.

**Cart dan CartItem**

| Field | Tipe | Aturan |
| --- | --- | --- |
| Cart.userId | String | Unik: satu keranjang aktif per user |
| CartItem.cartId | String | Foreign key, hapus bertingkat dengan Cart |
| CartItem.productId | String | Foreign key ke Product |
| CartItem.quantity | Int | Bilangan bulat, minimal 1 |
| (cartId, productId) | Unik | Produk yang sama tidak dobel; kuantitas digabung |

**Order dan OrderItem**

| Field | Tipe | Aturan |
| --- | --- | --- |
| Order.userId | String | Pemilik order; dasar pemeriksaan IDOR |
| Order.status | Enum | PENDING (default), CONFIRMED, PROCESSING, SHIPPED, COMPLETED, CANCELLED |
| Order.paymentStatus | Enum | SIMULATED pada MVP; tidak ada pembayaran sungguhan |
| Order.subtotalIdr, totalIdr | Int | Dihitung backend |
| Order.shippingName, shippingPhone, shippingAddress | String | Data pengiriman minimal (usulan) |
| OrderItem.orderId | String | Foreign key, hapus bertingkat dengan Order |
| OrderItem.productId | String | Foreign key, hapus dibatasi (Restrict) agar riwayat aman |
| OrderItem.productName | String | Snapshot nama saat dibeli |
| OrderItem.unitPriceIdr | Int | Snapshot harga saat dibeli |
| OrderItem.quantity, lineTotalIdr | Int | Kuantitas dan subtotal baris |

### 9.3 Aturan integritas

- Harga dan stok hanya dibaca dari tabel `Product`; nilai dari klien diabaikan.
- Checkout berjalan di dalam `prisma.$transaction`: validasi item, buat `Order` dan `OrderItem`, kurangi stok, kosongkan keranjang.
- Pengurangan stok memakai update kondisional (stok harus lebih besar atau sama dengan kuantitas); bila tidak ada baris yang berubah, transaksi dibatalkan. Dengan begitu dua checkout bersamaan tidak membuat stok negatif.
- Pembatalan order dari status PENDING atau CONFIRMED mengembalikan stok dalam transaksi yang sama.
- `OrderItem` menyimpan snapshot nama dan harga; mengubah katalog tidak mengubah riwayat.
- Semua query multi-baris memakai `take` dan `skip` (default 20, maksimal 100).

## 10. Kontrak API REST

Endpoint publik hanya membaca katalog; semua operasi tulis dan data pribadi memakai `JwtAuthGuard`, dan operasi admin tambahan `RolesGuard` dengan `@Roles('ADMIN')`. Daftar ini adalah usulan; path final mengikuti hasil `npx @nestjs/cli g resource` dan controller Maincore yang sudah ada.

### 10.1 Endpoint

| Method | Path | Akses | Fungsi | Fase |
| --- | --- | --- | --- | --- |
| GET | `/health` | Publik | Liveness dan readiness (sudah ada) | Ada |
| GET | `/categories` | Publik | Daftar kategori dan jumlah produk aktif | 2 |
| GET | `/products` | Publik | Daftar produk aktif: `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` | 2 |
| GET | `/products/:slug` | Publik | Detail produk aktif | 2 |
| POST | `/auth/login` | Publik, 5 per menit | Login (sudah ada) | Ada |
| POST | `/auth/register`, `/auth/refresh`, `/auth/logout` | Publik atau terautentikasi | Registrasi, refresh token, logout; nama dan perilaku diperiksa terhadap `AuthController` yang ada | 3 |
| GET | `/cart` | USER | Isi keranjang dengan harga dan total dari database | 3 |
| POST | `/cart/items` | USER | Tambah produk: `productId`, `quantity` | 3 |
| PATCH | `/cart/items/:productId` | USER | Ubah kuantitas | 3 |
| DELETE | `/cart/items/:productId` | USER | Hapus item | 3 |
| POST | `/orders` | USER | Checkout simulasi dari keranjang beserta data pengiriman | 3 |
| GET | `/orders`, `/orders/:id` | USER (milik sendiri) | Riwayat dan detail order | 3 |
| GET | `/admin/products` | ADMIN | Semua produk termasuk nonaktif | 3 |
| POST | `/admin/products` | ADMIN | Buat produk | 3 |
| PATCH | `/admin/products/:id` | ADMIN | Ubah produk, stok, atau nonaktifkan (`isActive: false`) | 3 |
| GET | `/admin/orders`, `/admin/orders/:id` | ADMIN | Daftar dan detail semua order | 3 |
| PATCH | `/admin/orders/:id/status` | ADMIN | Ubah status sesuai transisi yang sah | 3 |
| POST | `/ai/chat` | Lihat open decision | Percakapan dengan AI Shopping Assistant | 5 |

### 10.2 Konvensi

- **Paginasi:** `page` mulai 1, `limit` default 20 dan maksimal 100; respons berisi `data` dan `meta` (`total`, `page`, `limit`, `totalPages`).
- **Validasi:** setiap body dan query memakai DTO class-validator; properti asing menghasilkan 400.
- **Format error:** format bawaan NestJS (`statusCode`, `message`, `error`), tanpa membocorkan stack trace atau detail database.
- **Autentikasi:** header `Authorization: Bearer <access_token>`; refresh token di cookie HttpOnly. Frontend memakai `@/lib/axios` dengan `withCredentials: true`.
- **Uang:** semua nilai rupiah berupa integer; format `Rp` hanya dibuat di frontend.

| Status | Dipakai untuk |
| --- | --- |
| 200, 201 | Berhasil, dan berhasil membuat resource |
| 400 | Validasi gagal, payload asing, parameter tidak valid |
| 401 | Belum login atau token tidak valid |
| 403 | Role tidak cukup atau mengakses data milik orang lain |
| 404 | Resource tidak ada, atau produk tidak aktif untuk publik |
| 409 | Stok tidak cukup atau transisi status tidak sah |
| 429 | Rate limit terlampaui |
| 502, 504 | Provider AI gagal atau timeout (hanya endpoint AI) |

## 11. UI/UX

Seluruh UI Tokomu mengikuti `docs/ui.md` sebagai satu-satunya sumber desain: warm off-white, satu aksen biru `#0053F1`, card bersih berborder tipis, tombol pill, heading dua warna, dan font Plus Jakarta Sans. Aturan emasnya: jangan membuat style baru; cari pola paling mirip yang sudah ada.

### 11.1 Halaman dan rute

| Rute | Halaman | Akses | Fase |
| --- | --- | --- | --- |
| `/` | Homepage storefront | Publik | 1 |
| `/products` | Katalog dengan pencarian, filter, dan urutan | Publik | 1 |
| `/products/[slug]` | Detail produk (dan halaman not-found) | Publik | 1 |
| `/login`, `/register` | Autentikasi (pola login `docs/ui.md` bagian 12) | Publik | 3 |
| `/cart`, `/checkout` | Keranjang dan checkout simulasi | USER | 3 |
| `/orders`, `/orders/[id]` | Riwayat dan detail order | USER | 3 |
| `/admin/products`, `/admin/orders` | Dashboard admin (shell, tabel data, form CRUD) | ADMIN | 3 |

Rute yang membutuhkan login dijaga oleh `proxy.ts` yang sudah ada. Pengelompokan route group final ditentukan di Fase 0.

### 11.2 Susunan homepage

Mengikuti ritme landing di `docs/ui.md` bagian 9: setiap section diawali eyebrow dan heading dua warna, dan diakhiri satu CTA.

1. Navbar floating: logo StackPlus biru, menu dalam pill putih, satu dark pill di kanan.
2. Hero: status dot, H1 dua warna (misalnya penekanan biru pada satu frasa), paragraf, satu CTA utama menuju katalog, dan visual produk di kanan.
3. Kategori: card standar per kategori (Sneakers, Casual, Running, Formal).
4. Produk unggulan: grid kartu produk.
5. Bagian informasi (mengapa Tokomu, bento sederhana).
6. CTA block biru dengan watermark samar.
7. Footer: logo, tautan cepat, kontak toko, atribusi StackPlus Studio, dengan logo versi sesuai latar.

### 11.3 Komponen dan padanan pola

| Komponen | Pola `docs/ui.md` | Catatan |
| --- | --- | --- |
| StoreHeader, StoreNavigation | Navbar 8.9 | Hamburger di mobile, target sentuh minimal 44 px |
| StoreHero | Hero 8.6 | Form email diganti satu tombol CTA ke katalog |
| CategoryList | Card standar 8.5 | Ikon di kotak `bg-primary/10`, `card-hover` |
| ProductCard | Portfolio card 8.5 | Area gambar di atas dengan rasio tetap, tag kategori `text-[10px] uppercase text-primary`, nama `font-semibold`, harga, `card-hover` |
| ProductImage, ProductImageFallback | Area gambar `bg-surface-alt` | Placeholder netral bertema sepatu |
| ProductSearch | Input pill kecil | Punya `aria-label`, state fokus terlihat |
| ProductFilters | Badge dan pill | Kategori dan rentang harga; tombol reset |
| ProductGrid | Grid card | 1, 2, 3 kolom |
| ProductDetail | Section dengan heading dua warna | Satu CTA utama |
| StoreFooter | Footer 8.10 | Atribusi StackPlus |
| EmptyState, LoadingState, ErrorState | State 12 | Empty: ikon, judul, deskripsi, satu tombol; loading: skeleton `animate-pulse`; error: pesan dan "Try again" |
| AI chat | Chatbot floating 8.11 | Tombol bulat biru kanan-bawah; periksa komponen `Chatbot` yang sudah ada sebelum membuat baru |

Badge status order (Fase 3) memakai pola pill bertint hijau, amber, dan merah dengan teks atau ikon, bukan hanya warna.

### 11.4 Aturan wajib

- Warna hanya dari token (`primary`, `background`, `surface`, `surface-alt`, `line`, `ink`); tidak ada hex acak, gradient warna-warni, atau font baru.
- Tailwind v3 lewat `tailwind.config.ts`; sintaks v4 dilarang.
- Maksimal satu card aktif biru per grup dan satu CTA utama per halaman.
- Notifikasi memakai `react-hot-toast`; `alert()` dilarang.
- Panggilan API hanya lewat `@/lib/axios`.
- Mobile-first, tanpa horizontal overflow, termasuk marquee (wajib dalam wrapper `overflow-hidden`).
- Animasi hanya yang terdaftar (`card-hover`, `Reveal`, `animate-float`, marquee, `animate-pulse`) dan menghormati `prefers-reduced-motion`.
- Tidak ada dark mode.
- Aksesibilitas mengikuti checklist `docs/ui.md` bagian 11 dan 15.

### 11.5 Hal yang sengaja tidak diperbaiki di Tokomu

`docs/ui.md` bagian 14 mencatat utang konsistensi (warna teks ganda, `!important` di `body`, token `secondary`, bug visual pada screenshot lama). Hal itu di luar scope Tokomu; Tokomu tidak menyalin bug tersebut sebagai standar dan tidak mengubah token tanpa konfirmasi owner.

## 12. AI Shopping Assistant dan Otomasi

AI Shopping Assistant adalah nilai pembeda Tokomu: pengguna bertanya dalam bahasa alami, AI memilih tool pencarian, backend mengambil produk aktual, dan AI menyusun rekomendasi hanya dari hasil itu. AI membantu pencarian dan rekomendasi; ia tidak membayar, mengubah stok, atau melakukan tindakan admin.

### 12.1 Alur satu giliran percakapan

&#91;embedded content: satu giliran percakapan AI · 1 keputusan, 2 jalur\]

AI bukan sumber kebenaran untuk harga, stok, atau status. Setiap produk yang disebut harus berasal dari hasil tool; backend memeriksanya sebelum jawaban sampai ke UI.

### 12.2 Requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-50 | Endpoint `POST /ai/chat` memvalidasi pesan | Panjang pesan dan jumlah riwayat dibatasi; payload asing ditolak 400; rate limit khusus berlaku |
| FR-51 | LLM dipanggil dari server | API key hanya di environment server; tidak pernah dikirim ke browser; ada timeout |
| FR-52 | Tool `search_products` | Menerima kata kunci, kategori, harga minimum dan maksimum, serta batas hasil; mengembalikan produk aktif dari database |
| FR-53 | Tool `get_product_details` | Mengembalikan detail produk aktif berdasarkan id atau slug |
| FR-54 | Rekomendasi hanya dari hasil tool | Produk yang disebut AI selalu ada di hasil tool; harga dan stok identik dengan database |
| FR-55 | Hasil kosong | AI menyampaikan tidak ada yang cocok dan menyarankan melonggarkan kriteria, tanpa mengarang produk |
| FR-56 | Kegagalan provider | Timeout, error, atau format salah menghasilkan pesan ramah; katalog, keranjang, dan checkout tetap berfungsi |
| FR-57 | Permintaan ambigu | AI meminta klarifikasi singkat (misalnya budget atau jenis sepatu) |
| FR-58 | Batas kewenangan | Tidak ada tool yang menulis data; tidak ada akses langsung AI ke database |
| FR-59 | Antarmuka chat | Memakai pola chatbot floating; produk rekomendasi tampil sebagai kartu dari data tool, ada state loading dan error |

### 12.3 Tool

| Tool | Input | Output |
| --- | --- | --- |
| `search_products` | `keyword?`, `category?` (slug), `minPriceIdr?`, `maxPriceIdr?`, `limit?` (default 5, maksimal 10) | Daftar produk: id, slug, nama, `priceIdr`, kategori, `inStock` |
| `get_product_details` | `productId` atau `slug` | Detail produk aktif, atau tidak ditemukan |

Semua parameter dari LLM divalidasi ulang oleh backend (tipe, rentang, nilai yang diizinkan) karena keluaran model tidak dipercaya. Tool tambahan hanya dibuat bila ada kebutuhan nyata.

### 12.4 Guardrail

- System prompt membatasi peran ke asisten toko Tokomu, Bahasa Indonesia, harga dalam rupiah, dan hanya produk dari hasil tool.
- Tool bersifat read-only; jumlah putaran tool call per permintaan dibatasi (angka ditetapkan saat implementasi).
- Pesan pengguna dan isi data produk diperlakukan sebagai data, bukan instruksi (mitigasi prompt injection).
- Pasca-jawaban, backend memeriksa bahwa setiap produk yang disebut ada di hasil tool; bila tidak, jawaban diganti pesan aman.
- Timeout pemanggilan provider, retry terbatas, dan rate limiting khusus endpoint AI di atas Throttler global.
- Logging latensi, nama tool, status, dan penggunaan token tanpa menyimpan data sensitif.
- Penyimpanan riwayat percakapan di database bersifat opsional dan mengikuti minimisasi data; keputusan ada di Open Decisions.

### 12.5 Evaluasi

Kualitas AI diukur dengan sekumpulan test case tetap yang dijalankan terhadap seed katalog yang sama. Target numerik ditetapkan setelah baseline pertama; tes dengan mock provider tidak dianggap bukti bahwa provider asli selalu berfungsi.

| Skenario | Yang diperiksa |
| --- | --- |
| Permintaan dengan batas budget | Semua produk yang direkomendasikan berada di bawah budget |
| Permintaan berdasarkan kategori atau kebutuhan | Tool dipanggil dengan kategori dan kata kunci yang relevan |
| Permintaan ambigu | AI meminta klarifikasi, bukan menebak |
| Katalog tanpa produk yang cocok | AI menyatakan tidak ada hasil, tanpa mengarang |
| Produk nonaktif atau stok habis | Tidak direkomendasikan sebagai tersedia |
| Timeout atau error provider | Pesan ramah, aplikasi tetap berfungsi |
| Format respons tidak sesuai | Ditangani tanpa crash |
| Upaya prompt injection | Instruksi dalam pesan atau data produk tidak mengubah perilaku |

Metrik awal: validitas produk, kepatuhan budget, keberhasilan tool call, latensi, dan tingkat kegagalan.

### 12.6 Biaya dan provider

Penyedia LLM dan batas biaya bulanan belum diputuskan. Penggunaan token dicatat sejak awal agar biaya per percakapan bisa dihitung dari data, bukan dugaan.

### 12.7 Otomasi (opsional, setelah Fase 5)

Ide otomasi yang selaras dengan arah "AI atau otomasi" dan belum menjadi komitmen:

- Peringatan stok rendah untuk admin.
- Draf deskripsi produk oleh AI yang wajib ditinjau dan disetujui admin sebelum disimpan.
- Ringkasan order harian untuk admin.

Aturan tetap sama: AI tidak mengubah data tanpa mekanisme otorisasi dan aturan bisnis yang eksplisit.

## 13. Strategi Testing dan Quality Gates

Testing ditulis bersama fitur, bukan sesudahnya, dan mengikuti piramida Maincore: unit dan regression (Jest), API E2E (Supertest), smoke test web (Playwright), dan performa (k6). Perintah dijalankan dari root repo sesuai `docs/testing-runbook.md`.

### 13.1 Lapisan pengujian

| Lapisan | Alat | Cakupan di Tokomu | Perintah |
| --- | --- | --- | --- |
| Unit dan regression | Jest (`apps/api`) | Hitung subtotal dan total, validasi kuantitas, aturan transisi status, validasi parameter tool AI, penanganan error service | `pnpm test:cov` |
| Integration dan API security | Jest + Supertest, Postgres lokal (Docker, port 5433) | Endpoint dengan validasi dan guard, checkout beserta perubahan stok, rollback transaksi, IDOR, AI service dengan mock provider | `pnpm test:e2e` |
| Smoke test web | Playwright (`apps/web/e2e/`) | Lihat katalog, cari dan filter, buka detail, alur checkout, admin kelola produk, tanya AI | `pnpm --filter web test:e2e` |
| Performa | k6 (`perf/k6/`) | Baseline katalog dan endpoint utama | `pnpm perf:smoke`, `pnpm perf:load` |

Catatan: tes yang menyentuh transaksi dan stok wajib memakai database Postgres sungguhan, bukan mock, karena yang diuji adalah perilaku transaksi. `test-safety.guard.ts` menghentikan tes bila `DATABASE_URL` mengarah ke host remote; guard ini tidak boleh dilewati.

Unit test untuk logika frontend Fase 1 (pencarian, filter, format harga, fallback gambar) membutuhkan test runner di `apps/web`. Dokumentasi Maincore hanya menyebut unit test untuk `apps/api` dan Playwright untuk web, sehingga ada atau tidaknya runner unit di web diperiksa pada Fase 0. Menambah Jest atau React Testing Library ke `apps/web` adalah perubahan konfigurasi dan perlu konfirmasi owner.

### 13.2 Skenario wajib per area

| Area | Skenario normal | Skenario negatif |
| --- | --- | --- |
| Katalog | Daftar, detail, pencarian, filter, paginasi | Tanpa hasil, slug tidak ada, produk nonaktif, `limit` melebihi 100, rentang harga terbalik |
| Auth | Registrasi, login, refresh, logout | Password salah, brute force (429 setelah 5 per menit), token kedaluwarsa, akses tanpa token (401) |
| Otorisasi | Admin mengelola produk | USER mengakses `/admin/*` (403), USER membuka order orang lain (403, IDOR) |
| Keranjang | Tambah, ubah, hapus, total benar | Kuantitas nol, negatif, desimal, produk nonaktif, stok kurang |
| Checkout | Order dibuat, stok berkurang, keranjang kosong | Stok habis di tengah proses, rollback penuh bila gagal, dua checkout bersamaan untuk stok terakhir, total dari klien diabaikan |
| Admin order | Transisi status sah | Transisi tidak sah (409), pembatalan mengembalikan stok |
| AI | Rekomendasi sesuai budget dari data nyata | Provider timeout, format salah, hasil kosong, prompt injection, rate limit |
| Input | DTO valid | Properti asing (400), payload berisi SQL injection tidak menembus |

### 13.3 Quality gates

Sebuah perubahan dianggap selesai bila semua gate berikut hijau. Gate ini sama dengan `ci.yml` pada setiap push dan PR ke `main`.

| Gate | Perintah | Bila gagal |
| --- | --- | --- |
| Instalasi | `pnpm install --frozen-lockfile` | Sinkronkan `pnpm-lock.yaml` dan commit |
| Prisma | `pnpm db:generate` | Perbaiki skema |
| Typecheck | `pnpm typecheck` | Perbaiki tipe; jangan `as any` sembarangan |
| Lint | `pnpm lint` | Perbaiki aturan; tanpa `--fix` di CI |
| Unit dan coverage | `pnpm test:cov` | Tambah test sebelum menaikkan threshold; minimal 70% |
| API E2E | `pnpm test:e2e` | Periksa Postgres lokal dan `[TestSafetyGuard]` |
| Build | `pnpm build` | Perbaiki build NestJS dan Next.js |
| Docker | Build `apps/api/Dockerfile` | Perbaiki Dockerfile |
| Keamanan | Gitleaks, `pnpm audit`, Trivy (fs dan image) lewat `security.yml` | Kredensial bocor: rotasi segera, lalu bersihkan history; CVE HIGH/CRITICAL: update dependensi atau base image |

Gate opsional seperti perf test skala stress, spike, atau soak tidak boleh memblokir PR; jalankan manual atau terjadwal. Bug kritis pada autentikasi, otorisasi, stok, dan checkout harus selesai sebelum deployment.

### 13.4 Performa

- Jalankan `pnpm perf:smoke` dan `pnpm perf:load` pada mesin dan database yang sama untuk baseline.
- Catat hasil sebagai tabel (p95, p99, error rate, tanggal, spesifikasi mesin) di `docs/perf-testing.md`; jangan menyajikannya sebagai angka produksi.
- Skenario agresif ditolak oleh `perf/k6/lib/safety.js` bila `BASE_URL` mengarah ke host produksi.
- Target latensi katalog ditetapkan setelah baseline ada, lalu dapat dijadikan job terjadwal `perf-regression.yml`.

### 13.5 Aturan klaim

Angka cakupan test, performa, dan kualitas AI di README dan materi interview hanya boleh berasal dari hasil pengujian aktual.

## 14. Roadmap dan Breakdown Pengerjaan

Pengerjaan dibagi tujuh fase; MVP storefront dirilis ke subdomain di akhir Fase 1, sebelum backend dibangun. Estimasi awal 11 minggu (rencana sebelumnya 9 minggu belum memuat storefront statis dan modul admin); angka ini bergeser mengikuti waktu belajar harian, yang belum ditentukan.

### 14.1 Roadmap

&#91;embedded content: roadmap Tokomu · 7 fase, 4 gate\]

Diamond menandai gate: fase berikutnya baru dimulai bila kriteria gate terpenuhi (lihat 14.2).

### 14.2 Breakdown per fase

| Fase | Fokus belajar | Deliverable | Gate dan validasi |
| --- | --- | --- | --- |
| 0. Setup dan pemahaman | Struktur monorepo, workflow template repo, environment, quality gate | Repo baru dari template Maincore, `.env`, `PRD.md`, breakdown tugas, open decisions Fase 0 tertutup | `pnpm dev` berjalan; `pnpm typecheck`, `lint`, `test:cov` hijau |
| 1. Storefront statis (MVP) | TypeScript (tipe, interface, fungsi), transformasi array dan objek, komponen React, state, routing, Tailwind sesuai `docs/ui.md` | Storefront dengan data contoh dan konfigurasi toko | **Gate MVP online:** acceptance criteria bagian 15 terpenuhi; test logika reusable lulus; tayang di tokomu.stackplustudio.com |
| 2. Katalog database dan API | HTTP dan status code, REST, controller, service, DTO, SQL, relasi, Prisma, migrasi, indeks | Model Category dan Product, seed, API katalog, storefront membaca dari API | Integration test katalog lulus; tidak ada `fetch()` langsung |
| 3. Commerce inti | Autentikasi dan otorisasi, state management, transaksi database, konsistensi stok | Login customer, keranjang, checkout simulasi, order, admin produk dan order | **Gate checkout teruji:** test transaksi, rollback, konkurensi stok, dan IDOR lulus; alur belanja lolos Playwright |
| 4. Testing dan hardening | Test negatif, keamanan API, baseline performa | Suite test lengkap, laporan baseline k6, security scan bersih | Coverage minimal 70%; tidak ada temuan HIGH/CRITICAL terbuka |
| 5. AI Shopping Assistant | LLM API, token usage, function calling, grounding, evaluasi | Assistant terhubung ke katalog, set evaluasi dan hasilnya | **Gate AI terevaluasi:** skenario evaluasi dijalankan dan hasilnya tercatat |
| 6. Produksi dan portofolio | Logging, konfigurasi environment, CI, deployment, dokumentasi | Aplikasi online penuh, README, diagram, demo, materi interview | **Gate siap interview:** pemilik menjelaskan seluruh alur tanpa catatan |

### 14.3 Siklus belajar untuk setiap fitur

1. **Understand:** pahami konsep dan alasan fitur dibutuhkan.
2. **Design:** rancang alur data dan tanggung jawab tiap bagian.
3. **Implement:** tulis kode bertahap, dibantu AI agent, tetapi dibaca dan dipahami.
4. **Test:** tulis Jest test termasuk skenario gagal.
5. **Explain:** jelaskan implementasi seolah sedang interview, lalu catat di dokumen keputusan.
6. **Review:** periksa pemahaman, kode, dan kekurangannya sebelum lanjut.

### 14.4 Rincian Fase 1 (MVP)

| Step | Pekerjaan | Bergantung pada | Validasi |
| --- | --- | --- | --- |
| 1.1 | Pelajari `apps/web`: komponen, route group, `tailwind.config.ts`, test runner yang ada | Fase 0 | Catatan temuan; keputusan lokasi kode |
| 1.2 | Definisikan tipe `Product`, `Category`, `StoreConfig`, lalu data contoh (sekitar 8 sampai 12 sepatu, sebagian tanpa gambar) | 1.1 | `pnpm typecheck` hijau |
| 1.3 | Layout statis: navbar, hero, footer, logo StackPlus dua varian | 1.1 | Tampil benar di mobile dan desktop |
| 1.4 | `ProductCard`, `ProductImage`, `ProductImageFallback`, `ProductGrid` | 1.2 | Kartu dengan dan tanpa foto sama tinggi; test fallback |
| 1.5 | Pencarian, filter kategori, dan (Should) harga dan urutan sebagai fungsi murni | 1.2 | Unit test: ada hasil, tanpa hasil, kombinasi |
| 1.6 | Halaman detail dan not-found | 1.2, 1.4 | Slug valid dan tidak valid diuji |
| 1.7 | State loading, empty, error; polesan responsif | 1.4 sampai 1.6 | Tanpa horizontal overflow di 360 sampai 1440 px |
| 1.8 | Test, dokumentasi, deploy ke subdomain | Semua di atas | Quality gate hijau; situs terbuka di domain |

## 15. Acceptance Criteria, Definition of Done, Risiko, dan Open Decisions

MVP dianggap selesai bila sepuluh kriteria di 15.1 terpenuhi; fitur apa pun dianggap selesai bila memenuhi Definition of Done di 15.2.

### 15.1 Acceptance criteria MVP (Fase 1)

- [ ] Homepage tampil benar pada desktop dan mobile.
- [ ] Kartu produk menampilkan informasi produk dan gambar fallback bila foto tidak ada.
- [ ] Pencarian mengembalikan produk yang cocok dan menangani tanpa hasil.
- [ ] Filter kategori bekerja dan dapat digabung dengan pencarian.
- [ ] Memilih produk membuka halaman detail yang benar; slug tidak dikenal menampilkan not-found.
- [ ] Konten toko dapat diganti tanpa menulis ulang komponen UI.
- [ ] Logo StackPlus memakai versi yang tepat untuk latarnya.
- [ ] Tidak ada horizontal overflow atau navigasi rusak pada 360 sampai 1440 px.
- [ ] Logika reusable (pencarian, filter, format harga, fallback) punya automated test.
- [ ] Cara setup dan menjalankan proyek terdokumentasi, dan situs tayang di tokomu.stackplustudio.com.

### 15.2 Definition of Done (semua fitur)

- [ ] Requirement fungsional terimplementasi dan input serta aturan bisnis divalidasi.
- [ ] Error handling tersedia dan memakai status HTTP yang tepat.
- [ ] Unit test dan integration test relevan dibuat, termasuk skenario gagal.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test:cov`, `pnpm test:e2e`, dan `pnpm build` hijau.
- [ ] Pemeriksaan UI sesuai checklist `docs/ui.md` bagian 15.
- [ ] Dokumentasi diperbarui dan tidak ada rahasia yang masuk repo.
- [ ] Pemilik dapat menjelaskan desain, implementasi, dan trade-off fitur tersebut.
- [ ] Untuk fitur AI: evaluasi output dan skenario kegagalan provider tercakup.

### 15.3 Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Scope melebar ke marketplace, pembayaran, atau fitur AI lanjutan | Proyek tidak selesai | Fase dan gate; non-tujuan di bagian 2; fitur lanjutan hanya setelah MVP stabil |
| Kode dari AI agent diterima tanpa dipahami | Gagal menjelaskan saat interview, tujuan utama gagal | Siklus Explain dan Review wajib; setiap fitur punya catatan penjelasan |
| Stok menjadi negatif akibat checkout bersamaan | Data tidak konsisten | Transaksi dengan update stok kondisional; test konkurensi |
| AI menyebut produk atau harga yang tidak ada | Kepercayaan hilang | Tool grounding, pemeriksaan pasca-jawaban, set evaluasi |
| Biaya LLM tak terkendali | Biaya tak terduga | Batas biaya bulanan, rate limit khusus AI, pencatatan token |
| Kebocoran API key atau rahasia | Insiden keamanan | Environment variable, `getOrThrow()`, Gitleaks, rotasi bila bocor |
| Konflik antara tema per toko dan `docs/ui.md` | Tampilan tidak konsisten | Hanya token yang ada; perluasan token menunggu konfirmasi owner |
| Mengubah konfigurasi dasar Maincore tanpa sengaja (misalnya menambah test runner di web) | Fondasi tidak stabil | Konfirmasi owner sebelum perubahan; aturan `docs/handover.md` |
| Waktu belajar harian tidak pasti | Jadwal bergeser | MVP lebih dulu; estimasi dalam minggu relatif dan ditinjau tiap gate |
| Klaim portofolio melebihi bukti | Merusak kredibilitas saat interview | Klaim hanya dari hasil pengujian aktual |

### 15.4 Asumsi

- Maincore dipakai sesuai versi pada `docs/architecture.md` (Next.js 16, NestJS 11, Prisma 5.22, Tailwind v3).
- Satu mata uang (IDR) dan satu bahasa (Indonesia).
- Checkout selalu simulasi; tidak ada pembayaran sungguhan.
- Role yang dipakai hanya `USER` dan `ADMIN`.
- Data produk awal adalah data contoh; foto produk boleh belum tersedia.
- Pengerjaan dibantu AI agent yang mengikuti `docs/handover.md`.

### 15.5 Open decisions

| # | Keputusan | Usulan | Dibutuhkan sebelum |
| --- | --- | --- | --- |
| 1 | Tokomu di monorepo core atau repo terpisah | Repo baru dari template Maincore (`docs/newproject.md` Opsi A) | Fase 0 |
| 2 | Waktu belajar harian | Belum ditentukan; menentukan jadwal | Fase 0 |
| 3 | Lokasi dan format aset logo StackPlus (putih dan biru) | Cari di repo; bila belum ada, minta dari owner | Step 1.3 |
| 4 | Lokasi store config dan route group publik | Diputuskan setelah memeriksa `apps/web` | Fase 0 |
| 5 | Test runner unit untuk `apps/web` | Periksa yang ada; bila tidak ada, ajukan Jest atau React Testing Library ke owner | Fase 0 |
| 6 | Desain akhir homepage dan placeholder sepatu | Mengikuti pola `docs/ui.md`; placeholder ilustrasi netral | Fase 1 |
| 7 | Sumber data Fase 1 | Data contoh lokal di balik `ProductRepository` | Fase 1 |
| 8 | Hosting dan DNS subdomain | Vercel untuk web; konfigurasi DNS `tokomu.stackplustudio.com` | Akhir Fase 1 |
| 9 | Skema final, nama status order, data pengiriman, aturan pengembalian stok | Seperti bagian 9 dan 6.5 | Fase 3 |
| 10 | Persistensi keranjang dan keranjang tamu | Keranjang di database untuk user login; tanpa keranjang tamu | Fase 3 |
| 11 | Penyedia LLM, model, dan batas biaya | Model yang mendukung function calling dengan biaya rendah | Fase 5 |
| 12 | Akses `/ai/chat`: wajib login atau publik dengan limit ketat | Wajib login atau limit sangat ketat agar biaya terkendali | Fase 5 |
| 13 | Riwayat percakapan AI disimpan atau tidak | Tidak disimpan pada MVP AI; riwayat singkat dikirim klien dan divalidasi | Fase 5 |
| 14 | Hosting API dan database produksi | Docker di VPS atau PaaS; Supabase atau Neon | Fase 6 |
| 15 | Target performa dan coverage terukur (naik ke 80%?) | Ditetapkan setelah baseline | Fase 4 |
| 16 | Perlukah semantic search atau RAG | Evaluasi setelah Fase 5 | Setelah Fase 5 |
| 17 | Perluasan token tema per toko | Setelah MVP dan persetujuan owner | Setelah MVP |

## 16. Panduan AI Agent dan Kit Portofolio

Dokumen ini ditulis agar bisa disimpan sebagai `PRD.md` di root repo dan dibaca AI agent sebagai langkah pertama protokol `docs/handover.md`; bagian ini menjelaskan cara memakainya dan apa yang harus dihasilkan agar proyek siap dibawa ke interview.

### 16.1 Cara memakai PRD ini dengan AI agent

Protokol Maincore mengharuskan agent membaca tiga hal sebelum menulis kode: `PRD.md` (apa yang dibangun), `docs/ui.md` (tampilan), dan `docs/architecture.md` beserta `README.md` (teknis).

Aturan tambahan untuk Tokomu:

- Jangan coding sebelum breakdown dari PRD ini disetujui pemilik.
- Kerjakan satu fase sekaligus, mulai Fase 0 dan 1; jangan melompat ke fase berikutnya.
- Jangan menambah requirement yang tidak ada di PRD; bila ada ambiguitas bisnis atau akses, tanyakan.
- Periksa kode aktual sebelum mengubah file yang sudah ada; jangan menimpa logika atau validasi yang sudah teruji.
- Gunakan SOP `docs/newproject.md` untuk skema Prisma, modul NestJS (`npx @nestjs/cli g resource`), dan route group frontend.
- Jangan mengubah arsitektur, stack, atau konfigurasi dasar tanpa konfirmasi owner.
- Akhiri setiap fitur dengan ringkasan penjelasan interview: apa yang dibangun, kenapa begitu, dan trade-off-nya (3 sampai 5 kalimat).
- Pastikan `pnpm typecheck`, `pnpm lint`, dan `pnpm test:cov` hijau sebelum menyatakan pekerjaan selesai.

Prompt awal yang bisa dipakai:

```text
Baca PRD.md, docs/ui.md, docs/architecture.md, dan README.md secara menyeluruh.
Jangan melakukan coding. Buat breakdown Fase 0 dan Fase 1 berisi phase, stage,
step, dependency, dan validation, hanya berdasarkan isi PRD.md. Periksa juga
struktur apps/web yang ada, lalu daftar pertanyaan yang perlu saya putuskan
sebelum implementasi (lihat Open Decisions bagian 15.5). Tunggu persetujuan
saya sebelum menulis kode.
```

### 16.2 Kit portofolio

| Deliverable | Isi | Fase |
| --- | --- | --- |
| `README.md` | Tujuan, fitur, tech stack, arsitektur, cara setup dan menjalankan test, screenshot, tautan demo | 1, dimutakhirkan tiap fase |
| Catatan keputusan teknis | Satu catatan per keputusan penting (konteks, keputusan, alternatif, trade-off): transaksi stok, harga integer, grounding AI, store config | Tiap fase |
| Diagram | Arsitektur (bagian 8) dan alur AI (bagian 12) dalam format yang tampil di GitHub | 2 dan 5 |
| Bukti pengujian | Coverage, hasil quality gate, baseline k6 beserta spesifikasi mesin, hasil evaluasi AI | 4 dan 5 |
| Skrip demo | Alur 3 sampai 5 menit: katalog, cari, keranjang, checkout, order, tanya AI, panel admin | 6 |
| Catatan interview | Jawaban singkat untuk pertanyaan di 16.3, ditulis dengan kata sendiri | Tiap fase |

### 16.3 Pertanyaan yang harus bisa dijawab pemilik

| Topik | Pertanyaan | Bukti di proyek |
| --- | --- | --- |
| Arsitektur | Mengapa monorepo? Bagaimana request mengalir dari browser sampai database? | Bagian 8, struktur repo |
| Database | Mengapa checkout memakai transaksi? Bagaimana mencegah stok negatif? Mengapa harga integer dan snapshot di `OrderItem`? | Bagian 9, test konkurensi |
| Keamanan | Bagaimana IDOR dan mass assignment dicegah? Mengapa refresh token di cookie HttpOnly? Untuk apa rate limiting? | NFR-01 sampai NFR-05, test negatif |
| Testing | Apa beda unit dan integration test? Mengapa test transaksi memakai Postgres asli? Untuk apa `test-safety.guard`? | Bagian 13 |
| AI | Apa itu function calling? Bagaimana mencegah AI mengarang produk? Apa yang terjadi bila provider mati? Mengapa belum memakai RAG? | Bagian 12, set evaluasi |
| Frontend | Bagaimana store config membuat blueprint reusable? Mengapa ada fallback gambar? | Bagian 5, FR-03, FR-09 |
| Proses | Bagian mana yang dibantu AI agent dan bagaimana kamu memverifikasinya? | Catatan keputusan, riwayat commit dan review |

### 16.4 Draf cerita proyek (finalkan setelah fitur selesai)

"Tokomu adalah toko online single-vendor yang saya bangun di atas Maincore, boilerplate monorepo milik Stack Plus Studio. Harga, stok, dan order dikendalikan sepenuhnya oleh backend dan database transaksional, dan AI Shopping Assistant hanya mengambil produk lewat tool backend sehingga tidak mengarang data. Setiap fitur punya test, dan angka di README berasal dari hasil pengujian."

Kalimat tentang AI, transaksi, dan test baru boleh dipakai setelah fase terkait selesai dan terbukti.

### 16.5 Dokumen acuan

PRD ini disusun dari dokumen Maincore yang diberikan pemilik: `docs/architecture.md`, `docs/ui.md`, `docs/newproject.md`, `docs/handover.md`, `docs/testing-runbook.md`, `docs/ci-cd.md`, `docs/security-scanning.md`, dan `docs/perf-testing.md`, serta draf PRD dan spesifikasi Tokomu dari percakapan sebelumnya. File `docs/architectur.md` (ejaan salah) ada di folder `docs/` tetapi isinya belum dibaca; periksa apakah duplikat atau versi lama.
