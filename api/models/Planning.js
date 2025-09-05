const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Daily availability slots
  slots: [{
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "17:00"
    isAvailable: { type: Boolean, default: true },
    zone: { type: String }, // Preferred zone: "Paris", "La Défense", etc.
    notes: { type: String }
  }],
  // Overall day availability
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'off', 'maintenance'],
      default: 'available'
    },
    startTime: { type: String }, // "08:00" - start of working day
    endTime: { type: String },   // "22:00" - end of working day
    breakTimes: [{
      startTime: { type: String },
      endTime: { type: String },
      reason: { type: String }
    }]
  },
  // Booked courses for this date
  bookedCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    startTime: { type: String },
    endTime: { type: String },
    platform: { type: String },
    estimatedEarnings: { type: Number }
  }],
  // Goals for the day
  dailyGoals: {
    targetRides: { type: Number, default: 0 },
    targetEarnings: { type: Number, default: 0 },
    targetHours: { type: Number, default: 0 },
    preferredZones: [{ type: String }]
  },
  // Actual results (filled at end of day)
  actualResults: {
    totalRides: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  // Platform synchronization
  platformSync: {
    uber: {
      isOnline: { type: Boolean, default: false },
      lastSync: { type: Date }
    },
    bolt: {
      isOnline: { type: Boolean, default: false },
      lastSync: { type: Date }
    },
    heetch: {
      isOnline: { type: Boolean, default: false },
      lastSync: { type: Date }
    },
    marcel: {
      isOnline: { type: Boolean, default: false },
      lastSync: { type: Date }
    }
  },
  // Weather and traffic considerations
  conditions: {
    weather: {
      forecast: { type: String },
      impact: { type: String, enum: ['positive', 'negative', 'neutral'] }
    },
    traffic: {
      expected: { type: String, enum: ['light', 'moderate', 'heavy'] },
      events: [{ type: String }] // "Concert at Stade de France", "Strike RATP"
    }
  },
  // Notes and reminders
  notes: {
    type: String
  },
  reminders: [{
    time: { type: String },
    message: { type: String },
    isCompleted: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Indexes for performance
planningSchema.index({ userId: 1, date: -1 });
planningSchema.index({ userId: 1, 'availability.status': 1 });
planningSchema.index({ date: 1 });

// Ensure one planning document per user per date
planningSchema.index({ userId: 1, date: 1 }, { unique: true });

// Methods for planning calculations
planningSchema.methods.getTotalAvailableHours = function() {
  if (!this.availability.startTime || !this.availability.endTime) return 0;
  
  const start = new Date(`2000-01-01T${this.availability.startTime}:00`);
  const end = new Date(`2000-01-01T${this.availability.endTime}:00`);
  let totalHours = (end - start) / (1000 * 60 * 60);
  
  // Subtract break times
  this.availability.breakTimes.forEach(breakTime => {
    const breakStart = new Date(`2000-01-01T${breakTime.startTime}:00`);
    const breakEnd = new Date(`2000-01-01T${breakTime.endTime}:00`);
    const breakDuration = (breakEnd - breakStart) / (1000 * 60 * 60);
    totalHours -= breakDuration;
  });
  
  return Math.max(0, totalHours);
};

planningSchema.methods.getTotalBookedHours = function() {
  return this.bookedCourses.reduce((total, course) => {
    const start = new Date(`2000-01-01T${course.startTime}:00`);
    const end = new Date(`2000-01-01T${course.endTime}:00`);
    const duration = (end - start) / (1000 * 60 * 60);
    return total + duration;
  }, 0);
};

planningSchema.methods.getAvailableHours = function() {
  return this.getTotalAvailableHours() - this.getTotalBookedHours();
};

planningSchema.methods.isTimeSlotAvailable = function(startTime, endTime) {
  const requestStart = new Date(`2000-01-01T${startTime}:00`);
  const requestEnd = new Date(`2000-01-01T${endTime}:00`);
  
  // Check against booked courses
  return !this.bookedCourses.some(course => {
    const courseStart = new Date(`2000-01-01T${course.startTime}:00`);
    const courseEnd = new Date(`2000-01-01T${course.endTime}:00`);
    
    // Check for overlap
    return requestStart < courseEnd && requestEnd > courseStart;
  });
};

// Static methods
planningSchema.statics.getWeeklyPlanning = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

module.exports = mongoose.model('Planning', planningSchema);