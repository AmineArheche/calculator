import { describe, it, expect } from 'vitest';
import { ScientificEngine } from '../src/core/scientific-engine.js';

describe('ScientificEngine Service', () => {
  const sci = new ScientificEngine('DEG');

  describe('Trigonometry in DEG & RAD', () => {
    it('computes sin, cos, tan in DEG mode', () => {
      expect(sci.sin(0)).toBe(0);
      expect(sci.sin(90)).toBe(1);
      expect(sci.cos(0)).toBe(1);
      expect(sci.cos(90)).toBe(0);
      expect(sci.tan(45)).toBe(1);
    });

    it('computes trigonometry in RAD mode', () => {
      sci.setAngleMode('RAD');
      expect(sci.sin(Math.PI / 2)).toBe(1);
      expect(sci.cos(Math.PI)).toBe(-1);
      sci.setAngleMode('DEG');
    });

    it('throws error on tangent asymptote (90 deg)', () => {
      expect(() => sci.tan(90)).toThrow();
    });
  });

  describe('Logarithms & Powers', () => {
    it('computes natural and base-10 logarithms', () => {
      expect(sci.ln(Math.E)).toBe(1);
      expect(sci.log10(100)).toBe(2);
      expect(sci.log2(8)).toBe(3);
    });

    it('throws for non-positive logarithms', () => {
      expect(() => sci.ln(0)).toThrow();
      expect(() => sci.log10(-5)).toThrow();
    });

    it('calculates nth roots and cube roots', () => {
      expect(sci.cbrt(27)).toBe(3);
      expect(sci.nthRoot(16, 4)).toBe(2);
    });

    it('calculates factorials accurately', () => {
      expect(sci.factorial(0)).toBe(1);
      expect(sci.factorial(5)).toBe(120);
      expect(() => sci.factorial(-1)).toThrow();
    });
  });

  describe('Mathematical Constants', () => {
    it('exposes accurate Pi, E, and Golden Ratio', () => {
      expect(sci.PI).toBeCloseTo(3.14159265);
      expect(sci.E).toBeCloseTo(2.71828182);
      expect(sci.PHI).toBeCloseTo(1.61803398);
    });
  });
});
