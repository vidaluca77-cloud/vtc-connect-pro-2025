# VTC Connect Pro 2025

Plateforme VTC Connect Pro - Solution complète de gestion et réservation VTC avec backend Node.js, frontend React, système de paiement intégré, géolocalisation en temps réel, notifications push et interface administrateur avancée.

## 🚀 Fonctionnalités

- **Gestion des courses** : Planification, suivi en temps réel, historique
- **Système financier** : Gestion des revenus, dépenses, paiements Stripe
- **Intelligence artificielle** : Optimisation d'itinéraires, prédiction de demande
- **Communauté** : Échanges entre chauffeurs, conseils, discussions
- **Interface moderne** : Design responsive avec Material-UI
- **Sécurité** : Authentification JWT, chiffrement des données
- **Notifications** : Système d'email et notifications push

## 🛠 Technologies

### Backend
- Node.js + Express.js
- MongoDB avec Mongoose
- Redis pour la mise en cache
- Stripe pour les paiements
- OpenAI pour l'IA
- JWT pour l'authentification
- Nodemailer pour les emails

### Frontend
- React 18 + Material-UI
- Redux Toolkit pour l'état global
- Chart.js pour les graphiques
- React Router pour la navigation

### Infrastructure
- Docker & Docker Compose
- MongoDB + Redis
- Support Vercel pour le déploiement

## 📦 Installation

### Option 1: Développement local

1. **Cloner le repository**
```bash
git clone https://github.com/vidaluca77-cloud/vtc-connect-pro-2025.git
cd vtc-connect-pro-2025
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npm run dev
```

3. **Frontend Setup** (nouvel terminal)
```bash
cd frontend
npm install
npm start
```

### Option 2: Docker (Recommandé)

1. **Lancer avec Docker Compose**
```bash
docker-compose up --build
```

L'application sera disponible sur :
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

## 🔧 Configuration

### Variables d'environnement Backend (.env)

```env
# Application
NODE_ENV=development
PORT=5000

# Base de données
MONGODB_URI=mongodb://localhost:27017/vtcconnectpro

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

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 👤 Compte de test

Pour tester l'application rapidement :
- **Email** : test@test.com
- **Mot de passe** : password

## 📱 Utilisation

### Pages principales

1. **Page d'accueil** (`/`) - Présentation de la plateforme
2. **Connexion** (`/login`) - Authentification
3. **Inscription** (`/register`) - Création de compte
4. **Tableau de bord** (`/dashboard`) - Vue d'ensemble, statistiques
5. **Finances** (`/finances`) - Gestion financière, transactions
6. **Planning** (`/planning`) - Planification des courses
7. **Communauté** (`/community`) - Échanges entre chauffeurs
8. **Profil** (`/profile`) - Gestion du profil utilisateur

### API Endpoints

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/dashboard` - Données du tableau de bord
- `GET /api/transactions` - Liste des transactions
- `POST /api/payments/create-intent` - Création d'intention de paiement
- `GET /api/admin/dashboard` - Tableau de bord administrateur
- `POST /api/ai/optimize-route` - Optimisation d'itinéraire IA
- `POST /api/email/welcome` - Envoi d'email de bienvenue

## 🏗 Architecture

```
vtc-connect-pro-2025/
├── backend/                 # API Node.js
│   ├── routes/             # Routes API
│   ├── models/             # Modèles MongoDB
│   ├── middleware/         # Middlewares Express
│   ├── server.js           # Point d'entrée
│   └── Dockerfile          # Container backend
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── store/          # Redux store
│   │   └── App.js          # Composant principal
│   └── Dockerfile          # Container frontend
├── docker-compose.yml      # Configuration Docker
└── README.md              # Documentation
```

## 🚢 Déploiement

### Vercel (Frontend)
1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Heroku/Railway (Backend)
1. Configurer les variables d'environnement
2. Connecter MongoDB Atlas
3. Déployer l'API

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
