/**
 * Accessibility Live Region Announcer
 * Delivers vocalized announcements for screen reader users on key calculation events.
 */

export class A11yAnnouncer {
  constructor(containerId = 'a11y-announcements') {
    this.containerId = containerId;
    this.element = this.getOrCreateElement();
  }

  getOrCreateElement() {
    if (typeof document === 'undefined') return null;
    let el = document.getElementById(this.containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = this.containerId;
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.style.position = 'absolute';
      el.style.width = '1px';
      el.style.height = '1px';
      el.style.padding = '0';
      el.style.margin = '-1px';
      el.style.overflow = 'hidden';
      el.style.clip = 'rect(0, 0, 0, 0)';
      el.style.whiteSpace = 'nowrap';
      el.style.border = '0';
      document.body.appendChild(el);
    }
    return el;
  }

  announce(message, priority = 'polite') {
    if (!this.element && typeof document !== 'undefined') {
      this.element = this.getOrCreateElement();
    }
    if (!this.element) return;

    this.element.setAttribute('aria-live', priority);
    // Clear and set timeout for screen reader trigger
    this.element.textContent = '';
    setTimeout(() => {
      if (this.element) this.element.textContent = message;
    }, 50);
  }

  announceCalculation(formula, result) {
    this.announce(`Résultat du calcul ${formula} : ${result}`);
  }

  announceClear() {
    this.announce('Affichage réinitialisé à zéro');
  }

  announceError(errorMessage) {
    this.announce(`Erreur de calcul : ${errorMessage}`, 'assertive');
  }
}
