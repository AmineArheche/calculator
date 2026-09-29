/**
 * ==========================================================================
 * CALCULATRICE MODERNE & ÉLÉGANTE - MOTEUR JAVASCRIPT
 * ==========================================================================
 * Gestion des opérations mathématiques de base, affichage dual et machine à états.
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

    this.lastComputedFormula = `${formula} =`;
    this.currentValue = result.toString();
    this.previousValue = isFinal ? null : result.toString();
    this.operation = isFinal ? null : this.operation;
    this.shouldResetScreen = true;

    this.updateActiveOpButton();
    this.updateClearButtonText();
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

  triggerError(msg) {
    this.isError = true;
    this.currentValue = msg;
    this.previousValue = null;
    this.operation = null;
    this.shouldResetScreen = true;
    this.primaryDisplay.classList.add('error-state');
  }

  updateClearButtonText() {
    if (this.btnClear) {
      this.btnClear.textContent = (this.currentValue !== '0' || this.isError) ? 'C' : 'AC';
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

    // Affichage de la ligne secondaire (formule)
    if (this.previousValue !== null && this.operation !== null) {
      this.secondaryDisplay.textContent = `${this.formatDisplayString(this.previousValue)} ${this.operation}`;
    } else if (this.lastComputedFormula) {
      this.secondaryDisplay.textContent = this.lastComputedFormula;
    } else {
      this.secondaryDisplay.innerHTML = '&nbsp;';
    }

    // Affichage principal
    this.primaryDisplay.textContent = this.formatDisplayString(this.currentValue);
  }

  formatDisplayString(valStr) {
    if (!valStr && valStr !== '0') return '0';
    if (valStr === '-') return '-';

    const parts = valStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : null;

    let formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (decimalPart !== null) {
      return `${formattedInt},${decimalPart}`;
    }
    return formattedInt;
  }

  formatNumber(num) {
    return this.formatDisplayString(num.toString());
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.calculatorApp = new ModernCalculator();
});
