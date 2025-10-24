const jwt = require('jsonwebtoken');
const { User, Place, Itinerary } = require('../Model/Model'); // Ensure this path is correct

// Health check controller (optional but good for testing)
const healthCheck = (req, res) => {
  res.json({ ok: true, message: 'Backend server is running', timestamp: new Date().toISOString() });
};

// --- User Controllers ---
const userControllers = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user (Password hashing should be handled in your User model via middleware)
      const user = new User({ name, email, password });
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key', // Use environment variable for secret
        { expiresIn: '7d' } // Token expiration time
      );

      // Send response (exclude password)
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error during signup' });
    }
  },

  authenticate: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        // Use generic message for security
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password using the method defined in your User model
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        // Use generic message for security
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Send response (exclude password)
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'Server error during authentication' });
    }
  },

  getProfile: async (req, res) => {
    // req.userId is added by the authenticateToken middleware
    try {
      // Find user by ID from token, exclude password field
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return user profile data
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt // Example: include join date
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error getting profile' });
    }
  }
};

// --- Place Controllers ---
const placeControllers = {
  getAllPlaces: async (req, res) => {
    try {
      // Basic filtering example (can be expanded)
      const { category, priceRange, location } = req.query;
      let filter = {};

      if (category) filter.category = category;
      if (priceRange) filter.priceRange = priceRange; // Assuming priceRange is a specific value/category
      if (location) filter.location = new RegExp(location, 'i'); // Case-insensitive search

      const places = await Place.find(filter);
      res.json({ places });
    } catch (error) {
      console.error('Get places error:', error);
      res.status(500).json({ message: 'Server error getting places' });
    }
  },

  getPlaceById: async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }
      res.json({ place });
    } catch (error) {
      console.error('Get place error:', error);
      res.status(500).json({ message: 'Server error getting place' });
    }
  },

  // Example: Protected route (e.g., only admin can create places)
  createPlace: async (req, res) => {
    // Add admin role check here if needed based on req.userId
    try {
      const placeData = req.body;
      // Add validation for required place fields here
      const place = new Place(placeData);
      await place.save();
      res.status(201).json({ message: 'Place created successfully', place });
    } catch (error) {
      console.error('Create place error:', error);
      // Handle validation errors specifically if needed
      if (error.name === 'ValidationError') {
         return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error creating place' });
    }
  }
};

// --- Itinerary Controllers ---
const itineraryControllers = {
  // Get all itineraries for the logged-in user
  getUserItineraries: async (req, res) => {
    // req.userId comes from authenticateToken middleware
    try {
      const itineraries = await Itinerary.find({ user: req.userId })
        .populate('days.places.place') // Populate place details if needed
        .sort({ createdAt: -1 }); // Sort by newest first
      res.json({ itineraries });
    } catch (error) {
      console.error('Get itineraries error:', error);
      res.status(500).json({ message: 'Server error getting itineraries' });
    }
  },

  // Get a single itinerary by ID, ensuring it belongs to the user
  getItineraryById: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOne({
        _id: req.params.id,
        user: req.userId // Ensure user owns this itinerary
      }).populate('days.places.place'); // Populate details

      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found or access denied' });
      }
      res.json({ itinerary });
    } catch (error) {
      console.error('Get itinerary error:', error);
      res.status(500).json({ message: 'Server error getting itinerary' });
    }
  },

  // Create a new itinerary for the logged-in user
  createItinerary: async (req, res) => {
    try {
      // Combine request body with the user ID from the token
      const { title, destination, duration /*, other fields... */ } = req.body;

      // Basic validation
       if (!title || !destination || !duration) {
          return res.status(400).json({ message: 'Title, destination, and duration are required.' });
        }

      // Add user ID
      const itineraryData = { ...req.body, user: req.userId };

      // TODO: Add logic here to create initial 'days' array based on duration if needed
      // Example:
      // if (!itineraryData.days && itineraryData.duration > 0) {
      //   itineraryData.days = Array.from({ length: itineraryData.duration }, (_, i) => ({
      //     dayNumber: i + 1,
      //     title: `Day ${i + 1}`,
      //     description: '',
      //     places: [],
      //     budget: 0
      //   }));
      // }


      const itinerary = new Itinerary(itineraryData);
      await itinerary.save(); // This triggers Mongoose validation

      // Optionally populate after saving if needed immediately
      // const populatedItinerary = await Itinerary.findById(itinerary._id).populate(...);

      res.status(201).json({ message: 'Itinerary created successfully', itinerary });
    } catch (error) {
      console.error('Create itinerary error:', error);
       // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
         return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error creating itinerary' });
    }
  },

  // Update an existing itinerary
  updateItinerary: async (req, res) => {
    try {
      const updatedData = req.body;
      const itinerary = await Itinerary.findOneAndUpdate(
        { _id: req.params.id, user: req.userId }, // Find by ID and ensure user owns it
        updatedData,
        { new: true, runValidators: true } // Return updated doc and run schema validators
      ).populate('days.places.place');

      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found or access denied' });
      }
      res.json({ message: 'Itinerary updated successfully', itinerary });
    } catch (error) {
      console.error('Update itinerary error:', error);
       if (error.name === 'ValidationError') {
         return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error updating itinerary' });
    }
  },

  // Delete an itinerary
  deleteItinerary: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOneAndDelete({
        _id: req.params.id,
        user: req.userId // Ensure user owns it
      });

      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found or access denied' });
      }
      res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
      console.error('Delete itinerary error:', error);
      res.status(500).json({ message: 'Server error deleting itinerary' });
    }
  }
};

// Export all controllers
module.exports = {
  healthCheck,
  userControllers,
  placeControllers,
  itineraryControllers
};
