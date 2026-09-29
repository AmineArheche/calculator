import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeManager, AVAILABLE_THEMES } from '../src/core/theme-manager.js';

describe('ThemeManager Service', () => {
  let themeManager;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    themeManager = new ThemeManager('test_theme_key');
  });

  it('initializes with default Nebula theme when no preference stored', () => {
    themeManager.init();
    expect(themeManager.currentTheme).toBe('theme-nebula');
    expect(document.documentElement.classList.contains('theme-nebula')).toBe(true);
  });

  it('cycles across all available themes sequentially', () => {
    const first = themeManager.cycleNextTheme();
    expect(first.id).toBe('theme-oled');
    expect(document.documentElement.classList.contains('theme-oled')).toBe(true);

    const second = themeManager.cycleNextTheme();
    expect(second.id).toBe('theme-cyberpunk');
    expect(document.documentElement.classList.contains('theme-cyberpunk')).toBe(true);
    expect(document.documentElement.classList.contains('theme-oled')).toBe(false);

    const third = themeManager.cycleNextTheme();
    expect(third.id).toBe('theme-frost');

    const loopBack = themeManager.cycleNextTheme();
    expect(loopBack.id).toBe('theme-nebula');
  });

  it('persists theme preference to localStorage', () => {
    themeManager.setTheme('theme-cyberpunk');
    expect(localStorage.getItem('test_theme_key')).toBe('theme-cyberpunk');

    const freshManager = new ThemeManager('test_theme_key');
    expect(freshManager.currentTheme).toBe('theme-cyberpunk');
  });
});
