/**
 * Finite State Machine for Calculator Logic
 * Completely decouples state and mathematical transitions from UI presentation.
 */

import { executeOperation, computePercent, toggleSign as mathToggleSign, ERROR_MESSAGES } from './math-engine.js';

export const CalculatorStates = {
  IDLE: 'IDLE',
  ENTERING_FIRST_OPERAND: 'ENTERING_FIRST_OPERAND',
  OPERATION_SELECTED: 'OPERATION_SELECTED',
  ENTERING_SECOND_OPERAND: 'ENTERING_SECOND_OPERAND',
  RESULT_DISPLAYED: 'RESULT_DISPLAYED',
  ERROR: 'ERROR',
};

export class CalculatorStateMachine {
  constructor(initialState = {}) {
    this.subscribers = new Set();
    this.historyListeners = new Set();

    this.state = CalculatorStates.IDLE;
    this.currentValue = initialState.currentValue || '0';
    this.previousValue = initialState.previousValue || null;
    this.operation = initialState.operation || null;
    this.formula = initialState.formula || '';
    this.lastResult = null;
    this.isError = false;
    this.errorMessage = '';
    this.maxDigits = 15;
  }

  /**
   * Subscribe a listener function to state changes.
   * @param {Function} listener 
   * @returns {Function} Unsubscribe callback
   */
  subscribe(listener) {
    this.subscribers.add(listener);
    listener(this.getStateSnapshot());
    return () => this.subscribers.delete(listener);
  }

  /**
   * Subscribe to completed calculations (for history logging).
   * @param {Function} listener 
   * @returns {Function}
   */
  onCalculationComplete(listener) {
    this.historyListeners.add(listener);
    return () => this.historyListeners.delete(listener);
  }

  getStateSnapshot() {
    return {
      state: this.state,
      currentValue: this.currentValue,
      previousValue: this.previousValue,
      operation: this.operation,
      formula: this.formula,
      isError: this.isError,
      errorMessage: this.errorMessage,
      canClearAll: this.currentValue === '0' && this.previousValue === null,
    };
  }

  notify() {
    const snapshot = this.getStateSnapshot();
    this.subscribers.forEach((fn) => fn(snapshot));
  }

  /**
   * Appends a digit (0-9).
   * @param {string|number} digit 
   */
  inputDigit(digit) {
    const dStr = digit.toString();

    if (this.isError || this.state === CalculatorStates.RESULT_DISPLAYED) {
      this.currentValue = dStr;
      this.previousValue = null;
      this.operation = null;
      this.formula = '';
      this.isError = false;
      this.errorMessage = '';
      this.state = CalculatorStates.ENTERING_FIRST_OPERAND;
      this.notify();
      return;
    }

    if (this.state === CalculatorStates.OPERATION_SELECTED) {
      this.currentValue = dStr;
      this.state = CalculatorStates.ENTERING_SECOND_OPERAND;
      this.notify();
      return;
    }

    // Limit digits to avoid overflowing display
    const rawDigits = this.currentValue.replace(/[^0-9]/g, '');
    if (rawDigits.length >= this.maxDigits && this.currentValue !== '0') {
      return;
    }

    if (this.currentValue === '0') {
      this.currentValue = dStr;
    } else {
      this.currentValue += dStr;
    }

    if (this.operation) {
      this.state = CalculatorStates.ENTERING_SECOND_OPERAND;
    } else {
      this.state = CalculatorStates.ENTERING_FIRST_OPERAND;
    }

    this.notify();
  }

  /**
   * Appends decimal separator.
   */
  inputDecimal() {
    if (this.isError || this.state === CalculatorStates.RESULT_DISPLAYED) {
      this.currentValue = '0.';
      this.previousValue = null;
      this.operation = null;
      this.formula = '';
      this.isError = false;
      this.errorMessage = '';
      this.state = CalculatorStates.ENTERING_FIRST_OPERAND;
      this.notify();
      return;
    }

    if (this.state === CalculatorStates.OPERATION_SELECTED) {
      this.currentValue = '0.';
      this.state = CalculatorStates.ENTERING_SECOND_OPERAND;
      this.notify();
      return;
    }

    if (!this.currentValue.includes('.')) {
      this.currentValue = this.currentValue === '' ? '0.' : this.currentValue + '.';
      if (this.operation) {
        this.state = CalculatorStates.ENTERING_SECOND_OPERAND;
      } else {
        this.state = CalculatorStates.ENTERING_FIRST_OPERAND;
      }
      this.notify();
    }
  }

  /**
   * Selects or chains an operation (+, -, *, /).
   * @param {string} op 
   */
  setOperation(op) {
    if (this.isError) return;

    if (this.state === CalculatorStates.OPERATION_SELECTED) {
      this.operation = op;
      this.notify();
      return;
    }

    if (this.state === CalculatorStates.ENTERING_SECOND_OPERAND && this.previousValue !== null) {
      // Intermediate calculation chain
      try {
        const prev = parseFloat(this.previousValue);
        const curr = parseFloat(this.currentValue);
        const result = executeOperation(prev, curr, this.operation);
        this.currentValue = result.toString();
        this.previousValue = result.toString();
        this.operation = op;
        this.state = CalculatorStates.OPERATION_SELECTED;
        this.notify();
        return;
      } catch (err) {
        this.setError(err.message);
        return;
      }
    }

    this.previousValue = this.currentValue;
    this.operation = op;
    this.state = CalculatorStates.OPERATION_SELECTED;
    this.notify();
  }

  /**
   * Computes the final result.
   */
  calculate() {
    if (this.isError || this.operation === null || this.previousValue === null) {
      return;
    }

    const prev = parseFloat(this.previousValue);
    const curr = parseFloat(this.currentValue);

    if (isNaN(prev) || isNaN(curr)) {
      return;
    }

    const expressionStr = `${this.previousValue} ${this.operation} ${this.currentValue}`;

    try {
      const result = executeOperation(prev, curr, this.operation);
      const resultStr = result.toString();

      this.formula = `${expressionStr} =`;
      this.lastResult = resultStr;
      this.currentValue = resultStr;
      this.previousValue = null;
      this.operation = null;
      this.state = CalculatorStates.RESULT_DISPLAYED;

      // Broadcast completed calculation
      this.historyListeners.forEach((fn) => fn({
        expression: expressionStr,
        result: resultStr,
      }));

      this.notify();
    } catch (err) {
      this.setError(err.message);
    }
  }

  /**
   * Applies percentage calculation.
   */
  applyPercent() {
    if (this.isError) return;

    const curr = parseFloat(this.currentValue);
    if (isNaN(curr)) return;

    const prev = this.previousValue !== null ? parseFloat(this.previousValue) : null;
    const result = computePercent(curr, prev, this.operation);
    this.currentValue = result.toString();
    this.notify();
  }

  /**
   * Toggles positive/negative sign.
   */
  toggleSign() {
    if (this.isError) return;
    this.currentValue = mathToggleSign(this.currentValue);
    this.notify();
  }

  /**
   * Removes last entered character.
   */
  backspace() {
    if (this.isError || this.state === CalculatorStates.RESULT_DISPLAYED) {
      this.clear();
      return;
    }

    if (this.state === CalculatorStates.OPERATION_SELECTED) {
      return;
    }

    if (this.currentValue.length === 1 || (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }

    this.notify();
  }

  /**
   * Clears state completely (AC).
   */
  clear() {
    this.state = CalculatorStates.IDLE;
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.formula = '';
    this.isError = false;
    this.errorMessage = '';
    this.notify();
  }

  /**
   * Restores an external value (e.g. from history entry).
   * @param {string|number} value 
   */
  restoreValue(value) {
    this.currentValue = value.toString();
    this.previousValue = null;
    this.operation = null;
    this.formula = '';
    this.isError = false;
    this.errorMessage = '';
    this.state = CalculatorStates.RESULT_DISPLAYED;
    this.notify();
  }

  setError(msg) {
    this.isError = true;
    this.errorMessage = msg || ERROR_MESSAGES.INVALID_INPUT;
    this.currentValue = this.errorMessage;
    this.previousValue = null;
    this.operation = null;
    this.formula = '';
    this.state = CalculatorStates.ERROR;
    this.notify();
  }
}
