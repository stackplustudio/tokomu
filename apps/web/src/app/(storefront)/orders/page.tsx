"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

interface OrderItemSummary {
  id: string;
  productName: string;
  unitPriceIdr: number;
  quantity: number;
  subtotalIdr: number;
}

interface OrderSummary {
  id: string;
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  paymentStatus: string;
  totalIdr: number;
  items: OrderItemSummary[];
}

export function OrderStatusBadge({ status }: { status: OrderSummary["status"] }) {
  const statusConfig: Record<
    OrderSummary["status"],
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    PENDING: {
      label: "Menunggu Konfirmasi",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    CONFIRMED: {
      label: "Pesanan Dikonfirmasi",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    PROCESSING: {
      label: "Sedang Dikemas",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    SHIPPED: {
      label: "Dalam Pengiriman",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    COMPLETED: {
      label: "Selesai",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    CANCELLED: {
      label: "Dibatalkan",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  const cfg = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get<OrderSummary[]>("/orders");
      setOrders(res.data);
    } catch {
      setError("Gagal memuat riwayat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get<OrderSummary[]>("/orders");
        if (isMounted) setOrders(res.data);
      } catch {
        if (isMounted) setError("Gagal memuat riwayat pesanan.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

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
        <ErrorState message={error} onRetry={fetchOrders} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Belum Ada Riwayat Pesanan"
          description="Anda belum memiliki transaksi pesanan di Tokomu. Yuk mulai belanja sekarang!"
          actionLabel="Jelajahi Produk"
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
            › RIWAYAT TRANSAKSI ‹
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Pesanan <span className="text-[#0053F1]">Saya</span>
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Total <span className="font-bold text-gray-900">{orders.length}</span> pesanan ditemukan
        </p>
      </div>

      {/* List Pesanan */}
      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString(
            "id-ID",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          return (
            <div
              key={order.id}
              className="bg-white border border-[#EAE5D9] rounded-2xl p-5 sm:p-6 shadow-xs hover:border-gray-300 transition-all space-y-4"
            >
              {/* Header Card Pesanan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE5D9]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-gray-500">
                    ID: #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Snapshot Produk Ringkas */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-xs sm:text-sm text-gray-700"
                  >
                    <span className="font-medium text-gray-900 truncate max-w-md">
                      {item.productName}{" "}
                      <span className="text-gray-400 font-normal">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="font-semibold text-gray-900 shrink-0">
                      {formatRupiah(item.subtotalIdr)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Link Detail */}
              <div className="border-t border-[#EAE5D9] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-500">Total Pembayaran:</span>
                  <span className="text-base sm:text-lg font-bold text-[#0053F1]">
                    {formatRupiah(order.totalIdr)}
                  </span>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#EAE5D9] text-xs font-semibold text-gray-700 hover:bg-[#F6F3EC] hover:text-[#0053F1] transition-colors"
                >
                  Lihat Detail Pesanan →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
