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
  // Vehicle information (as required in problem statement)
  vehicle: {
    brand: { type: String },
    model: { type: String },
    licensePlate: { type: String },
    year: { type: Number },
    type: { type: String, enum: ['sedan', 'suv', 'van', 'luxury'] },
    color: { type: String },
    seats: { type: Number, default: 4 }
  },
  // VTC License (as required in problem statement)
  vtcLicense: {
    number: { type: String },
    expiryDate: { type: Date },
    isValid: { type: Boolean, default: true }
  },
  // Subscription (as required in problem statement)
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
    stripeCustomerId: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'trialing', 'past_due', 'canceled'], default: 'inactive' },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  // Stats (as required in problem statement)
  stats: {
    totalRides: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5.0 },
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
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['driver', 'admin', 'support'],
    default: 'driver'
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
    bio: { type: String, maxlength: 500 },
    languages: [{ type: String }] // ["Français", "Anglais", "Espagnol"]
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
  // Business information
  businessInfo: {
    siretNumber: { type: String },
    vatNumber: { type: String },
    businessAddress: { type: String },
    accountantEmail: { type: String }
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ clerkId: 1 }, { unique: true, sparse: true });
userSchema.index({ lastActivity: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'driverProfile.status': 1 });

// Methods for user statistics
userSchema.methods.updateStats = async function(period = 'week') {
  const Course = mongoose.model('Course');
  const now = new Date();
  let startDate;
  
  if (period === 'week') {
    startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  const courses = await Course.find({
    userId: this._id,
    status: 'completed',
    actualEndTime: { $gte: startDate }
  });
  
  const rides = courses.length;
  const earnings = courses.reduce((sum, course) => sum + course.price.net, 0);
  const hours = courses.reduce((sum, course) => {
    if (course.actualStartTime && course.actualEndTime) {
      return sum + (course.actualEndTime - course.actualStartTime) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);
  
  if (period === 'week') {
    this.stats.thisWeek = { rides, earnings, hours };
  } else if (period === 'month') {
    this.stats.thisMonth = { rides, earnings, hours };
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
