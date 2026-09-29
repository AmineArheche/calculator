/**
 * Topic 8: Ordre des Opérations (PEMDAS / BODMAS)
 */

export const pemdasTopic = {
  id: 'pemdas',
  title: 'Ordre des Opérations (PEMDAS / BODMAS)',
  summary: 'Apprendre la hiérarchie standard des opérations mathématiques pour éviter tout piège.',
  explanation: `
    Dans une formule avec plusieurs opérations, on ne calcule pas simplement de gauche à droite !
    Une convention universelle détermine l'ordre des priorités : <strong>PEMDAS</strong>.
  `,
  rules: [
    { title: 'P - Parenthèses', formula: '( ... )', text: 'On évalue en priorité absolue ce qui se trouve entre parenthèses.' },
    { title: 'E - Exposants', formula: 'xⁿ , √x', text: 'Les puissances et racines carrées sont prioritaires sur les produits.' },
    { title: 'MD - Multiplications & Divisions', formula: '× et ÷', text: 'Sont prioritaires sur l’addition et la soustraction (de gauche à droite).' },
    { title: 'AS - Additions & Soustractions', formula: '+ et −', text: 'Se calculent en dernier (de gauche à droite).' }
  ],
  interactiveDemo: {
    type: 'order',
    expression: '2 + 3 × 4',
    step1: '3 × 4 = 12 (la multiplication est prioritaire)',
    step2: '2 + 12 = 14',
    render() {
      return '2 + 3 × 4 = 14 (et non 20 !)';
    }
  },
  quiz: [
    {
      question: 'Quel est le résultat correct de : 10 − 2 × 3 ?',
      options: ['24', '4', '8', '16'],
      correctIndex: 1,
      explanation: 'La multiplication 2 × 3 = 6 est prioritaire. Ensuite : 10 − 6 = 4.'
    },
    {
      question: 'Dans l’expression (5 + 3) × 2, quelle opération effectue-t-on en premier ?',
      options: [
        'La multiplication par 2',
        'L’addition entre parenthèses (5 + 3)',
        'Les deux en même temps',
        'Peu importe, le résultat sera le même'
      ],
      correctIndex: 1,
      explanation: 'Les parenthèses ont toujours la priorité la plus haute : (5 + 3) = 8, puis 8 × 2 = 16.'
    }
  ]
};
