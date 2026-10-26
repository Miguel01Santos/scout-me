'use client';

import { Lock } from 'lucide-react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { PrivateProfileNoticeProps } from './type';

export function PrivateProfileNotice({ isRequestPending }: PrivateProfileNoticeProps) {
  const themeClasses = useThemeClasses();

  return (
    <div className={`flex items-center gap-3 p-4 border rounded-2xl ${themeClasses.card}`}>
      <Lock size={18} className="shrink-0" />
      <div className="space-y-0.5">
        <p className="text-sm font-bold">Esta conta é privada</p>
        <p className={`text-xs ${themeClasses.subText}`}>
          {isRequestPending
            ? 'Pedido enviado. Quando for aprovado, você vê a descrição e os atributos.'
            : 'Siga para ver a descrição e os atributos.'}
        </p>
      </div>
    </div>
  );
}
