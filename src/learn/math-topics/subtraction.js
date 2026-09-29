/**
 * Topic 2: Soustraction & Différences
 */

export const subtractionTopic = {
  id: 'subtraction',
  title: 'Soustraction & Différences',
  summary: 'Comprendre l’écart entre deux valeurs et l’inverse de l’addition.',
  explanation: `
    La soustraction permet de déterminer ce qui reste après avoir retiré une partie d'un tout,
    ou de mesurer la distance/différence entre deux grandeurs. Le résultat s'appelle la <strong>différence</strong>.
  `,
  rules: [
    { title: 'Non-commutativité', formula: 'a − b ≠ b − a', text: '12 − 5 = 7, mais 5 − 12 = −7. L’ordre est fondamental !' },
    { title: 'Lien avec l’addition', formula: 'a − b = c ⇔ c + b = a', text: 'La soustraction vérifie toujours l’addition réciproque.' },
    { title: 'Soustraction de soi-même', formula: 'a − a = 0', text: 'Retirer à un nombre sa propre valeur donne toujours zéro.' }
  ],
  interactiveDemo: {
    type: 'difference',
    initialA: 50,
    initialB: 18,
    render(a, b) {
      return `${a} − ${b} = ${a - b}`;
    }
  },
  quiz: [
    {
      question: 'Si vous avez 45 billes et en donnez 19, combien vous en reste-t-il ?',
      options: ['26', '24', '36', '28'],
      correctIndex: 0,
      explanation: '45 − 19 = 45 − 20 + 1 = 26.'
    },
    {
      question: 'Laquelle de ces affirmations est vraie concernant la soustraction ?',
      options: [
        'Elle est toujours commutative',
        'L’élément neutre à droite est 0 (a − 0 = a)',
        'Soustraire un nombre donne toujours un nombre positif',
        'a − b donne le même résultat que b − a'
      ],
      correctIndex: 1,
      explanation: 'Tout nombre dont on soustrait 0 conserve sa valeur initiale (ex: 8 − 0 = 8).'
    }
  ]
};
