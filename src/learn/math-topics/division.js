/**
 * Topic 4: Division & Partages
 */

export const divisionTopic = {
  id: 'division',
  title: 'Division & Partages',
  summary: 'Partager équitablement des quantités et comprendre la division euclidienne.',
  explanation: `
    La division permet de répartir une quantité totale en un nombre précis de parts égales.
    Le nombre à diviser est le <strong>dividende</strong>, le nombre de parts est le <strong>diviseur</strong>,
    et la valeur de chaque part est le <strong>quotient</strong>.
  `,
  rules: [
    { title: 'Division par zéro', formula: 'a ÷ 0 = Impossible', text: 'On ne peut pas partager un gâteau entre 0 personnes ! Cela n’a aucun sens mathématique.' },
    { title: 'Inverse de la multiplication', formula: 'a ÷ b = c ⇔ b × c = a', text: 'Puisque 6 × 7 = 42, alors 42 ÷ 6 = 7 et 42 ÷ 7 = 6.' },
    { title: 'Division d’un nombre par lui-même', formula: 'a ÷ a = 1 (pour a ≠ 0)', text: 'Partager 8 bonbons entre 8 enfants donne exactement 1 bonbon chacun.' }
  ],
  interactiveDemo: {
    type: 'division',
    initialA: 84,
    initialB: 4,
    render(a, b) {
      if (b === 0) return 'Division impossible';
      return `${a} ÷ ${b} = ${a / b}`;
    }
  },
  quiz: [
    {
      question: 'Combien font 72 divisé par 9 ?',
      options: ['6', '7', '8', '9'],
      correctIndex: 2,
      explanation: '72 ÷ 9 = 8 car 8 × 9 = 72.'
    },
    {
      question: 'Pourquoi la calculatrice affiche-t-elle "Cannot divide by zero" ?',
      options: [
        'Parce que le résultat est toujours zéro',
        'Parce que la division par zéro est indéfinie en mathématiques',
        'Parce que le processeur manque de mémoire',
        'Parce que le résultat est négatif'
      ],
      correctIndex: 1,
      explanation: 'Aucun nombre réel multiplié par 0 ne peut redonner un nombre non-nul. L’opération n’a pas de solution.'
    }
  ]
};
