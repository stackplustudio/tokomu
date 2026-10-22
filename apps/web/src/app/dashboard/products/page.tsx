"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { Product } from "@/types/product";
import { formatRupiah } from "@/lib/utils";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get<{ data: Product[] }>("/products?limit=100");
      setProducts(res.data.data || []);
    } catch {
      toast.error("Gagal memuat katalog produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get<{ data: Product[] }>("/products?limit=100");
        if (isMounted) setProducts(res.data.data || []);
      } catch {
        if (isMounted) toast.error("Gagal memuat katalog produk");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setActionLoading(id);
    try {
      const res = await api.patch<Product>(`/products/${id}`, {
        isActive: !currentActive,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: res.data.isActive } : p))
      );
      toast.success(
        res.data.isActive
          ? "Produk berhasil diaktifkan kembali"
          : "Produk dinonaktifkan dari katalog (Soft-delete)"
      );
    } catch {
      toast.error("Gagal mengubah status aktif produk");
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickStockUpdate = async (id: string, currentStock: number) => {
    const input = prompt("Masukkan jumlah stok baru:", String(currentStock));
    if (input === null) return;
    const newStock = parseInt(input, 10);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Jumlah stok harus berupa bilangan bulat >= 0");
      return;
    }

    setActionLoading(id);
    try {
      const res = await api.patch<Product>(`/products/${id}`, {
        stock: newStock,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: res.data.stock } : p))
      );
      toast.success("Stok berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui stok");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF6] p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#EAE5D9]">
        <div>
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#0053F1]">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Produk</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Katalog & Manajemen <span className="text-[#0053F1]">Stok</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            className="px-4 py-2.5 rounded-full border border-[#EAE5D9] text-xs font-semibold text-gray-700 bg-white hover:bg-[#F6F3EC] transition-all"
          >
            🔄 Refresh
          </button>
          <Link
            href="/dashboard/products/create"
            className="px-5 py-2.5 rounded-full bg-[#0053F1] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <LoadingState count={4} />
        ) : products.length === 0 ? (
          <EmptyState
            title="Belum Ada Produk"
            description="Mulai tambahkan produk pertama Anda ke dalam toko."
            actionLabel="Tambah Produk Baru"
            onAction={() => (window.location.href = "/dashboard/products/create")}
          />
        ) : (
          <div className="bg-white border border-[#EAE5D9] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCFBF6] border-b border-[#EAE5D9] text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Produk</th>
                    <th className="py-4 px-4">Kategori</th>
                    <th className="py-4 px-4">Harga</th>
                    <th className="py-4 px-4 text-center">Stok</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5D9]">
                  {products.map((p) => {
                    const isBusy = actionLoading === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-[#FCFBF6]/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                          <p className="text-gray-400 font-mono text-[11px]">{p.sku || p.slug}</p>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium">
                          {p.category?.name || "-"}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {formatRupiah(p.priceIdr)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickStockUpdate(p.id, p.stock)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FCFBF6] hover:bg-gray-100 border border-[#EAE5D9] rounded-full font-bold text-gray-800 transition-colors"
                            title="Klik untuk ubah stok"
                          >
                            <span>{p.stock}</span>
                            <span className="text-[10px] text-gray-400">✏️</span>
                          </button>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {p.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleActive(p.id, p.isActive)}
                            className={`px-3 py-1.5 rounded-full font-semibold text-[11px] transition-colors border ${
                              p.isActive
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {p.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
