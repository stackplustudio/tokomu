interface ErrorStateProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

/**
 * ErrorState — UI ketika terjadi kesalahan dalam memuat data (ui.md §12 State: error).
 * Pola: Card dengan aksen merah (#DC2626 / green-600/amber/red semantic) dan tombol retry.
 */
export default function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data produk. Silakan coba beberapa saat lagi.",
  retryLabel = "Coba Lagi",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-red-200 rounded-2xl max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-red-600 mb-6 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

