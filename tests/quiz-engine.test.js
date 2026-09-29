import { describe, it, expect, beforeEach } from 'vitest';
import { QuizEngine, ALL_TOPICS } from '../src/learn/quiz-engine.js';

describe('QuizEngine', () => {
  let engine;

  beforeEach(() => {
    localStorage.clear();
    engine = new QuizEngine('test_quiz_storage');
  });

  it('aggregates quiz questions across all 10 topics', () => {
    expect(ALL_TOPICS).toHaveLength(10);
    expect(engine.getTotalQuestionsCount()).toBeGreaterThanOrEqual(20);
  });

  it('evaluates correct answers with explanation', () => {
    // Topic: addition, Question 0: commutativity (index 0)
    const res = engine.submitAnswer('addition', 0, 0);
    expect(res.isCorrect).toBe(true);
    expect(res.explanation).toContain('commutativité');

    const state = engine.getStateSnapshot();
    expect(state.score).toBe(1);
    expect(state.totalAnswered).toBe(1);
  });

  it('detects incorrect choices and gives correct index', () => {
    // Topic: addition, Question 0: wrong choice (index 2)
    const res = engine.submitAnswer('addition', 0, 2);
    expect(res.isCorrect).toBe(false);
    expect(res.correctIndex).toBe(0);

    const state = engine.getStateSnapshot();
    expect(state.score).toBe(0);
    expect(state.totalAnswered).toBe(1);
  });

  it('resets student quiz progress completely', () => {
    engine.submitAnswer('addition', 0, 0);
    expect(engine.getStateSnapshot().score).toBe(1);

    engine.resetProgress();
    const snapshot = engine.getStateSnapshot();
    expect(snapshot.score).toBe(0);
    expect(snapshot.totalAnswered).toBe(0);
    expect(snapshot.answers).toEqual({});
  });
});
