/**
 * Topic 6: Nombres Décimaux & Valeurs de Position
 */

export const decimalsTopic = {
  id: 'decimals',
  title: 'Nombres Décimaux & Valeurs de Position',
  summary: 'Maîtriser la précision après la virgule et la numération en base 10.',
  explanation: `
    Les nombres décimaux permettent d'exprimer des quantités non entières avec une précision infinie.
    Le premier chiffre après la virgule correspond aux <strong>dixièmes</strong> (1/10),
    le second aux <strong>centièmes</strong> (1/100), le troisième aux <strong>millièmes</strong> (1/1000).
  `,
  rules: [
    { title: 'Valeur de position', formula: '0,1 = 1/10 | 0,01 = 1/100', text: 'Chaque pas vers la droite divise la valeur par dix.' },
    { title: 'Zéros inutiles', formula: '2,5 = 2,50 = 2,500', text: 'Ajouter des zéros à l’extrémité droite de la partie décimale ne modifie pas sa valeur.' },
    { title: 'Précision flottante', formula: '0,1 + 0,2 = 0,3', text: 'En informatique, les nombres flottants génèrent des erreurs résiduelles (0.30000000000000004) que notre moteur élimine.' }
  ],
  interactiveDemo: {
    type: 'decimal',
    initialA: 0.1,
    initialB: 0.2,
    render(a, b) {
      return `${a} + ${b} = ${Math.round((a + b) * 100) / 100}`;
    }
  },
  quiz: [
    {
      question: 'Combien font 0,5 + 0,25 ?',
      options: ['0,30', '0,70', '0,75', '0,525'],
      correctIndex: 2,
      explanation: '0,50 + 0,25 = 0,75 (soit la moitié plus un quart = trois quarts).'
    },
    {
      question: 'Dans le nombre 14,837, quel chiffre représente les centièmes ?',
      options: ['1', '8', '3', '7'],
      correctIndex: 2,
      explanation: '8 est au rang des dixièmes, 3 est au rang des centièmes, 7 est au rang des millièmes.'
    }
  ]
};
