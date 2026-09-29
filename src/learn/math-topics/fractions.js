/**
 * Topic 5: Fractions & Proportions
 */

export const fractionsTopic = {
  id: 'fractions',
  title: 'Fractions & Proportions',
  summary: 'Visualiser des portions d’unité et comprendre la simplification des fractions.',
  explanation: `
    Une fraction représente le rapport entre deux grandeurs entières.
    Le <strong>dénominateur</strong> (en bas) indique en combien de parts l'unité est découpée.
    Le <strong>numérateur</strong> (en haut) indique combien de parts on possède.
  `,
  rules: [
    { title: 'Équivalence', formula: 'a/b = (a×k) / (b×k)', text: 'Multiplier le haut et le bas par un même nombre ne change pas la valeur (1/2 = 2/4 = 4/8).' },
    { title: 'Passage en décimal', formula: '1/4 = 0,25 | 1/2 = 0,5 | 3/4 = 0,75', text: 'Une fraction est avant tout une division en attente.' },
    { title: 'Fraction unitaire', formula: 'a / a = 1', text: 'Prendre toutes les parts revient à posséder l’objet entier.' }
  ],
  interactiveDemo: {
    type: 'fraction',
    initialA: 3,
    initialB: 4,
    render(a, b) {
      return `${a}/${b} = ${a / b}`;
    }
  },
  quiz: [
    {
      question: 'Quelle est la valeur décimale exacte de la fraction 3/4 ?',
      options: ['0,34', '0,75', '0,60', '0,80'],
      correctIndex: 1,
      explanation: '3 divisé par 4 donne exactement 0,75.'
    },
    {
      question: 'Si vous simplifiez la fraction 10/20 par 10, vous obtenez :',
      options: ['1/2', '2/1', '1/10', '5/10'],
      correctIndex: 0,
      explanation: '10 ÷ 10 = 1 et 20 ÷ 10 = 2, donc 10/20 se simplifie en 1/2.'
    }
  ]
};
