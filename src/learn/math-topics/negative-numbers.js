/**
 * Topic 9: Nombres Négatifs & Règle des Signes
 */

export const negativeNumbersTopic = {
  id: 'negatives',
  title: 'Nombres Négatifs & Règle des Signes',
  summary: 'Apprivoiser les valeurs sous zéro et les lois de multiplication des signes.',
  explanation: `
    Les nombres négatifs représentent des valeurs en-dessous de zéro (températures négatives, dettes, profondeurs).
    Sur une droite orientée, ils se situent à gauche de l'origine zéro.
  `,
  rules: [
    { title: 'Multiplication des signes', formula: '(−) × (−) = (+)', text: 'Le produit de deux nombres de même signe est TOUJOURS positif (ex: (−4) × (−5) = +20).' },
    { title: 'Signes opposés', formula: '(+) × (−) = (−)', text: 'Le produit de deux nombres de signes opposés est TOUJOURS négatif (ex: 6 × (−3) = −18).' },
    { title: 'Double négation', formula: 'a − (−b) = a + b', text: 'Soustraire un nombre négatif revient à ajouter un nombre positif (ex: 5 − (−3) = 5 + 3 = 8).' }
  ],
  interactiveDemo: {
    type: 'signs',
    initialA: -5,
    initialB: -4,
    render(a, b) {
      return `(${a}) × (${b}) = ${a * b}`;
    }
  },
  quiz: [
    {
      question: 'Que vaut (−6) × (−7) ?',
      options: ['−42', '+42', '−13', '+13'],
      correctIndex: 1,
      explanation: 'Moins par moins donne plus : 6 × 7 = 42, avec un signe positif final.'
    },
    {
      question: 'Quel est le résultat de : 10 − (−5) ?',
      options: ['5', '−15', '15', '−5'],
      correctIndex: 2,
      explanation: 'Deux signes "moins" qui se suivent se transforment en "plus" : 10 + 5 = 15.'
    }
  ]
};
