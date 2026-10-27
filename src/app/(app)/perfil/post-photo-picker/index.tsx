'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react';
import { PHOTOS_PER_POST_LIMIT } from '@/src/core/enums/post';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { preparePostImage } from '@/src/core/utils/prepare-post-image';
import { PickedPhoto, PostPhotoPickerProps } from './type';

export function PostPhotoPicker({ photos, isDisabled, onChange }: PostPhotoPickerProps) {
  const themeClasses = useThemeClasses();
  const inputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  const [isPreparing, setIsPreparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)),
    []
  );

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, PHOTOS_PER_POST_LIMIT - photos.length);

    event.target.value = '';

    if (files.length === 0) return;

    setErrorMessage('');
    setIsPreparing(true);

    const added: PickedPhoto[] = [];

    try {
      for (const file of files) {
        const blob = await preparePostImage(file);

        added.push({ id: crypto.randomUUID(), blob, previewUrl: URL.createObjectURL(blob) });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível usar essa foto.');
    } finally {
      setIsPreparing(false);
      onChange([...photos, ...added]);
    }
  }

  function movePhoto(index: number, offset: number) {
    const next = [...photos];
    const [photo] = next.splice(index, 1);

    next.splice(index + offset, 0, photo);
    onChange(next);
  }

  function removePhoto(photo: PickedPhoto) {
    URL.revokeObjectURL(photo.previewUrl);
    onChange(photos.filter((item) => item.id !== photo.id));
  }

  const canAdd = photos.length < PHOTOS_PER_POST_LIMIT && !isDisabled && !isPreparing;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-slate-400">Fotos</span>
        <span className={`text-[10px] ${themeClasses.subText}`}>
          {photos.length}/{PHOTOS_PER_POST_LIMIT}
        </span>
      </div>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image src={photo.previewUrl} alt={`Foto ${index + 1}`} fill unoptimized className="object-cover" />
            <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-1.5 text-[10px] font-bold text-white">
              {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removePhoto(photo)}
              disabled={isDisabled}
              aria-label={`Tirar a foto ${index + 1}`}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
            >
              <X size={12} />
            </button>
            <div className="absolute inset-x-1 bottom-1 flex justify-between">
              <button
                type="button"
                onClick={() => movePhoto(index, -1)}
                disabled={isDisabled || index === 0}
                aria-label={`Mover a foto ${index + 1} para a esquerda`}
                className="rounded-full bg-black/60 p-1 text-white disabled:opacity-0"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                type="button"
                onClick={() => movePhoto(index, 1)}
                disabled={isDisabled || index === photos.length - 1}
                aria-label={`Mover a foto ${index + 1} para a direita`}
                className="rounded-full bg-black/60 p-1 text-white disabled:opacity-0"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {photos.length < PHOTOS_PER_POST_LIMIT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!canAdd}
            className={`flex aspect-[4/5] flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-[11px] font-bold transition hover:opacity-80 disabled:opacity-50 ${themeClasses.subText}`}
          >
            <ImagePlus size={20} />
            {isPreparing ? 'Preparando…' : 'Adicionar'}
          </button>
        )}
      </div>

      <p className={`text-[11px] ${themeClasses.subText}`}>
        As fotos são cortadas no formato 4:5, pelo centro. A primeira é a capa do post.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={addPhotos}
      />
    </div>
  );
}
