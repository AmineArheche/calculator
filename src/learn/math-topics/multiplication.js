/**
 * Topic 3: Multiplication & Tables
 */

export const multiplicationTopic = {
  id: 'multiplication',
  title: 'Multiplication & Tables',
  summary: 'Accélérer les calculs par des additions répétées et visualiser les aires rectangulaires.',
  explanation: `
    Multiplier revient à répéter une quantité un certain nombre de fois.
    Les nombres que l'on multiplie sont des <strong>facteurs</strong>, et le résultat est le <strong>produit</strong>.
  `,
  rules: [
    { title: 'Commutativité', formula: 'a × b = b × a', text: '6 × 8 donne le même produit que 8 × 6 (48).' },
    { title: 'Élément absorbant (0)', formula: 'a × 0 = 0', text: 'Multiplier n’importe quel nombre par zéro donne toujours 0.' },
    { title: 'Distributivité', formula: 'a × (b + c) = a×b + a×c', text: 'Calcul mental : 7 × 12 = 7 × (10 + 2) = 70 + 14 = 84.' }
  ],
  interactiveDemo: {
    type: 'grid',
    initialA: 6,
    initialB: 7,
    render(a, b) {
      return `${a} × ${b} = ${a * b}`;
    }
  },
  quiz: [
    {
      question: 'Combien font 8 × 7 ?',
      options: ['54', '56', '58', '64'],
      correctIndex: 1,
      explanation: '8 × 7 = 56 (une des valeurs les plus célèbres de la table de 8).'
    },
    {
      question: 'Que vaut l’expression : 999 × 0 × 42 ?',
      options: ['999', '42', '0', 'Indéfini'],
      correctIndex: 2,
      explanation: 'Le zéro est l’élément absorbant de la multiplication : tout produit comportant un facteur 0 vaut 0.'
    }
  ]
};
