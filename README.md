# VTC Connect Pro 2025

Plateforme VTC Connect Pro - Solution complète de gestion et réservation VTC avec backend Node.js, frontend Next.js, authentification Clerk, système de paiement intégré, géolocalisation en temps réel, notifications push et interface administrateur avancée.

## 🏗️ Architecture Mono-Repo

```
vtc-connect-pro-2025/
├── app/                 # Next.js + Clerk (PRINCIPAL)
│   ├── src/
│   │   ├── app/        # Pages Next.js
│   │   ├── components/ # Composants réutilisables
│   │   └── middleware.ts
│   └── package.json
├── api/                 # Backend Node.js (anciennement backend/)
│   ├── routes/         # API endpoints
│   ├── models/         # Modèles MongoDB
│   ├── middleware/     # Middlewares Express
│   └── server.js
├── docker-compose.yml   # Orchestration
└── package.json         # Scripts workspace
```

## 🚀 Fonctionnalités

- **Gestion des courses** : Planification, suivi en temps réel, historique
- **Système financier** : Gestion des revenus, dépenses, analyses détaillées
- **Intelligence artificielle** : Optimisation d'itinéraires, prédiction de demande
- **Communauté** : Forum entre chauffeurs, conseils, discussions
- **Interface moderne** : Design responsive avec Tailwind CSS
- **Authentification sécurisée** : Système Clerk avec protection des routes
- **Notifications** : Système d'email et notifications push

## 🛠 Technologies

### Frontend (app/)
- **Next.js 15** avec App Router
- **Clerk** pour l'authentification
- **Tailwind CSS** pour le styling
- **TypeScript** pour la sécurité de type
- **React 19** pour l'interface utilisateur

### Backend (api/)
- **Node.js + Express.js**
- **MongoDB** avec Mongoose
- **Redis** pour la mise en cache
- **Stripe** pour les paiements
- **OpenAI** pour l'IA
- **JWT** pour l'authentification API
- **Nodemailer** pour les emails

### Infrastructure
- **Docker & Docker Compose**
- **Workspaces npm** pour la gestion mono-repo
- **MongoDB + Redis** pour les données
- **Support Vercel** pour le déploiement

## 📦 Installation

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/vidaluca77-cloud/vtc-connect-pro-2025.git
cd vtc-connect-pro-2025

# Installer toutes les dépendances
npm run install:all

# Démarrer en mode développement
npm run dev:all
```

### Installation détaillée

1. **Cloner et installer**
```bash
git clone https://github.com/vidaluca77-cloud/vtc-connect-pro-2025.git
cd vtc-connect-pro-2025
npm install
```

2. **Configuration des variables d'environnement**
```bash
# API
cp api/.env.example api/.env
# Configurer MongoDB, Redis, Stripe, etc.

# App (Clerk)
# Ajouter les clés Clerk dans app/.env.local
```

```bash
# Développement - services séparés
npm run dev:app    # Next.js sur port 3000
npm run dev:api    # API sur port 5000

# Développement - tous les services
npm run dev:all    # App + API en parallèle

# Production
npm run build      # Build du frontend
npm run start      # Start production
```

### Option Docker (Recommandé)

```bash
# Lancer avec Docker Compose
npm run docker:build

# Ou directement
docker compose up --build
```

L'application sera disponible sur :
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🔧 Configuration

### Variables d'environnement API (api/.env)

```env
# Application
NODE_ENV=development
PORT=5000

# Base de données
MONGODB_URI=mongodb://localhost:27017/vtcconnectpro
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=votre-clé-secrète-jwt
JWT_EXPIRES_IN=15m

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_clé_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# OpenAI (optionnel)
OPENAI_API_KEY=sk-proj-votre-clé-openai

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
```

### Variables d'environnement App (app/.env.local)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_votre_clé_publique
CLERK_SECRET_KEY=sk_test_votre_clé_secrète

# URLs Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# API
NEXT_PUBLIC_API_URL=http://localhost:5000
```
```

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev              # Next.js app
npm run dev:app          # Next.js app seulement
npm run dev:api          # API seulement  
npm run dev:all          # App + API en parallèle

# Build et Production
npm run build            # Build app
npm run build:app        # Build app seulement
npm run start            # Start app en production
npm run start:api        # Start API en production

# Tests et qualité
npm run lint             # Lint app
npm run test             # Test API

# Docker
npm run docker:up        # Démarrer les containers
npm run docker:down      # Arrêter les containers
npm run docker:build     # Build et démarrer

# Utilitaires
npm run install:all      # Installer toutes les dépendances
```

## 👤 Authentification

L'application utilise **Clerk** pour l'authentification :
- Inscription/Connexion sécurisée
- Gestion des sessions
- Protection des routes
- Profils utilisateur

Configuration Clerk requise dans `app/.env.local`

## 📱 Utilisation

### Pages principales

1. **Page d'accueil** (`/`) - Présentation de la plateforme
2. **Connexion** (`/sign-in`) - Authentification Clerk
3. **Inscription** (`/sign-up`) - Création de compte Clerk
4. **Tableau de bord** (`/dashboard`) - Vue d'ensemble, statistiques
5. **Finances** (`/finances`) - Gestion financière, analyses, transactions
6. **Planning** (`/planning`) - Planification et suivi des courses
7. **Communauté** (`/community`) - Forum entre chauffeurs, conseils
8. **Profil** (`/profile`) - Gestion du profil utilisateur
9. **IA** (`/ia`) - Outils d'intelligence artificielle
10. **Interface Web** (`/web`) - Interface complète

### API Endpoints

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription  
- `GET /api/dashboard` - Données du tableau de bord
- `GET /api/transactions` - Liste des transactions
- `POST /api/payments/create-intent` - Création d'intention de paiement
- `GET /api/admin/dashboard` - Tableau de bord administrateur
- `POST /api/ai/optimize-route` - Optimisation d'itinéraire IA
- `POST /api/email/welcome` - Envoi d'email de bienvenue

## 🏗 Architecture mise à jour

```
vtc-connect-pro-2025/
├── app/                     # Next.js + Clerk (PRINCIPAL)
│   ├── src/
│   │   ├── app/            # Pages Next.js App Router
│   │   │   ├── dashboard/  # Page tableau de bord
│   │   │   ├── finances/   # Page finances  
│   │   │   ├── planning/   # Page planning
│   │   │   ├── community/  # Page communauté
│   │   │   ├── sign-in/    # Page connexion
│   │   │   └── sign-up/    # Page inscription
│   │   ├── components/     # Composants réutilisables
│   │   └── middleware.ts   # Middleware Clerk
│   ├── next.config.ts      # Configuration Next.js
│   └── package.json        # Dépendances frontend
├── api/                     # Backend Node.js (ex-backend/)
│   ├── routes/             # Routes API Express
│   ├── models/             # Modèles MongoDB
│   ├── middleware/         # Middlewares Express
│   ├── server.js           # Point d'entrée API
│   └── package.json        # Dépendances backend
├── docker-compose.yml       # Configuration Docker
├── package.json            # Scripts workspace root
└── README.md              # Documentation
```

## 🚢 Déploiement

### Vercel (Frontend + Full-Stack)
1. Connecter le repository à Vercel
2. Configurer les variables d'environnement Clerk
3. Le build se fait automatiquement avec `npm run build`
4. Next.js gère le SSR et les API routes

### Railway/Render (API séparée)
1. Déployer le dossier `api/` séparément
2. Configurer les variables d'environnement
3. Connecter MongoDB Atlas et Redis
4. Utiliser `npm run start --workspace=api`

### Docker (Développement/Production)
```bash
# Production avec Docker
docker compose up --build

# Développement avec hot reload
npm run dev:all
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changes (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Email : support@vtcconnectpro.com

---

**VTC Connect Pro 2025** - Votre partenaire pour une activité VTC réussie ! 🚗💼
