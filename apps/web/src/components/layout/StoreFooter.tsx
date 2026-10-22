"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import storeConfig from "@/config/store";

/**
 * StoreFooter — Footer toko sesuai UI Design System StackPlus Studio (ui.md §8.10).
 * - 3 kolom + Brand: Identitas toko, tautan cepat, kategori, kontak & media sosial.
 * - Atribusi ke Stack Plus Studio.
 * - Border tipis line (#EAE5D9) dan background surface (#FDFBF7).
 */
export default function StoreFooter() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-[#FDFBF7] border-t border-[#EAE5D9] mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Deskripsi (2 kolom) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              {!logoError ? (
                <div className="relative h-9 w-32">
                  <Image
                    src={storeConfig.assets.logoBlue}
                    alt={storeConfig.name}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  {storeConfig.name}
                  <span className="text-[#0053F1]">.</span>
                </span>
              )}
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              {storeConfig.footer.about}
            </p>
            <div className="pt-2 text-xs text-gray-400">
              Blueprint e-commerce berstandar enterprise dibangun di atas Stack Plus Studio Core Engine.
            </div>
          </div>

          {/* Kolom 1: Navigasi Cepat */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              {storeConfig.footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#0053F1] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 2: Kategori Populer */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">
              Kategori Sepatu
            </h4>
            <ul className="space-y-2.5 text-sm">
              {storeConfig.categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-gray-500 hover:text-[#0053F1] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Jam Kerja */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">
              Hubungi Kami
            </h4>
            <div className="space-y-2.5 text-sm text-gray-500">
              <p>{storeConfig.contact.address}</p>
              <p>Email: {storeConfig.contact.email}</p>
              <p>WhatsApp: {storeConfig.contact.phone}</p>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-[#EAE5D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>{storeConfig.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <span className="text-[#0053F1] font-semibold">
              Powering Modern Commerce
            </span>
            <span>Made with precision by Stack Plus Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

