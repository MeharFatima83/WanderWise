// backend/routes/itinerary.js
const express = require("express");
const router = express.Router();
const { BadRequestError } = require("es-errors");

// POST /itinerary
router.post("/", (req, res, next) => {
  try {
    const { destination, budget, duration } = req.body;

    // Validate input
    if (!destination || !budget || !duration) {
      throw new BadRequestError("destination, budget, and duration are required");
    }

    // Placeholder response (replace later with AI API)
    const sampleItinerary = `Sample itinerary for ${destination} with budget $${budget} for ${duration} days.`;

    res.json({ itinerary: sampleItinerary });
  } catch (err) {
    next(err); // pass the error to global error handler
  }
});

module.exports = router;
