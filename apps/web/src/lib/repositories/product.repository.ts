/**
 * ProductRepository — abstraksi akses data produk (FR-12 & FR-24).
 *
 * Fase 2: Implementasi memanggil REST API backend NestJS via @/lib/axios.
 * Dilengkapi graceful fallback ke data seed jika API belum menyala saat build.
 */

import axios from "axios";
import { api } from "@/lib/axios";
import { Product, ProductCategory, ProductFilters, PaginatedProducts } from "@/types/product";
import { products, categories } from "@/lib/data/products";

// ─── Local Fallback Helper (untuk offline / SSR build time) ──────────────────

function applyLocalFilters(items: Product[], filters: ProductFilters): Product[] {
  let result = items.filter((p) => p.isActive);

  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.trim().toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (filters.category) {
    result = result.filter((p) => p.category.slug === filters.category);
  }

  if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
    result = result.filter((p) => p.priceIdr >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
    result = result.filter((p) => p.priceIdr <= filters.maxPrice!);
  }

  if (filters.sort === "price_asc") {
    result = [...result].sort((a, b) => a.priceIdr - b.priceIdr);
  } else if (filters.sort === "price_desc") {
    result = [...result].sort((a, b) => b.priceIdr - a.priceIdr);
  } else {
    result = [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return result;
}

function fallbackFindAll(filters: ProductFilters = {}): PaginatedProducts {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));

  const filtered = applyLocalFilters(products, filters);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { total, page, limit, totalPages } };
}

// ─── REST API Repository ───────────────────────────────────────────────────

export const ProductRepository = {
  /**
   * Mengambil produk dari backend API GET /products (FR-21 & FR-24).
   */
  async findAll(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    try {
      const response = await api.get<PaginatedProducts>("/products", {
        params: {
          search: filters.search || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
          page: filters.page,
          limit: filters.limit,
        },
      });
      return response.data;
    } catch {
      // Graceful fallback ke local dataset bila API server belum running saat SSG
      return fallbackFindAll(filters);
    }
  },

  /**
   * Mengambil detail produk aktif berdasarkan slug via GET /products/:slug (FR-22).
   */
  async findBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await api.get<Product>(`/products/${slug}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      return products.find((p) => p.slug === slug && p.isActive) ?? null;
    }
  },

  /**
   * Mengambil produk unggulan untuk homepage.
   */
  async findFeatured(limit = 4): Promise<Product[]> {
    try {
      const response = await api.get<PaginatedProducts>("/products", {
        params: { limit: 100 },
      });
      return response.data.data.filter((p) => p.isFeatured).slice(0, limit);
    } catch {
      return products.filter((p) => p.isFeatured && p.isActive).slice(0, limit);
    }
  },

  /**
   * Mengambil daftar kategori beserta hitungan produk aktif via GET /categories (FR-23).
   */
  async findCategories(): Promise<(ProductCategory & { productCount: number })[]> {
    try {
      const response = await api.get<(ProductCategory & { productCount: number })[]>("/categories");
      return response.data;
    } catch {
      return categories.map((cat) => ({
        ...cat,
        productCount: products.filter((p) => p.categoryId === cat.id && p.isActive).length,
      }));
    }
  },
};
