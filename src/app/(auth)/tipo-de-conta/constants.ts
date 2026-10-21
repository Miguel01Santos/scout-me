import { Binoculars, Shirt, Trophy, Users } from 'lucide-react';
import { AccountType } from '@/src/core/enums/account-type';
import { Language } from '@/src/core/enums/language';
import { AccountTypeOption, PlanLabel } from './type';

// As descrições respondem à pergunta da tela: "O que você quer fazer no ScoutMe PRO?".
export const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    type: AccountType.PLAYER,
    icon: Shirt,
    description: 'Divulgar minhas atividades e acompanhar quem interage com o meu perfil.',
  },
  {
    type: AccountType.SCOUT,
    icon: Binoculars,
    description: 'Monitorar atletas, comparar desempenhos e encontrar novas promessas.',
  },
  {
    type: AccountType.TEAM,
    icon: Users,
    description:
      'Cadastrar meus atletas, agendar treinos e inscrever o time em competições da região.',
  },
  {
    type: AccountType.ORGANIZATION,
    icon: Trophy,
    description: 'Organizar competições e torneios e ranquear os atletas do ScoutMe PRO.',
  },
];

// A fita segue o idioma da conta, que já existe nesse ponto (o padrão de conta nova é pt).
export const PLAN_LABEL: Record<Language, PlanLabel> = {
  [Language.PT]: { free: 'Grátis', paid: 'Pago' },
  [Language.EN]: { free: 'Free', paid: 'Buy' },
  [Language.ES]: { free: 'Gratis', paid: 'De pago' },
};
