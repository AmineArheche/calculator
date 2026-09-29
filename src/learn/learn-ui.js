/**
 * Student Math Learning Lab UI Controller
 * Renders the 10 foundational learning cards, interactive quizzes, and connects to calculator.
 */

import { MATH_SECTIONS } from './learn-data.js';
import { ALL_TOPICS } from './quiz-engine.js';

export class LearnUI {
  /**
   * @param {import('./quiz-engine.js').QuizEngine} quizEngine 
   * @param {import('../core/calculator-state.js').CalculatorStateMachine} stateMachine 
   * @param {import('../core/audio-engine.js').AudioEngine} audioEngine 
   */
  constructor(quizEngine, stateMachine, audioEngine) {
    this.quizEngine = quizEngine;
    this.stateMachine = stateMachine;
    this.audioEngine = audioEngine;

    this.container = document.getElementById('learn-container');
    this.calculatorCard = document.getElementById('calculator');
    this.btnToggleMode = document.getElementById('btn-learn-mode-toggle');
    this.progressBar = document.getElementById('quiz-progress-bar');
    this.scoreBadge = document.getElementById('quiz-score-badge');

    this.activeTopicId = null;
    this.isLabOpen = false;
  }

  init() {
    this.renderSections();
    this.bindEvents();

    this.quizEngine.subscribe((snapshot) => this.onQuizStateChange(snapshot));
  }

  bindEvents() {
    if (this.btnToggleMode) {
      this.btnToggleMode.addEventListener('click', () => {
        this.toggleLabMode();
        this.audioEngine.play('click');
      });
    }

    if (this.container) {
      this.container.addEventListener('click', (e) => {
        // Toggle card collapse / expand
        const header = e.target.closest('.learn-card-header');
        if (header) {
          const card = header.closest('.learn-card');
          if (card) {
            const topicId = card.dataset.topicId;
            this.toggleTopicExpand(topicId);
            this.audioEngine.play('click');
          }
          return;
        }

        // Try in Calculator button
        const btnCalc = e.target.closest('.btn-try-calc');
        if (btnCalc) {
          const formula = btnCalc.dataset.formula;
          if (formula) {
            this.tryInCalculator(formula);
            this.audioEngine.play('click');
          }
          return;
        }

        // Quiz option selection
        const optionBtn = e.target.closest('.quiz-option-btn');
        if (optionBtn && !optionBtn.disabled) {
          const topicId = optionBtn.dataset.topicId;
          const qIndex = parseInt(optionBtn.dataset.qIndex, 10);
          const optIndex = parseInt(optionBtn.dataset.optIndex, 10);
          this.handleQuizAnswer(topicId, qIndex, optIndex, optionBtn);
        }
      });
    }
  }

  toggleLabMode(forceState = null) {
    this.isLabOpen = forceState !== null ? forceState : !this.isLabOpen;

    if (this.container) {
      this.container.classList.toggle('active', this.isLabOpen);
    }
    if (this.calculatorCard) {
      this.calculatorCard.classList.toggle('lab-mode-dimmed', this.isLabOpen);
    }
    if (this.btnToggleMode) {
      this.btnToggleMode.classList.toggle('active-mode', this.isLabOpen);
      this.btnToggleMode.title = this.isLabOpen ? 'Revenir à la calculatrice' : 'Ouvrir le laboratoire de maths';
    }
  }

  toggleTopicExpand(topicId) {
    const card = this.container?.querySelector(`.learn-card[data-topic-id="${topicId}"]`);
    if (!card) return;

    const isCurrentlyOpen = card.classList.contains('expanded');
    // Close other expanded cards for clean reading
    this.container?.querySelectorAll('.learn-card.expanded').forEach((c) => c.classList.remove('expanded'));

    if (!isCurrentlyOpen) {
      card.classList.add('expanded');
      this.activeTopicId = topicId;
    } else {
      this.activeTopicId = null;
    }
  }

  tryInCalculator(formula) {
    // Switch to calculator view
    this.toggleLabMode(false);

    // Pre-fill / calculate formula in state machine
    // e.g. "25 + 17", "100 − 37", "12 × 8", "144 ÷ 12", "0.1 + 0.2", "2 + 3 × 4"
    this.stateMachine.clear();

    const tokens = formula.split(' ');
    if (tokens.length === 3) {
      const a = tokens[0];
      const op = tokens[1];
      const b = tokens[2];

      for (const char of a) {
        if (char === '.') this.stateMachine.inputDecimal();
        else this.stateMachine.inputDigit(char);
      }
      this.stateMachine.setOperation(op);
      for (const char of b) {
        if (char === '.') this.stateMachine.inputDecimal();
        else this.stateMachine.inputDigit(char);
      }
      this.stateMachine.calculate();
    } else {
      this.stateMachine.restoreValue(formula);
    }
  }

  handleQuizAnswer(topicId, questionIndex, selectedOptionIndex, clickedBtn) {
    const result = this.quizEngine.submitAnswer(topicId, questionIndex, selectedOptionIndex);
    if (!result.success && result.isCorrect === undefined) return;

    const parentGroup = clickedBtn.closest('.quiz-options-list');
    const feedbackBox = parentGroup?.parentElement?.querySelector('.quiz-feedback');

    // Disable all options in this question
    parentGroup?.querySelectorAll('.quiz-option-btn').forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === result.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedOptionIndex && !result.isCorrect) {
        btn.classList.add('wrong');
      }
    });

    if (feedbackBox) {
      feedbackBox.className = `quiz-feedback ${result.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
      feedbackBox.innerHTML = `
        <strong>${result.isCorrect ? '✅ Bravo ! Réponse exacte.' : '❌ Pas tout à fait.'}</strong>
        <p>${result.explanation}</p>
      `;
    }

    this.audioEngine.play(result.isCorrect ? 'success' : 'error');
  }

  onQuizStateChange(snapshot) {
    if (this.scoreBadge) {
      this.scoreBadge.textContent = `${snapshot.score}/${snapshot.totalQuestions}`;
    }
    if (this.progressBar) {
      const pct = snapshot.totalQuestions > 0 ? (snapshot.score / snapshot.totalQuestions) * 100 : 0;
      this.progressBar.style.width = `${pct}%`;
    }
  }

  renderSections() {
    if (!this.container) return;

    const quizState = this.quizEngine.getStateSnapshot();

    const cardsHtml = MATH_SECTIONS.map((sec) => {
      const topicObj = ALL_TOPICS.find((t) => t.id === sec.id);
      const quizQuestions = topicObj?.quiz || [];

      return `
        <article class="learn-card" data-topic-id="${sec.id}">
          <header class="learn-card-header">
            <div class="card-title-group">
              <span class="card-icon">${sec.icon}</span>
              <div class="card-headings">
                <div class="card-badge-row">
                  <span class="topic-number">Leçon ${sec.number}</span>
                  <span class="topic-badge">${sec.badge}</span>
                </div>
                <h3 class="topic-title">${sec.title}</h3>
              </div>
            </div>
            <button class="btn-card-toggle" aria-label="Déplier la leçon">
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </header>

          <div class="learn-card-body">
            <p class="topic-desc">${sec.description}</p>

            <div class="rules-container">
              <h4>📌 Règles & Principes Clés :</h4>
              <ul class="concepts-list">
                ${sec.keyConcepts.map((c) => `<li>${c}</li>`).join('')}
              </ul>
            </div>

            <div class="action-formula-box">
              <div class="formula-preview">
                <span class="formula-label">Exemple type :</span>
                <code class="formula-code">${sec.sampleFormula} = ${sec.expectedResult}</code>
              </div>
              <button type="button" class="btn-try-calc" data-formula="${sec.sampleFormula}" title="Tester dans la calculatrice">
                🚀 Tester sur la calculatrice
              </button>
            </div>

            <div class="learning-tip-box">
              <span class="tip-icon">💡</span>
              <span class="tip-text"><strong>Astuce :</strong> ${sec.tip}</span>
            </div>

            ${this.renderQuizBlock(sec.id, quizQuestions, quizState.answers)}
          </div>
        </article>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="lab-header-banner">
        <div class="banner-title-wrap">
          <span class="banner-emoji">🎓</span>
          <div>
            <h2>Centre d'Apprentissage Mathématique</h2>
            <p>10 leçons fondamentales interactives pour collégiens et étudiants</p>
          </div>
        </div>
        <div class="quiz-tracker-box">
          <div class="tracker-labels">
            <span>Score aux Quiz :</span>
            <strong id="quiz-score-badge">${quizState.score}/${quizState.totalQuestions}</strong>
          </div>
          <div class="progress-track">
            <div id="quiz-progress-bar" class="progress-fill" style="width: ${(quizState.score / (quizState.totalQuestions || 1)) * 100}%"></div>
          </div>
        </div>
      </div>
      <div class="learn-cards-grid">
        ${cardsHtml}
      </div>
    `;

    // Re-link references
    this.progressBar = document.getElementById('quiz-progress-bar');
    this.scoreBadge = document.getElementById('quiz-score-badge');
  }

  renderQuizBlock(topicId, questions, savedAnswers) {
    if (!questions || questions.length === 0) return '';

    return `
      <div class="topic-quiz-block">
        <h4>✍️ Mini-Quiz de Validation (${questions.length} questions) :</h4>
        ${questions.map((q, qIdx) => {
          const answerKey = `${topicId}_${qIdx}`;
          const pastAnswer = savedAnswers[answerKey];
          const hasAnswered = pastAnswer !== undefined;

          return `
            <div class="quiz-question-card" data-q-index="${qIdx}">
              <p class="question-text"><strong>Q${qIdx + 1}.</strong> ${q.question}</p>
              <div class="quiz-options-list">
                ${q.options.map((opt, optIdx) => {
                  let statusClass = '';
                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) statusClass = 'correct';
                    else if (optIdx === pastAnswer.selectedOptionIndex && !pastAnswer.isCorrect) statusClass = 'wrong';
                  }

                  return `
                    <button type="button" class="quiz-option-btn ${statusClass}"
                      data-topic-id="${topicId}"
                      data-q-index="${qIdx}"
                      data-opt-index="${optIdx}"
                      ${hasAnswered ? 'disabled' : ''}>
                      <span class="option-letter">${String.fromCharCode(65 + optIdx)}.</span> ${opt}
                    </button>
                  `;
                }).join('')}
              </div>
              <div class="quiz-feedback ${hasAnswered ? (pastAnswer.isCorrect ? 'feedback-correct' : 'feedback-wrong') : ''}">
                ${hasAnswered ? `
                  <strong>${pastAnswer.isCorrect ? '✅ Bravo ! Réponse exacte.' : '❌ Pas tout à fait.'}</strong>
                  <p>${q.explanation}</p>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}
