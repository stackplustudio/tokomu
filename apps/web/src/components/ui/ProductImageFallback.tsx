/**
 * ProductImageFallback — placeholder bila gambar tidak ada atau gagal dimuat.
 * FR-03, PRD §5.3: latar dari token surface-alt, ikon sepatu sederhana.
 * Tidak pakai SVG eksternal agar tidak ada request tambahan.
 */

export default function ProductImageFallback() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#F6F3EC]"
      aria-label="Gambar produk tidak tersedia"
    >
      {/* Ikon sepatu inline SVG — stroke currentColor, outline (ui.md §8.12) */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-[#EAE5D9]"
      >
        <path
          d="M6 34C6 34 8 28 12 26C16 24 20 25 24 24C28 23 30 20 34 19C38 18 42 20 42 24V34C42 35.1 41.1 36 40 36H8C6.9 36 6 35.1 6 34Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 34H42"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 26L18 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 24.5L24 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="mt-2 text-xs text-[#EAE5D9] font-medium tracking-wide">
        Foto segera hadir
      </span>
    </div>
  );
}

