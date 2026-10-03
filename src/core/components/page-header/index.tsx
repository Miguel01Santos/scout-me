'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHeaderProps } from './type';

export function PageHeader({ title, action }: PageHeaderProps) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/home');
  }

  return (
    <header className="flex items-center justify-between pb-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="Voltar"
          className="p-2 border rounded-xl hover:opacity-80 transition cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-normal m-0">{title}</h1>
      </div>
      {action}
    </header>
  );
}
