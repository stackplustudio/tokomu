import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * EmptyState — UI ketika daftar atau pencarian tidak menghasilkan data (ui.md §12 State: empty).
 * Pola: Ikon dalam kotak bg-[#0053F1]/10, judul semibold, deskripsi abu-abu, satu tombol CTA.
 */
export default function EmptyState({
  title = "Tidak ada produk ditemukan",
  description = "Coba ubah kata kunci pencarian atau reset filter untuk melihat koleksi lainnya.",
  actionLabel = "Lihat Semua Produk",
  actionHref = "/products",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-[#EAE5D9] rounded-2xl max-w-lg mx-auto my-8">
      {/* Kotak ikon aksen biru 10% */}
      <div className="w-14 h-14 rounded-2xl bg-[#0053F1]/10 text-[#0053F1] flex items-center justify-center mb-4">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>

      {onAction ? (
        <button
          onClick={onAction}
          className="bg-[#0053F1] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#003CB3] transition-all"
        >
          {actionLabel}
        </button>
      ) : (
        <Link
          href={actionHref}
          className="bg-[#0053F1] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#003CB3] transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

