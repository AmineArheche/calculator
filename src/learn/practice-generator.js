/**
 * Endless Math Practice & Challenge Generator
 * Generates dynamic questions across 3 difficulty levels with instant verification.
 */

export class PracticeGenerator {
  /**
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   * @param {string} category 
   */
  generateQuestion(difficulty = 'easy', category = 'all') {
    const categories = ['addition', 'subtraction', 'multiplication', 'division', 'percentages', 'powers'];
    const chosenCat = category === 'all' 
      ? categories[Math.floor(Math.random() * categories.length)]
      : category;

    switch (chosenCat) {
      case 'addition':
        return this.generateAddition(difficulty);
      case 'subtraction':
        return this.generateSubtraction(difficulty);
      case 'multiplication':
        return this.generateMultiplication(difficulty);
      case 'division':
        return this.generateDivision(difficulty);
      case 'percentages':
        return this.generatePercentages(difficulty);
      case 'powers':
        return this.generatePowers(difficulty);
      default:
        return this.generateAddition(difficulty);
    }
  }

  generateAddition(diff) {
    const max = diff === 'easy' ? 20 : diff === 'medium' ? 100 : 500;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    return {
      category: 'Addition',
      question: `${a} + ${b}`,
      answer: a + b,
      hint: `Astuce : Décomposez ${b} par dizaines et unités.`
    };
  }

  generateSubtraction(diff) {
    const max = diff === 'easy' ? 30 : diff === 'medium' ? 150 : 600;
    const a = Math.floor(Math.random() * max) + 10;
    const b = Math.floor(Math.random() * a);
    return {
      category: 'Soustraction',
      question: `${a} − ${b}`,
      answer: a - b,
      hint: `Pensez à la distance entre ${b} et ${a}.`
    };
  }

  generateMultiplication(diff) {
    const maxA = diff === 'easy' ? 10 : diff === 'medium' ? 15 : 25;
    const maxB = diff === 'easy' ? 10 : diff === 'medium' ? 12 : 20;
    const a = Math.floor(Math.random() * maxA) + 2;
    const b = Math.floor(Math.random() * maxB) + 2;
    return {
      category: 'Multiplication',
      question: `${a} × ${b}`,
      answer: a * b,
      hint: `Pensez aux tables de multiplication de repère (×10, ×5).`
    };
  }

  generateDivision(diff) {
    const maxDivisor = diff === 'easy' ? 6 : diff === 'medium' ? 12 : 20;
    const divisor = Math.floor(Math.random() * maxDivisor) + 2;
    const quotient = Math.floor(Math.random() * (diff === 'easy' ? 10 : 20)) + 1;
    const dividend = divisor * quotient;
    return {
      category: 'Division',
      question: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      hint: `Combien de fois ${divisor} loge-t-il dans ${dividend} ?`
    };
  }

  generatePercentages(diff) {
    const rates = diff === 'easy' ? [10, 20, 50] : [15, 25, 30, 40, 75];
    const rate = rates[Math.floor(Math.random() * rates.length)];
    const base = (Math.floor(Math.random() * (diff === 'easy' ? 10 : 30)) + 1) * 10;
    const answer = (base * rate) / 100;
    return {
      category: 'Pourcentages',
      question: `${rate}% de ${base}`,
      answer: answer,
      hint: `Calculez d'abord 10% de ${base} (${base / 10}), puis multipliez.`
    };
  }

  generatePowers(diff) {
    const base = Math.floor(Math.random() * (diff === 'easy' ? 7 : diff === 'medium' ? 12 : 20)) + 2;
    return {
      category: 'Puissances',
      question: `${base}²`,
      answer: base * base,
      hint: `Multipliez ${base} par lui-même.`
    };
  }

  verifyAnswer(userAnswer, expectedAnswer) {
    const numUser = parseFloat(String(userAnswer).replace(',', '.').trim());
    return Math.abs(numUser - expectedAnswer) < 0.0001;
  }
}
