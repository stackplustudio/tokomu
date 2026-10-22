"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import storeConfig from "@/config/store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Harap isi email dan password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{
        message: string;
        user: { id: string; email: string; role: string };
        access_token: string;
      }>("/auth/login", { email, password });

      Cookies.set("token", res.data.access_token, { expires: 7 });
      toast.success("Login berhasil! Selamat datang kembali.");

      if (res.data.user.role === "ADMIN" && redirectPath === "/") {
        router.push("/dashboard");
      } else {
        router.push(redirectPath);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Email atau password salah";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-[#FCFBF6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#EAE5D9] rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-gray-900">
            {storeConfig.name}
            <span className="text-[#0053F1]">.</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Masuk ke Akun
          </h1>
          <p className="text-xs text-gray-500">
            Akses keranjang belanja, checkout, dan riwayat pesanan Anda
          </p>
        </div>

        {/* Demo Credentials Quick-Fill (Portofolio Convenience) */}
        <div className="p-4 bg-[#F6F3EC] rounded-2xl border border-[#EAE5D9] space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Akun Demo Siap Pakai:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuickDemo("customer@stackplus.studio")}
              className="px-3 py-2 bg-white rounded-xl border border-[#EAE5D9] font-medium text-gray-700 hover:border-[#0053F1] transition-all text-center"
            >
              👤 Demo Customer
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo("admin@stackplus.studio")}
              className="px-3 py-2 bg-white rounded-xl border border-[#EAE5D9] font-medium text-gray-700 hover:border-[#0053F1] transition-all text-center"
            >
              🛡️ Demo Admin
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center">
            Password: <code className="text-gray-600 font-semibold">password123</code>
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0053F1] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>

        {/* Footer Nav */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-[#EAE5D9]">
          <Link href="/" className="hover:text-[#0053F1] transition-colors">
            ← Kembali ke Beranda Toko
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF6] flex items-center justify-center">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}

