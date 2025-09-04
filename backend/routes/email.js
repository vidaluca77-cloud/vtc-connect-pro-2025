const express = require('express');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const auth = require('../middleware/auth');

const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const templates = {
  welcome: `
    <h2>Bienvenue sur VTC Connect Pro !</h2>
    <p>Bonjour {{firstName}},</p>
    <p>Nous sommes ravis de vous accueillir sur VTC Connect Pro, votre plateforme de gestion VTC.</p>
    <p>Votre compte est maintenant actif et vous pouvez commencer à utiliser nos services.</p>
    <p>Cordialement,<br>L'équipe VTC Connect Pro</p>
  `,
  rideConfirmation: `
    <h2>Confirmation de course</h2>
    <p>Bonjour {{firstName}},</p>
    <p>Votre course a été confirmée :</p>
    <ul>
      <li><strong>Départ :</strong> {{pickup}}</li>
      <li><strong>Destination :</strong> {{destination}}</li>
      <li><strong>Date :</strong> {{date}}</li>
      <li><strong>Prix :</strong> {{price}}€</li>
    </ul>
    <p>Merci de votre confiance.</p>
  `,
  paymentReceipt: `
    <h2>Reçu de paiement</h2>
    <p>Bonjour {{firstName}},</p>
    <p>Nous avons bien reçu votre paiement :</p>
    <ul>
      <li><strong>Montant :</strong> {{amount}}€</li>
      <li><strong>Transaction :</strong> {{transactionId}}</li>
      <li><strong>Date :</strong> {{date}}</li>
    </ul>
    <p>Merci pour votre paiement.</p>
  `
};

// Send welcome email
router.post('/welcome', auth, async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: 'Email et prénom requis'
      });
    }

    const template = handlebars.compile(templates.welcome);
    const html = template({ firstName, lastName });

    // Mock email sending for now
    console.log('Sending welcome email to:', email);
    console.log('Email content:', html);

    // Uncomment when SMTP is configured:
    /*
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Bienvenue sur VTC Connect Pro',
      html: html
    });
    */

    res.json({
      success: true,
      message: 'Email de bienvenue envoyé'
    });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    });
  }
});

// Send ride confirmation email
router.post('/ride-confirmation', auth, async (req, res) => {
  try {
    const { 
      email, 
      firstName, 
      pickup, 
      destination, 
      date, 
      price 
    } = req.body;

    const template = handlebars.compile(templates.rideConfirmation);
    const html = template({ 
      firstName, 
      pickup, 
      destination, 
      date: new Date(date).toLocaleDateString('fr-FR'),
      price 
    });

    console.log('Sending ride confirmation email to:', email);

    res.json({
      success: true,
      message: 'Email de confirmation envoyé'
    });
  } catch (error) {
    console.error('Ride confirmation email error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    });
  }
});

// Send payment receipt email
router.post('/payment-receipt', auth, async (req, res) => {
  try {
    const { 
      email, 
      firstName, 
      amount, 
      transactionId 
    } = req.body;

    const template = handlebars.compile(templates.paymentReceipt);
    const html = template({ 
      firstName, 
      amount, 
      transactionId,
      date: new Date().toLocaleDateString('fr-FR')
    });

    console.log('Sending payment receipt email to:', email);

    res.json({
      success: true,
      message: 'Reçu de paiement envoyé'
    });
  } catch (error) {
    console.error('Payment receipt email error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du reçu'
    });
  }
});

// Send bulk email
router.post('/bulk', auth, async (req, res) => {
  try {
    const { recipients, subject, template, data } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Liste de destinataires requise'
      });
    }

    const emailTemplate = handlebars.compile(template);
    let sentCount = 0;
    let errorCount = 0;

    for (const recipient of recipients) {
      try {
        const html = emailTemplate({ ...data, ...recipient });
        
        // Mock sending
        console.log(`Sending bulk email to: ${recipient.email}`);
        sentCount++;
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (emailError) {
        console.error(`Error sending to ${recipient.email}:`, emailError);
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Emails envoyés: ${sentCount}, Erreurs: ${errorCount}`,
      stats: { sent: sentCount, errors: errorCount, total: recipients.length }
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi en masse'
    });
  }
});

// Get email templates
router.get('/templates', auth, async (req, res) => {
  try {
    const availableTemplates = Object.keys(templates).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      content: templates[key]
    }));

    res.json({
      success: true,
      data: availableTemplates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des modèles'
    });
  }
});

// Test email configuration
router.post('/test', auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email de test requis'
      });
    }

    // Mock test email
    console.log('Sending test email to:', email);

    res.json({
      success: true,
      message: 'Email de test envoyé avec succès'
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test d\'email'
    });
  }
});

module.exports = router;