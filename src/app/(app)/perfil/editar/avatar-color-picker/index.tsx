'use client';

import {
  AVATAR_COLOR_NAME,
  AVATAR_COLOR_STYLE,
  AvatarColor,
} from '@/src/core/enums/avatar-color';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { AvatarColorPickerProps } from '../type';

const BUTTON_CLASS_NAME = 'w-full aspect-square rounded-full cursor-pointer transition';

export function AvatarColorPicker({ value, onChange }: AvatarColorPickerProps) {
  const themeClasses = useThemeClasses();

  return (
    <div>
      <p className="block text-[10px] uppercase font-bold mb-2 text-slate-400">Cor do avatar</p>
      <div className="grid grid-cols-9 gap-2 p-1" role="radiogroup" aria-label="Cor do avatar">
        <button
          type="button"
          role="radio"
          aria-checked={value === null}
          aria-label="Padrão"
          onClick={() => onChange(null)}
          className={`${BUTTON_CLASS_NAME} border ${themeClasses.skeleton} ${
            value === null ? 'outline-2 outline-offset-2' : ''
          }`}
        />
        {Object.values(AvatarColor).map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={value === color}
            aria-label={AVATAR_COLOR_NAME[color]}
            onClick={() => onChange(color)}
            style={{ backgroundColor: AVATAR_COLOR_STYLE[color].background }}
            className={`${BUTTON_CLASS_NAME} ${value === color ? 'outline-2 outline-offset-2' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
