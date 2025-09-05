# Guide de démarrage rapide - VTC Connect Pro 2025

## 🚀 Démarrage en 5 minutes

### 1. Installation des dépendances
```bash
# Backend
cd backend
npm install

# Frontend (nouveau terminal)
cd frontend
npm install
```

### 2. Configuration
```bash
# Copier le fichier d'environnement
cd backend
cp .env.example .env
```

### 3. Lancement de l'application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 4. Accès à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Health check** : http://localhost:5000/health

### 5. Test avec le compte démo
- **Email** : [CONFIGURÉ_VIA_VARIABLES_ENVIRONNEMENT]
- **Mot de passe** : [CONFIGURÉ_VIA_VARIABLES_ENVIRONNEMENT]

⚠️ **Note sécurité** : Les identifiants de test doivent être configurés via les variables d'environnement et non codés en dur dans le code.

## 🐳 Démarrage avec Docker
```bash
# Lancer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

## 📋 Scripts disponibles

### Backend
- `npm start` - Production
- `npm run dev` - Développement avec nodemon
- `npm test` - Tests

### Frontend
- `npm start` - Développement
- `npm run build` - Build de production
- `npm test` - Tests

## 🔍 Vérification du setup
1. ✅ Backend démarré : http://localhost:5000/health
2. ✅ Frontend accessible : http://localhost:3000
3. ✅ Connexion possible avec compte test
4. ✅ Navigation entre les pages

## 🛠 Dépannage

### Port déjà utilisé
```bash
# Trouver le processus utilisant le port
lsof -i :3000
lsof -i :5000

# Tuer le processus
kill -9 PID
```

### Problème de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur MongoDB (avec Docker)
```bash
# Redémarrer les services
docker-compose down
docker-compose up --build
```
