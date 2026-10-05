'use client';

import { ChangeEvent, Key, useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Dropdown } from '@heroui/react';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { prepareAvatarImage } from '@/src/core/utils/prepare-avatar-image';
import { AvatarEditorProps } from '../type';

export function AvatarEditor({ name, avatarUrl, color, onResult }: AvatarEditorProps) {
  const { changeAvatar, removeAvatar } = useAccount();
  const themeClasses = useThemeClasses();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function run(action: () => Promise<void>, successMessage: string) {
    setIsBusy(true);

    try {
      await action();
      onResult({ message: successMessage, isError: false });
    } catch (error) {
      onResult({
        message: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.',
        isError: true,
      });
    } finally {
      setIsBusy(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    run(async () => changeAvatar(await prepareAvatarImage(file)), 'Foto atualizada.');
  }

  function handleAction(key: Key) {
    if (key === 'camera') cameraInputRef.current?.click();
    if (key === 'gallery') galleryInputRef.current?.click();
    if (key === 'remove') run(removeAvatar, 'Foto removida.');
  }

  return (
    <div>
      <Dropdown>
        <Dropdown.Trigger
          isDisabled={isBusy}
          aria-label="Alterar foto de perfil"
          className="relative rounded-full cursor-pointer disabled:cursor-not-allowed outline-none"
        >
          <ProfileAvatar name={name} avatarUrl={avatarUrl} color={color} />

          <span className="absolute bottom-1 right-1 flex p-1.5 rounded-full bg-indigo-600 text-white">
            <Pencil size={14} />
          </span>

          {isBusy && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white">
              <Loader2 size={28} className="animate-spin" />
            </span>
          )}
        </Dropdown.Trigger>

        <Dropdown.Popover placement="bottom start" className={`border ${themeClasses.popover}`}>
          <Dropdown.Menu aria-label="Foto de perfil" onAction={handleAction} className="p-1">
            <Dropdown.Item id="camera" textValue="Tirar foto" className="text-sm font-bold text-inherit!">
              <Camera size={16} />
              Tirar foto
            </Dropdown.Item>
            <Dropdown.Item id="gallery" textValue="Escolher da galeria" className="text-sm font-bold text-inherit!">
              <ImageIcon size={16} />
              Escolher da galeria
            </Dropdown.Item>
            {avatarUrl ? (
              <Dropdown.Item
                id="remove"
                textValue="Remover foto"
                variant="danger"
                className="text-sm font-bold text-rose-400!"
              >
                <Trash2 size={16} />
                Remover foto
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFile}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
