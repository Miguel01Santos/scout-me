'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HeaderNavProps } from './type';

const BUTTON_SIZE = 35;
const GAP = 10;

const BADGE_MAX = 9;

export function HeaderNav({ items, badges }: HeaderNavProps) {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => item.href === pathname);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [labelWidths, setLabelWidths] = useState<number[]>([]);
  const [animated, setAnimated] = useState(false);

  useLayoutEffect(() => {
    const measure = () =>
      setLabelWidths(items.map((_, index) => labelRefs.current[index]?.offsetWidth ?? 0));

    measure();
    document.fonts?.ready.then(measure);
  }, [items]);

  // Só liga a transição depois da 1ª medição, para o fundo não deslizar do zero ao abrir o app.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const hasIndicator = activeIndex >= 0 && labelWidths.length > 0;
  const indicatorLeft = activeIndex * (BUTTON_SIZE + GAP);
  const indicatorWidth = BUTTON_SIZE + (labelWidths[activeIndex] ?? 0);

  return (
    <nav className="relative flex items-center" style={{ gap: GAP }}>
      <span
        aria-hidden
        className={`absolute top-0 rounded-full bg-indigo-600 motion-reduce:transition-none ${
          animated ? 'transition-[left,width,opacity] duration-300 ease-out' : ''
        }`}
        style={{
          height: BUTTON_SIZE,
          left: hasIndicator ? indicatorLeft : 0,
          width: hasIndicator ? indicatorWidth : BUTTON_SIZE,
          opacity: hasIndicator ? 1 : 0,
        }}
      />

      {items.map(({ href, label, icon: Icon }, index) => {
        const isActive = index === activeIndex;
        const badgeCount = badges?.[href] ?? 0;

        return (
          <Link
            key={href}
            href={href}
            aria-label={badgeCount > 0 ? `${label} (${badgeCount} novas)` : label}
            aria-current={isActive ? 'page' : undefined}
            className={`relative z-10 flex items-center rounded-full transition-colors duration-300 motion-reduce:transition-none ${
              isActive ? 'text-white' : 'hover:opacity-80'
            }`}
            style={{ height: BUTTON_SIZE, paddingInline: (BUTTON_SIZE - 18) / 2 }}
          >
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            <span
              aria-hidden
              className="block overflow-hidden whitespace-nowrap motion-reduce:transition-none transition-[max-width,opacity] duration-300 ease-out"
              style={{
                maxWidth: isActive ? labelWidths[index] ?? 0 : 0,
                opacity: isActive ? 1 : 0,
              }}
            >
              <span
                ref={(element) => {
                  labelRefs.current[index] = element;
                }}
                className="inline-block pl-1.5 text-xs font-bold"
              >
                {label}
              </span>
            </span>
            {badgeCount > 0 &&
              (isActive ? (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-500 px-1 text-center text-[10px] font-bold leading-4 text-white">
                  {badgeCount > BADGE_MAX ? `${BADGE_MAX}+` : badgeCount}
                </span>
              ) : (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500" />
              ))}
          </Link>
        );
      })}
    </nav>
  );
}
