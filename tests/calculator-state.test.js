import { describe, it, expect, vi } from 'vitest';
import { CalculatorStateMachine, CalculatorStates } from '../src/core/calculator-state.js';

describe('Calculator State Machine', () => {
  it('initializes in IDLE state with 0 value', () => {
    const sm = new CalculatorStateMachine();
    const snapshot = sm.getStateSnapshot();

    expect(snapshot.state).toBe(CalculatorStates.IDLE);
    expect(snapshot.currentValue).toBe('0');
    expect(snapshot.previousValue).toBeNull();
    expect(snapshot.operation).toBeNull();
    expect(snapshot.isError).toBe(false);
  });

  it('handles multi-digit inputs and decimals', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('1');
    sm.inputDigit('2');
    sm.inputDecimal();
    sm.inputDigit('5');

    const snapshot = sm.getStateSnapshot();
    expect(snapshot.currentValue).toBe('12.5');
    expect(snapshot.state).toBe(CalculatorStates.ENTERING_FIRST_OPERAND);
  });

  it('performs simple calculation 7 + 8 = 15', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('7');
    sm.setOperation('+');
    sm.inputDigit('8');
    sm.calculate();

    const snapshot = sm.getStateSnapshot();
    expect(snapshot.currentValue).toBe('15');
    expect(snapshot.state).toBe(CalculatorStates.RESULT_DISPLAYED);
    expect(snapshot.formula).toBe('7 + 8 =');
  });

  it('supports continuous calculation chaining (5 + 5 + 5 = 15)', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('5');
    sm.setOperation('+');
    sm.inputDigit('5');
    sm.setOperation('+'); // Triggers intermediate calculation
    expect(sm.getStateSnapshot().currentValue).toBe('10');

    sm.inputDigit('5');
    sm.calculate();
    expect(sm.getStateSnapshot().currentValue).toBe('15');
  });

  it('transitions to ERROR state on division by zero', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('4');
    sm.inputDigit('2');
    sm.setOperation('÷');
    sm.inputDigit('0');
    sm.calculate();

    const snapshot = sm.getStateSnapshot();
    expect(snapshot.isError).toBe(true);
    expect(snapshot.errorMessage).toBe('Cannot divide by zero');
    expect(snapshot.currentValue).toBe('Cannot divide by zero');
    expect(snapshot.state).toBe(CalculatorStates.ERROR);
  });

  it('recovers cleanly from error state on new digit input', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('5');
    sm.setOperation('÷');
    sm.inputDigit('0');
    sm.calculate();
    expect(sm.getStateSnapshot().isError).toBe(true);

    sm.inputDigit('9');
    const snapshot = sm.getStateSnapshot();
    expect(snapshot.isError).toBe(false);
    expect(snapshot.currentValue).toBe('9');
    expect(snapshot.state).toBe(CalculatorStates.ENTERING_FIRST_OPERAND);
  });

  it('handles contextual percentages (100 + 20% = 120)', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('1');
    sm.inputDigit('0');
    sm.inputDigit('0');
    sm.setOperation('+');
    sm.inputDigit('2');
    sm.inputDigit('0');
    sm.applyPercent();

    expect(sm.getStateSnapshot().currentValue).toBe('20');
    sm.calculate();
    expect(sm.getStateSnapshot().currentValue).toBe('120');
  });

  it('notifies calculation completed listener for history logging', () => {
    const sm = new CalculatorStateMachine();
    const historyListener = vi.fn();
    sm.onCalculationComplete(historyListener);

    sm.inputDigit('6');
    sm.setOperation('×');
    sm.inputDigit('7');
    sm.calculate();

    expect(historyListener).toHaveBeenCalledTimes(1);
    expect(historyListener).toHaveBeenCalledWith({
      expression: '6 × 7',
      result: '42',
    });
  });

  it('handles backspace correctly', () => {
    const sm = new CalculatorStateMachine();
    sm.inputDigit('1');
    sm.inputDigit('2');
    sm.inputDigit('3');
    sm.backspace();
    expect(sm.getStateSnapshot().currentValue).toBe('12');

    sm.backspace();
    expect(sm.getStateSnapshot().currentValue).toBe('1');

    sm.backspace();
    expect(sm.getStateSnapshot().currentValue).toBe('0');
  });
});
