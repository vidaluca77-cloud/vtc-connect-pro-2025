# Guide de Déploiement Vercel avec Clerk

## 🚀 Déploiement sur Vercel

### 1. Prérequis
- Compte [Vercel](https://vercel.com)
- Compte [Clerk](https://clerk.com)
- Repository GitHub connecté

### 2. Configuration Clerk

1. **Créer une application Clerk :**
   - Aller sur [dashboard.clerk.com](https://dashboard.clerk.com)
   - Créer une nouvelle application
   - Choisir "Email" comme méthode d'authentification

2. **Récupérer les clés API :**
   - Dans le dashboard Clerk, aller à "API Keys"
   - Copier la "Publishable Key" (commence par `pk_`)
   - Copier la "Secret Key" (commence par `sk_`)

### 3. Configuration Vercel

1. **Variables d'environnement :**
   Dans les paramètres du projet Vercel, ajouter :
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

2. **Paramètres de build :**
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `app/.next`
   - Install Command: `npm run vercel-install`

### 4. Configuration DNS (Optionnel)

Si vous utilisez un domaine personnalisé :
1. Ajouter le domaine dans Vercel
2. Mettre à jour les URLs autorisées dans Clerk
3. Configurer les redirections si nécessaire

### 5. Variables d'environnement de production

```env
# Production Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_live_key
CLERK_SECRET_KEY=sk_live_your_live_secret

# URLs de production (remplacer par votre domaine)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# API Backend (si applicable)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 6. Test du déploiement

1. Vérifier que l'application se charge correctement
2. Tester l'inscription d'un nouvel utilisateur
3. Tester la connexion
4. Vérifier l'accès aux pages protégées
5. Tester la déconnexion

### 7. Domaines autorisés dans Clerk

Dans le dashboard Clerk, section "Domains", ajouter :
- `localhost:3000` (développement)
- `your-app.vercel.app` (production Vercel)
- `your-custom-domain.com` (domaine personnalisé)

## 🔧 Dépannage

### Erreur de clé Clerk invalide
- Vérifier que les variables d'environnement sont correctement définies
- S'assurer que les clés correspondent au bon environnement (dev/prod)
- Vérifier que le domaine est autorisé dans Clerk

### Problèmes de redirection
- Vérifier les URLs de redirection dans Clerk
- S'assurer que les variables d'environnement correspondent aux routes

### Erreurs de build
- Vérifier que toutes les dépendances sont installées
- S'assurer que les variables d'environnement sont définies pour le build

## 📈 Monitoring

- Utiliser les analytics Vercel pour surveiller les performances
- Configurer les alertes Clerk pour l'authentification
- Surveiller les logs d'erreur dans les deux plateformes