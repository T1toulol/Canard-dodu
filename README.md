# Canard Dodu - Application de Gestion

Application web de gestion pour le commerce "Canard Dodu", permettant de gérer les produits, les commandes et les clients.

## 🚀 Fonctionnalités

- Gestion des produits (ajout, modification, suppression)
- Gestion des commandes
- Gestion des clients
- Gestion des remises
- Interface responsive
- Upload d'images pour les produits

## 📦 Installation

1. Clonez le repository
```bash
git clone <url-du-repo>
cd canard-dodu
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env.local
# Éditez .env.local avec vos configurations
```

4. Lancez le serveur de développement
```bash
npm run dev
```

## 📁 Structure du projet

```
canard-dodu/
├── public/                # Fichiers statiques
│   └── images/
│       ├── produits/     # Images des produits
│       ├── layout/       # Images du layout
│       └── icons/        # Icônes
├── src/
│   ├── app/             # Pages et routes Next.js
│   ├── components/      # Composants React
│   ├── types/          # Types TypeScript
│   └── lib/            # Utilitaires et configurations
└── scripts/            # Scripts utilitaires
```

## 🖼️ Gestion des images

Pour ajouter des images de produits :

1. Placez vos images dans le dossier `public/images/produits/`
2. Utilisez le chemin `/images/produits/nom-image.jpg` dans l'interface

## 🛠️ Technologies utilisées

- Next.js 13+
- React 18
- TypeScript
- Tailwind CSS
- API Routes

## 📝 License

MIT 

## 🎨 Interface Utilisateur

### Page d'accueil
![Maquette Accueil](docs/maquettes/accueil.png)

| Zone | Description |
|------|-------------|
| En-tête | Navigation principale avec logo et menu |
| Statistiques | Affichage des KPI (clients, commandes, produits) |
| Actions rapides | Boutons d'accès aux fonctions principales |

### Gestion des commandes

![Maquette Commandes](docs/maquettes/commandes.png)

| Zone | Type de champ | Contrôle | Référentiel utilisé |
|------|---------------|-----------|-------------------|
| Client | Liste déroulante | Sélection obligatoire | Liste des clients (BD) |
| Produit | Zone de saisie + auto-complétion | Numérique | Catalogue produits |
| Quantité | Zone de saisie | Valeur > 0 | - |
| Remise | Automatique | Lecture seule | Calculée selon règles commerciales |

#### Contrôles et validations
- Le client doit être sélectionné avant d'ajouter des produits
- La quantité doit être supérieure à 0
- Les remises sont calculées automatiquement selon :
  - Le statut du client (standard, premium, VIP)
  - Le montant total de la commande
  - Les promotions en cours

### Gestion des produits

![Maquette Produits](docs/maquettes/produits.png)

| Zone | Type de champ | Contrôle | Référentiel utilisé |
|------|---------------|-----------|-------------------|
| Nom | Zone de texte | Obligatoire | - |
| Description | Zone de texte multiligne | Optionnel | - |
| Prix | Zone de saisie | Numérique > 0 | - |
| Catégorie | Liste déroulante | Obligatoire | Liste des catégories |
| Image | Upload de fichier | Format image | - |

### Gestion des clients

![Maquette Clients](docs/maquettes/clients.png)

| Zone | Type de champ | Contrôle | Référentiel utilisé |
|------|---------------|-----------|-------------------|
| Nom | Zone de texte | Obligatoire | - |
| Email | Zone de texte | Format email | - |
| Téléphone | Zone de texte | Format téléphone | - |
| Adresse | Zone de texte multiligne | Obligatoire | - |
| Type | Liste déroulante | Obligatoire | Types de client |

### Règles de design

#### Palette de couleurs
- Principal : `#4F46E5` (Indigo 600)
- Secondaire : `#059669` (Emerald 600)
- Accent : `#D97706` (Amber 600)
- Texte : `#111827` (Gray 900)
- Fond : `#F9FAFB` (Gray 50)

#### Typographie
- Titres : Inter, sans-serif
- Corps : Inter, sans-serif
- Tailles :
  - H1 : 24px (1.5rem)
  - H2 : 20px (1.25rem)
  - Corps : 16px (1rem)
  - Small : 14px (0.875rem)

#### Composants communs
- Boutons :
  - Principal : Fond indigo, texte blanc
  - Secondaire : Bordure indigo, texte indigo
  - Danger : Fond rouge, texte blanc
- Champs de formulaire :
  - Hauteur : 40px
  - Bordure arrondie : 6px
  - État focus : Bordure indigo
- Messages :
  - Succès : Fond vert clair
  - Erreur : Fond rouge clair
  - Info : Fond bleu clair

#### Responsive Design
- Breakpoints :
  - Mobile : < 640px
  - Tablette : 640px - 1024px
  - Desktop : > 1024px
- Grille :
  - Mobile : 1 colonne
  - Tablette : 2 colonnes
  - Desktop : 3-4 colonnes

### Navigation et flux utilisateur

1. **Création d'une commande** :
   ```
   Accueil → Nouvelle commande → Sélection client → Ajout produits → Validation
   ```

2. **Gestion des produits** :
   ```
   Accueil → Produits → [Ajouter/Modifier/Supprimer]
   ```

3. **Gestion des clients** :
   ```
   Accueil → Clients → [Ajouter/Modifier/Supprimer]
   ```

Les maquettes détaillées sont disponibles dans le dossier `docs/maquettes/` du projet. 