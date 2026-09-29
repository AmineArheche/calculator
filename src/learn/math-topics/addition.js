/**
 * Topic 1: Addition & Dénombrement
 */

export const additionTopic = {
  id: 'addition',
  title: 'Addition & Dénombrement',
  summary: 'Apprendre à combiner des ensembles et utiliser les propriétés arithmétiques pour calculer plus vite.',
  explanation: `
    L'addition est l'opération fondamentale qui consiste à regrouper deux ou plusieurs quantités.
    Chaque nombre dans l'addition est appelé un <strong>terme</strong>, et le résultat final est la <strong>somme</strong>.
  `,
  rules: [
    { title: 'Commutativité', formula: 'a + b = b + a', text: 'L’ordre des termes ne change pas le résultat (7 + 5 = 5 + 7 = 12).' },
    { title: 'Élément neutre (0)', formula: 'a + 0 = a', text: 'Ajouter zéro à n’importe quel nombre laisse le nombre inchangé.' },
    { title: 'Associativité', formula: '(a + b) + c = a + (b + c)', text: 'Regroupez les termes astucieusement (ex: 8 + 14 + 2 = (8 + 2) + 14 = 24).' }
  ],
  interactiveDemo: {
    type: 'counter',
    initialA: 5,
    initialB: 7,
    render(a, b) {
      return `${a} + ${b} = ${a + b}`;
    }
  },
  quiz: [
    {
      question: 'Quelle est la propriété qui affirme que 14 + 28 = 28 + 14 ?',
      options: ['La commutativité', 'L’associativité', 'La distributivité', 'L’absorption'],
      correctIndex: 0,
      explanation: 'La commutativité permet d’inverser l’ordre des termes dans une addition sans modifier la somme.'
    },
    {
      question: 'Quel est le résultat de l’addition astucieuse : 17 + 85 + 3 ?',
      options: ['102', '105', '110', '95'],
      correctIndex: 1,
      explanation: 'En associant (17 + 3) = 20, puis 20 + 85 = 105.'
    }
  ]
};
