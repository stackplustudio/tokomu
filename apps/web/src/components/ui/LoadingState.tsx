/**
 * LoadingState — skeleton loading (ui.md §12 State: loading).
 * Skeleton: bg-surface-alt animate-pulse rounded-xl.
 */
export default function LoadingState({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-[#EAE5D9] rounded-2xl overflow-hidden">
          {/* Gambar skeleton */}
          <div className="aspect-[4/3] bg-[#F6F3EC] animate-pulse" />
          {/* Teks skeleton */}
          <div className="p-4 space-y-2">
            <div className="h-3 w-20 bg-[#F6F3EC] animate-pulse rounded-full" />
            <div className="h-4 w-3/4 bg-[#F6F3EC] animate-pulse rounded-lg" />
            <div className="h-4 w-1/2 bg-[#F6F3EC] animate-pulse rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

