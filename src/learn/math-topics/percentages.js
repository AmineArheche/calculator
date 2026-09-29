/**
 * Topic 7: Pourcentages & Vie Quotidienne
 */

export const percentagesTopic = {
  id: 'percentages',
  title: 'Pourcentages & Vie Quotidienne',
  summary: 'Calculer des soldes, taxes et augmentations sur une base normalisée de 100.',
  explanation: `
    Le mot pourcentage signifie littéralement "pour chaque centaine".
    Il s'agit d'une fraction dont le dénominateur est 100 (ex: 20% = 20/100 = 0,20).
  `,
  rules: [
    { title: 'Calcul direct', formula: 'Valeur = Total × (Pourcentage / 100)', text: 'Pour calculer 30% de 200 € : 200 × 0,30 = 60 €.' },
    { title: 'Remise commerciale', formula: 'Nouveau Prix = Initial − (Initial × Remise%)', text: 'Un vêtement à 80 € soldé à -25% coûte 80 − 20 = 60 €.' },
    { title: 'Astuce 10%', formula: '10% de X = X ÷ 10', text: 'Pour trouver 10%, déplacez simplement la virgule d’un rang vers la gauche (10% de 450 = 45).' }
  ],
  interactiveDemo: {
    type: 'percent',
    initialTotal: 150,
    initialPercent: 20,
    render(total, percent) {
      return `${percent}% de ${total} = ${(total * percent) / 100}`;
    }
  },
  quiz: [
    {
      question: 'Combien vaut une remise de 20% sur un article à 50 € ?',
      options: ['5 €', '10 €', '15 €', '20 €'],
      correctIndex: 1,
      explanation: '50 × (20 / 100) = 50 × 0,2 = 10 € de réduction (l’article coûte alors 40 €).'
    },
    {
      question: 'Que vaut 50% d’un nombre ?',
      options: ['Son double', 'Son tiers', 'Sa moitié', 'Son quart'],
      correctIndex: 2,
      explanation: '50% = 50/100 = 1/2, soit la moitié exacte.'
    }
  ]
};
