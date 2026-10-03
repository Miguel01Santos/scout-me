import Link from 'next/link';
import { IconLinkButtonProps } from './type';

export function IconLinkButton({ href, label, children }: IconLinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex p-2 border rounded-xl hover:opacity-80 transition"
    >
      {children}
    </Link>
  );
}
