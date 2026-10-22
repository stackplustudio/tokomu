"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  lineTotalIdr: number;
  product: {
    id: string;
    slug: string;
    name: string;
    priceIdr: number;
    stock: number;
    imageUrls: string[];
    isActive: boolean;
  };
}

interface CartResponse {
  id: string;
  userId: string;
  items: CartItemData[];
  subtotalIdr: number;
  totalIdr: number;
  totalQuantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const res = await api.get<CartResponse>("/cart");
      setCart(res.data);
    } catch {
      setError("Gagal memuat keranjang belanja. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get<CartResponse>("/cart");
        if (isMounted) setCart(res.data);
      } catch {
        if (isMounted) setError("Gagal memuat keranjang belanja. Silakan coba lagi.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    setActionLoading(productId);
    try {
      const res = await api.patch<CartResponse>(`/cart/items/${productId}`, {
        quantity: newQty,
      });
      setCart(res.data);
      if (newQty <= 0) {
        toast.success("Item dihapus dari keranjang");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memperbarui kuantitas";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setActionLoading(productId);
    try {
      const res = await api.delete<CartResponse>(`/cart/items/${productId}`);
      setCart(res.data);
      toast.success("Item berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Kosongkan semua isi keranjang belanja?")) return;
    setActionLoading("clear");
    try {
      const res = await api.delete<CartResponse>("/cart");
      setCart(res.data);
      toast.success("Keranjang berhasil dikosongkan");
    } catch {
      toast.error("Gagal mengosongkan keranjang");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchCart} />
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Keranjang Belanja Anda Kosong"
          description="Anda belum menambahkan produk ke dalam keranjang. Temukan sepatu favorit Anda di katalog."
          actionLabel="Jelajahi Produk Sekarang"
          onAction={() => (window.location.href = "/products")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#EAE5D9] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            › SHOPPING CART ‹
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Keranjang <span className="text-[#0053F1]">Belanja</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          disabled={actionLoading === "clear"}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kolom Daftar Item (2 Kolom) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const isLoadingThis = actionLoading === item.productId;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#EAE5D9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs transition-all hover:border-gray-300"
              >
                {/* Info Produk & Foto */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#EAE5D9] shrink-0 bg-[#FCFBF6]">
                    <ProductImage
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-gray-900 text-sm sm:text-base hover:text-[#0053F1] transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      Harga Satuan:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatRupiah(item.product.priceIdr)}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Tersedia: {item.product.stock} pasang
                    </p>
                  </div>
                </div>

                {/* Kuantitas & Subtotal & Hapus */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EAE5D9]">
                  {/* Selector Jumlah */}
                  <div className="flex items-center border border-[#EAE5D9] rounded-full overflow-hidden bg-[#FCFBF6]">
                    <button
                      type="button"
                      disabled={isLoadingThis || item.quantity <= 1}
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#F6F3EC] disabled:opacity-30 transition-colors"
                      aria-label="Kurangi kuantitas"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={
                        isLoadingThis || item.quantity >= item.product.stock
                      }
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#F6F3EC] disabled:opacity-30 transition-colors"
                      aria-label="Tambah kuantitas"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs text-gray-400">Subtotal</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                      {formatRupiah(item.lineTotalIdr)}
                    </p>
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    type="button"
                    disabled={isLoadingThis}
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    aria-label="Hapus produk"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kolom Ringkasan Pesanan (1 Kolom) */}
        <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Ringkasan Pesanan
          </h2>

          <div className="space-y-3 text-xs sm:text-sm border-b border-[#EAE5D9] pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Total Item:</span>
              <span className="font-semibold text-gray-900">
                {cart?.totalQuantity} pasang
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">
                {formatRupiah(cart?.subtotalIdr || 0)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Pengiriman:</span>
              <span className="text-emerald-600 font-semibold">
                Simulasi Gratis
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900">Total Akhir:</span>
            <span className="text-2xl font-extrabold text-[#0053F1]">
              {formatRupiah(cart?.totalIdr || 0)}
            </span>
          </div>

          {/* CTA Checkout */}
          <Link
            href="/checkout"
            className="w-full bg-[#0053F1] text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-all text-center flex items-center justify-center gap-2"
          >
            Lanjut ke Pembayaran →
          </Link>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            ⚡ Transaksi ini berada dalam mode simulasi portofolio Tokomu.
          </p>
        </div>
      </div>
    </div>
  );
}
