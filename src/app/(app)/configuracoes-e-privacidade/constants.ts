import { Palette, UserRound } from 'lucide-react';
import { SettingsRoute } from './type';

export const SETTINGS_ROUTES: SettingsRoute[] = [
  { label: 'Tema', href: '/configuracoes-e-privacidade/tema', icon: Palette },
  { label: 'Conta', href: '/configuracoes-e-privacidade/conta', icon: UserRound },
];
