import { ThemeClasses } from '@/src/core/hooks/use-theme-classes/type';
import { Talent } from '@/src/core/mocks/type';

export type Blueprint = Record<string, number>;


export interface TabProps {
  talents: Talent[];
  themeClasses: ThemeClasses;
}

export interface TacticalBlueprintTabProps extends TabProps {
  onSelectTalent: (talentId: string) => void;
}
