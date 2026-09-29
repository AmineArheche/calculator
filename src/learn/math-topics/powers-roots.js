/**
 * Topic 10: Puissances & Racines Carrées
 */

export const powersRootsTopic = {
  id: 'powers',
  title: 'Puissances & Racines Carrées',
  summary: 'Comprendre l’élévation au carré, les exposants et l’opération réciproque de la racine.',
  explanation: `
    La puissance correspond à la multiplication répétée d'un même nombre par lui-même.
    La racine carrée (√) est l'opération inverse : quel nombre multiplié par lui-même donne la valeur voulue ?
  `,
  rules: [
    { title: 'Carré d’un nombre', formula: 'a² = a × a', text: '5² = 5 × 5 = 25. 9² = 9 × 9 = 81.' },
    { title: 'Racine carrée', formula: '√a² = a (pour a ≥ 0)', text: '√64 = 8 car 8 × 8 = 64.' },
    { title: 'Puissance zéro', formula: 'a⁰ = 1 (pour a ≠ 0)', text: 'Tout nombre réel non-nul élevé à la puissance 0 vaut exactement 1.' }
  ],
  interactiveDemo: {
    type: 'power',
    initialBase: 6,
    render(base) {
      return `${base}² = ${base * base} ⇔ √${base * base} = ${base}`;
    }
  },
  quiz: [
    {
      question: 'Combien vaut 2 élevé à la puissance 4 (2⁴) ?',
      options: ['8', '12', '16', '32'],
      correctIndex: 2,
      explanation: '2⁴ = 2 × 2 × 2 × 2 = 16 (et non 2 × 4 = 8 !).'
    },
    {
      question: 'Quelle est la racine carrée exacte de 81 (√81) ?',
      options: ['7', '8', '9', '18'],
      correctIndex: 2,
      explanation: '9 × 9 = 81, donc √81 = 9.'
    }
  ]
};
