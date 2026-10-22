"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import storeConfig from "@/config/store";

/**
 * StoreNavbar — Navbar floating dengan design token StackPlus Studio (ui.md §8.9).
 * - Kiri: Logo resmi (stackplusbiru.png) dengan fallback teks.
 * - Tengah: Pill putih menu navigasi (desktop).
 * - Kanan: Dark pill CTA ("Katalog Lengkap" / Belanja).
 * - Mobile: Hamburger menu dengan touch target >= 44px.
 */
export default function StoreNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "BERANDA", href: "/" },
    { label: "SEMUA PRODUK", href: "/products" },
    { label: "SNEAKERS", href: "/products?category=sneakers" },
    { label: "RUNNING", href: "/products?category=running-shoes" },
    { label: "CASUAL", href: "/products?category=casual-shoes" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between h-16 bg-[#FCFBF6]/90 backdrop-blur-md border border-[#EAE5D9] rounded-2xl sm:rounded-full px-4 sm:px-6 shadow-sm">
          {/* Logo Brand (Kiri) */}
          <Link href="/" className="flex items-center gap-3">
            {!logoError ? (
              <div className="relative h-8 w-28 sm:w-32">
                <Image
                  src={storeConfig.assets.logoBlue}
                  alt={storeConfig.name}
                  fill
                  className="object-contain"
                  onError={() => setLogoError(true)}
                  priority
                />
              </div>
            ) : (
              <span className="text-xl font-bold tracking-tight text-gray-900">
                {storeConfig.name}
                <span className="text-[#0053F1]">.</span>
              </span>
            )}
          </Link>

          {/* Navigasi Pill Tengah (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 border border-[#EAE5D9] px-4 py-1.5 rounded-full shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-[#0053F1] bg-[#0053F1]/10"
                      : "text-gray-600 hover:text-[#0053F1]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Kanan (Dark Pill - ui.md §8.1) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#2A2724] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-black transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Beli Sekarang
            </Link>
          </div>

          {/* Tombol Hamburger Menu (Mobile) */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-gray-700 hover:text-gray-900 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 p-4 bg-white border border-[#EAE5D9] rounded-2xl shadow-lg flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#F6F3EC] hover:text-[#0053F1] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#EAE5D9]">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2A2724] text-white py-3 rounded-full text-xs font-semibold hover:bg-black transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Beli Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

