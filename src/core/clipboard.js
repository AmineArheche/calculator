/**
 * Clipboard Service with Toast Notification
 * Provides resilient copy capabilities with fallback for restricted environments.
 */

export class ClipboardService {
  constructor(toastElement = null) {
    this.toastElement = toastElement;
    this.toastTimeout = null;
  }

  setToastElement(el) {
    this.toastElement = el;
  }

  /**
   * Copies text to clipboard with feedback.
   * @param {string} text 
   * @returns {Promise<boolean>}
   */
  async copy(text) {
    if (!text || text === 'Cannot divide by zero' || text === 'Invalid calculation') {
      return false;
    }

    let success = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        success = this.fallbackCopy(text);
      }
    } else {
      success = this.fallbackCopy(text);
    }

    if (success) {
      this.showToast('Copié !');
    } else {
      this.showToast('Échec de la copie');
    }

    return success;
  }

  fallbackCopy(text) {
    if (typeof document === 'undefined') return false;

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (e) {
      return false;
    }
  }

  showToast(message, duration = 1800) {
    if (!this.toastElement) return;

    this.toastElement.textContent = message;
    this.toastElement.classList.add('show');

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.toastElement.classList.remove('show');
      this.toastTimeout = null;
    }, duration);
  }
}
