const { User, Place, Itinerary } = require('../Model/Model');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// User Controllers
const userControllers = {
  // Register new user
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Login user
  authenticate: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

// Place Controllers
const placeControllers = {
  // Get all places
  getAllPlaces: async (req, res) => {
    try {
      const { category, location, priceRange } = req.query;
      let filter = {};

      if (category) filter.category = category;
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (priceRange) filter.priceRange = priceRange;

      const places = await Place.find(filter).sort({ rating: -1 });
      res.json({ places });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get place by ID
  getPlaceById: async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }
      res.json({ place });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new place (admin only)
  createPlace: async (req, res) => {
    try {
      const place = new Place(req.body);
      await place.save();
      res.status(201).json({ message: 'Place created successfully', place });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

// Itinerary Controllers
const itineraryControllers = {
  // Get user's itineraries
  getUserItineraries: async (req, res) => {
    try {
      const itineraries = await Itinerary.find({ user: req.userId })
        .populate('days.places.place')
        .sort({ createdAt: -1 });
      res.json({ itineraries });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get single itinerary
  getItineraryById: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOne({ 
        _id: req.params.id, 
        user: req.userId 
      }).populate('days.places.place');
      
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.json({ itinerary });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new itinerary
  createItinerary: async (req, res) => {
    try {
      const itineraryData = {
        ...req.body,
        user: req.userId
      };
      const itinerary = new Itinerary(itineraryData);
      await itinerary.save();
      
      const populatedItinerary = await Itinerary.findById(itinerary._id)
        .populate('days.places.place');
      
      res.status(201).json({ 
        message: 'Itinerary created successfully', 
        itinerary: populatedItinerary 
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update itinerary
  updateItinerary: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true, runValidators: true }
      ).populate('days.places.place');
      
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.json({ message: 'Itinerary updated successfully', itinerary });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete itinerary
  deleteItinerary: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOneAndDelete({
        _id: req.params.id,
        user: req.userId
      });
      
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = {
  userControllers,
  placeControllers,
  itineraryControllers
};
