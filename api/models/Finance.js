const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Income categories
      'course_revenue', 'tip', 'bonus', 'referral', 'other_income',
      // Expense categories
      'fuel', 'maintenance', 'insurance', 'vehicle_payment', 'parking', 'tolls', 
      'phone', 'internet', 'cleaning', 'equipment', 'registration', 'license_renewal',
      'accounting', 'legal', 'marketing', 'other_expense'
    ]
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'check', 'app_payment', 'other'],
    required: true
  },
  // Associated course/ride (for income)
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  // Receipt and documentation
  receiptUrl: {
    type: String
  },
  receiptNumber: {
    type: String
  },
  vendor: {
    name: { type: String },
    address: { type: String },
    phone: { type: String }
  },
  // Tax information
  taxDeductible: {
    type: Boolean,
    default: false
  },
  taxCategory: {
    type: String
  },
  vatAmount: {
    type: Number,
    default: 0
  },
  vatRate: {
    type: Number,
    default: 0
  },
  // Location where expense occurred
  location: {
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  // Additional tracking
  mileage: {
    type: Number // For fuel/maintenance expenses
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'approved', 'rejected'],
    default: 'processed'
  },
  // Recurring expense tracking
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringSchedule: {
    frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'] },
    nextDueDate: { type: Date }
  }
}, {
  timestamps: true
});

// Indexes for performance
financeSchema.index({ userId: 1, date: -1 });
financeSchema.index({ userId: 1, type: 1, date: -1 });
financeSchema.index({ category: 1 });
financeSchema.index({ taxDeductible: 1 });
financeSchema.index({ status: 1 });
financeSchema.index({ createdAt: -1 });

// Methods for calculations
financeSchema.statics.getTotalsByPeriod = function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

financeSchema.statics.getCategoryBreakdown = function(userId, type, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: type,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

module.exports = mongoose.model('Finance', financeSchema);