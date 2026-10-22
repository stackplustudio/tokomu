"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const isOutOfStock = stock <= 0;

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await api.post("/cart/items", { productId, quantity });
      toast.success(`${quantity} item berhasil ditambahkan ke keranjang! 🛒`);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal menambahkan ke keranjang";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 space-y-4">
      {/* Pilih Kuantitas */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Jumlah:
          </span>
          <div className="flex items-center border border-[#EAE5D9] rounded-full overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-[#F6F3EC] disabled:opacity-30 transition-colors"
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-bold text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-[#F6F3EC] disabled:opacity-30 transition-colors"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
          <span className="text-xs text-gray-400">Maks. {stock} pasang</span>
        </div>
      )}

      {/* Tombol CTA Utama */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || loading}
        className="w-full bg-[#0053F1] text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Menambahkan...
          </>
        ) : isOutOfStock ? (
          "Stok Habis"
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Tambah ke Keranjang
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        ⚡ Simulasi transaksi — tidak ada tagihan nyata
      </p>
    </div>
  );
}

