"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { OrderStatusBadge } from "../page";

interface OrderDetailItem {
  id: string;
  productId: string;
  productName: string;
  unitPriceIdr: number;
  quantity: number;
  subtotalIdr: number;
  product?: {
    slug: string;
    imageUrls: string[];
  };
}

interface OrderDetail {
  id: string;
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  paymentStatus: string;
  subtotalIdr: number;
  totalIdr: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  customerNotes?: string | null;
  items: OrderDetailItem[];
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = async () => {
    try {
      const res = await api.get<OrderDetail>(`/orders/${orderId}`);
      setOrder(res.data);
    } catch {
      setError("Pesanan tidak ditemukan atau Anda tidak memiliki izin untuk melihatnya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get<OrderDetail>(`/orders/${orderId}`);
        if (isMounted) setOrder(res.data);
      } catch {
        if (isMounted) {
          setError(
            "Pesanan tidak ditemukan atau Anda tidak memiliki izin untuk melihatnya."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState count={3} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          message={error || "Pesanan tidak ditemukan"}
          onRetry={fetchOrderDetail}
        />
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Nav */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#0053F1]">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-[#0053F1]">
          Pesanan Saya
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold font-mono">
          #{order.id.slice(0, 8).toUpperCase()}
        </span>
      </nav>

      {/* Banner Simulasi (FR-38) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <p className="text-xs text-amber-800">
            <strong>Mode Simulasi:</strong> Transaksi ini tercatat di database untuk keperluan portofolio e-commerce. Tidak ada pembayaran nyata.
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full shrink-0">
          SIMULASI AKTIF
        </span>
      </div>

      {/* Header Info Pesanan */}
      <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE5D9]">
          <div>
            <p className="text-xs font-mono uppercase text-gray-400">
              ID Pesanan: {order.id}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              Rincian Pesanan
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{formattedDate}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Info Pengiriman */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 uppercase tracking-wider font-semibold">
              Tujuan Pengiriman
            </span>
            <p className="font-bold text-gray-900 text-sm">{order.shippingName}</p>
            <p className="text-gray-600">{order.shippingPhone}</p>
            <p className="text-gray-600 leading-relaxed mt-1">
              {order.shippingAddress}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400 uppercase tracking-wider font-semibold">
              Catatan & Pembayaran
            </span>
            <p className="text-gray-600">
              Metode: <strong className="text-gray-900">Direct Checkout (Simulasi)</strong>
            </p>
            <p className="text-gray-600">
              Catatan:{" "}
              <span className="italic">
                {order.customerNotes || "Tidak ada catatan khusus"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Produk yang Dibeli (Snapshot FR-34) */}
      <div className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          Produk yang Dibeli
        </h2>

        <div className="divide-y divide-[#EAE5D9]">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="font-bold text-gray-900 text-sm">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} pasang × {formatRupiah(item.unitPriceIdr)}
                </p>
              </div>
              <p className="font-bold text-gray-900 text-sm">
                {formatRupiah(item.subtotalIdr)}
              </p>
            </div>
          ))}
        </div>

        {/* Ringkasan Biaya */}
        <div className="border-t border-[#EAE5D9] pt-4 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-gray-900">
              {formatRupiah(order.subtotalIdr)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Biaya Pengiriman:</span>
            <span className="text-emerald-600 font-semibold">Rp 0 (Gratis)</span>
          </div>
          <div className="border-t border-[#EAE5D9] pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900">Total Pembayaran:</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0053F1]">
              {formatRupiah(order.totalIdr)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigasi Aksi */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
        <Link
          href="/orders"
          className="text-xs font-semibold text-gray-600 hover:text-[#0053F1] transition-colors"
        >
          ← Kembali ke Semua Pesanan
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#2A2724] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-black transition-all"
        >
          Lanjut Belanja di Katalog
        </Link>
      </div>
    </div>
  );
}
