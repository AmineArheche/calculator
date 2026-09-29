# 🧮 Calculatrice Moderne & Élégante

Une application web de calculatrice haut de gamme, fluide et responsive, développée en **HTML5**, **CSS3 pur (Flexbox / Grid / Glassmorphism)** et **JavaScript (ES6+)**.

---

## ✨ Fonctionnalités Clés

### 🎨 Design & Ergonomie (UI / UX)
- **Design Sombre Premium :** Effet verre dépoli (*Glassmorphism*), fond avec lueurs d'ambiance dynamiques (*mesh glows*), boutons aux couleurs distinctes et retour visuel tactile.
- **Affichage Double Ligne (Dual Display) :**
  - Ligne secondaire : Visualisation de l'expression ou de la formule en cours (`ex: 1 250 × 4 +`).
  - Ligne principale : Résultat ou nombre saisi avec ajustement automatique de la taille de police et séparateur de milliers pour une lisibilité parfaite.
- **100% Responsive :** Parfaitement optimisé pour smartphone, tablette et écran d'ordinateur.

### ⚡ Fonctions Arithmétiques & Avancées
- **Opérations de base :** Addition (`+`), Soustraction (`−`), Multiplication (`×`), Division (`÷`).
- **Précision Haute-Fidélité :** Correction automatique des imprécisions de calcul flottant en JavaScript (évite les `0.1 + 0.2 = 0.30000000000000004`).
- **Pourcentage Intelligent (`%`) :** Calcule les pourcentages contextuels (`100 + 20% = 120`).
- **Inversion de Signe (`±`) :** Permet de basculer facilement entre positif et négatif.
- **Effacement Intelligent :**
  - Touche `⌫` (Backspace) pour supprimer le dernier caractère saisi.
  - Touche `AC` / `C` pour effacement complet ou partiel.
- **Gestion Robuste des Erreurs :** Message clair lors d'une division par zéro (`Division par zéro`) sans bloquer l'interface.

### 🚀 Bonus Intégrés
- **Panneau d'Historique Déroulant :**
  - Conserve les calculs effectués avec horodatage (synchronisé dans le `localStorage`).
  - Cliquez sur n'importe quelle entrée passée pour réinjecter son résultat dans la calculatrice.
  - Bouton pour vider l'historique en un clic.
- **Support Clavier Physique Intégral :** Tapez directement sur votre clavier avec simulation visuelle des touches pressées.
- **Copie Facile :** Cliquez sur l'icône de copie ou directement sur le grand écran pour copier la valeur dans le presse-papier.
- **Retour Sonore Tactile (Web Audio API) :** Bruits de clic subtils et chimes de validation sans aucun fichier MP3 externe (activable/désactivable avec le bouton dédié).

---

## ⌨️ Raccourcis Clavier

| Touche Clavier | Action dans la calculatrice |
| :--- | :--- |
| `0` à `9` | Saisie des chiffres |
| `.` ou `,` | Virgule décimale |
| `+` | Addition |
| `-` | Soustraction |
| `*` | Multiplication |
| `/` | Division |
| `Entrée` ou `=` | Calculer le résultat (`=`) |
| `Backspace` (Retour) | Effacer le dernier chiffre (`⌫`) |
| `Échap` (Escape) ou `Suppr` | Tout effacer (`AC`) |
| `%` | Pourcentage |

---

## 🚀 Comment Lancer l'Application

Aucun serveur ou installation `node_modules` n'est nécessaire !

1. Ouvrez simplement le fichier **`index.html`** dans votre navigateur web préféré (Chrome, Firefox, Edge, Safari, Brave, etc.) :
   - Soit par un double-clic sur `index.html`.
   - Soit par un clic droit > *Ouvrir avec...* > *Votre navigateur*.
2. Profitez immédiatement de votre calculatrice !

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.