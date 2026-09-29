import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorStateMachine, CalculatorStates } from '../src/core/calculator-state.js';
import { QuizEngine } from '../src/learn/quiz-engine.js';
import { LearnUI } from '../src/learn/learn-ui.js';
import { KeyboardHandler } from '../src/core/keyboard-handler.js';

describe('Code Review Improvements & Issue Fixes', () => {
  let stateMachine;
  let quizEngine;

  beforeEach(() => {
    stateMachine = new CalculatorStateMachine();
    quizEngine = new QuizEngine('test_review_quiz_progress');
    quizEngine.resetProgress();
  });

  describe('Issue #1: Multi-token formula sequential evaluation in tryInCalculator', () => {
    it('should correctly evaluate standard two-operand expressions like 25 + 17', () => {
      const mockAudio = { play: () => {} };
      const learnUI = new LearnUI(quizEngine, stateMachine, mockAudio);
      learnUI.tryInCalculator('25 + 17');

      const snapshot = stateMachine.getStateSnapshot();
      expect(snapshot.currentValue).toBe('42');
      expect(snapshot.state).toBe(CalculatorStates.RESULT_DISPLAYED);
    });

    it('should correctly evaluate multi-token sequential expressions like 250 × 20 ÷ 100', () => {
      const mockAudio = { play: () => {} };
      const learnUI = new LearnUI(quizEngine, stateMachine, mockAudio);
      learnUI.tryInCalculator('250 × 20 ÷ 100');

      const snapshot = stateMachine.getStateSnapshot();
      expect(snapshot.currentValue).toBe('50');
      expect(snapshot.state).toBe(CalculatorStates.RESULT_DISPLAYED);
    });

    it('should correctly evaluate high-precision floating point expressions like 0.1 + 0.2', () => {
      const mockAudio = { play: () => {} };
      const learnUI = new LearnUI(quizEngine, stateMachine, mockAudio);
      learnUI.tryInCalculator('0.1 + 0.2');

      const snapshot = stateMachine.getStateSnapshot();
      expect(snapshot.currentValue).toBe('0.3');
    });
  });

  describe('Issue #3: Quiz reset progress and state clearing', () => {
    it('should reset answers and score to 0 when resetProgress is called', () => {
      quizEngine.submitAnswer('addition', 0, 0); // correct
      quizEngine.submitAnswer('subtraction', 0, 0); // correct
      expect(quizEngine.getStateSnapshot().score).toBe(2);

      quizEngine.resetProgress();
      const snapshot = quizEngine.getStateSnapshot();
      expect(snapshot.score).toBe(0);
      expect(Object.keys(snapshot.answers).length).toBe(0);
    });
  });

  describe('Issue #2: Keyboard handler isolation when learning lab is active', () => {
    it('should ignore digit inputs if #learn-container has active class', () => {
      const fakeContainer = document.createElement('section');
      fakeContainer.id = 'learn-container';
      fakeContainer.className = 'learn-container active';
      document.body.appendChild(fakeContainer);

      const handler = new KeyboardHandler(stateMachine);
      handler.handleKeyDown(new KeyboardEvent('keydown', { key: '9' }));

      expect(stateMachine.getStateSnapshot().currentValue).toBe('0');

      document.body.removeChild(fakeContainer);
    });

    it('should trigger #btn-learn-mode-toggle on Escape when lab is active', () => {
      const fakeContainer = document.createElement('section');
      fakeContainer.id = 'learn-container';
      fakeContainer.className = 'learn-container active';
      document.body.appendChild(fakeContainer);

      let toggleClicked = false;
      const fakeBtn = document.createElement('button');
      fakeBtn.id = 'btn-learn-mode-toggle';
      fakeBtn.onclick = () => { toggleClicked = true; };
      document.body.appendChild(fakeBtn);

      const handler = new KeyboardHandler(stateMachine);
      handler.handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(toggleClicked).toBe(true);

      document.body.removeChild(fakeContainer);
      document.body.removeChild(fakeBtn);
    });
  });
});
