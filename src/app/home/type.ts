import { Talent } from '@/src/core/mocks/type';

export type Blueprint = Record<string, number>;

export interface ThemeClasses {
  bg: string;
  card: string;
  cardHover: string;
  subText: string;
}

export interface TabProps {
  talents: Talent[];
  themeClasses: ThemeClasses;
}

export interface TacticalBlueprintTabProps extends TabProps {
  onSelectTalent: (talentId: string) => void;
}
