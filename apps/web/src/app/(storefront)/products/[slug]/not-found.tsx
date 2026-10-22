import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
        Sepatu Tidak Ditemukan
      </h1>
      <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
        Sepatu yang kamu cari tidak tersedia, sudah dinonaktifkan, atau tautan yang kamu ikuti keliru.
      </p>
      <Link
        href="/products"
        className="bg-[#0053F1] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#003CB3] transition-all shadow-md"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}

