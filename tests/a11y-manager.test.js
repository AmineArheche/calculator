import { describe, it, expect, beforeEach } from 'vitest';
import { A11yAnnouncer } from '../src/ui/a11y-manager.js';

describe('A11yAnnouncer Service', () => {
  let announcer;

  beforeEach(() => {
    document.body.innerHTML = '';
    announcer = new A11yAnnouncer('test-a11y');
  });

  it('creates an accessible hidden live region element in the DOM', () => {
    const el = document.getElementById('test-a11y');
    expect(el).not.toBeNull();
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });

  it('formats calculation announcements cleanly', async () => {
    announcer.announceCalculation('25 + 17', '42');
    await new Promise((resolve) => setTimeout(resolve, 80));
    const el = document.getElementById('test-a11y');
    expect(el.textContent).toBe('Résultat du calcul 25 + 17 : 42');
  });

  it('announces errors assertively for immediate reader notification', async () => {
    announcer.announceError('Division par zéro');
    await new Promise((resolve) => setTimeout(resolve, 80));
    const el = document.getElementById('test-a11y');
    expect(el.getAttribute('aria-live')).toBe('assertive');
    expect(el.textContent).toContain('Erreur');
  });
});
