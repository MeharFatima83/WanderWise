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
    // Note: Description wasn't explicitly required in the form,
    // but the schema requires it. Ensure you send it or make it optional.
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
    required: true // This requires the controller fix we made
  },
  days: [{ // This defines the structure for individual days within the itinerary
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
      // Consider if this day-level description is always required
      required: false // Made optional for now, adjust if needed
    },
    places: [{ // Array to hold places planned for the day
      place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place' // Links to your Place model
      },
      timeSlot: { // e.g., morning, afternoon, evening
        type: String,
        enum: ['morning', 'afternoon', 'evening'],
        required: false // Made optional, adjust if needed
      },
      duration: { // How long to spend at the place (e.g., in hours)
        type: Number,
        default: 2
      },
      notes: String // Optional notes for this specific place visit
    }],
    budget: { // Optional budget specifically for this day
      type: Number,
      default: 0
    }
  }],
  user: { // Link to the user who created this itinerary
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: { // Flag if the itinerary can be viewed by others
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create models from the schemas
const User = mongoose.model('User', userSchema);
const Place = mongoose.model('Place', placeSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);

// Export the models
module.exports = { User, Place, Itinerary };