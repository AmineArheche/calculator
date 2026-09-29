import { describe, it, expect } from 'vitest';
import {
  add,
  subtract,
  multiply,
  divide,
  computePercent,
  toggleSign,
  executeOperation,
  formatNumberForDisplay,
  ERROR_MESSAGES,
} from '../src/core/math-engine.js';

describe('Precision Math Engine', () => {
  describe('Floating-point Precision Arithmetic', () => {
    it('solves 0.1 + 0.2 without IEEE 754 precision error', () => {
      expect(add(0.1, 0.2)).toBe(0.3);
      expect(add(0.7, 0.1)).toBe(0.8);
      expect(add(0.0001, 0.0002)).toBe(0.0003);
    });

    it('solves 1.4 - 0.4 and 0.3 - 0.1 cleanly', () => {
      expect(subtract(1.4, 0.4)).toBe(1);
      expect(subtract(0.3, 0.1)).toBe(0.2);
      expect(subtract(10, 0.05)).toBe(9.95);
    });

    it('solves 0.2 * 0.1 and 35.5 * 2.5 correctly', () => {
      expect(multiply(0.2, 0.1)).toBe(0.02);
      expect(multiply(0.03, 0.02)).toBe(0.0006);
      expect(multiply(7, 0.8)).toBe(5.6);
    });

    it('solves exact divisions cleanly', () => {
      expect(divide(0.3, 0.1)).toBe(3);
      expect(divide(10, 2)).toBe(5);
      expect(divide(1, 4)).toBe(0.25);
    });
  });

  describe('Division by Zero Guard', () => {
    it('throws "Cannot divide by zero" when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow(ERROR_MESSAGES.DIVISION_BY_ZERO);
      expect(() => divide(0, 0)).toThrow(ERROR_MESSAGES.DIVISION_BY_ZERO);
      expect(() => executeOperation(42, 0, '÷')).toThrow(ERROR_MESSAGES.DIVISION_BY_ZERO);
    });
  });

  describe('Percentage Calculation', () => {
    it('computes standalone percentages', () => {
      expect(computePercent(50)).toBe(0.5);
      expect(computePercent(100)).toBe(1);
      expect(computePercent(25)).toBe(0.25);
    });

    it('computes contextual percentages with addition/subtraction', () => {
      // 100 + 20% -> 20 (to be added to 100 = 120)
      expect(computePercent(20, 100, '+')).toBe(20);
      expect(computePercent(15, 200, '-')).toBe(30);
    });

    it('computes percentages with multiplication/division', () => {
      // 50 * 10% -> 0.1
      expect(computePercent(10, 50, '*')).toBe(0.1);
    });
  });

  describe('Sign Inversion', () => {
    it('inverts positive to negative and vice-versa', () => {
      expect(toggleSign('42')).toBe('-42');
      expect(toggleSign('-42')).toBe('42');
      expect(toggleSign('0')).toBe('0');
      expect(toggleSign('')).toBe('0');
      expect(toggleSign('3.14')).toBe('-3.14');
      expect(toggleSign('-3.14')).toBe('3.14');
    });
  });

  describe('Display Formatting', () => {
    it('formats large numbers with thousand spaces and comma decimal', () => {
      expect(formatNumberForDisplay(1234567)).toBe('1 234 567');
      expect(formatNumberForDisplay('1234567.89')).toBe('1 234 567,89');
      expect(formatNumberForDisplay('0.05')).toBe('0,05');
      expect(formatNumberForDisplay('Cannot divide by zero')).toBe('Cannot divide by zero');
    });
  });
});
