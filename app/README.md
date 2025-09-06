# VTC Connect Pro 2025 - Next.js App with Supabase Authentication

Cette application Next.js utilise l'authentification Supabase pour une gestion moderne et sécurisée des utilisateurs.

## 🏗 Structure de l'Application

```
app/src/app/
├── layout.tsx          # Layout principal avec AuthProvider
├── page.tsx            # Page d'accueil avec authentification
├── auth/               # Pages d'authentification Supabase
├── dashboard/          # Tableau de bord principal
├── ia/                 # Interface Intelligence Artificielle
├── web/                # Interface Web (hub principal)
├── finances/           # Gestion financière
├── planning/           # Planification des courses
├── community/          # Communauté des chauffeurs
└── profile/            # Profil utilisateur
```

## 🔐 Authentification Supabase

L'application utilise Supabase pour l'authentification, permettant aux utilisateurs de :

- Créer un compte facilement
- Se connecter de manière sécurisée
- Gérer leur profil
- Accéder aux fonctionnalités protégées
- Synchronisation automatique des données

## 🚀 Déploiement Vercel

### Variables d'environnement requises :

1. **NEXT_PUBLIC_SUPABASE_URL** : URL de votre projet Supabase
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** : Clé anonyme publique Supabase
3. **NEXT_PUBLIC_API_URL** : URL de l'API backend (optionnel)

### Étapes de déploiement :

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement Supabase
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
- **/auth/signin** : Connexion utilisateur
- **/auth/signup** : Inscription utilisateur

### Pages Protégées (nécessitent une authentification)

- **/dashboard** : Tableau de bord principal
- **/ia** : Outils d'intelligence artificielle
- **/web** : Hub des fonctionnalités web
- **/finances** : Gestion financière
- **/planning** : Planification des courses
- **/community** : Communauté des chauffeurs
- **/profile** : Gestion du profil

## 🔧 Configuration

Le fichier .env.local doit contenir :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🤝 Intégration avec Supabase

L'application utilise Supabase pour :

- Authentification utilisateur
- Base de données temps réel
- Stockage de fichiers
- APIs automatiques
- Synchronisation des profils utilisateur

## 📄 Licence

Ce projet est sous licence MIT.
