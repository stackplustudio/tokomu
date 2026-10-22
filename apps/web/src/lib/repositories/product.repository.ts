/**
 * ProductRepository — abstraksi akses data produk.
 *
 * Fase 1: implementasi statis (data lokal).
 * Fase 2: ganti implementasi ini ke API call via @/lib/axios.
 * Komponen UI tidak perlu diubah karena hanya memanggil interface ini.
 *
 * PRD §8.3 (FR-12): mengganti data contoh ke API di Fase 2 tidak mengubah komponen UI.
 */

import { Product, ProductCategory, ProductFilters, PaginatedProducts } from "@/types/product";
import { products, categories } from "@/lib/data/products";

// ─── Helper ────────────────────────────────────────────────────────────────

function applyFilters(items: Product[], filters: ProductFilters): Product[] {
  let result = items.filter((p) => p.isActive);

  // Pencarian case-insensitive (FR-04)
  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.trim().toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  // Filter kategori by slug (FR-05)
  if (filters.category) {
    result = result.filter((p) => p.category.slug === filters.category);
  }

  // Rentang harga (FR-06)
  if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
    result = result.filter((p) => p.priceIdr >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
    result = result.filter((p) => p.priceIdr <= filters.maxPrice!);
  }

  // Pengurutan (FR-06)
  if (filters.sort === "price_asc") {
    result = [...result].sort((a, b) => a.priceIdr - b.priceIdr);
  } else if (filters.sort === "price_desc") {
    result = [...result].sort((a, b) => b.priceIdr - a.priceIdr);
  } else {
    // Default: terbaru (newest — berdasarkan createdAt desc)
    result = [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return result;
}

// ─── Repository ────────────────────────────────────────────────────────────

export const ProductRepository = {
  /**
   * Ambil produk dengan filter, pencarian, dan paginasi.
   * Default: 20 item per halaman, maks 100 (PRD §10.2).
   */
  findAll(filters: ProductFilters = {}): PaginatedProducts {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));

    const filtered = applyFilters(products, filters);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, meta: { total, page, limit, totalPages } };
  },

  /** Ambil detail produk berdasarkan slug. Null jika tidak ada atau tidak aktif. */
  findBySlug(slug: string): Product | null {
    return products.find((p) => p.slug === slug && p.isActive) ?? null;
  },

  /** Ambil produk unggulan untuk homepage. */
  findFeatured(limit = 4): Product[] {
    return products.filter((p) => p.isFeatured && p.isActive).slice(0, limit);
  },

  /** Ambil semua kategori beserta jumlah produk aktif (FR-23). */
  findCategories(): (ProductCategory & { productCount: number })[] {
    return categories.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.categoryId === cat.id && p.isActive).length,
    }));
  },
};

