/**
 * ProductCard — kartu produk reusable (ui.md §8.5 Portfolio card, FR-02).
 * - Area gambar rasio tetap 4:3 dengan fallback otomatis (FR-03)
 * - Tag kategori, nama, harga Rp, badge opsional
 * - card-hover untuk efek interaktif (ui.md §7)
 */

import Link from "next/link";
import { cn, formatRupiah } from "@/lib/utils";
import ProductImage from "./ProductImage";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  priority?: boolean;
  className?: string;
};

export default function ProductCard({ product, priority = false, className }: Props) {
  const { slug, name, priceIdr, category, badge, imageUrls, stock } = product;
  const mainImage = imageUrls[0];

  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        "group block bg-white border border-[#EAE5D9] rounded-2xl overflow-hidden card-hover",
        // Produk stok habis — opacity sedikit berkurang tapi tetap bisa diklik
        stock === 0 && "opacity-75",
        className
      )}
      aria-label={`Lihat detail ${name}`}
    >
      {/* Area gambar */}
      <div className="relative">
        <ProductImage
          src={mainImage}
          alt={name}
          priority={priority}
        />

        {/* Badge: New / Featured */}
        {badge && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#0053F1] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {badge}
          </span>
        )}

        {/* Badge stok habis */}
        {stock === 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-gray-800 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
            Habis
          </span>
        )}
      </div>

      {/* Info produk */}
      <div className="p-4">
        {/* Tag kategori (ui.md §8.5) */}
        <span className="text-[10px] uppercase font-semibold tracking-wider text-[#0053F1]">
          {category.name}
        </span>

        {/* Nama produk */}
        <h3 className="mt-1 text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0053F1] transition-colors duration-200">
          {name}
        </h3>

        {/* Harga */}
        <p className="mt-2 text-sm font-bold text-gray-900">
          {formatRupiah(priceIdr)}
        </p>

        {/* Link aksi */}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0053F1]">
          Lihat Detail
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

