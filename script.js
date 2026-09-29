/**
 * ==========================================================================
 * CALCULATRICE MODERNE & ÉLÉGANTE - MOTEUR JAVASCRIPT
 * ==========================================================================
 * Gestion des opérations mathématiques avec haute précision,
 * support des pourcentages, inversion de signe et ajustement dynamique d'affichage.
 */

class ModernCalculator {
  constructor() {
    // --- Éléments du DOM ---
    this.primaryDisplay = document.getElementById('primary-display');
    this.secondaryDisplay = document.getElementById('secondary-display');
    this.btnClear = document.getElementById('btn-clear');

    // --- État interne du Calculateur ---
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetScreen = false;
    this.isError = false;
    this.lastComputedFormula = '';

    // Initialisation
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    const keypad = document.querySelector('.keypad-grid');
    if (!keypad) return;

    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      const value = btn.dataset.value;
      const op = btn.dataset.op;

      this.handleAction(action, value, op);
    });

    // Écouteur pour le clavier physique
    window.addEventListener('keydown', (e) => this.handleKeyboardInput(e));
  }

  handleKeyboardInput(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key;

    if (key >= '0' && key <= '9') {
      this.handleAction('number', key, null);
      this.animateKeypress(`[data-value="${key}"]`);
    } else if (key === '.' || key === ',') {
      this.handleAction('decimal', null, null);
      this.animateKeypress('[data-action="decimal"]');
    } else if (key === '+') {
      this.handleAction('operation', null, '+');
      this.animateKeypress('[data-op="+"]');
    } else if (key === '-') {
      this.handleAction('operation', null, '−');
      this.animateKeypress('[data-op="−"]');
    } else if (key === '*') {
      this.handleAction('operation', null, '×');
      this.animateKeypress('[data-op="×"]');
    } else if (key === '/') {
      e.preventDefault();
      this.handleAction('operation', null, '÷');
      this.animateKeypress('[data-op="÷"]');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      this.handleAction('calculate', null, null);
      this.animateKeypress('.btn-equals');
    } else if (key === 'Backspace') {
      this.handleAction('backspace', null, null);
      this.animateKeypress('[data-action="backspace"]');
    } else if (key === 'Escape' || key === 'Delete') {
      this.handleAction('clear', null, null);
      this.animateKeypress('[data-action="clear"]');
    } else if (key === '%') {
      this.handleAction('percent', null, null);
      this.animateKeypress('[data-action="percent"]');
    }
  }

  animateKeypress(selector) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.classList.add('keyboard-active');
      setTimeout(() => btn.classList.remove('keyboard-active'), 140);
    }
  }


  handleAction(action, value, op) {
    if (this.isError && action !== 'clear') {
      this.clear();
    }

    switch (action) {
      case 'number':
        this.appendNumber(value);
        break;
      case 'decimal':
        this.appendDecimal();
        break;
      case 'operation':
        this.chooseOperation(op);
        break;
      case 'calculate':
        this.compute();
        break;
      case 'clear':
        this.clear();
        break;
      case 'backspace':
        this.deleteLast();
        break;
      case 'percent':
        this.applyPercent();
        break;
      case 'negate':
        this.toggleSign();
        break;
    }

    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentValue = '';
      this.shouldResetScreen = false;
    }

    const digitsOnly = this.currentValue.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 15 && this.currentValue !== '0') return;

    if (this.currentValue === '0' && number !== '.') {
      this.currentValue = number;
    } else {
      this.currentValue += number;
    }

    this.updateClearButtonText();
  }

  appendDecimal() {
    if (this.shouldResetScreen) {
      this.currentValue = '0';
      this.shouldResetScreen = false;
    }

    if (!this.currentValue.includes('.')) {
      this.currentValue = this.currentValue === '' ? '0.' : this.currentValue + '.';
    }

    this.updateClearButtonText();
  }

  chooseOperation(op) {
    if (this.currentValue === '' && this.previousValue === null) return;

    if (this.shouldResetScreen && this.operation) {
      this.operation = op;
      this.updateActiveOpButton();
      return;
    }

    if (this.previousValue !== null) {
      this.compute(false);
    } else {
      this.previousValue = this.currentValue;
    }

    this.operation = op;
    this.shouldResetScreen = true;
    this.updateActiveOpButton();
  }

  compute(isFinal = true) {
    if (this.operation === null || this.previousValue === null) return;

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    const formula = `${this.formatNumber(prev)} ${this.operation} ${this.formatNumber(current)}`;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '−':
      case '-':
        result = prev - current;
        break;
      case '×':
      case '*':
        result = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          this.triggerError('Division par zéro');
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    // Correction de la précision en virgule flottante IEEE 754 (évite 0.1 + 0.2 = 0.30000000000000004)
    result = this.roundPrecision(result);

    this.lastComputedFormula = `${formula} =`;
    this.currentValue = result.toString();
    this.previousValue = isFinal ? null : result.toString();
    this.operation = isFinal ? null : this.operation;
    this.shouldResetScreen = true;

    this.updateActiveOpButton();
    this.updateClearButtonText();
  }

  applyPercent() {
    let current = parseFloat(this.currentValue);
    if (isNaN(current)) return;

    if (this.previousValue !== null && this.operation !== null) {
      const prev = parseFloat(this.previousValue);
      if (this.operation === '+' || this.operation === '−' || this.operation === '-') {
        current = prev * (current / 100);
      } else {
        current = current / 100;
      }
    } else {
      current = current / 100;
    }

    this.currentValue = this.roundPrecision(current).toString();
    this.updateClearButtonText();
  }

  toggleSign() {
    if (this.currentValue === '0' || this.currentValue === '') return;

    if (this.currentValue.startsWith('-')) {
      this.currentValue = this.currentValue.slice(1);
    } else {
      this.currentValue = '-' + this.currentValue;
    }
  }

  deleteLast() {
    if (this.shouldResetScreen || this.isError) {
      this.clear();
      return;
    }

    if (this.currentValue.length === 1 || (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }

    this.updateClearButtonText();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetScreen = false;
    this.isError = false;
    this.lastComputedFormula = '';
    this.primaryDisplay.classList.remove('error-state');
    this.updateActiveOpButton();
    this.updateClearButtonText();
  }

  triggerError(message) {
    this.isError = true;
    this.currentValue = message;
    this.previousValue = null;
    this.operation = null;
    this.shouldResetScreen = true;
    this.primaryDisplay.classList.add('error-state');
    this.updateActiveOpButton();
  }

  roundPrecision(num) {
    if (isNaN(num)) return num;
    return parseFloat(Number(Math.round(num + 'e+12') + 'e-12').toFixed(12));
  }

  updateClearButtonText() {
    if (this.btnClear) {
      this.btnClear.textContent = (this.currentValue !== '0' && !this.shouldResetScreen) ? 'C' : 'AC';
    }
  }

  updateActiveOpButton() {
    const opButtons = document.querySelectorAll('.btn-op');
    opButtons.forEach((btn) => {
      if (this.operation && btn.dataset.op === this.operation && this.shouldResetScreen) {
        btn.classList.add('active-op');
      } else {
        btn.classList.remove('active-op');
      }
    });
  }

  updateDisplay() {
    if (this.isError) {
      this.primaryDisplay.textContent = this.currentValue;
      this.secondaryDisplay.innerHTML = '&nbsp;';
      return;
    }

    this.primaryDisplay.textContent = this.formatNumber(this.currentValue);

    // Ajustement dynamique de la taille de police pour les grands nombres
    const charCount = this.primaryDisplay.textContent.length;
    this.primaryDisplay.classList.remove('size-medium', 'size-small', 'size-tiny');

    if (charCount > 13) {
      this.primaryDisplay.classList.add('size-tiny');
    } else if (charCount > 9) {
      this.primaryDisplay.classList.add('size-small');
    } else if (charCount > 6) {
      this.primaryDisplay.classList.add('size-medium');
    }

    if (this.previousValue !== null && this.operation !== null) {
      this.secondaryDisplay.textContent = `${this.formatNumber(this.previousValue)} ${this.operation}`;
    } else if (this.lastComputedFormula !== '') {
      this.secondaryDisplay.textContent = this.lastComputedFormula;
    } else {
      this.secondaryDisplay.innerHTML = '&nbsp;';
    }
  }

  formatNumber(num) {
    if (typeof num === 'string' && (num === 'Division par zéro' || num === 'Erreur' || num === 'NaN')) {
      return num;
    }

    const stringNum = num.toString();
    const [integerPart, decimalPart] = stringNum.split('.');

    const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (decimalPart !== undefined) {
      return `${formattedInt},${decimalPart}`;
    }
    return formattedInt;
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.calculatorApp = new ModernCalculator();
});
