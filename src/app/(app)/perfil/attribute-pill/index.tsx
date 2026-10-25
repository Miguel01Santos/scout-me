'use client';

import { Popover } from '@heroui/react';
import { useDarkMode } from '@/src/core/hooks/use-dark-mode';
import { AttributePillProps } from './type';

// Pílula com a sigla; o toque abre um balão com o nome completo. É Popover, e não Tooltip,
// porque tooltip não abre com toque no celular.
export function AttributePill({ label, short, full }: AttributePillProps) {
  const darkMode = useDarkMode();

  return (
    <Popover>
      <Popover.Trigger
        aria-label={`${label}: ${full}`}
        className={`cursor-pointer rounded-full border bg-transparent px-3 py-1 text-xs font-bold transition hover:opacity-80 ${
          // Borda e texto brancos no tema escuro; no claro, branco sumiria no fundo.
          darkMode ? 'border-white text-white' : 'border-slate-700 text-slate-700'
        }`}
      >
        {short}
      </Popover.Trigger>

      {/* O balão abre num portal, fora do AppShell, então as cores vão explícitas aqui. */}
      <Popover.Content
        placement="top"
        className={`border shadow-lg ${
          darkMode
            ? 'bg-slate-800 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <Popover.Dialog className="px-3 py-2">
          <Popover.Arrow className={darkMode ? '[&_svg]:fill-slate-800' : '[&_svg]:fill-white'} />
          <span className="block text-[10px] font-bold uppercase tracking-wide opacity-60">
            {label}
          </span>
          <span className="block text-xs font-bold">{full}</span>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
