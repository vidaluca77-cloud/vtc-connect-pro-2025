const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['earning', 'expense', 'commission', 'fuel', 'maintenance', 'insurance', 'bonus', 'penalty'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'app_payment', 'check', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['ride', 'fuel', 'maintenance', 'insurance', 'commission', 'bonus', 'parking', 'tolls', 'other'],
    required: true
  },
  receiptUrl: {
    type: String
  },
  taxDeductible: {
    type: Boolean,
    default: false
  },
  // Additional fields for finance tracking
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);