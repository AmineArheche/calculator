/**
 * Mathematical Dictionary & Glossary Service
 * Searchable glossary of foundational math terms with definitions and examples.
 */

export const GLOSSARY_TERMS = [
  { term: 'Addition', category: 'Arithmétique', definition: 'Opération combinant deux nombres pour obtenir une somme totale.', example: '7 + 5 = 12' },
  { term: 'Soustraction', category: 'Arithmétique', definition: 'Opération trouvant la différence entre deux quantités.', example: '15 − 8 = 7' },
  { term: 'Multiplication', category: 'Arithmétique', definition: 'Addition répétée d’une même quantité un nombre donné de fois.', example: '6 × 4 = 24' },
  { term: 'Division', category: 'Arithmétique', definition: 'Partage équitable ou recherche du nombre de fois qu’un diviseur est contenu.', example: '20 ÷ 4 = 5' },
  { term: 'Fraction', category: 'Nombres', definition: 'Représentation du quotient de deux entiers sous la forme a/b (b ≠ 0).', example: '3/4 = 0,75' },
  { term: 'Numérateur', category: 'Nombres', definition: 'Terme situé au-dessus de la barre de fraction indiquant les parts prises.', example: 'Dans 3/5, le numérateur est 3' },
  { term: 'Dénominateur', category: 'Nombres', definition: 'Terme situé sous la barre de fraction indiquant le total de parts égales.', example: 'Dans 3/5, le dénominateur est 5' },
  { term: 'Décimal', category: 'Nombres', definition: 'Nombre comportant une partie entière et une virgule suivie de dixièmes/centièmes.', example: '3,1415' },
  { term: 'Pourcentage', category: 'Proportion', definition: 'Rapport exprimé sur une base normalisée de 100.', example: '25% = 25/100 = 0,25' },
  { term: 'Commutativité', category: 'Propriété', definition: 'Propriété où l’ordre des termes ne change pas le résultat.', example: 'a + b = b + a et a × b = b × a' },
  { term: 'Associativité', category: 'Propriété', definition: 'Propriété permettant de regrouper les termes librement avec parenthèses.', example: '(a + b) + c = a + (b + c)' },
  { term: 'Distributivité', category: 'Propriété', definition: 'Règle étendant le produit à une somme algébrique.', example: 'k × (a + b) = k × a + k × b' },
  { term: 'PEMDAS', category: 'Algèbre', definition: 'Acronyme mnémonique de l’ordre des opérations : Parenthèses, Exposants, Multiplications/Divisions, Additions/Soustractions.', example: '2 + 3 × 4 = 14' },
  { term: 'Nombre Premier', category: 'Arithmétique', definition: 'Entier naturel supérieur à 1 qui ne possède que deux diviseurs : 1 et lui-même.', example: '2, 3, 5, 7, 11, 13, 17...' },
  { term: 'Racine Carrée', category: 'Puissances', definition: 'Nombre positif qui, multiplié par lui-même, donne le nombre sous le radical.', example: '√49 = 7' },
  { term: 'Hypoténuse', category: 'Géométrie', definition: 'Plus long côté d’un triangle rectangle, opposé à l’angle droit.', example: 'Théorème de Pythagore : c² = a² + b²' }
];

export class MathGlossary {
  constructor(terms = GLOSSARY_TERMS) {
    this.terms = terms;
  }

  getAllTerms() {
    return this.terms;
  }

  search(query) {
    if (!query || typeof query !== 'string') return this.terms;
    const clean = query.trim().toLowerCase();
    if (!clean) return this.terms;

    return this.terms.filter((t) => 
      t.term.toLowerCase().includes(clean) ||
      t.definition.toLowerCase().includes(clean) ||
      t.category.toLowerCase().includes(clean)
    );
  }

  getByCategory(category) {
    return this.terms.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  getCategories() {
    return Array.from(new Set(this.terms.map((t) => t.category)));
  }
}
