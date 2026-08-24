"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
}

export default function EntryPhotoGrid({ photos, label }: { photos: Photo[]; label: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  if (photos.length === 0) return null;

  const active = openIndex !== null ? photos[openIndex] : null;
  const multiple = photos.length > 1;

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={multiple ? `View ${label} photo ${index + 1} of ${photos.length}, full screen` : `View ${label} photo, full screen`}
            className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Image src={photo.url} alt="" fill sizes="80px" className="object-cover" unoptimized />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${label} photo, full screen`}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-2xl text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Image src={active.url} alt={label} fill sizes="100vw" className="object-contain" unoptimized />
          </div>
        </div>
      )}
    </>
  );
}
