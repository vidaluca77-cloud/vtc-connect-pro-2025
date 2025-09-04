const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
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
  phone: {
    type: String
  },
  vtcLicense: {
    type: String,
    required: true
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
  emailPreferences: {
    weeklySummary: { type: Boolean, default: true },
    monthlyReport: { type: Boolean, default: true },
    goalAchieved: { type: Boolean, default: true },
    lowActivityReminder: { type: Boolean, default: true },
    feedbackRequests: { type: Boolean, default: true },
    systemAlerts: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ lastActivity: 1 });
userSchema.index({ subscriptionStatus: 1 });

module.exports = mongoose.model('User', userSchema);
