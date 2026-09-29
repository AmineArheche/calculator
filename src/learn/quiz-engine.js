/**
 * Interactive Student Quiz Engine
 * Tracks progress, instant feedback, scoring and mastery across all 10 math topics.
 */

import { additionTopic } from './math-topics/addition.js';
import { subtractionTopic } from './math-topics/subtraction.js';
import { multiplicationTopic } from './math-topics/multiplication.js';
import { divisionTopic } from './math-topics/division.js';
import { fractionsTopic } from './math-topics/fractions.js';
import { decimalsTopic } from './math-topics/decimals.js';
import { percentagesTopic } from './math-topics/percentages.js';
import { pemdasTopic } from './math-topics/pemdas.js';
import { negativeNumbersTopic } from './math-topics/negative-numbers.js';
import { powersRootsTopic } from './math-topics/powers-roots.js';

export const ALL_TOPICS = [
  additionTopic,
  subtractionTopic,
  multiplicationTopic,
  divisionTopic,
  fractionsTopic,
  decimalsTopic,
  percentagesTopic,
  pemdasTopic,
  negativeNumbersTopic,
  powersRootsTopic,
];

export class QuizEngine {
  constructor(storageKey = 'calc_math_quiz_progress') {
    this.storageKey = storageKey;
    this.topics = ALL_TOPICS;
    this.subscribers = new Set();
    this.state = this.loadState();
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    listener(this.getStateSnapshot());
    return () => this.subscribers.delete(listener);
  }

  notify() {
    const snapshot = this.getStateSnapshot();
    this.subscribers.forEach((fn) => fn(snapshot));
  }

  getStateSnapshot() {
    return {
      answers: { ...this.state.answers },
      score: this.state.score,
      totalAnswered: Object.keys(this.state.answers).length,
      totalQuestions: this.getTotalQuestionsCount(),
    };
  }

  getTotalQuestionsCount() {
    return this.topics.reduce((acc, t) => acc + (t.quiz?.length || 0), 0);
  }

  getTopic(topicId) {
    return this.topics.find((t) => t.id === topicId) || null;
  }

  submitAnswer(topicId, questionIndex, selectedOptionIndex) {
    const topic = this.getTopic(topicId);
    if (!topic || !topic.quiz || !topic.quiz[questionIndex]) {
      return { success: false, error: 'Question not found' };
    }

    const question = topic.quiz[questionIndex];
    const key = `${topicId}_${questionIndex}`;
    const isCorrect = selectedOptionIndex === question.correctIndex;

    this.state.answers[key] = {
      selectedOptionIndex,
      isCorrect,
      timestamp: Date.now(),
    };

    // Recompute score
    this.state.score = Object.values(this.state.answers).filter((a) => a.isCorrect).length;

    this.saveState();
    this.notify();

    return {
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    };
  }

  resetProgress() {
    this.state = {
      answers: {},
      score: 0,
    };
    this.saveState();
    this.notify();
  }

  loadState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.score === 'number' && parsed.answers) {
            return parsed;
          }
        }
      }
    } catch (e) {}
    return { answers: {}, score: 0 };
  }

  saveState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      }
    } catch (e) {}
  }
}
