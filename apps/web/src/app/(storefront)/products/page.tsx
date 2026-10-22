"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { Product, ProductCategory } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import storeConfig from "@/config/store";

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Baca parameter awal dari URL query params (FR-05)
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = (searchParams.get("sort") as "price_asc" | "price_desc" | "newest") || "newest";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">(initialSort);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [categories, setCategories] = useState<(ProductCategory & { productCount: number })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil daftar kategori dari REST API (FR-23)
  useEffect(() => {
    ProductRepository.findCategories().then(setCategories);
  }, []);

  // Update URL params agar state filter dapat dibagikan / di-bookmark
  const updateURL = (cat: string, q: string, s: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q) params.set("search", q);
    if (s && s !== "newest") params.set("sort", s);
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (slug: string) => {
    const next = selectedCategory === slug ? "" : slug;
    setSelectedCategory(next);
    setLoading(true);
    setError(null);
    updateURL(next, search, sort);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setLoading(true);
    setError(null);
    updateURL(selectedCategory, val, sort);
  };

  const handleSortChange = (s: "newest" | "price_asc" | "price_desc") => {
    setSort(s);
    setLoading(true);
    setError(null);
    updateURL(selectedCategory, search, s);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSort("newest");
    setMaxPrice(undefined);
    setLoading(true);
    setError(null);
    router.replace("/products", { scroll: false });
  };

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    ProductRepository.findAll({
      search,
      category: selectedCategory || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      limit: 100,
    })
      .then((res) => {
        setProducts(res.data);
        setTotal(res.meta.total);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat produk dari server API.");
        setLoading(false);
      });
  };

  // Eksekusi filter via ProductRepository (FR-21 & FR-24)
  useEffect(() => {
    let active = true;

    ProductRepository.findAll({
      search,
      category: selectedCategory || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      limit: 100,
    })
      .then((res) => {
        if (!active) return;
        setProducts(res.data);
        setTotal(res.meta.total);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Gagal memuat data produk dari server API.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, selectedCategory, maxPrice, sort]);

  const isFiltered = Boolean(search || selectedCategory || maxPrice || sort !== "newest");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Halaman Katalog (ui.md §4: Heading Dua Warna) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE5D9]">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
            › KATALOG LENGKAP ‹
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Koleksi Sepatu <span className="text-[#0053F1]">{storeConfig.name}</span>
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Menampilkan <span className="font-semibold text-gray-900">{total}</span> produk siap kirim
        </p>
      </div>

      {/* Toolbar Pencarian & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Input Pencarian (ui.md §8.2 Form pill) */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari sepatu berdasarkan nama..."
              aria-label="Cari produk"
              className="w-full bg-white border border-[#EAE5D9] rounded-full pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1] transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-gray-400 hover:text-gray-700"
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Pengurutan (Sort Dropdown) */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
              Urutkan:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as "newest" | "price_asc" | "price_desc")}
              className="bg-white border border-[#EAE5D9] rounded-full px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga: Termurah</option>
              <option value="price_desc">Harga: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Filter Kategori (Pill Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === ""
                ? "bg-[#0053F1] text-white shadow-xs"
                : "bg-white text-gray-700 border border-[#EAE5D9] hover:bg-[#F6F3EC]"
            }`}
          >
            Semua ({categories.reduce((acc, c) => acc + c.productCount, 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? "bg-[#0053F1] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-[#EAE5D9] hover:bg-[#F6F3EC]"
              }`}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors whitespace-nowrap ml-auto"
            >
              Reset Filter ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid Produk, State Loading, State Error, atau EmptyState (FR-10) */}
      {loading ? (
        <LoadingState count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Sepatu yang Cocok"
          description={`Pencarian untuk "${search || selectedCategory}" tidak menemukan hasil. Silakan periksa ejaan atau klik reset filter.`}
          actionLabel="Reset Semua Filter"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><LoadingState count={8} /></div>}>
      <CatalogContent />
    </Suspense>
  );
}
