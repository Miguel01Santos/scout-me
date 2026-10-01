import { ReactNode } from 'react';
import { Header } from '@/src/core/components/header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-4">
        <Header />
      </div>
      {children}
    </>
  );
}
