# 🧮 Calculator Pro (Calculatrice Moderne & Professionnelle)

Une application web de calculatrice haut de gamme, modulaire et prête pour la production, développée avec une architecture orientée composants, une machine à états finis (**FSM**), un moteur mathématique haute précision, un support de tests automatisés **Vitest**, et un design sombre *glassmorphism*.

---

## 🏗️ Architecture Modulaire

Le projet sépare strictement la logique métier, la persistance, l'audio et la présentation :

```
calculatrice-app/
├── index.html                   # Structure sémantique HTML5 & sélecteur de mode
├── package.json                 # Scripts Vite & dépendances Vitest
├── vite.config.js               # Configuration du bundler Vite
├── vitest.config.js             # Configuration du runner de tests Vitest (JSDOM)
├── src/
│   ├── main.js                  # Point d'entrée de l'application & initialisation
│   ├── core/
│   │   ├── math-engine.js       # Moteur arithmétique haute précision (correction IEEE 754)
│   │   ├── calculator-state.js  # Machine à états finis (Finite State Machine)
│   │   ├── history-store.js     # Gestionnaire réactif d'historique + persistance localStorage
│   │   ├── audio-engine.js      # Synthèse sonore temps réel (Web Audio API)
│   │   ├── keyboard-handler.js  # Écouteurs globaux et mappage clavier matériel
│   │   └── clipboard.js         # Service de copie presse-papier avec notifications toast
│   ├── learn/
│   │   ├── learn-data.js        # Référentiel des 10 modules pédagogiques
│   │   ├── quiz-engine.js       # Moteur de quiz réactif avec persistance des scores
│   │   ├── learn-ui.js          # Contrôleur d'interface utilisateur de l'espace cours
│   │   └── math-topics/         # 10 modules de cours interactifs
│   │       ├── addition.js
│   │       ├── subtraction.js
│   │       ├── multiplication.js
│   │       ├── division.js
│   │       ├── fractions.js
│   │       ├── decimals.js
│   │       ├── percentages.js
│   │       ├── pemdas.js
│   │       ├── negative-numbers.js
│   │       └── powers-roots.js
│   ├── ui/
│   │   ├── display.js           # Contrôleur double écran & auto-scaling de police
│   │   └── calculator-ui.js     # Médiateur de présentation DOM ↔ État
│   └── styles/
│       ├── variables.css        # Tokens de design, couleurs & verre dépoli
│       ├── layout.css           # Arrière-plan, mesh glows animés et centrage
│       ├── calculator.css       # Boîtier card, header et toast
│       ├── keypad.css           # Pavé 5x4 et retours tactiles
│       ├── history.css          # Tiroir coulissant & entrées passées
│       ├── responsive.css       # Media queries mobile, tablette et bureau
│       ├── learn.css            # Cartes d'apprentissage, glassmorphism & navigation
│       └── quiz.css             # Mini-quiz interactifs, feedback et barre de progression
└── tests/
    ├── math-engine.test.js      # Tests unitaires de précision arithmétique & cas limites
    ├── calculator-state.test.js # Tests de transitions d'états, enchaînements et erreurs
    ├── history-store.test.js    # Tests de persistance et limitation d'historique
    ├── keyboard-handler.test.js # Tests du routage des touches clavier
    ├── learn-data.test.js       # Tests unitaires validant l'exhaustivité des 10 cours
    └── quiz-engine.test.js      # Tests unitaires du moteur de quiz et scoring
```

---

## ✨ Fonctionnalités Clés

### 1. ⚙️ Machine à États & Précision Mathématique
- **Découplage UI / Logique :** La machine à états `CalculatorStateMachine` orchestre les transitions (`IDLE`, `ENTERING_FIRST_OPERAND`, `OPERATION_SELECTED`, `ENTERING_SECOND_OPERAND`, `RESULT_DISPLAYED`, `ERROR`) sans aucune dépendance directe au DOM.
- **Résolution des imprécisions IEEE 754 :** Les calculs flottants critiques (`0.1 + 0.2 = 0.3`, `0.7 + 0.1 = 0.8`, `0.2 * 0.1 = 0.02`) sont résolus avec exactitude.
- **Gestion gracieuse des erreurs :** La division par zéro affiche clairement `"Cannot divide by zero"` sans bloquer le moteur, avec réinitialisation automatique dès la saisie suivante.
- **Pourcentage contextuel :** Calcule intelligemment les augmentations/réductions (`100 + 20% = 120`).

### 2. 📜 Tiroir d'Historique Réactif & LocalStorage
- **Tiroir coulissant :** Déclenché par l'icône horloge, avec compteur badge dynamique.
- **Restauration au clic :** Cliquez sur n'importe quel calcul passé pour réinjecter immédiatement son résultat.
- **Persistance locale :** Sauvegarde automatique dans le `localStorage` avec horodatage et limite de taille.

### 3. ⌨️ Interactivité & Raccourcis Clavier
- **Support clavier intégral :** Saisie directe des chiffres, opérateurs (`+`, `-`, `*`, `/`), validation (`Entrée`, `=`), effacement (`Backspace`, `Échap`).
- **Retour visuel tactile :** Effet de pulsation synchronisé sur les boutons à chaque frappe clavier.
- **Copie au clic :** Cliquez sur l'icône de copie ou sur l'écran pour copier le résultat dans le presse-papier avec confirmation visuelle (*Toast « Copié ! »*).
- **Haptique sonore (Web Audio API) :** Clics subtils, carillon harmonique de validation et son d'alerte, désactivables via l'icône haut-parleur.

### 4. 🎓 Centre d'Apprentissage Mathématique (10 Modules Fondamentaux)
Un laboratoire interactif complet dédié aux élèves et étudiants pour maîtriser les bases du calcul :
1. **➕ Addition & Calcul Mental :** Décomposition par dizaines, associativité et astuces de vitesse.
2. **➖ Soustraction & Droite Graduée :** Différence relative, visualisation par saut et compléments à 100.
3. **✖️ Multiplication & Grille Matricielle :** Répétition d'ajouts, commutativité et tables mnémotechniques.
4. **➗ Division & Restes (Euclidienne) :** Partage équitable, quotient, reste et critères de divisibilité.
5. **🍕 Fractions & Équivalences :** Numérateur, dénominateur, simplification et fractions irréductibles.
6. **🔢 Nombres Décimaux & Valeurs de Position :** Virgule flottante, dixièmes, centièmes et alignement.
7. **🏷️ Pourcentages & Remises :** Calcul d'un taux, réductions de soldes et coefficients multiplicateurs.
8. **🎯 Priorités Opératoires (PEMDAS / BODMAS) :** Parenthèses, puissances, multiplications/divisions avant additions/soustractions.
9. **🌡️ Nombres Négatifs & Règle des Signes :** Valeurs sous zéro, double négation (`-` par `-` donne `+`) et droite numérique.
10. **⚡ Puissances & Racines Carrées :** Exposants, notation scientifique et carrés parfaits (`√144 = 12`).

- **Bouton « 🚀 Tester sur la calculatrice » :** Chaque leçon intègre un injecteur de formule en direct vers la machine à états pour tester immédiatement la théorie.
- **Mini-Quiz Didactiques :** 2 questions à choix multiples par leçon avec explications immédiates et barre de score globale synchronisée via `localStorage`.

---

## 🧪 Tests Automatisés (Vitest)

La suite complète de tests unitaires valide l'ensemble des modules arithmétiques, scientifiques, financiers, statistiques, convertisseurs, gestionnaires d'historique, quiz et accessibilité :

```bash
# Exécuter l'ensemble des 17 suites de tests
npm test

# Exécuter les tests en mode watch interactif
npm run test:watch
```

**87 tests unitaires (17 suites)** couvrent l'intégralité du projet :
- `math-engine.test.js` : Précision arithmétique, flottants IEEE 754, arrondis et divisions par zéro
- `calculator-state.test.js` : Machine à états finis (FSM), enchaînements d'opérations et réinitialisation
- `scientific-engine.test.js` : Trigonométrie DEG/RAD, logarithmes (ln, log10, log2), racines n-ièmes et factorielles
- `history-store.test.js` : Persistance localStorage et limitations de capacité
- `keyboard-handler.test.js` : Routage des frappes clavier physique
- `theme-manager.test.js` : Gestion des thèmes visuels (Nebula, OLED, Cyberpunk, Frost) et persistance
- `sound-presets.test.js` : Profils audio Web Audio API (Mécanique, Bulle, 8-bit, Sci-Fi)
- `unit-converter.test.js` : Conversions de longueurs, masses, températures et stockage numérique
- `finance-math.test.js` : Intérêts composés, mensualités de prêts et ROI
- `stats-engine.test.js` : Moyenne, médiane, mode, variance d'échantillon/population et écart-type
- `math-glossary.test.js` : Recherche plein texte et filtrage catégoriel du lexique mathématique
- `daily-challenge.test.js` : Défis quotidiens déterministes, calcul de séries (streaks) et badges
- `practice-generator.test.js` : Générateur dynamique d'exercices d'entraînement et validation de saisie
- `learn-data.test.js` : Validation de l'exhaustivité didactique des 10 cours de mathématiques
- `quiz-engine.test.js` : Moteur de quiz, validation de réponses et persistance de score
- `review-fixes.test.js` : Évaluation multi-jetons séquentielle, reset de quiz et isolation clavier
- `a11y-manager.test.js` : Annonces vocales en direct pour lecteurs d'écran (aria-live polite/assertive)

---

## 🚀 Développement & Build de Production

```bash
# Lancer le serveur de développement local Vite
npm run dev

# Compiler le bundle de production optimisé
npm run build

# Prévisualiser la version de production
npm run preview
```

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE).