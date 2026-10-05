import { LucideIcon } from 'lucide-react';

export interface HeaderNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface HeaderNavProps {
  items: HeaderNavItem[];
}
