'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { cloudinaryImage } from '@/src/core/utils/cloudinary-image';
import { PostCarouselProps } from './type';

const PHOTO_WIDTH = 1080;

export function PostCarousel({ photos, alt }: PostCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function goTo(index: number) {
    const track = trackRef.current;

    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="space-y-2">
      <div
        ref={trackRef}
        onScroll={(event) =>
          setActiveIndex(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))
        }
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-[4/5] w-full shrink-0 snap-center">
            <Image
              src={cloudinaryImage(photo.url, PHOTO_WIDTH)}
              alt={`${alt} (${photo.position} de ${photos.length})`}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Foto ${index + 1}`}
              aria-current={index === activeIndex}
              className={`size-1.5 rounded-full transition ${
                index === activeIndex ? 'bg-indigo-500' : 'bg-slate-500/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
