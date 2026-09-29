import { describe, it, expect } from 'vitest';
import { StatsEngine } from '../src/stats/stats-engine.js';

describe('StatsEngine Service', () => {
  const stats = new StatsEngine();

  it('calculates arithmetic mean', () => {
    expect(stats.mean([2, 4, 6, 8, 10])).toBe(6);
  });

  it('calculates median for odd and even length datasets', () => {
    expect(stats.median([1, 3, 5])).toBe(3);
    expect(stats.median([1, 3, 5, 7])).toBe(4);
  });

  it('finds single and multi-modal distributions', () => {
    expect(stats.mode([1, 2, 2, 3])).toEqual([2]);
    expect(stats.mode([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });

  it('calculates population and sample variance & standard deviation', () => {
    const data = [10, 12, 23, 23, 16, 23, 21, 16];
    const stdDevPop = stats.standardDeviation(data, false);
    expect(stdDevPop).toBeCloseTo(4.8989, 2);

    const stdDevSample = stats.standardDeviation(data, true);
    expect(stdDevSample).toBeCloseTo(5.2372, 2);
  });

  it('calculates range of dataset', () => {
    expect(stats.range([5, 12, 99, 1])).toBe(98);
  });
});
