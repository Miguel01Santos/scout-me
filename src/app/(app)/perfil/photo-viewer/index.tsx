'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@heroui/react';
import { PhotoViewerProps } from './type';

export function PhotoViewer({ src, alt, children }: PhotoViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ver foto ampliada"
        className="rounded-full shrink-0 cursor-zoom-in"
      >
        {children}
      </button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="sm" placement="center">
            <Modal.Dialog aria-label={alt} className="bg-transparent shadow-none p-0">
              <Image
                src={src}
                alt={alt}
                width={512}
                height={512}
                unoptimized
                className="w-full aspect-square object-cover rounded-3xl"
              />
              <Modal.CloseTrigger />
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
