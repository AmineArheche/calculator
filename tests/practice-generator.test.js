import { describe, it, expect } from 'vitest';
import { PracticeGenerator } from '../src/learn/practice-generator.js';

describe('PracticeGenerator Service', () => {
  const gen = new PracticeGenerator();

  it('generates valid addition questions across difficulties', () => {
    const qEasy = gen.generateQuestion('easy', 'addition');
    expect(qEasy.category).toBe('Addition');
    expect(qEasy.question).toContain('+');
    expect(typeof qEasy.answer).toBe('number');
    expect(gen.verifyAnswer(qEasy.answer, qEasy.answer)).toBe(true);
  });

  it('generates exact integer division problems', () => {
    for (let i = 0; i < 10; i++) {
      const q = gen.generateQuestion('medium', 'division');
      expect(Number.isInteger(q.answer)).toBe(true);
      expect(gen.verifyAnswer(String(q.answer), q.answer)).toBe(true);
    }
  });

  it('generates percentage exercises with valid answers', () => {
    const q = gen.generateQuestion('easy', 'percentages');
    expect(q.category).toBe('Pourcentages');
    expect(q.question).toContain('%');
    expect(gen.verifyAnswer(q.answer, q.answer)).toBe(true);
  });

  it('generates square powers exercises', () => {
    const q = gen.generateQuestion('hard', 'powers');
    expect(q.category).toBe('Puissances');
    expect(q.question).toContain('²');
    expect(q.answer).toBeGreaterThan(0);
  });

  it('correctly validates user answers including comma decimals', () => {
    expect(gen.verifyAnswer('12.5', 12.5)).toBe(true);
    expect(gen.verifyAnswer('12,5', 12.5)).toBe(true);
    expect(gen.verifyAnswer('13', 12.5)).toBe(false);
  });
});
