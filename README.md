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

## ✅ Statut de Déploiement
- Scripts Vercel vérifiés et configurés dans package.json racine
- vercel-build et vercel-install scripts présents et optimisés
- Prêt pour déploiement automatique sur Vercel

<!-- Verification complete - vercel-build and vercel-install scripts confirmed - 2025-09-05 21:21 CEST -->
<!-- Force deployment trigger - 2025-09-05 21:27 CEST -->
