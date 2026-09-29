/**
 * Keyboard Handler for Physical Typing Support
 * Maps hardware keyboard events to calculator state actions with visual & auditory feedback.
 */

export class KeyboardHandler {
  /**
   * @param {import('./calculator-state.js').CalculatorStateMachine} stateMachine 
   * @param {import('./audio-engine.js').AudioEngine} audioEngine 
   * @param {HTMLElement} rootContainer 
   */
  constructor(stateMachine, audioEngine = null, rootContainer = null) {
    this.stateMachine = stateMachine;
    this.audioEngine = audioEngine;
    this.rootContainer = rootContainer;
    this.boundHandler = this.handleKeyDown.bind(this);
    this.attached = false;
  }

  attach() {
    if (!this.attached && typeof window !== 'undefined') {
      window.addEventListener('keydown', this.boundHandler);
      this.attached = true;
    }
  }

  detach() {
    if (this.attached && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.boundHandler);
      this.attached = false;
    }
  }

  handleKeyDown(e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }

    if (typeof document !== 'undefined') {
      const learnContainer = document.getElementById('learn-container');
      const isLabActive = learnContainer && learnContainer.classList.contains('active');

      if (isLabActive) {
        if (e.key === 'Escape') {
          const toggleBtn = document.getElementById('btn-learn-mode-toggle');
          if (toggleBtn) {
            toggleBtn.click();
            e.preventDefault();
          }
        }
        return;
      }
    }

    const key = e.key;
    let buttonSelector = null;

    if (key >= '0' && key <= '9') {
      this.stateMachine.inputDigit(key);
      buttonSelector = `[data-value="${key}"]`;
    } else if (key === '.' || key === ',') {
      this.stateMachine.inputDecimal();
      buttonSelector = '[data-action="decimal"]';
    } else if (key === '+') {
      this.stateMachine.setOperation('+');
      buttonSelector = '[data-op="+"]';
    } else if (key === '-') {
      this.stateMachine.setOperation('−');
      buttonSelector = '[data-op="−"]';
    } else if (key === '*') {
      this.stateMachine.setOperation('×');
      buttonSelector = '[data-op="×"]';
    } else if (key === '/') {
      e.preventDefault(); // Prevent browser search shortcut
      this.stateMachine.setOperation('÷');
      buttonSelector = '[data-op="÷"]';
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      this.stateMachine.calculate();
      buttonSelector = '.btn-equals';
    } else if (key === 'Backspace') {
      this.stateMachine.backspace();
      buttonSelector = '[data-action="backspace"]';
    } else if (key === 'Escape' || key === 'Delete') {
      this.stateMachine.clear();
      buttonSelector = '[data-action="clear"]';
    } else if (key === '%') {
      this.stateMachine.applyPercent();
      buttonSelector = '[data-action="percent"]';
    }

    if (buttonSelector) {
      this.triggerVisualFeedback(buttonSelector);
      if (this.audioEngine) {
        this.audioEngine.play('click');
      }
    }
  }

  triggerVisualFeedback(selector) {
    if (typeof document === 'undefined') return;
    const btn = document.querySelector(selector);
    if (btn) {
      btn.classList.add('keyboard-active');
      setTimeout(() => btn.classList.remove('keyboard-active'), 140);
    }
  }
}
