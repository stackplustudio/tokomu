/**
 * Tipe domain Tokomu — Fase 1 (Static Storefront)
 * Tipe ini akan tetap sama ketika data beralih dari statis ke API di Fase 2.
 */

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Harga dalam satuan rupiah penuh (integer). Format Rp di frontend saja. */
  priceIdr: number;
  stock: number;
  sku?: string;
  /** Array URL gambar. Kosong = gunakan placeholder. */
  imageUrls: string[];
  /** Badge opsional: 'New' | 'Featured' | string */
  badge?: string;
  isFeatured: boolean;
  isActive: boolean;
  /** Atribut tambahan bebas: merek, bahan, warna, ukuran tersedia, waterproof, dll. */
  attributes?: Record<string, string | string[] | number | boolean>;
  categoryId: string;
  category: ProductCategory;
  createdAt: string; // ISO string
};

export type PaginatedProducts = {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ProductFilters = {
  search?: string;
  category?: string; // slug kategori
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
};

