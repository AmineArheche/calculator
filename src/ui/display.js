/**
 * Display Controller for Dual-Line Screen
 * Manages typography auto-scaling, number formatting, and expression visualization.
 */

import { formatNumberForDisplay } from '../core/math-engine.js';

export class DisplayController {
  /**
   * @param {HTMLElement} primaryDisplayEl 
   * @param {HTMLElement} secondaryDisplayEl 
   */
  constructor(primaryDisplayEl, secondaryDisplayEl) {
    this.primaryDisplay = primaryDisplayEl;
    this.secondaryDisplay = secondaryDisplayEl;
  }

  /**
   * Updates screen based on state machine snapshot.
   * @param {import('../core/calculator-state.js').CalculatorStateSnapshot} stateSnapshot 
   */
  update(stateSnapshot) {
    if (!this.primaryDisplay || !this.secondaryDisplay) return;

    const { currentValue, previousValue, operation, formula, isError, errorMessage } = stateSnapshot;

    // Handle Error State
    if (isError) {
      this.primaryDisplay.textContent = errorMessage || 'Error';
      this.primaryDisplay.classList.add('error-state');
      this.secondaryDisplay.innerHTML = '&nbsp;';
      this.adjustFontSize(this.primaryDisplay.textContent.length);
      return;
    }

    this.primaryDisplay.classList.remove('error-state');

    // Format primary display number
    const formattedValue = formatNumberForDisplay(currentValue);
    this.primaryDisplay.textContent = formattedValue;
    this.adjustFontSize(formattedValue.length);

    // Format secondary display expression
    if (previousValue !== null && operation !== null) {
      const formattedPrev = formatNumberForDisplay(previousValue);
      this.secondaryDisplay.textContent = `${formattedPrev} ${operation}`;
    } else if (formula) {
      this.secondaryDisplay.textContent = formula;
    } else {
      this.secondaryDisplay.innerHTML = '&nbsp;';
    }
  }

  /**
   * Adjusts font size classes to prevent number truncation.
   * @param {number} length 
   */
  adjustFontSize(length) {
    this.primaryDisplay.classList.remove('size-medium', 'size-small', 'size-tiny');

    if (length > 13) {
      this.primaryDisplay.classList.add('size-tiny');
    } else if (length > 9) {
      this.primaryDisplay.classList.add('size-small');
    } else if (length > 6) {
      this.primaryDisplay.classList.add('size-medium');
    }
  }
}
