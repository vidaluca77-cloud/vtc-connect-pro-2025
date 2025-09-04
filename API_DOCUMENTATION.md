# Documentation API - VTC Connect Pro

## Base URL
- Développement: `http://localhost:5000/api`
- Production: `https://votre-api.herokuapp.com/api`

## Authentification

### POST /auth/register
Créer un nouveau compte chauffeur VTC.

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Martin",
  "email": "jean.martin@email.com",
  "password": "motdepasse123",
  "phone": "+33123456789",
  "vtcLicense": "VTC001234"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "user_id",
    "email": "jean.martin@email.com",
    "firstName": "Jean",
    "lastName": "Martin"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
Connexion à un compte existant.

**Body:**
```json
{
  "email": "jean.martin@email.com",
  "password": "motdepasse123"
}
```

**Response 200:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "jean.martin@email.com",
    "firstName": "Jean",
    "lastName": "Martin"
  },
  "token": "jwt_token"
}
```

### GET /auth/me
Obtenir les informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response 200:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "jean.martin@email.com",
    "firstName": "Jean",
    "lastName": "Martin",
    "vtcLicense": "VTC001234",
    "isActive": true
  }
}
```

## Tableau de bord

### GET /dashboard
Obtenir les données du tableau de bord.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "Jean",
      "lastName": "Martin",
      "email": "jean.martin@email.com",
      "vtcLicense": "VTC001234"
    },
    "stats": {
      "totalRides": 156,
      "totalEarnings": 12850.50,
      "weeklyRides": 23,
      "weeklyEarnings": 1820.75,
      "averageRating": 4.8,
      "totalDistance": 3450
    },
    "recentRides": [
      {
        "id": 1,
        "date": "2025-01-04T10:30:00Z",
        "from": "Paris CDG",
        "to": "16e Arrondissement",
        "amount": 85.50,
        "status": "completed"
      }
    ],
    "nextRides": [
      {
        "id": 3,
        "date": "2025-01-05T14:00:00Z",
        "from": "Orly Airport",
        "to": "Champs-Élysées",
        "amount": 75.00,
        "status": "scheduled"
      }
    ]
  }
}
```

### GET /dashboard/stats
Obtenir les statistiques détaillées.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "daily": {
      "rides": [12, 15, 10, 18, 22, 8, 14],
      "earnings": [450, 675, 380, 720, 890, 320, 560]
    },
    "monthly": {
      "rides": [120, 135, 98, 156, 178, 145, 167, 189, 201, 156, 134, 167],
      "earnings": [4500, 5200, 3800, 6100, 7200, 5800, 6700, 7800, 8500, 6900, 5600, 7100]
    },
    "topDestinations": [
      { "name": "Charles de Gaulle", "count": 45 },
      { "name": "Orly", "count": 32 },
      { "name": "Gare du Nord", "count": 28 }
    ]
  }
}
```

## Transactions

### GET /transactions
Obtenir la liste des transactions.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN001",
        "date": "2025-01-04T10:30:00Z",
        "type": "ride",
        "description": "Course Paris CDG - 16e Arrondissement",
        "amount": 85.50,
        "status": "completed",
        "paymentMethod": "card",
        "commission": 8.55
      }
    ],
    "summary": {
      "totalAmount": 12850.50,
      "totalCommissions": 1285.05,
      "totalWithdrawals": 2500.00
    }
  }
}
```

### GET /transactions/:id
Obtenir les détails d'une transaction.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "TXN001",
    "date": "2025-01-04T10:30:00Z",
    "type": "ride",
    "description": "Course Paris CDG - 16e Arrondissement",
    "amount": 85.50,
    "status": "completed",
    "paymentMethod": "card",
    "commission": 8.55,
    "details": {
      "distance": "35.2 km",
      "duration": "45 minutes",
      "from": {
        "address": "Aéroport Charles de Gaulle, 95700 Roissy-en-France",
        "coordinates": [49.0097, 2.5479]
      },
      "to": {
        "address": "123 Avenue Foch, 75016 Paris",
        "coordinates": [48.8742, 2.2840]
      },
      "passenger": {
        "name": "Client Anonyme",
        "rating": 5
      }
    }
  }
}
```

## Paiements

### POST /payments/create-intent
Créer une intention de paiement Stripe.

**Body:**
```json
{
  "amount": 85.50,
  "currency": "eur",
  "metadata": {
    "rideId": "ride_123"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### GET /payments/methods
Obtenir les méthodes de paiement.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pm_card_visa",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "exp_month": 12,
        "exp_year": 2026
      },
      "default": true
    }
  ]
}
```

## Intelligence Artificielle

### POST /ai/optimize-route
Optimiser un itinéraire avec l'IA.

**Body:**
```json
{
  "pickupLocation": "Aéroport Charles de Gaulle",
  "destination": "16e Arrondissement, Paris",
  "preferences": {
    "prioritize": "time"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "estimatedTime": "32 minutes",
    "estimatedDistance": "28.5 km",
    "estimatedCost": 45.80,
    "route": [
      { "lat": 48.8566, "lng": 2.3522, "instruction": "Départ de Aéroport Charles de Gaulle" },
      { "lat": 48.8606, "lng": 2.3376, "instruction": "Prendre Boulevard Saint-Germain" }
    ],
    "alternatives": [
      {
        "name": "Route rapide",
        "time": "28 minutes",
        "distance": "31.2 km",
        "cost": 48.50,
        "traffic": "moderate"
      }
    ],
    "trafficConditions": "moderate",
    "bestTimeToLeave": "2025-01-04T10:35:00Z"
  }
}
```

### GET /ai/predict-demand
Prédire la demande dans une zone.

**Query Parameters:**
- `location` (optional): Zone géographique
- `timeFrame` (optional): Période (hourly, daily)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "location": "Paris Centre",
    "timeFrame": "hourly",
    "predictions": [
      { "time": "09:00", "demand": "high", "confidence": 0.85, "estimatedRides": 45 },
      { "time": "10:00", "demand": "medium", "confidence": 0.78, "estimatedRides": 32 }
    ],
    "recommendations": [
      "Zone forte demande: Gare du Nord (13h-15h)",
      "Éviter: Périphérie Est (10h-12h)"
    ],
    "hotspots": [
      { "name": "Charles de Gaulle", "lat": 49.0097, "lng": 2.5479, "score": 0.92 }
    ]
  }
}
```

## Emails

### POST /email/welcome
Envoyer un email de bienvenue.

**Body:**
```json
{
  "email": "jean.martin@email.com",
  "firstName": "Jean",
  "lastName": "Martin"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Email de bienvenue envoyé"
}
```

### POST /email/ride-confirmation
Envoyer une confirmation de course.

**Body:**
```json
{
  "email": "jean.martin@email.com",
  "firstName": "Jean",
  "pickup": "Paris CDG",
  "destination": "16e Arrondissement",
  "date": "2025-01-04T10:30:00Z",
  "price": 85.50
}
```

## Codes d'erreur

- `400` - Bad Request - Données invalides
- `401` - Unauthorized - Token manquant ou invalide
- `403` - Forbidden - Accès refusé
- `404` - Not Found - Ressource non trouvée
- `409` - Conflict - Conflit (ex: email déjà utilisé)
- `500` - Internal Server Error - Erreur serveur

## Format d'erreur standard

```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```