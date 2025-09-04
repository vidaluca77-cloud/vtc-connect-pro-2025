# VTC Connect Pro 2025 - Next.js App with Clerk Authentication

Cette application Next.js remplace l'ancienne structure React et intègre l'authentification Clerk pour Vercel.

## 🏗 Structure de l'Application

```
app/src/app/
├── layout.tsx          # Layout principal avec ClerkProvider
├── page.tsx            # Page d'accueil avec authentification
├── sign-in/            # Page de connexion Clerk
├── sign-up/            # Page d'inscription Clerk
├── dashboard/          # Tableau de bord principal
├── ia/                 # Interface Intelligence Artificielle
├── web/                # Interface Web (hub principal)
├── finances/           # Gestion financière
├── planning/           # Planification des courses
├── community/          # Communauté des chauffeurs
└── profile/            # Profil utilisateur
```

## 🔐 Authentification Clerk

L'application utilise Clerk pour l'authentification, permettant aux utilisateurs de :
- Créer un compte facilement
- Se connecter de manière sécurisée
- Gérer leur profil
- Accéder aux fonctionnalités protégées

## 🚀 Déploiement Vercel

### Variables d'environnement requises :

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** : Clé publique Clerk
2. **CLERK_SECRET_KEY** : Clé secrète Clerk
3. **NEXT_PUBLIC_API_URL** : URL de l'API backend (optionnel)

### Étapes de déploiement :

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

## 🛠 Développement Local

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build
```

## 📱 Pages et Fonctionnalités

### Pages Publiques
- **/** : Page d'accueil avec présentation
- **/sign-in** : Connexion utilisateur
- **/sign-up** : Inscription utilisateur

### Pages Protégées (nécessitent une authentification)
- **/dashboard** : Tableau de bord principal
- **/ia** : Outils d'intelligence artificielle
- **/web** : Hub des fonctionnalités web
- **/finances** : Gestion financière
- **/planning** : Planification des courses
- **/community** : Communauté des chauffeurs
- **/profile** : Gestion du profil

## 🔧 Configuration

Le fichier `.env.local` doit contenir :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🤝 Intégration avec l'API Backend

L'application est conçue pour s'intégrer avec l'API Node.js existante dans le dossier `backend/`. 
Les routes protégées utilisent l'authentification Clerk côté client et peuvent valider les tokens côté serveur.

## 📄 Licence

Ce projet est sous licence MIT.
