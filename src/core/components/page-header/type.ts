import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  // Destino fixo do voltar, para quando a tela anterior no histórico não faz sentido.
  backHref?: string;
}
