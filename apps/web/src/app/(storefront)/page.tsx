import Link from "next/link";
import { ProductRepository } from "@/lib/repositories/product.repository";
import ProductCard from "@/components/ui/ProductCard";
import storeConfig from "@/config/store";

export const metadata = {
  title: "Beranda — Koleksi Sepatu Pilihan",
  description: storeConfig.description,
};

export default function StorefrontHomePage() {
  const featuredProducts = ProductRepository.findFeatured(4);
  const categories = ProductRepository.findCategories();

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* ─── 1. HERO SECTION (ui.md §8.6) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 lg:pt-8 lg:pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Kolom Kiri: Teks & Satu CTA Utama */}
          <div className="max-w-xl">
            {/* Status Dot (ui.md §8.3) */}
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE5D9] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0053F1] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Koleksi Eksklusif 2026
              </span>
            </div>

            {/* Heading Dua Warna (ui.md §4) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              {storeConfig.hero.title} <br className="hidden sm:inline" />
              <span className="text-[#0053F1]">{storeConfig.hero.highlight}</span>
            </h1>

            {/* Paragraf Pendukung */}
            <p className="text-base text-gray-500 leading-relaxed mb-10">
              {storeConfig.hero.subtitle}
            </p>

            {/* SATU Tombol CTA Utama (ui.md §8.1) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={storeConfig.hero.ctaHref}
                className="bg-[#0053F1] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#003CB3] transition-all text-center shadow-lg shadow-[#0053F1]/20 hover:shadow-none"
              >
                {storeConfig.hero.ctaLabel} →
              </Link>
              <Link
                href="/products?category=running-shoes"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border border-[#EAE5D9] px-6 py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#F6F3EC] transition-all"
              >
                Sepatu Lari
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Visual Hero Showcase */}
          <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] flex items-center justify-center">
            {/* Glow Blur Latar (ui.md §8.6) */}
            <div className="absolute inset-0 bg-[#F6F3EC] rounded-full opacity-60 blur-3xl" />
            <div className="absolute w-72 h-72 bg-[#0053F1] opacity-10 rounded-full blur-3xl animate-pulse" />

            {/* Floating Showcase Cards */}
            <div className="relative z-10 w-full max-w-md space-y-4">
              {featuredProducts.slice(0, 2).map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-white border border-[#EAE5D9] rounded-2xl p-4 shadow-xl shadow-gray-200/50 flex items-center gap-4 transition-transform hover:-translate-y-1 ${
                    idx === 1 ? "sm:translate-x-8" : ""
                  }`}
                >
                  <div className="w-20 h-20 bg-[#F6F3EC] rounded-xl flex items-center justify-center text-[#0053F1] font-bold text-xs shrink-0">
                    {item.category.name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#0053F1]">
                      {item.badge || "Pilihan Teratas"}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      Rp {item.priceIdr.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="p-2 text-gray-400 hover:text-[#0053F1] transition-colors"
                    aria-label={`Buka ${item.name}`}
                  >
                    →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. KATEGORI PILIHAN (ui.md §8.5 Card standar) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
            › KATEGORI PRODUK ‹
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Jelajahi Berdasarkan <span className="text-[#0053F1]">Kebutuhanmu</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="card-hover bg-[#FDFBF7] border border-[#EAE5D9] rounded-2xl p-6 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0053F1]/10 text-[#0053F1] flex items-center justify-center mb-4 group-hover:bg-[#0053F1] group-hover:text-white transition-colors duration-200">
                <span className="font-bold text-lg">✦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#0053F1] transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {cat.description}
              </p>
              <span className="text-xs font-semibold text-[#0053F1] inline-flex items-center gap-1">
                {cat.productCount} Produk Tersedia →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. PRODUK UNGGULAN (Featured Products Grid) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              › PILIHAN EDITOR ‹
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Koleksi Sepatu <span className="text-[#0053F1]">Terlaris</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#0053F1] hover:underline whitespace-nowrap"
          >
            Lihat Semua Produk ({ProductRepository.findAll().meta.total}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── 4. MENGAPA TOKOMU (Bento Information - ui.md §8.5) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFBF7] border border-[#EAE5D9] rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              {storeConfig.whyUs.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {storeConfig.whyUs.title} <span className="text-[#0053F1]">{storeConfig.whyUs.highlight}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeConfig.whyUs.items.map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0053F1]/10 text-[#0053F1] flex items-center justify-center font-bold text-base">
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. CTA BLOCK (ui.md §8.8) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#0053F1] rounded-3xl p-8 sm:p-14 text-white shadow-xl shadow-[#0053F1]/20">
          {/* Watermark STACKPLUS raksasa samar di latar (ui.md §8.8) */}
          <span
            className="absolute -right-8 -bottom-10 text-8xl sm:text-9xl font-black text-white/5 select-none pointer-events-none tracking-tighter"
            aria-hidden="true"
          >
            STACKPLUS
          </span>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Siap Melangkah Lebih Jauh?
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Temukan Sepatu Impianmu Hari Ini.
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Ribuan pelanggan telah membuktikan kenyamanan dan kualitas sepatu Tokomu.
              Garansi penukaran ukuran 7 hari tanpa repot.
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-block bg-white text-[#0053F1] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#F6F3EC] transition-all shadow-md"
              >
                Mulai Belanja Sekarang →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

