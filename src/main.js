/**
 * Main Application Entry Point
 * Orchestrates modules, initializes state machine, and mounts presentation layer.
 */

import './styles/variables.css';
import './styles/layout.css';
import './styles/calculator.css';
import './styles/keypad.css';
import './styles/history.css';
import './styles/responsive.css';
import './styles/learn.css';
import './styles/quiz.css';

import { CalculatorStateMachine } from './core/calculator-state.js';
import { HistoryStore } from './core/history-store.js';
import { AudioEngine } from './core/audio-engine.js';
import { ClipboardService } from './core/clipboard.js';
import { CalculatorUI } from './ui/calculator-ui.js';
import { QuizEngine } from './learn/quiz-engine.js';
import { LearnUI } from './learn/learn-ui.js';
import { ThemeManager } from './core/theme-manager.js';
import { ScientificEngine } from './core/scientific-engine.js';
import { PracticeGenerator } from './learn/practice-generator.js';
import { DailyChallengeManager } from './learn/daily-challenge.js';
import { MathGlossary } from './learn/math-glossary.js';
import { UnitConverter } from './converters/unit-converter.js';
import { FinanceMath } from './finance/finance-math.js';
import { StatsEngine } from './stats/stats-engine.js';
import { A11yAnnouncer } from './ui/a11y-manager.js';

export function initializeApp() {
  const stateMachine = new CalculatorStateMachine();
  const historyStore = new HistoryStore();
  const audioEngine = new AudioEngine();
  const clipboardService = new ClipboardService();

  const ui = new CalculatorUI(stateMachine, historyStore, audioEngine, clipboardService);
  ui.init();

  const themeManager = new ThemeManager();
  themeManager.init();

  if (typeof document !== 'undefined') {
    const themeBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (themeBtn) {
      if (themeIcon) {
        themeIcon.textContent = themeManager.getCurrentThemeDetails().icon;
      }
      themeBtn.addEventListener('click', () => {
        const next = themeManager.cycleNextTheme();
        if (themeIcon) themeIcon.textContent = next.icon;
        themeBtn.title = `Thème : ${next.name}`;
        audioEngine.play('click');
      });
    }
  }

  const quizEngine = new QuizEngine();
  const learnUI = new LearnUI(quizEngine, stateMachine, audioEngine);
  learnUI.init();

  const scientificEngine = new ScientificEngine();
  const practiceGenerator = new PracticeGenerator();
  const dailyChallengeManager = new DailyChallengeManager();
  const mathGlossary = new MathGlossary();
  const unitConverter = new UnitConverter();
  const financeMath = new FinanceMath();
  const statsEngine = new StatsEngine();
  const a11yAnnouncer = new A11yAnnouncer();

  return {
    stateMachine,
    historyStore,
    audioEngine,
    clipboardService,
    themeManager,
    ui,
    quizEngine,
    learnUI,
    scientificEngine,
    practiceGenerator,
    dailyChallengeManager,
    mathGlossary,
    unitConverter,
    financeMath,
    statsEngine,
    a11yAnnouncer,
  };
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.app = initializeApp();
    });
  } else {
    window.app = initializeApp();
  }

  // Register Service Worker for offline PWA installation
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.debug('ServiceWorker registration skipped:', err);
      });
    });
  }
}
