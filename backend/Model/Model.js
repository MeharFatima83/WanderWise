const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Place Schema
const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['attraction', 'restaurant', 'hotel', 'activity', 'landmark'],
    required: true
  },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'luxury'],
    default: 'moderate'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

// Itinerary Schema
const itinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  days: [{
    dayNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    places: [{
      place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
      },
      timeSlot: {
        type: String,
        enum: ['morning', 'afternoon', 'evening'],
        required: true
      },
      duration: {
        type: Number, // in hours
        default: 2
      }
    }],
    budget: {
      type: Number,
      default: 0
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Place = mongoose.model('Place', placeSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = { User, Place, Itinerary };
