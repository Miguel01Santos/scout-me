import { FileText, KeyRound } from 'lucide-react';
import { SettingsRoute } from '../type';

export const PRIVACY_ROUTES: SettingsRoute[] = [
  { label: 'Redefinir minha senha', href: '/redefinir-senha', icon: KeyRound },
  {
    label: 'Política de privacidade',
    href: '/configuracoes-e-privacidade/privacidade/politica-de-privacidade',
    icon: FileText,
  },
];
