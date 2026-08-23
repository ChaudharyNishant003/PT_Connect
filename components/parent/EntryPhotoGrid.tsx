"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
}

export default function EntryPhotoGrid({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
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
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 min-h-[44px] min-w-[44px] rounded-full bg-white/10 text-2xl text-white"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative h-full w-full max-w-3xl">
            <Image src={active.url} alt="" fill sizes="100vw" className="object-contain" unoptimized />
          </div>
        </div>
      )}
    </>
  );
}
