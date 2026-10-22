"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import LoadingState from "@/components/ui/LoadingState";
import ProductImage from "@/components/ui/ProductImage";

interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  lineTotalIdr: number;
  product: {
    id: string;
    name: string;
    priceIdr: number;
    imageUrls: string[];
  };
}

interface CartResponse {
  items: CartItemData[];
  subtotalIdr: number;
  totalIdr: number;
  totalQuantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields (CheckoutDto)
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await api.get<CartResponse>("/cart");
        if (!res.data || res.data.items.length === 0) {
          toast.error("Keranjang belanja kosong. Silakan pilih produk terlebih dahulu.");
          router.push("/cart");
          return;
        }
        setCart(res.data);
      } catch {
        toast.error("Gagal memuat data checkout.");
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingName.trim() || !shippingPhone.trim() || !shippingAddress.trim()) {
      toast.error("Harap lengkapi semua data pengiriman wajib");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ id: string }>("/orders", {
        shippingName,
        shippingPhone,
        shippingAddress,
        customerNotes: customerNotes.trim() || undefined,
      });

      toast.success("Pesanan simulasi berhasil dibuat! 🎉");
      router.push(`/orders/${res.data.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal membuat pesanan. Silakan coba lagi.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState count={4} />
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Banner Simulasi Transaksi (FR-38) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <span className="text-xl">⚡</span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            SIMULASI PEMBAYARAN TOKOMU
          </h4>
          <p className="text-xs text-amber-800 mt-0.5">
            Pesanan ini bersifat simulasi portofolio. Tidak ada penagihan uang nyata. Stok akan berkurang otomatis di database saat Anda mengonfirmasi.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[#EAE5D9] pb-6">
        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
          › CHECKOUT & PENGIRIMAN ‹
        </p>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Konfirmasi <span className="text-[#0053F1]">Pesanan</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kolom Formulir Pengiriman (2 Kolom) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Data Pengiriman
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  required
                  className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                  Nomor HP / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  required
                  className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Alamat Lengkap Pengiriman *
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos..."
                rows={3}
                required
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Catatan Pesanan (Opsional)
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Contoh: Titip di pos satpam bila tidak ada orang"
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>
          </div>

          {/* Metode Pembayaran (Simulasi Opsi) */}
          <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Metode Pembayaran
            </h2>
            <div className="p-4 rounded-2xl border-2 border-[#0053F1] bg-[#0053F1]/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-[#0053F1] flex items-center justify-center text-white text-[10px]">✓</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Simulasi Direct Checkout</p>
                  <p className="text-xs text-gray-500">Status langsung diverifikasi oleh sistem simulasi Tokomu</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-[#0053F1] text-white rounded-full">
                SIMULASI
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0053F1] text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? "Memproses Pesanan..." : "Konfirmasi & Buat Pesanan Sekarang →"}
          </button>
        </form>

        {/* Kolom Review Produk & Rincian (1 Kolom) */}
        <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Pesanan ({cart?.totalQuantity})
            </h2>
            <Link href="/cart" className="text-xs text-[#0053F1] hover:underline font-semibold">
              Ubah
            </Link>
          </div>

          {/* List Ringkas Produk */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <div className="w-12 h-12 rounded-lg border border-[#EAE5D9] overflow-hidden shrink-0 bg-[#FCFBF6]">
                  <ProductImage
                    src={item.product.imageUrls[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-gray-400">
                    {item.quantity} × {formatRupiah(item.product.priceIdr)}
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {formatRupiah(item.lineTotalIdr)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EAE5D9] pt-4 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">
                {formatRupiah(cart?.subtotalIdr || 0)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Ongkir:</span>
              <span className="text-emerald-600 font-semibold">Rp 0 (Gratis)</span>
            </div>
          </div>

          <div className="border-t border-[#EAE5D9] pt-4 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-extrabold text-[#0053F1]">
              {formatRupiah(cart?.totalIdr || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

