const express = require('express');
const { OpenAI } = require('openai');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI client only if API key is available
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// AI route optimization
router.post('/optimize-route', auth, async (req, res) => {
  try {
    const { pickupLocation, destination, preferences = {} } = req.body;

    if (!pickupLocation || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Lieu de prise en charge et destination requis'
      });
    }

    // Mock AI route optimization for now
    const optimizedRoute = {
      estimatedTime: '32 minutes',
      estimatedDistance: '28.5 km',
      estimatedCost: 45.80,
      route: [
        { lat: 48.8566, lng: 2.3522, instruction: 'Départ de ' + pickupLocation },
        { lat: 48.8606, lng: 2.3376, instruction: 'Prendre Boulevard Saint-Germain' },
        { lat: 48.8698, lng: 2.3075, instruction: 'Continuer sur Avenue des Champs-Élysées' },
        { lat: 48.8738, lng: 2.2950, instruction: 'Arrivée à ' + destination }
      ],
      alternatives: [
        {
          name: 'Route rapide',
          time: '28 minutes',
          distance: '31.2 km',
          cost: 48.50,
          traffic: 'moderate'
        },
        {
          name: 'Route économique',
          time: '38 minutes',
          distance: '25.8 km',
          cost: 42.30,
          traffic: 'light'
        }
      ],
      trafficConditions: 'moderate',
      bestTimeToLeave: new Date(Date.now() + 300000).toISOString()
    };

    res.json({
      success: true,
      data: optimizedRoute
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'optimisation de l\'itinéraire'
    });
  }
});

// AI demand prediction
router.get('/predict-demand', auth, async (req, res) => {
  try {
    const { location, timeFrame = 'hourly' } = req.query;

    // Mock demand prediction
    const prediction = {
      location: location || 'Paris Centre',
      timeFrame,
      predictions: [
        { time: '09:00', demand: 'high', confidence: 0.85, estimatedRides: 45 },
        { time: '10:00', demand: 'medium', confidence: 0.78, estimatedRides: 32 },
        { time: '11:00', demand: 'medium', confidence: 0.82, estimatedRides: 28 },
        { time: '12:00', demand: 'high', confidence: 0.91, estimatedRides: 52 },
        { time: '13:00', demand: 'very_high', confidence: 0.88, estimatedRides: 68 },
        { time: '14:00', demand: 'high', confidence: 0.75, estimatedRides: 41 }
      ],
      recommendations: [
        'Zone forte demande: Gare du Nord (13h-15h)',
        'Éviter: Périphérie Est (10h-12h)',
        'Opportunité: Aéroports (toute la journée)'
      ],
      hotspots: [
        { name: 'Charles de Gaulle', lat: 49.0097, lng: 2.5479, score: 0.92 },
        { name: 'Gare du Nord', lat: 48.8809, lng: 2.3553, score: 0.87 },
        { name: 'La Défense', lat: 48.8921, lng: 2.2364, score: 0.79 }
      ]
    };

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Demand prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la prédiction de la demande'
    });
  }
});

// AI price optimization
router.post('/optimize-pricing', auth, async (req, res) => {
  try {
    const { basePrice, distance, duration, demand, weather, events } = req.body;

    // Mock price optimization
    const pricingAnalysis = {
      recommendedPrice: basePrice * 1.15,
      factors: [
        { name: 'Demande élevée', impact: +15, confidence: 0.82 },
        { name: 'Conditions météo', impact: +5, confidence: 0.65 },
        { name: 'Événements locaux', impact: +10, confidence: 0.78 },
        { name: 'Trafic dense', impact: +8, confidence: 0.71 }
      ],
      competitorAnalysis: {
        averagePrice: basePrice * 1.12,
        ourPosition: 'competitive',
        priceRange: { min: basePrice * 0.95, max: basePrice * 1.25 }
      },
      revenue: {
        estimated: (basePrice * 1.15) * 0.9, // After commission
        potential: (basePrice * 1.25) * 0.9,
        conservative: (basePrice * 1.05) * 0.9
      }
    };

    res.json({
      success: true,
      data: pricingAnalysis
    });
  } catch (error) {
    console.error('Price optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'optimisation des prix'
    });
  }
});

// AI chat assistant
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context = 'general' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message requis'
      });
    }

    // Mock AI chat response for now (replace with real OpenAI call when API key is available)
    const mockResponses = {
      route: "Je peux vous aider à optimiser votre itinéraire. Pouvez-vous me dire votre point de départ et votre destination ?",
      pricing: "Pour optimiser vos tarifs, je recommande d'augmenter de 15% pendant les heures de pointe et de surveiller la demande en temps réel.",
      general: "Bonjour ! Je suis votre assistant VTC Connect Pro. Comment puis-je vous aider aujourd'hui ?",
      support: "Je comprends votre problème. Laissez-moi vérifier les solutions disponibles pour vous."
    };

    // Use OpenAI API if available, otherwise use mock responses
    let response;
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Tu es un assistant IA spécialisé dans les services VTC. Tu aides les chauffeurs à optimiser leurs courses, leurs tarifs et à résoudre leurs problèmes."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        });
        response = completion.choices[0].message.content;
      } catch (error) {
        console.error('OpenAI API error:', error);
        response = mockResponses[context] || mockResponses.general;
      }
    } else {
      response = mockResponses[context] || mockResponses.general;
    }

    res.json({
      success: true,
      data: {
        response,
        context,
        suggestions: [
          "Comment optimiser mes itinéraires ?",
          "Quels sont les meilleurs créneaux ?",
          "Comment calculer mes tarifs ?",
          "Aide pour les paiements"
        ]
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la discussion avec l\'assistant IA'
    });
  }
});

module.exports = router;