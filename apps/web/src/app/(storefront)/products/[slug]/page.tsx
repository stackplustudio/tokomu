import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await ProductRepository.findBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: `${product.name} — ${formatRupiah(product.priceIdr)}`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await ProductRepository.findBySlug(slug);

  // FR-07: slug tidak dikenal atau produk tidak aktif menampilkan 404
  if (!product || !product.isActive) {
    notFound();
  }

  const { name, priceIdr, description, category, stock, attributes, badge, imageUrls } = product;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs Navigasi */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#0053F1]">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#0053F1]">
          Katalog
        </Link>
        <span>/</span>
        <Link href={`/products?category=${category.slug}`} className="hover:text-[#0053F1]">
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[200px]">
          {name}
        </span>
      </nav>

      {/* Grid Detail Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Kolom Kiri: Galeri Foto dengan Rasio Tetap (FR-03) */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#EAE5D9] overflow-hidden bg-white shadow-xs">
            <ProductImage
              src={imageUrls[0]}
              alt={name}
              priority
              className="aspect-square sm:aspect-[4/3]"
            />
          </div>
          {badge && (
            <div className="inline-block px-3 py-1 bg-[#0053F1] text-white text-xs font-bold uppercase tracking-wider rounded-full">
              {badge}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Informasi & Aksi */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#0053F1]">
              {category.name}
            </span>
            {/* Heading Dua Warna (ui.md §4) */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-1">
              {name}
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4">
              {formatRupiah(priceIdr)}
            </p>
          </div>

          {/* Status Ketersediaan Stok */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Stok Tersedia ({stock} pasang)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Stok Habis
              </span>
            )}
          </div>

          {/* Deskripsi Produk */}
          <div className="border-t border-b border-[#EAE5D9] py-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Deskripsi Produk
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Spesifikasi / Atribut Tambahan (FR-07) */}
          {attributes && Object.keys(attributes).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Spesifikasi
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(attributes).map(([key, val]) => (
                  <div key={key} className="bg-white border border-[#EAE5D9] p-3 rounded-xl">
                    <dt className="text-gray-400 capitalize">{key}</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5">
                      {Array.isArray(val) ? val.join(", ") : String(val)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* CTA Utama — Satu Tombol Utama per Viewport (ui.md §8.1) */}
          <div className="pt-4 space-y-3">
            <button
              type="button"
              disabled
              className="w-full bg-[#0053F1] text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider opacity-90 cursor-not-allowed shadow-md flex items-center justify-center gap-2"
              title="Keranjang & Checkout aktif di Fase 3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Tambah ke Keranjang (Fase 3: Segera Hadir)
            </button>
            <p className="text-center text-xs text-gray-400">
              ⚡ Simulasi transaksi & checkout akan diaktifkan penuh pada Fase 3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

