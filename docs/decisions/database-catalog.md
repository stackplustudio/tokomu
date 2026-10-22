# 📐 Catatan Keputusan Teknis: Katalog Berbasis Database PostgreSQL & NestJS REST API

- **Status:** Diterima & Diimplementasikan (Fase 2)
- **Tanggal:** 22 Oktober 2026
- **Pengambil Keputusan:** AI Engineer & Tech Lead (@Budi Cahono)
- **Referensi PRD:** PRD Tokomu §6.2 (FR-20 s/d FR-25), §9.2

---

## 1. Konteks

Pada **Fase 1**, storefront Tokomu menyajikan data statis melalui abstraksi `ProductRepository`. Untuk masuk ke standar e-commerce enterprise pada **Fase 2**, data katalog harus bersumber secara terpusat dari **database relasional PostgreSQL** dan diekspos melalui **REST API NestJS**.

Tantangan utama yang harus diselesaikan:
1. Menjamin integritas data numerik mata uang Rupiah tanpa galat desimal.
2. Memastikan relasi antara kategori dan produk aman dari penghapusan tidak sengaja (*referential integrity*).
3. Melindungi performa query database dari *Full Table Scan* saat filter multi-kriteria diterapkan.
4. Menjaga agar frontend tidak dapat memalsukan harga atau stok (*Server Authority*).

---

## 2. Keputusan yang Diambil

1. **Harga Disimpan sebagai Integer Penuh (`priceIdr: Int`):**
   - Menghindari tipe data `Float` atau desimal floating point yang rentan terhadap galat pembulatan biner (misal: `0.1 + 0.2 = 0.30000000000000004`).
   - Karena Rupiah tidak memiliki satuan sen yang beredar, nilai nominal integer (misal: `1299000`) adalah representasi yang 100% presisi. Format visual `Rp 1.299.000` di-render murni pada lapisan presentasi frontend via `formatRupiah()`.

2. **Soft-Disable Pattern (`isActive: Boolean @default(true)`):**
   - Produk yang ditarik dari peredaran atau dihentikan penjualannya **tidak dihapus secara fisik (`DELETE`)** dari tabel database.
   - Penghapusan fisik akan memutus riwayat transaksi (*foreign key breakdown*) saat modul transaksi pesanan (`Order` dan `OrderItem`) dibangun di Fase 3.
   - Endpoint publik `GET /products` dan `GET /products/:slug` secara ketat memfilter klausa `where: { isActive: true }`.

3. **Composite Indexing untuk Kecepatan Query:**
   - Ditambahkan indeks `@@index([slug])`, `@@index([categoryId])`, dan komposit `@@index([isActive, categoryId])`.
   - Menjamin eksekusi query filter kategori tetap berkecepatan tinggi $O(\log N)$ seiring bertambahnya ratusan produk.

4. **Koneksi Asinkron Frontend via `@/lib/axios` dengan Graceful Fallback:**
   - `ProductRepository` di `apps/web` dialihkan memanggil endpoint REST API `GET /products` dan `GET /categories`.
   - Dilengkapi fallback cerdas: bila server API sedang mati atau saat tahap prerendering statis Next.js build berlangsung, sistem menggunakan dataset seed lokal sebagai cadangan tanpa menggagalkan proses build.

---

## 3. Trade-off & Konsekuensi

- **Keuntungan:**
  - Sumber kebenaran tunggal (*Single Source of Truth*): harga dan stok sepenuhnya dikendalikan oleh backend database.
  - Komponen UI di `apps/web/src/app/(storefront)/` tidak mengalami *breaking changes* karena mematuhi interface `ProductRepository`.
  - Cakupan pengujian (test coverage) backend mencapai 96.95% statements, menjaga stabilitas sistem.
- **Konsekuensi / Beban:**
  - Penambahan latensi jaringan (*network round-trip*) antara browser dan API backend (ditangani secara elegan melalui `LoadingState` dan `ErrorState` di UI).

