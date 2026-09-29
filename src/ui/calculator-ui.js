/**
 * Calculator UI Presentation Controller
 * Mediates between DOM elements, core state machine, and service modules.
 */

import { formatNumberForDisplay } from '../core/math-engine.js';
import { DisplayController } from './display.js';
import { KeyboardHandler } from '../core/keyboard-handler.js';

export class CalculatorUI {
  constructor(stateMachine, historyStore, audioEngine, clipboardService) {
    this.stateMachine = stateMachine;
    this.historyStore = historyStore;
    this.audioEngine = audioEngine;
    this.clipboardService = clipboardService;

    // Grab DOM elements
    this.card = document.getElementById('calculator');
    this.primaryDisplay = document.getElementById('primary-display');
    this.secondaryDisplay = document.getElementById('secondary-display');
    this.btnClear = document.getElementById('btn-clear');
    this.keypad = document.querySelector('.keypad-grid');

    // Header actions
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.iconSoundOn = this.btnSoundToggle?.querySelector('.icon-sound-on');
    this.iconSoundOff = this.btnSoundToggle?.querySelector('.icon-sound-off');
    this.btnCopyResult = document.getElementById('btn-copy-result');
    this.toastMessage = document.getElementById('toast-message');

    // History elements
    this.btnHistoryToggle = document.getElementById('btn-history-toggle');
    this.historyBadge = document.getElementById('history-badge');
    this.historyDrawer = document.getElementById('history-drawer');
    this.btnCloseHistory = document.getElementById('btn-close-history');
    this.btnClearHistory = document.getElementById('btn-clear-history');
    this.historyList = document.getElementById('history-list');

    // Sub-controllers
    this.displayController = new DisplayController(this.primaryDisplay, this.secondaryDisplay);
    this.keyboardHandler = new KeyboardHandler(this.stateMachine, this.audioEngine, this.card);

    if (this.clipboardService && this.toastMessage) {
      this.clipboardService.setToastElement(this.toastMessage);
    }
  }

  init() {
    this.bindEvents();
    this.keyboardHandler.attach();

    // Subscribe to state changes
    this.stateMachine.subscribe((snapshot) => this.onStateChange(snapshot));

    // Subscribe to completed calculations -> record into history and play chime
    this.stateMachine.onCalculationComplete(({ expression, result }) => {
      this.historyStore.addEntry(expression, result);
      this.audioEngine.play('success');
    });

    // Subscribe to history changes -> render history drawer
    this.historyStore.subscribe((items) => this.renderHistory(items));

    // Subscribe to audio state -> update sound icon
    this.audioEngine.subscribe((enabled) => this.updateSoundIcon(enabled));
  }

  bindEvents() {
    // Keypad clicks delegation
    if (this.keypad) {
      this.keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        this.audioEngine.play('click');
        const action = btn.dataset.action;
        const value = btn.dataset.value;
        const op = btn.dataset.op;

        this.handleButtonAction(action, value, op);
      });
    }

    // Sound toggle
    if (this.btnSoundToggle) {
      this.btnSoundToggle.addEventListener('click', () => {
        const enabled = this.audioEngine.toggle();
        this.clipboardService.showToast(enabled ? 'Son activé' : 'Son désactivé');
      });
    }

    // Copy result
    if (this.btnCopyResult) {
      this.btnCopyResult.addEventListener('click', () => this.triggerCopy());
    }
    if (this.primaryDisplay) {
      this.primaryDisplay.addEventListener('click', () => this.triggerCopy());
    }

    // History drawer toggle
    if (this.btnHistoryToggle) {
      this.btnHistoryToggle.addEventListener('click', () => this.setHistoryDrawerOpen(true));
    }
    if (this.btnCloseHistory) {
      this.btnCloseHistory.addEventListener('click', () => this.setHistoryDrawerOpen(false));
    }
    if (this.btnClearHistory) {
      this.btnClearHistory.addEventListener('click', () => {
        this.historyStore.clear();
        this.audioEngine.play('click');
      });
    }

    // History item restore
    if (this.historyList) {
      this.historyList.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.history-item');
        if (!itemEl) return;

        const result = itemEl.dataset.result;
        if (result !== undefined) {
          this.stateMachine.restoreValue(result);
          this.setHistoryDrawerOpen(false);
          this.audioEngine.play('click');
        }
      });
    }

    // Close drawer when clicking backdrop outside
    document.addEventListener('click', (e) => {
      if (
        this.historyDrawer &&
        this.historyDrawer.classList.contains('open') &&
        !this.historyDrawer.contains(e.target) &&
        !this.btnHistoryToggle?.contains(e.target)
      ) {
        this.setHistoryDrawerOpen(false);
      }
    });
  }

  handleButtonAction(action, value, op) {
    switch (action) {
      case 'number':
        this.stateMachine.inputDigit(value);
        break;
      case 'decimal':
        this.stateMachine.inputDecimal();
        break;
      case 'operation':
        this.stateMachine.setOperation(op);
        break;
      case 'calculate':
        this.stateMachine.calculate();
        break;
      case 'clear':
        this.stateMachine.clear();
        break;
      case 'backspace':
        this.stateMachine.backspace();
        break;
      case 'percent':
        this.stateMachine.applyPercent();
        break;
      case 'negate':
        this.stateMachine.toggleSign();
        break;
    }
  }

  onStateChange(snapshot) {
    this.displayController.update(snapshot);
    this.updateActiveOperation(snapshot.operation);
    this.updateClearButton(snapshot.canClearAll);

    if (snapshot.isError) {
      this.audioEngine.play('error');
    }
  }

  updateActiveOperation(currentOp) {
    const opButtons = this.keypad?.querySelectorAll('.btn-op') || [];
    opButtons.forEach((btn) => {
      if (currentOp && btn.dataset.op === currentOp) {
        btn.classList.add('active-op');
      } else {
        btn.classList.remove('active-op');
      }
    });
  }

  updateClearButton(canClearAll) {
    if (this.btnClear) {
      this.btnClear.textContent = canClearAll ? 'AC' : 'C';
    }
  }

  setHistoryDrawerOpen(isOpen) {
    if (!this.historyDrawer) return;
    if (isOpen) {
      this.historyDrawer.classList.add('open');
      this.historyDrawer.setAttribute('aria-hidden', 'false');
    } else {
      this.historyDrawer.classList.remove('open');
      this.historyDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  renderHistory(items) {
    const count = items.length;
    if (this.historyBadge) {
      this.historyBadge.textContent = count;
      if (count > 0) {
        this.historyBadge.classList.add('visible');
      } else {
        this.historyBadge.classList.remove('visible');
      }
    }

    if (!this.historyList) return;

    if (count === 0) {
      this.historyList.innerHTML = `
        <div class="history-empty">
          <p>Aucun calcul récent</p>
          <span>Vos opérations terminées apparaîtront ici.</span>
        </div>
      `;
      return;
    }

    this.historyList.innerHTML = items.map((item) => `
      <div class="history-item" data-id="${item.id}" data-result="${item.result}" title="Cliquer pour réutiliser ce résultat">
        <span class="history-item-time">${item.timestamp}</span>
        <span class="history-item-exp">${item.expression} =</span>
        <span class="history-item-res">${formatNumberForDisplay(item.result)}</span>
      </div>
    `).join('');
  }

  updateSoundIcon(enabled) {
    if (!this.iconSoundOn || !this.iconSoundOff) return;
    if (enabled) {
      this.iconSoundOn.classList.remove('hidden');
      this.iconSoundOff.classList.add('hidden');
    } else {
      this.iconSoundOn.classList.add('hidden');
      this.iconSoundOff.classList.remove('hidden');
    }
  }

  triggerCopy() {
    const snapshot = this.stateMachine.getStateSnapshot();
    if (!snapshot.isError) {
      this.clipboardService.copy(snapshot.currentValue);
      this.audioEngine.play('click');
    }
  }
}
