const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Platform information
  platform: {
    type: String,
    enum: ['uber', 'bolt', 'heetch', 'marcel', 'kapten', 'direct', 'other'],
    required: true
  },
  platformRideId: {
    type: String // Platform's ride ID
  },
  // Location details
  startLocation: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  endLocation: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  // Time and distance
  distance: {
    type: Number, // in kilometers
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
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
  // Pricing breakdown
  price: {
    gross: { type: Number, required: true, min: 0 }, // Total price before commission
    commission: { type: Number, required: true, min: 0 }, // Platform commission
    net: { type: Number, required: true, min: 0 }, // Driver earnings after commission
    tip: { type: Number, default: 0, min: 0 },
    tolls: { type: Number, default: 0, min: 0 },
    parking: { type: Number, default: 0, min: 0 },
    waitingTime: { type: Number, default: 0, min: 0 },
    cancellationFee: { type: Number, default: 0, min: 0 }
  },
  // Status tracking
  status: {
    type: String,
    enum: ['scheduled', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  // Passenger information
  passenger: {
    name: { type: String, required: true },
    phone: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    passengers: { type: Number, default: 1, min: 1, max: 8 }
  },
  // Driver rating from passenger
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    ratedAt: { type: Date }
  },
  // Vehicle used
  vehicle: {
    type: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true }
  },
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'app_payment', 'other'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  // Additional details
  specialRequests: {
    type: String
  },
  notes: {
    type: String
  },
  weather: {
    type: String
  },
  trafficCondition: {
    type: String,
    enum: ['light', 'moderate', 'heavy', 'extreme']
  }
}, {
  timestamps: true
});

// Indexes for performance
courseSchema.index({ userId: 1, scheduledDateTime: -1 });
courseSchema.index({ platform: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ 'startLocation.coordinates': '2dsphere' });
courseSchema.index({ 'endLocation.coordinates': '2dsphere' });

// Virtual for total earnings including tip
courseSchema.virtual('totalEarnings').get(function() {
  return this.price.net + this.price.tip;
});

module.exports = mongoose.model('Course', courseSchema);