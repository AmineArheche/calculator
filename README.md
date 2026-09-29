# 🧮 Calculator Pro (Calculatrice Moderne & Professionnelle)

Une application web de calculatrice haut de gamme, modulaire et prête pour la production, développée avec une architecture orientée composants, une machine à états finis (**FSM**), un moteur mathématique haute précision, un support de tests automatisés **Vitest**, et un design sombre *glassmorphism*.

---

## 🏗️ Architecture Modulaire

Le projet sépare strictement la logique métier, la persistance, l'audio et la présentation :

```
calculatrice-app/
├── index.html                   # Structure sémantique HTML5
├── package.json                 # Scripts Vite & dépendances Vitest
├── vite.config.js               # Configuration du bundler Vite
├── vitest.config.js             # Configuration du runner de tests Vitest (JSDOM)
├── src/
│   ├── main.js                  # Point d'entrée de l'application
│   ├── core/
│   │   ├── math-engine.js       # Moteur arithmétique haute précision (correction IEEE 754)
│   │   ├── calculator-state.js  # Machine à états finis (Finite State Machine)
│   │   ├── history-store.js     # Gestionnaire réactif d'historique + persistance localStorage
│   │   ├── audio-engine.js      # Synthèse sonore temps réel (Web Audio API)
│   │   ├── keyboard-handler.js  # Écouteurs globaux et mappage clavier matériel
│   │   └── clipboard.js         # Service de copie presse-papier avec notifications toast
│   ├── ui/
│   │   ├── display.js           # Contrôleur double écran & auto-scaling de police
│   │   └── calculator-ui.js     # Médiateur de présentation DOM ↔ État
│   └── styles/
│       ├── variables.css        # Tokens de design, couleurs & verre dépoli
│       ├── layout.css           # Arrière-plan, mesh glows animés et centrage
│       ├── calculator.css       # Boîtier card, header et toast
│       ├── keypad.css           # Pavé 5x4 et retours tactiles
│       ├── history.css          # Tiroir coulissant & entrées passées
│       └── responsive.css       # Media queries mobile, tablette et bureau
└── tests/
    ├── math-engine.test.js      # Tests unitaires de précision arithmétique & cas limites
    ├── calculator-state.test.js # Tests de transitions d'états, enchaînements et erreurs
    ├── history-store.test.js    # Tests de persistance et limitation d'historique
    └── keyboard-handler.test.js # Tests du routage des touches clavier
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

---

## 🧪 Tests Automatisés (Vitest)

La suite de tests unitaires valide l'ensemble des règles métier, la machine à états et les raccourcis clavier :

```bash
# Exécuter les tests une fois
npm test

# Exécuter les tests en mode watch interactif
npm run test:watch
```

30 tests unitaires couvrent :
- Précision arithmétique et arrondis
- Protection contre la division par zéro
- Enchaînement d'opérations et calculs continus
- Persistance et restauration de l'historique
- Mappage des touches du clavier matériel

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