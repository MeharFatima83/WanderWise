// Import necessary modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// *** ADJUSTED PATH TO GO UP ONE DIRECTORY to find Model folder ***
const { Place } = require('../Model/Model'); // This path is correct when running from backend root using 'node scripts/seed.js'

// Load environment variables from .env file (assuming .env is in the backend root)
// *** REMOVED path option - dotenv will now look for .env in the CWD (backend folder) ***
dotenv.config();

// --- Data to Seed (Adapted from HomePage.jsx) ---
// IMPORTANT: Adjust image URLs and ensure fields match your Place schema
const destinationsToSeed = [
  {
    name: "Mussoorie",
    location: "Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1601618776041-e127c5b6b15a?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "The Queen of Hills — scenic views, waterfalls, and colonial charm.",
    priceRange: "moderate",
    category: "attraction", // Mapped from 'Hills'
    rating: 4.7
  },
  {
    name: "Goa",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Golden beaches, vibrant nightlife, and endless fun under the sun.",
    priceRange: "moderate",
    category: "attraction", // Mapped from 'Beach'
    rating: 4.5
  },
  {
    name: "Ladakh",
    location: "Leh-Ladakh, India",
    image: "https://images.unsplash.com/photo-1581691763156-324a87c10c12?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "Adventure, monasteries, and surreal landscapes at every turn.",
    priceRange: "luxury",
    category: "activity", // Mapped from 'Adventure'
    rating: 4.8
  },
  {
    name: "Kerala",
    location: "Backwaters, India",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "Serene backwaters, lush greenery, and Ayurvedic experiences.",
    priceRange: "moderate",
    category: "attraction", // Mapped from 'Beach'/'Backwaters'
    rating: 4.6
  },
  {
    name: "Jaipur",
    location: "Rajasthan, India", // Matched Hawa Mahal location
    image: "https://images.unsplash.com/photo-1544276709-b4676a6b8364?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "The Pink City — heritage forts, palaces, and royal culture.",
    priceRange: "budget",
    category: "landmark", // Mapped from 'Heritage'
    rating: 4.4
  },
  {
    name: "Andaman Islands",
    location: "Bay of Bengal, India",
    image: "https://images.unsplash.com/photo-1506041774431-76b3517c5b1d?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "Turquoise waters, coral reefs, and tropical tranquility.",
    priceRange: "luxury",
    category: "attraction", // Mapped from 'Beach'
    rating: 4.7
  },
  {
    name: "Pune",
    location: "Maharashtra, India",
    image: "https://images.unsplash.com/photo-1568601815152-16a29e2f4625?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "Cultural city with vibrant cafes, historical landmarks, and pleasant weather.",
    priceRange: "budget",
    category: "landmark", // Mapped from 'Heritage'
    rating: 4.3
  },
  {
    name: "Mumbai",
    location: "Maharashtra, India",
    image: "https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "The city of dreams with bustling markets, nightlife, and iconic landmarks.",
    priceRange: "moderate",
    category: "attraction", // Mapped from 'Beach'
    rating: 4.6
  },
  {
    name: "Nainital",
    location: "Uttarakhand, India",
    image: "https://images.unsplash.com/photo-1577089456385-f559c5d07a10?auto=format&fit=crop&w=800&q=80", // Needs valid URL
    description: "Hill station with serene lakes, scenic views, and cool mountain air.",
    priceRange: "budget",
    category: "attraction", // Mapped from 'Hills'
    rating: 4.4
  },
   {
    name: "Hawa Mahal",
    location: "Rajasthan, India",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80", // Example valid URL
    description: "Palace of Winds, known for its intricate facade.",
    priceRange: "budget",
    category: "landmark",
    rating: 4.6
  },
   {
    name: "Eiffel Tower",
    description: "Iconic iron lattice tower and symbol of Paris, offering breathtaking city views.",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
    location: "Paris, France",
    category: "landmark",
    priceRange: "moderate",
    rating: 4.8
  },
  // Added Goa place example
   {
    name: "Calangute Beach",
    description: "Famous beach in North Goa known for water sports and shacks.",
    image: "https://images.unsplash.com/photo-1590380629601-52e811c7b375?auto=format&fit=crop&w=800&q=80", // Example valid URL
    location: "Goa, India",
    category: "attraction", // Using 'attraction' as 'beach' is not in schema enum
    priceRange: "moderate",
    // --- Corrected typo: rating should not be inside quotes ---
    rating: 4.5
  },
];

// Function to seed the database
const seedDatabase = async () => {
  // Check if MONGO_URI is loaded
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not found in environment variables. Make sure .env file is in the backend root and loaded correctly.');
    return; // Exit if no connection string
  }

  try {
    // 1. Connect to MongoDB
    console.log(`Attempting to connect to MongoDB at ${process.env.MONGO_URI ? 'URI specified' : 'URI MISSING'}`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // 2. Delete existing places
    console.log('🧹 Deleting existing places...');
    const deleteResult = await Place.deleteMany({});
    console.log(`✅ ${deleteResult.deletedCount} existing places deleted`);

    // 3. Insert the new destination data
    console.log(`🌱 Inserting ${destinationsToSeed.length} new places...`);
    // --- Added check for potential validation errors during insert ---
    try {
        const insertedPlaces = await Place.insertMany(destinationsToSeed, { ordered: false }); // ordered:false tries to insert all valid docs even if some fail
        console.log(`✅ Successfully seeded ${insertedPlaces.length} places`);
    } catch (insertError) {
        // Log bulk write errors if they occur
        if (insertError.name === 'MongoBulkWriteError' || insertError.writeErrors) {
            console.error('❌ Errors during insertMany (some documents might have failed validation):');
            (insertError.writeErrors || []).forEach(err => {
                console.error(`  - Index ${err.index}: ${err.errmsg}`);
            });
             console.log(`ℹ️ Successfully seeded ${insertError.result?.nInserted || 0} places despite errors.`);
        } else {
             throw insertError; // Re-throw other unexpected errors
        }
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    // Log specific Mongoose connection errors if available
     if (error.name === 'MongoNetworkError') {
       console.error('   Network error during connection. Is MongoDB running and accessible?');
     } else if (error.name === 'MongooseServerSelectionError') {
        console.error('   Server selection error. Check MONGO_URI and database server status.');
     } else if (error.name === 'ValidationError') { // Should be caught by inner try/catch now
        console.error('   Validation Error:', error.errors);
     }
  } finally {
    // 4. Disconnect from MongoDB
    try {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected');
    } catch (disconnectError) {
        console.error('❌ Error disconnecting from MongoDB:', disconnectError);
    }
  }
};

// Run the seed function
seedDatabase();

