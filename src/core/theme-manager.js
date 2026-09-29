/**
 * Theme Manager Service
 * Manages color schemes, dark/light themes, OLED mode, and persists user preference.
 */

export const AVAILABLE_THEMES = [
  { id: 'theme-nebula', name: 'Dark Nebula', icon: '🌌' },
  { id: 'theme-oled', name: 'OLED Pure Black', icon: '🖤' },
  { id: 'theme-cyberpunk', name: 'Cyberpunk Neon', icon: '⚡' },
  { id: 'theme-frost', name: 'Frost Light', icon: '❄️' },
];

export class ThemeManager {
  constructor(storageKey = 'calc_theme_preference') {
    this.storageKey = storageKey;
    this.currentTheme = this.loadTheme();
  }

  init() {
    this.applyTheme(this.currentTheme);
  }

  loadTheme() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(this.storageKey);
        if (saved && AVAILABLE_THEMES.some((t) => t.id === saved)) {
          return saved;
        }
      }
    } catch (e) {}
    return 'theme-nebula';
  }

  setTheme(themeId) {
    if (!AVAILABLE_THEMES.some((t) => t.id === themeId)) return;
    this.currentTheme = themeId;
    this.applyTheme(themeId);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, themeId);
      }
    } catch (e) {}
  }

  cycleNextTheme() {
    const currentIndex = AVAILABLE_THEMES.findIndex((t) => t.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % AVAILABLE_THEMES.length;
    const nextTheme = AVAILABLE_THEMES[nextIndex];
    this.setTheme(nextTheme.id);
    return nextTheme;
  }

  applyTheme(themeId) {
    if (typeof document === 'undefined') return;
    AVAILABLE_THEMES.forEach((t) => document.documentElement.classList.remove(t.id));
    document.documentElement.classList.add(themeId);
  }

  getCurrentThemeDetails() {
    return AVAILABLE_THEMES.find((t) => t.id === this.currentTheme) || AVAILABLE_THEMES[0];
  }
}
