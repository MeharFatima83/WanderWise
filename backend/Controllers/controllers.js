const jwt = require('jsonwebtoken');
const { User, Place, Itinerary } = require('../Model/Model'); // Make sure path is correct

// Helper function to escape special regex characters
function escapeRegex(string) {
  // Escape characters with special meaning in regex.
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Health check controller
const healthCheck = (req, res) => {
  res.json({ ok: true, message: 'Backend server is running', timestamp: new Date().toISOString() });
};

// User Controllers (Keep existing userControllers code unchanged)
const userControllers = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      const user = new User({ name, email, password });
      await user.save();
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error('Signup error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error during signup' });
    }
  },
  authenticate: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'Server error during authentication' });
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error getting profile' });
    }
  }
};

// Place Controllers
const placeControllers = {
  // --- ADDED TEMPORARY LOGGING TO getAllPlaces ---
  getAllPlaces: async (req, res) => {
    try {
      const { category, priceRange, location, name } = req.query;
      let filter = {};
      console.log('Received query params for getAllPlaces:', req.query);

      // *** TEMPORARY DIAGNOSTIC LOG: Fetch all places first ***
      try {
        console.log('--- DIAGNOSTIC: Fetching ALL places ---');
        const allPlaces = await Place.find({});
        console.log(`--- DIAGNOSTIC: Found ${allPlaces.length} total places. Names:`, allPlaces.map(p => p.name));
        // You can examine this log to see if "Mumbai" appears here
      } catch (diagError) {
        console.error('--- DIAGNOSTIC: Error fetching all places ---', diagError);
      }
      // *** END TEMPORARY DIAGNOSTIC LOG ***


      if (category) filter.category = category;
      if (priceRange) filter.priceRange = priceRange;
      if (location) {
         const trimmedLocation = location.trim();
         const escapedLocation = escapeRegex(trimmedLocation);
         filter.location = { $regex: escapedLocation, $options: 'i' };
      } else if (name) { // Filter by name if location is not provided
         const trimmedName = name.trim();
         const escapedName = escapeRegex(trimmedName);
         filter.name = { $regex: escapedName, $options: 'i' };
      }

      console.log('Executing Place.find with filter:', JSON.stringify(filter, null, 2));

      const places = await Place.find(filter);

      console.log(`Place.find result (length ${places.length}):`, JSON.stringify(places, null, 2));

      res.json({ places });
    } catch (error) {
      console.error('Error in getAllPlaces controller:', error);
      res.status(500).json({ message: 'Server error getting places' });
    }
  },
  // --- END ADDED LOGGING ---

  getPlaceById: async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }
      res.json({ place });
    } catch (error) {
      console.error('Get place error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Place ID format' });
      }
      res.status(500).json({ message: 'Server error getting place' });
    }
  },
  createPlace: async (req, res) => {
    try {
      const placeData = req.body;
      const place = new Place(placeData);
      await place.save();
      res.status(201).json({ message: 'Place created successfully', place });
    } catch (error) {
      console.error('Create place error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error creating place' });
    }
  }
};

// Itinerary Controllers (Keep existing itineraryControllers code unchanged)
const itineraryControllers = {
  getUserItineraries: async (req, res) => {
    try {
      const itineraries = await Itinerary.find({ user: req.userId })
                                         .populate('days.places.place')
                                         .sort({ createdAt: -1 });
      res.json({ itineraries });
    } catch (error) {
      console.error('Get itineraries error:', error);
      res.status(500).json({ message: 'Server error getting itineraries' });
    }
  },
  getItineraryById: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOne({
        _id: req.params.id,
        user: req.userId
      }).populate('days.places.place');

      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found or access denied' });
      }
      res.json({ itinerary });
    } catch (error) {
      console.error('Get itinerary error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Itinerary ID format' });
      }
      res.status(500).json({ message: 'Server error getting itinerary' });
    }
  },
  createItinerary: async (req, res) => {
    try {
      const { title, destination, description, duration, budget, startDate } = req.body;
      const userId = req.userId;

      // --- Input Validation ---
      if (!title || !destination || !duration || !budget || !startDate) {
        return res.status(400).json({ message: 'Missing required itinerary fields (title, destination, duration, budget, startDate).' });
      }
      const parsedDuration = parseInt(duration);
      const parsedBudget = parseInt(budget);
      if (isNaN(parsedDuration) || parsedDuration < 1) {
         return res.status(400).json({ message: 'Duration must be a positive number.' });
      }
       if (isNaN(parsedBudget) || parsedBudget < 0) {
         return res.status(400).json({ message: 'Budget must be a non-negative number.' });
      }
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
         return res.status(400).json({ message: 'Invalid start date format. Use YYYY-MM-DD.' });
      }
      // --- End Validation ---

      // --- Calculate endDate ---
      const calculatedEndDate = new Date(parsedStartDate);
      calculatedEndDate.setDate(parsedStartDate.getDate() + parsedDuration - 1);
      // --- End Calculation ---

      // --- Fetch and Distribute Places ---
      let daysArray = [];
      let potentialPlaces = [];
      let queryToLog = {};
      try {
        const trimmedDestination = destination.trim();
        const escapedDestination = escapeRegex(trimmedDestination);
        const destinationQuery = { $regex: escapedDestination, $options: 'i' };

        queryToLog = { location: destinationQuery };
        console.log(`Executing Place.find with query:`, JSON.stringify(queryToLog, null, 2));

        potentialPlaces = await Place.find(queryToLog).limit(parsedDuration * 3);

        console.log(`Place.find raw result (length ${potentialPlaces.length}):`, JSON.stringify(potentialPlaces, null, 2));
        console.log(`Query result: Found ${potentialPlaces.length} potential places for "${destination}"`);

        // --- Distribution Logic ---
        const effectiveDuration = Math.max(1, parsedDuration);
        const placesPerDay = potentialPlaces.length > 0 ? Math.max(1, Math.floor(potentialPlaces.length / effectiveDuration)) : 0;
        let placeIndex = 0;

        for (let i = 1; i <= parsedDuration; i++) {
          const dayPlaces = [];
          const placesLeft = potentialPlaces.length - placeIndex;
          const numPlacesForDay = (i === parsedDuration) ? placesLeft : Math.min(placesPerDay, placesLeft);

          for (let j = 0; j < numPlacesForDay; j++) {
             if (placeIndex < potentialPlaces.length) {
                const timeSlot = (j % 2 === 0) ? 'morning' : 'afternoon';
                dayPlaces.push({
                    place: potentialPlaces[placeIndex]._id,
                    timeSlot: timeSlot,
                });
                placeIndex++;
             }
          }
          daysArray.push({
             dayNumber: i,
             title: `Day ${i} in ${destination}`,
             description: `Exploring ${destination}`,
             places: dayPlaces,
          });
        }
        console.log("Generated daysArray:", JSON.stringify(daysArray, null, 2));
        // --- End Distribution Logic ---

      } catch(placeError) {
         console.error(`ERROR DURING Place.find or distribution for destination "${destination}" with query ${JSON.stringify(queryToLog)}:`, placeError);
         daysArray = Array.from({ length: parsedDuration }, (_, i) => ({
             dayNumber: i + 1,
             title: `Day ${i + 1} Plan`,
             description: 'Details to be added',
             places: []
         }));
         console.log("Falling back to empty daysArray due to error.");
      }
      // --- END: Fetch and Distribute Places ---

      // Create a new itinerary document instance
      const newItinerary = new Itinerary({
        title,
        destination,
        description: description || `Trip to ${destination}`,
        duration: parsedDuration,
        budget: parsedBudget,
        startDate: parsedStartDate,
        endDate: calculatedEndDate,
        user: userId,
        days: daysArray
      });

      console.log("Attempting to save itinerary:", JSON.stringify(newItinerary, null, 2));

      // Save the document to the database
      await newItinerary.save();

      // Populate the newly saved itinerary before sending back
      const populatedItinerary = await Itinerary.findById(newItinerary._id).populate('days.places.place');

      // Send success response with the populated itinerary
      res.status(201).json({ message: 'Itinerary created successfully', itinerary: populatedItinerary });

    } catch (error) {
      console.error('Create itinerary error (outside place finding):', error);
      if (error.name === 'ValidationError') {
          return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error creating itinerary' });
    }
  },
  updateItinerary: async (req, res) => {
    try {
       const updatedData = req.body;
       if (updatedData.startDate || updatedData.duration) {
          const currentItinerary = await Itinerary.findById(req.params.id);
          if (!currentItinerary) return res.status(404).json({ message: 'Itinerary not found' });
          const newStartDate = updatedData.startDate ? new Date(updatedData.startDate) : currentItinerary.startDate;
          const newDuration = updatedData.duration ? parseInt(updatedData.duration) : currentItinerary.duration;
          if (!isNaN(newStartDate.getTime()) && !isNaN(newDuration) && newDuration > 0) {
              updatedData.endDate = new Date(newStartDate);
              updatedData.endDate.setDate(newStartDate.getDate() + newDuration - 1);
          }
       }
      const itinerary = await Itinerary.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        updatedData,
        { new: true, runValidators: true }
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
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Itinerary ID format' });
      }
      res.status(500).json({ message: 'Server error updating itinerary' });
    }
  },
  deleteItinerary: async (req, res) => {
    try {
      const itinerary = await Itinerary.findOneAndDelete({
        _id: req.params.id,
        user: req.userId
      });
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found or access denied' });
      }
      res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
      console.error('Delete itinerary error:', error);
       if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Itinerary ID format' });
      }
      res.status(500).json({ message: 'Server error deleting itinerary' });
    }
  }
};

module.exports = {
  healthCheck,
  userControllers,
  placeControllers,
  itineraryControllers
};

