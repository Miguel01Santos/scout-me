import { Theme } from '../../enums/theme';

const THEME_CACHE_KEY = 'scoutme.theme';

export function getCachedTheme(): Theme | null {
  try {
    const cachedTheme = localStorage.getItem(THEME_CACHE_KEY);
    const themes: string[] = Object.values(Theme);

    return cachedTheme && themes.includes(cachedTheme) ? (cachedTheme as Theme) : null;
  } catch {
    return null;
  }
}

export function saveCachedTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_CACHE_KEY, theme);
  } catch {
    return;
  }
}

export function clearCachedTheme() {
  try {
    localStorage.removeItem(THEME_CACHE_KEY);
  } catch {
    return;
  }
}

export function subscribeToCachedTheme(onChange: () => void) {
  window.addEventListener('storage', onChange);

  return () => window.removeEventListener('storage', onChange);
}
