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
    this.historyDrawer = document.getElementById('history-drawer');
    this.historyList = document.getElementById('history-list');
    this.historyBadge = document.getElementById('history-badge');
    this.btnHistoryToggle = document.getElementById('btn-history-toggle');
    this.btnCloseHistory = document.getElementById('btn-close-history');
    this.btnClearHistory = document.getElementById('btn-clear-history');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.iconSoundOn = this.btnSoundToggle ? this.btnSoundToggle.querySelector('.icon-sound-on') : null;
    this.iconSoundOff = this.btnSoundToggle ? this.btnSoundToggle.querySelector('.icon-sound-off') : null;

    // --- État interne du Calculateur ---
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetScreen = false;
    this.isError = false;
    this.lastComputedFormula = '';

    // --- Historique & Paramètres ---
    this.history = JSON.parse(localStorage.getItem('calc_history') || '[]');
    this.soundEnabled = localStorage.getItem('calc_sound') !== 'false';
    this.audioCtx = null;

    // Initialisation
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateDisplay();
    this.renderHistory();
    this.updateSoundIcon();
  }

  bindEvents() {
    const keypad = document.querySelector('.keypad-grid');
    if (!keypad) return;

    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      this.playSound('click');
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      const op = btn.dataset.op;

      this.handleAction(action, value, op);
    });

    // Toggle Son
    if (this.btnSoundToggle) {
      this.btnSoundToggle.addEventListener('click', () => this.toggleSound());
    }

    // Écouteur pour le clavier physique
    window.addEventListener('keydown', (e) => this.handleKeyboardInput(e));

    // Tiroir d'historique
    if (this.btnHistoryToggle) {
      this.btnHistoryToggle.addEventListener('click', () => this.toggleHistory(true));
    }
    if (this.btnCloseHistory) {
      this.btnCloseHistory.addEventListener('click', () => this.toggleHistory(false));
    }
    if (this.btnClearHistory) {
      this.btnClearHistory.addEventListener('click', () => this.clearHistory());
    }

    // Clic sur un élément de l'historique pour réutiliser la valeur
    if (this.historyList) {
      this.historyList.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (!item) return;

        const resultVal = item.dataset.result;
        if (resultVal) {
          this.currentValue = resultVal;
          this.shouldResetScreen = true;
          this.updateDisplay();
          this.toggleHistory(false);
        }
      });
    }

    // Fermer l'historique en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (this.historyDrawer &&
          this.historyDrawer.classList.contains('open') &&
          !this.historyDrawer.contains(e.target) &&
          !this.btnHistoryToggle.contains(e.target)) {
        this.toggleHistory(false);
      }
    });
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
      this.playSound('click');
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

    if (isFinal) {
      this.addToHistory(formula, this.formatNumber(result));
      this.playSound('success');
    }

    this.updateActiveOpButton();
    this.updateClearButtonText();
  }

  toggleHistory(open) {
    if (!this.historyDrawer) return;
    if (open) {
      this.historyDrawer.classList.add('open');
      this.historyDrawer.setAttribute('aria-hidden', 'false');
    } else {
      this.historyDrawer.classList.remove('open');
      this.historyDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  addToHistory(expression, result) {
    const item = {
      id: Date.now(),
      expression: expression,
      result: result,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.history.unshift(item);
    if (this.history.length > 30) this.history.pop();

    localStorage.setItem('calc_history', JSON.stringify(this.history));
    this.renderHistory();
  }

  renderHistory() {
    if (!this.historyBadge || !this.historyList) return;

    const count = this.history.length;
    this.historyBadge.textContent = count;
    if (count > 0) {
      this.historyBadge.classList.add('visible');
    } else {
      this.historyBadge.classList.remove('visible');
    }

    if (count === 0) {
      this.historyList.innerHTML = `
        <div class="history-empty">
          <p>Aucun calcul récent</p>
          <span>Vos opérations terminées apparaîtront ici.</span>
        </div>
      `;
      return;
    }

    this.historyList.innerHTML = this.history.map(item => `
      <div class="history-item" data-id="${item.id}" data-result="${item.result.replace(/\\s/g, '').replace(',', '.')}" title="Cliquer pour réutiliser ce résultat">
        <span class="history-item-time">${item.date}</span>
        <span class="history-item-exp">${item.expression} =</span>
        <span class="history-item-res">${item.result}</span>
      </div>
    `).join('');
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem('calc_history');
    this.renderHistory();
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
    this.playSound('error');
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

  /**
   * Effets sonores synthétisés avec Web Audio API
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('calc_sound', this.soundEnabled.toString());
    this.updateSoundIcon();
  }

  updateSoundIcon() {
    if (!this.iconSoundOn || !this.iconSoundOff) return;
    if (this.soundEnabled) {
      this.iconSoundOn.classList.remove('hidden');
      this.iconSoundOff.classList.add('hidden');
    } else {
      this.iconSoundOn.classList.add('hidden');
      this.iconSoundOff.classList.remove('hidden');
    }
  }

  playSound(type = 'click') {
    if (!this.soundEnabled) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // Ignorer si bloqué par les stratégies du navigateur
    }
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.calculatorApp = new ModernCalculator();
});
