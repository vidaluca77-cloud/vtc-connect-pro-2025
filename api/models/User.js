const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Clerk integration
  clerkId: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.clerkId; // Password not required if using Clerk
    },
    minlength: 6
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  phone: {
    type: String
  },
  vtcLicense: {
    type: String,
    required: function() {
      return !this.clerkId; // VTC License not required initially for Clerk users
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'trial', 'active', 'canceled', 'past_due'],
    default: 'free'
  },
  subscriptionPlan: {
    type: String
  },
  stripeCustomerId: {
    type: String
  },
  monthlyGoal: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  // Driver profile information
  driverProfile: {
    experience: { type: String }, // e.g., "3 ans d'expérience"
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    totalTrips: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline' },
    vehicle: {
      make: { type: String },
      model: { type: String },
      year: { type: Number },
      licensePlate: { type: String },
      type: { type: String, enum: ['sedan', 'suv', 'van', 'luxury'] }
    },
    workingHours: {
      weekdays: {
        start: { type: String }, // e.g., "08:00"
        end: { type: String }     // e.g., "22:00"
      },
      weekends: {
        start: { type: String },
        end: { type: String }
      }
    },
    preferredAreas: [{ type: String }], // e.g., ["Paris", "La Défense"]
    bio: { type: String, maxlength: 500 }
  },
  // Communication preferences
  emailPreferences: {
    weeklySummary: { type: Boolean, default: true },
    monthlyReport: { type: Boolean, default: true },
    goalAchieved: { type: Boolean, default: true },
    lowActivityReminder: { type: Boolean, default: true },
    feedbackRequests: { type: Boolean, default: true },
    systemAlerts: { type: Boolean, default: true }
  },
  // Statistics
  stats: {
    thisWeek: {
      rides: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 },
      hours: { type: Number, default: 0 }
    },
    thisMonth: {
      rides: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 },
      hours: { type: Number, default: 0 }
    },
    allTime: {
      rides: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 },
      hours: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ lastActivity: 1 });
userSchema.index({ subscriptionStatus: 1 });

module.exports = mongoose.model('User', userSchema);
