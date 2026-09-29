import { describe, it, expect } from 'vitest';
import { MathGlossary } from '../src/learn/math-glossary.js';

describe('MathGlossary Service', () => {
  const glossary = new MathGlossary();

  it('contains over 15 foundational mathematical terms', () => {
    expect(glossary.getAllTerms().length).toBeGreaterThanOrEqual(15);
  });

  it('searches terms by query keyword case-insensitively', () => {
    const results = glossary.search('PEMDAS');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].term).toBe('PEMDAS');
  });

  it('filters terms accurately by category', () => {
    const arithmeticTerms = glossary.getByCategory('Arithmétique');
    expect(arithmeticTerms.length).toBeGreaterThan(0);
    arithmeticTerms.forEach((t) => expect(t.category).toBe('Arithmétique'));
  });

  it('extracts unique categories list', () => {
    const cats = glossary.getCategories();
    expect(cats).toContain('Arithmétique');
    expect(cats).toContain('Nombres');
    expect(cats).toContain('Propriété');
  });
});
