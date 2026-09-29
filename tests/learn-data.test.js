import { describe, it, expect } from 'vitest';
import { MATH_SECTIONS } from '../src/learn/learn-data.js';

describe('Math Basics Syllabus & Lessons Data', () => {
  it('contains exactly 10 comprehensive foundational math sections', () => {
    expect(MATH_SECTIONS).toHaveLength(10);
  });

  it('assigns sequential numbers from 1 to 10', () => {
    const numbers = MATH_SECTIONS.map((s) => s.number);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('ensures each section contains required instructional properties', () => {
    MATH_SECTIONS.forEach((section) => {
      expect(section.id).toBeDefined();
      expect(typeof section.title).toBe('string');
      expect(section.title.length).toBeGreaterThan(3);
      expect(Array.isArray(section.keyConcepts)).toBe(true);
      expect(section.keyConcepts.length).toBeGreaterThanOrEqual(3);
      expect(typeof section.sampleFormula).toBe('string');
      expect(typeof section.expectedResult).toBe('string');
      expect(typeof section.tip).toBe('string');
      expect(section.tip.length).toBeGreaterThan(10);
    });
  });

  it('covers all 10 core student arithmetic domains', () => {
    const ids = MATH_SECTIONS.map((s) => s.id);
    expect(ids).toContain('addition');
    expect(ids).toContain('subtraction');
    expect(ids).toContain('multiplication');
    expect(ids).toContain('division');
    expect(ids).toContain('fractions');
    expect(ids).toContain('decimals');
    expect(ids).toContain('percentages');
    expect(ids).toContain('pemdas');
    expect(ids).toContain('negatives');
    expect(ids).toContain('powers');
  });
});
