import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format harga integer rupiah ke string "Rp 1.299.000" (FR-02).
 * Harga dari backend selalu integer; format Rp hanya di frontend.
 */
export function formatRupiah(priceIdr: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(priceIdr)
    .replace(/\u00A0/g, " "); // ganti non-breaking space ke spasi biasa
}

/**
 * Truncate teks panjang dengan ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
