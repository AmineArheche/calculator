/**
 * Daily Math Challenge & Streak System
 * Provides one curated math challenge per day with streak tracking and student reward badges.
 */

export const REWARD_BADGES = [
  { id: 'first_step', name: 'Premier Pas', icon: '🌱', threshold: 1, desc: 'Avoir réussi son 1er défi quotidien' },
  { id: 'streak_3', name: 'Régulier', icon: '🔥', threshold: 3, desc: '3 jours d’affilée de pratique mathématique' },
  { id: 'streak_7', name: 'Semaine Champion', icon: '⚡', threshold: 7, desc: '7 jours de calcul quotidien sans interruption' },
  { id: 'streak_30', name: 'Maître Inégalé', icon: '👑', threshold: 30, desc: '30 jours de pratique mathématique continue' },
];

export class DailyChallengeManager {
  constructor(storageKey = 'calc_math_daily_streak') {
    this.storageKey = storageKey;
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(this.storageKey);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {}
    return {
      streak: 0,
      lastCompletedDate: null,
      unlockedBadges: [],
    };
  }

  saveState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      }
    } catch (e) {}
  }

  getTodayString() {
    return new Date().toISOString().slice(0, 10);
  }

  getDailyChallenge(dateString = null) {
    const day = dateString || this.getTodayString();
    // Deterministic seed based on date string
    let seed = 0;
    for (let i = 0; i < day.length; i++) seed += day.charCodeAt(i);

    const a = (seed % 50) + 12;
    const b = ((seed * 3) % 25) + 5;
    const isMultiplication = seed % 2 === 0;

    return {
      date: day,
      question: isMultiplication ? `${a} × ${b}` : `${a * 2} − ${b}`,
      expectedAnswer: isMultiplication ? a * b : a * 2 - b,
      isCompletedToday: this.state.lastCompletedDate === day,
    };
  }

  submitDailyAnswer(userAnswer, dateString = null) {
    const challenge = this.getDailyChallenge(dateString);
    const num = parseFloat(String(userAnswer).replace(',', '.').trim());
    const isCorrect = Math.abs(num - challenge.expectedAnswer) < 0.0001;

    if (!isCorrect) {
      return { success: false, isCorrect: false };
    }

    const today = challenge.date;
    if (this.state.lastCompletedDate !== today) {
      // Check if yesterday was completed for streak continuation
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (this.state.lastCompletedDate === yesterdayStr) {
        this.state.streak += 1;
      } else {
        this.state.streak = 1;
      }
      this.state.lastCompletedDate = today;

      // Check badges
      REWARD_BADGES.forEach((b) => {
        if (this.state.streak >= b.threshold && !this.state.unlockedBadges.includes(b.id)) {
          this.state.unlockedBadges.push(b.id);
        }
      });

      this.saveState();
    }

    return {
      success: true,
      isCorrect: true,
      streak: this.state.streak,
      newBadges: this.state.unlockedBadges,
    };
  }
}
