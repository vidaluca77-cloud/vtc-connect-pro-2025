const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {} } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({
        success: false,
        message: 'Montant minimum: 0.50€'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user.id,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du paiement'
    });
  }
});

// Confirm payment
router.post('/confirm/:paymentIntentId', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.metadata.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    res.json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      }
    });
  } catch (error) {
    console.error('Payment confirm error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation du paiement'
    });
  }
});

// Get payment methods
router.get('/methods', auth, async (req, res) => {
  try {
    // Mock payment methods for now
    const paymentMethods = [
      {
        id: 'pm_card_visa',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2026
        },
        default: true
      },
      {
        id: 'pm_card_mastercard',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '5555',
          exp_month: 8,
          exp_year: 2025
        },
        default: false
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des moyens de paiement'
    });
  }
});

// Add payment method
router.post('/methods', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    // In real implementation, attach to customer
    // await stripe.paymentMethods.attach(paymentMethodId, {
    //   customer: customerStripeId,
    // });

    res.json({
      success: true,
      message: 'Moyen de paiement ajouté avec succès'
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du moyen de paiement'
    });
  }
});

// Remove payment method
router.delete('/methods/:paymentMethodId', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    // In real implementation, detach from customer
    // await stripe.paymentMethods.detach(paymentMethodId);

    res.json({
      success: true,
      message: 'Moyen de paiement supprimé avec succès'
    });
  } catch (error) {
    console.error('Remove payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du moyen de paiement'
    });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;