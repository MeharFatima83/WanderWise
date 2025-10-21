const express = require('express');
const router = express.Router();
const { userControllers, placeControllers, itineraryControllers } = require('../Controllers/controllers');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.userId = user.userId;
    next();
  });
};

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// User routes
router.post('/users/signup', userControllers.signup);
router.post('/users/authenticate', userControllers.authenticate);
router.get('/users/profile', authenticateToken, userControllers.getProfile);

// Place routes
router.get('/places', placeControllers.getAllPlaces);
router.get('/places/:id', placeControllers.getPlaceById);
router.post('/places', authenticateToken, placeControllers.createPlace);

// Itinerary routes (all require authentication)
router.get('/itineraries', authenticateToken, itineraryControllers.getUserItineraries);
router.get('/itineraries/:id', authenticateToken, itineraryControllers.getItineraryById);
router.post('/itineraries', authenticateToken, itineraryControllers.createItinerary);
router.put('/itineraries/:id', authenticateToken, itineraryControllers.updateItinerary);
router.delete('/itineraries/:id', authenticateToken, itineraryControllers.deleteItinerary);

module.exports = router;