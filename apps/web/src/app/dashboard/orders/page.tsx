"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { OrderStatusBadge } from "@/app/(storefront)/orders/page";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

interface AdminOrderItem {
  id: string;
  productName: string;
  unitPriceIdr: number;
  quantity: number;
  subtotalIdr: number;
}

interface AdminOrder {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: string;
  totalIdr: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  customerNotes?: string | null;
  items: AdminOrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get<{ data: AdminOrder[] }>("/orders/admin/all?limit=100");
      setOrders(res.data.data || []);
    } catch {
      toast.error("Gagal memuat daftar pesanan admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get<{ data: AdminOrder[] }>("/orders/admin/all?limit=100");
        if (isMounted) setOrders(res.data.data || []);
      } catch {
        if (isMounted) toast.error("Gagal memuat daftar pesanan admin");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Transisi yang diizinkan sesuai Section 6.5 PRD:
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    if (
      !confirm(
        `Ubah status pesanan #${orderId.slice(0, 8)} menjadi "${nextStatus}"?`
      )
    ) {
      return;
    }

    setActionLoading(orderId);
    try {
      const res = await api.patch<AdminOrder>(`/orders/admin/${orderId}/status`, {
        status: nextStatus,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: res.data.status } : o))
      );
      toast.success(`Status pesanan berhasil diubah menjadi ${nextStatus}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengubah status pesanan";
      toast.error(msg);
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
            <span className="text-gray-900 font-semibold">Pesanan</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Manajemen <span className="text-[#0053F1]">Pesanan Masuk</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="px-4 py-2 rounded-full border border-[#EAE5D9] text-xs font-semibold text-gray-700 bg-white hover:bg-[#F6F3EC] transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <LoadingState count={4} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Belum Ada Pesanan"
            description="Belum ada transaksi simulasi yang masuk dari customer."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const formattedDate = new Date(o.createdAt).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              const nextAvailable = allowedTransitions[o.status] || [];
              const isBusy = actionLoading === o.id;

              return (
                <div
                  key={o.id}
                  className="bg-white border border-[#EAE5D9] rounded-3xl p-6 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE5D9]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-gray-500">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{formattedDate}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {o.shippingName} ({o.shippingPhone})
                      </span>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>

                  {/* Ringkasan Produk & Pengiriman */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                        Item Pesanan ({o.items.length})
                      </span>
                      <ul className="space-y-1">
                        {o.items.map((it) => (
                          <li key={it.id} className="text-gray-700">
                            • <strong>{it.productName}</strong> × {it.quantity} (
                            {formatRupiah(it.subtotalIdr)})
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold text-gray-900 mt-2">
                        Total: {formatRupiah(o.totalIdr)}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400 uppercase tracking-wider font-semibold block mb-1">
                        Alamat Pengiriman
                      </span>
                      <p className="text-gray-600 leading-relaxed">
                        {o.shippingAddress}
                      </p>
                      {o.customerNotes && (
                        <p className="text-gray-500 italic mt-1">
                          Catatan: {o.customerNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi Transisi Status */}
                  <div className="pt-3 border-t border-[#EAE5D9] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-gray-400">
                      Transisi Status Alur (FR-37 & §6.5):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {nextAvailable.length > 0 ? (
                        nextAvailable.map((next) => (
                          <button
                            key={next}
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(o.id, next)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-2xs ${
                              next === "CANCELLED"
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                : "bg-[#0053F1] text-white hover:opacity-90"
                            }`}
                          >
                            Ubah ke {next}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">
                          Status Final ({o.status})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
