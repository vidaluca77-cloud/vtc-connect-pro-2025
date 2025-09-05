const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Ride = require('./models/Ride');
const Transaction = require('./models/Transaction');
require('dotenv').config();

// Sample data to seed the database
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Ride.deleteMany({});
    await Transaction.deleteMany({});
    
    console.log('Cleared existing data');

    // Create sample users
    const sampleUsers = [
      {
        clerkId: 'user_test_1',
        email: 'jean.martin@example.com',
        firstName: 'Jean',
        lastName: 'Martin',
        imageUrl: 'https://via.placeholder.com/150',
        vtcLicense: 'VTC-123456',
        driverProfile: {
          experience: 'Chauffeur VTC depuis 3 ans',
          rating: 4.9,
          totalTrips: 245,
          status: 'online',
          bio: 'Chauffeur expérimenté spécialisé dans les trajets aéroport.'
        },
        stats: {
          thisWeek: { rides: 15, earnings: 850, hours: 42 },
          thisMonth: { rides: 67, earnings: 3200, hours: 180 },
          allTime: { rides: 245, earnings: 12500, hours: 780 }
        }
      },
      {
        clerkId: 'user_test_2',
        email: 'sophie.leroy@example.com',
        firstName: 'Sophie',
        lastName: 'Leroy',
        imageUrl: 'https://via.placeholder.com/150',
        vtcLicense: 'VTC-789012',
        driverProfile: {
          experience: 'Nouvelle conductrice VTC',
          rating: 4.7,
          totalTrips: 45,
          status: 'offline',
          bio: 'Nouvelle dans le métier, très motivée et professionnelle.'
        },
        stats: {
          thisWeek: { rides: 8, earnings: 420, hours: 25 },
          thisMonth: { rides: 32, earnings: 1650, hours: 95 },
          allTime: { rides: 45, earnings: 2100, hours: 140 }
        }
      },
      {
        clerkId: 'user_test_3',
        email: 'marc.dubois@example.com',
        firstName: 'Marc',
        lastName: 'Dubois',
        imageUrl: 'https://via.placeholder.com/150',
        vtcLicense: 'VTC-345678',
        driverProfile: {
          experience: 'Expert VTC - 5 ans',
          rating: 4.95,
          totalTrips: 512,
          status: 'online',
          bio: 'Expert en transport VTC, spécialisé dans les événements et transferts d\'affaires.'
        },
        stats: {
          thisWeek: { rides: 22, earnings: 1340, hours: 55 },
          thisMonth: { rides: 89, earnings: 5200, hours: 220 },
          allTime: { rides: 512, earnings: 28600, hours: 1456 }
        }
      }
    ];

    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create sample posts
    const samplePosts = [
      {
        authorId: users[0]._id,
        content: 'Excellente zone aujourd\'hui autour de La Défense ! Beaucoup de demandes entre 17h et 19h. N\'hésitez pas à vous y positionner.',
        category: 'Conseils',
        tags: ['la-defense', 'zone-rentable'],
        likes: [
          { userId: users[1]._id },
          { userId: users[2]._id }
        ]
      },
      {
        authorId: users[1]._id,
        content: 'Des conseils pour optimiser mes trajets en région parisienne ? Je débute et j\'aimerais avoir vos retours d\'expérience. Merci d\'avance !',
        category: 'Question',
        tags: ['debutant', 'conseils'],
        likes: [
          { userId: users[0]._id }
        ],
        comments: [
          {
            authorId: users[0]._id,
            content: 'Utilisez Waze et positionnez-vous près des gares aux heures de pointe !'
          },
          {
            authorId: users[2]._id,
            content: 'N\'hésitez pas à accepter les courses longues, c\'est plus rentable.'
          }
        ]
      },
      {
        authorId: users[2]._id,
        content: 'Attention aux travaux sur la ligne 1 cette semaine ! Impact important sur les trajets vers République et Bastille. Prévoyez du temps supplémentaire.',
        category: 'Alerte',
        tags: ['travaux', 'ligne-1', 'republique', 'bastille'],
        likes: [
          { userId: users[0]._id },
          { userId: users[1]._id }
        ],
        isPinned: true
      }
    ];

    const posts = await Post.insertMany(samplePosts);
    console.log(`Created ${posts.length} posts`);

    // Create sample rides for the first user
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const sampleRides = [
      {
        userId: users[0]._id,
        pickupLocation: {
          address: 'Aéroport Charles de Gaulle Terminal 2E',
          coordinates: { lat: 49.0047, lng: 2.5703 }
        },
        dropoffLocation: {
          address: 'Paris 15ème - Avenue Émile Zola',
          coordinates: { lat: 48.8466, lng: 2.2822 }
        },
        scheduledDateTime: yesterday,
        actualStartTime: yesterday,
        actualEndTime: new Date(yesterday.getTime() + 90 * 60 * 1000), // 1h30 later
        status: 'completed',
        passengerInfo: {
          name: 'Monsieur Dupont',
          phone: '+33123456789',
          passengers: 2
        },
        fare: {
          basePrice: 40,
          distance: 45,
          duration: 90,
          waitingTime: 5,
          waitingCharge: 2.50,
          tolls: 0,
          parking: 0,
          tip: 5,
          totalAmount: 47.50
        },
        vehicle: {
          type: 'sedan',
          make: 'Mercedes',
          model: 'Classe E',
          licensePlate: 'AB-123-CD'
        },
        paymentMethod: 'card',
        rating: {
          score: 5,
          comment: 'Excellent service, très professionnel',
          ratedAt: new Date(yesterday.getTime() + 100 * 60 * 1000)
        }
      },
      {
        userId: users[0]._id,
        pickupLocation: {
          address: 'Gare du Nord',
          coordinates: { lat: 48.8808, lng: 2.3553 }
        },
        dropoffLocation: {
          address: 'La Défense - Tour First',
          coordinates: { lat: 48.8915, lng: 2.2364 }
        },
        scheduledDateTime: today,
        actualStartTime: today,
        actualEndTime: new Date(today.getTime() + 45 * 60 * 1000), // 45 min later
        status: 'completed',
        passengerInfo: {
          name: 'Madame Durand',
          phone: '+33187654321',
          passengers: 1
        },
        fare: {
          basePrice: 25,
          distance: 18,
          duration: 45,
          waitingTime: 0,
          waitingCharge: 0,
          tolls: 0,
          parking: 0,
          tip: 3,
          totalAmount: 28
        },
        vehicle: {
          type: 'sedan',
          make: 'Mercedes',
          model: 'Classe E',
          licensePlate: 'AB-123-CD'
        },
        paymentMethod: 'cash',
        rating: {
          score: 4,
          comment: 'Bien, rapide et courtois',
          ratedAt: new Date(today.getTime() + 50 * 60 * 1000)
        }
      }
    ];

    const rides = await Ride.insertMany(sampleRides);
    console.log(`Created ${rides.length} rides`);

    // Create sample transactions
    const sampleTransactions = [
      {
        userId: users[0]._id,
        rideId: rides[0]._id,
        amount: 47.50,
        type: 'earning',
        status: 'completed',
        paymentMethod: 'card',
        description: 'Course CDG → Paris 15ème - Monsieur Dupont',
        category: 'ride'
      },
      {
        userId: users[0]._id,
        rideId: rides[1]._id,
        amount: 28,
        type: 'earning',
        status: 'completed',
        paymentMethod: 'cash',
        description: 'Course Gare du Nord → La Défense - Madame Durand',
        category: 'ride'
      },
      {
        userId: users[0]._id,
        rideId: null,
        amount: 60,
        type: 'expense',
        status: 'completed',
        paymentMethod: 'card',
        description: 'Plein d\'essence - Station Total',
        category: 'fuel'
      }
    ];

    const transactions = await Transaction.insertMany(sampleTransactions);
    console.log(`Created ${transactions.length} transactions`);

    console.log('Sample data created successfully!');
    
    // Display summary
    console.log('\n=== SUMMARY ===');
    console.log(`Users created: ${users.length}`);
    console.log(`Posts created: ${posts.length}`);
    console.log(`Rides created: ${rides.length}`);
    console.log(`Transactions created: ${transactions.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();