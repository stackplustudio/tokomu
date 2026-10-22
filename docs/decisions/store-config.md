# 📐 Catatan Keputusan Teknis: Store Config & Product Repository Abstraction

- **Status:** Diterima & Diimplementasikan (Fase 1)
- **Tanggal:** 22 Oktober 2026
- **Pengambil Keputusan:** AI Engineer & Tech Lead (@Budi Cahono)
- **Referensi PRD:** PRD Tokomu §5 (FR-09, FR-12)

---

## 1. Konteks

Tokomu dirancang bukan hanya sebagai toko sepatu biasa, melainkan **blueprint toko online single-vendor yang reusable** untuk portofolio Stack Plus Studio. Klien atau developer harus bisa mengganti identitas toko (misal dari toko sepatu ke toko busana, batik, atau buku) tanpa perlu merombak komponen UI atau routing Next.js.

Selain itu, pada **Fase 1 (Static Storefront)**, data katalog bersumber dari data statis bertipe di frontend. Pada **Fase 2 (Database & REST API)**, data akan diambil dari NestJS backend via Axios. Perpindahan ini tidak boleh merusak atau mengubah komponen antarmuka yang sudah ada.

---

## 2. Keputusan yang Diambil

1. **Sentralisasi Konfigurasi Toko (`apps/web/src/config/store.ts`):**
   - Seluruh konten khusus toko (nama brand, tagline, 4 kategori, hero copy, kontak, tautan footer, dan path aset logo/placeholder) diekstraksi ke file bertipe `StoreConfig`.
   - Komponen UI (`StoreNavbar`, `StoreFooter`, `page.tsx`, dll.) **dilarang memuat teks brand hard-coded**. Semua teks dibaca dari `storeConfig`.

2. **Lapisan Abstraksi Data (`ProductRepository`):**
   - Akses produk dienkapsulasi dalam objek `ProductRepository` di `apps/web/src/lib/repositories/product.repository.ts`.
   - Menyediakan interface: `findAll(filters)`, `findBySlug(slug)`, `findFeatured(limit)`, dan `findCategories()`.
   - Di Fase 1, repository mengeksekusi filter di memori terhadap `products.ts`.
   - Di Fase 2, fungsi dalam repository cukup diarahkan untuk memanggil endpoint `GET /products` dan `GET /products/:slug` via `@/lib/axios`. Komponen UI tetap memanggil `ProductRepository.findAll()` tanpa perubahan kode satu baris pun.

3. **Fallback Gambar Otomatis (`ProductImage` + `ProductImageFallback`):**
   - Menjamin rasio gambar kartu produk tetap 4:3 (`aspect-[4/3]`) terlepas dari ada atau tidaknya gambar produk di URL, mencegah terjadinya layout shift (CLS).

---

## 3. Alternatif yang Dipertimbangkan

- **Alternatif A:** Mengambil data produk langsung dengan import `products` di setiap halaman/komponen.
  - *Alasan ditolak:* Menimbulkan *tight coupling*. Saat beralih ke REST API di Fase 2, puluhan file komponen harus dirombak ulang.
- **Alternatif B:** Menyimpan konfigurasi toko di database sejak Fase 1.
  - *Alasan ditolak:* Menambah dependensi backend sebelum storefront statis divalidasi. Menyalahi prinsip MVP bertahap.

---

## 4. Trade-off & Konsekuensi

- **Keuntungan:**
  - Kode sangat modular dan teruji.
  - Ganti toko sepatu ke toko lain hanya butuh ubah satu file config dan data seed.
  - Sesuai prinsip *Single Responsibility* dan *Separation of Concerns*.
- **Konsekuensi / Beban:**
  - Menambah satu lapisan file (`ProductRepository`), namun overhead-nya sangat kecil dibandingkan manfaat fleksibilitasnya.

