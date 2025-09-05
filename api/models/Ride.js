const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  dropoffLocation: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  passengerInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    passengers: { type: Number, default: 1, min: 1, max: 8 }
  },
  fare: {
    basePrice: { type: Number, required: true, min: 0 },
    distance: { type: Number, required: true, min: 0 }, // in km
    duration: { type: Number, required: true, min: 0 }, // in minutes
    waitingTime: { type: Number, default: 0, min: 0 }, // in minutes
    waitingCharge: { type: Number, default: 0, min: 0 },
    tolls: { type: Number, default: 0, min: 0 },
    parking: { type: Number, default: 0, min: 0 },
    tip: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 }
  },
  vehicle: {
    type: { type: String, required: true }, // 'sedan', 'suv', 'van', 'luxury'
    make: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'app_payment'],
    required: true
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    ratedAt: { type: Date }
  },
  specialRequests: {
    type: String
  },
  rideType: {
    type: String,
    enum: ['immediate', 'scheduled', 'airport', 'business', 'personal'],
    default: 'immediate'
  },
  route: {
    encodedPolyline: { type: String },
    estimatedDistance: { type: Number }, // in km
    estimatedDuration: { type: Number } // in minutes
  }
}, {
  timestamps: true
});

// Indexes for performance
rideSchema.index({ userId: 1, scheduledDateTime: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ createdAt: -1 });
rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
rideSchema.index({ 'dropoffLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);