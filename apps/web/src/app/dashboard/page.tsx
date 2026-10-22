"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import storeConfig from "@/config/store";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FCFBF6] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#EAE5D9]">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#0053F1]">
            ADMIN CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
            Dashboard Pengelola <span className="text-[#0053F1]">{storeConfig.name}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-full border border-[#EAE5D9] text-xs font-semibold text-gray-700 bg-white hover:bg-[#F6F3EC] transition-all"
          >
            ← Lihat Toko
          </Link>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Modul Produk */}
        <div className="p-6 bg-white rounded-3xl shadow-xs border border-[#EAE5D9] flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#0053F1]/10 text-[#0053F1] flex items-center justify-center font-bold text-lg mb-4">
              👟
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
              Manajemen Produk
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Kelola katalog, stok sepatu, harga, dan status aktif/nonaktif produk toko (FR-36).
            </p>
          </div>
          <Link href="/dashboard/products">
            <Button className="w-full bg-[#0053F1] hover:bg-[#0053F1]/90 rounded-full text-xs font-bold uppercase tracking-wider py-5">
              Buka Katalog Produk
            </Button>
          </Link>
        </div>

        {/* Modul Pesanan */}
        <div className="p-6 bg-white rounded-3xl shadow-xs border border-[#EAE5D9] flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              📦
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
              Manajemen Pesanan
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Pantau seluruh pesanan customer dan perbarui status alur pengiriman (FR-37).
            </p>
          </div>
          <Link href="/dashboard/orders">
            <Button className="w-full bg-[#2A2724] hover:bg-black rounded-full text-xs font-bold uppercase tracking-wider py-5 text-white">
              Buka Daftar Pesanan
            </Button>
          </Link>
        </div>

        {/* Modul Users (Blueprint Asli) */}
        <div className="p-6 bg-white rounded-3xl shadow-xs border border-[#EAE5D9] flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-lg mb-4">
              👥
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
              Manajemen User
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Blueprint standar CRUD user dari Stack Plus Studio Core Engine.
            </p>
          </div>
          <Link href="/dashboard/users">
            <Button variant="outline" className="w-full rounded-full text-xs font-semibold py-5">
              Buka Modul User
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
