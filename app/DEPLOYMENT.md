# Guide de Déploiement Vercel avec Supabase

## 🚀 Déploiement sur Vercel

### 1. Prérequis

- Compte [Vercel](https://vercel.com/)
- Compte [Supabase](https://supabase.com/)
- Repository GitHub connecté

### 2. Configuration Supabase

1. **Créer un projet Supabase :**
   - Aller sur [app.supabase.com](https://app.supabase.com/)
   - Créer un nouveau projet
   - Choisir une région et définir un mot de passe sécurisé

2. **Récupérer les clés API :**
   - Dans le dashboard Supabase, aller à "Settings" > "API"
   - Copier l'"URL" du projet
   - Copier la "anon key" (clé publique)
   - Optionnel : copier la "service_role key" pour les opérations admin

3. **Configurer l'authentification :**
   - Aller dans "Authentication" > "Settings"
   - Configurer les fournisseurs d'authentification souhaités
   - Définir les URLs de redirection autorisées

### 3. Configuration Vercel

1. **Variables d'environnement :**
   Dans les paramètres du projet Vercel, ajouter :
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Paramètres de build :**
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `app/.next`
   - Install Command: `npm run vercel-install`

### 4. Configuration DNS (Optionnel)

Si vous utilisez un domaine personnalisé :

1. Ajouter le domaine dans Vercel
2. Mettre à jour les URLs autorisées dans Supabase
3. Configurer les redirections si nécessaire

### 5. Variables d'environnement de production

```env
# Production Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# API Backend (si applicable)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 6. Test du déploiement

1. Vérifier que l'application se charge correctement
2. Tester l'inscription d'un nouvel utilisateur
3. Tester la connexion
4. Vérifier l'accès aux pages protégées
5. Tester la déconnexion
6. Vérifier la synchronisation des données avec Supabase

### 7. URLs autorisées dans Supabase

Dans le dashboard Supabase, section "Authentication" > "Settings" > "Site URL", ajouter :

- `http://localhost:3000` (développement)
- `https://your-app.vercel.app` (production Vercel)
- `https://your-custom-domain.com` (domaine personnalisé)

## 🔧 Dépannage

### Erreur de connexion Supabase

- Vérifier que les variables d'environnement sont correctement définies
- S'assurer que l'URL et la clé anon correspondent au bon projet
- Vérifier que le domaine est autorisé dans Supabase

### Problèmes d'authentification

- Vérifier les URLs de redirection dans Supabase
- S'assurer que les fournisseurs d'authentification sont activés
- Vérifier les politiques de sécurité RLS si activées

### Erreurs de build

- Vérifier que toutes les dépendances sont installées
- S'assurer que les variables d'environnement sont définies pour le build
- Vérifier que les types TypeScript sont à jour

## 📈 Monitoring

- Utiliser les analytics Vercel pour surveiller les performances
- Utiliser le dashboard Supabase pour monitorer la base de données
- Configurer les alertes Supabase pour l'authentification et la base de données
- Surveiller les logs d'erreur dans les deux plateformes

## 🔒 Sécurité

### Politiques de sécurité RLS (Row Level Security)

- Activer RLS sur toutes les tables sensibles
- Définir des politiques pour restreindre l'accès aux données
- Tester les politiques en mode développement

### Variables d'environnement

- Ne jamais exposer la `service_role key` côté client
- Utiliser uniquement la `anon key` pour les opérations publiques
- Stocker les clés de production de manière sécurisée
