import { Language } from '../../enums/language';
import { Theme } from '../../enums/theme';

export interface Configuration {
  theme: Theme;
  language: Language;
  notifications: boolean;
}

export type UpdateConfigurationInput = Partial<Configuration>;
