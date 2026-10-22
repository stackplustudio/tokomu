"use client";

/**
 * ProductImage — menampilkan gambar produk dengan fallback otomatis.
 * FR-03: Bila URL kosong atau error muat → tampilkan ProductImageFallback.
 * Rasio gambar 4:3 tetap agar grid tidak bergeser.
 */

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ProductImageFallback from "./ProductImageFallback";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function ProductImage({ src, alt, className, priority = false }: Props) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !src || hasError;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#F6F3EC]",
        // Rasio 4:3 — tetap di semua ukuran (FR-03: grid tidak bergeser)
        "aspect-[4/3]",
        className
      )}
    >
      {showFallback ? (
        <ProductImageFallback />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

