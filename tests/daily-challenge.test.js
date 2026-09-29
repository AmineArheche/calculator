import { describe, it, expect, beforeEach } from 'vitest';
import { DailyChallengeManager, REWARD_BADGES } from '../src/learn/daily-challenge.js';

describe('DailyChallengeManager Service', () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    manager = new DailyChallengeManager('test_streak_key');
  });

  it('generates a consistent deterministic challenge for a given date', () => {
    const c1 = manager.getDailyChallenge('2026-09-29');
    const c2 = manager.getDailyChallenge('2026-09-29');
    expect(c1.question).toBe(c2.question);
    expect(c1.expectedAnswer).toBe(c2.expectedAnswer);
  });

  it('correctly increments streak and awards initial badge', () => {
    const ch = manager.getDailyChallenge('2026-09-29');
    const res = manager.submitDailyAnswer(ch.expectedAnswer, '2026-09-29');

    expect(res.success).toBe(true);
    expect(res.streak).toBe(1);
    expect(res.newBadges).toContain('first_step');
  });

  it('rejects incorrect answers without incrementing streak', () => {
    const res = manager.submitDailyAnswer(999999, '2026-09-29');
    expect(res.success).toBe(false);
    expect(res.isCorrect).toBe(false);
    expect(manager.state.streak).toBe(0);
  });
});
