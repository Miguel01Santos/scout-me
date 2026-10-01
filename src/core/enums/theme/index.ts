export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const THEME_NAME: Record<Theme, string> = {
  [Theme.LIGHT]: 'Claro',
  [Theme.DARK]: 'Escuro',
  [Theme.SYSTEM]: 'Sistema',
};
