import { Theme } from '../../enums/theme';

const THEME_CACHE_KEY = 'scoutme.theme';

// Guarda o último tema conhecido para pintar a primeira tela já no tema certo,
// antes de a conta chegar do banco. A fonte da verdade continua sendo o banco.
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
    // Sem storage disponível (modo privado, por exemplo): o app só perde o cache.
  }
}

export function clearCachedTheme() {
  try {
    localStorage.removeItem(THEME_CACHE_KEY);
  } catch {
    // Mesmo caso do saveCachedTheme.
  }
}

export function subscribeToCachedTheme(onChange: () => void) {
  window.addEventListener('storage', onChange);

  return () => window.removeEventListener('storage', onChange);
}
