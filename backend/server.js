// backend/server.js
const express = require("express");
const cors = require("cors");
const { NotFoundError, BadRequestError } = require("es-errors");

const app = express();
const PORT = 5000;

// Import the itinerary router
const itineraryRoute = require("./routes/itinerary");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/itinerary", itineraryRoute);

app.get("/", (req, res) => {
  res.send("WanderWise Backend is running");
});

// 404 route handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.statusCode) {
    // If error has a statusCode (es-errors do), use it
    return res.status(err.statusCode).json({ error: err.message });
  }

  // default to 500 Internal Server Error
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});