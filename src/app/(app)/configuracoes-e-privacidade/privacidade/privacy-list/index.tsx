'use client';

import { LinkCard } from '@/src/core/components/link-card';
import { PRIVACY_ROUTES } from '../constants';

export function PrivacyList() {
  return (
    <nav className="space-y-2">
      {PRIVACY_ROUTES.map((route) => (
        <LinkCard key={route.href} {...route} />
      ))}
    </nav>
  );
}
