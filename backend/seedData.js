const mongoose = require('mongoose');
const { Place } = require('./Model/Model');
require('dotenv').config();

const samplePlaces = [
  {
    name: "Eiffel Tower",
    description: "Iconic iron lattice tower and symbol of Paris, offering breathtaking city views from its observation decks.",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=60",
    location: "Paris, France",
    category: "landmark",
    priceRange: "moderate",
    rating: 4.8,
    coordinates: { lat: 48.8584, lng: 2.2945 }
  },
  {
    name: "Santorini Sunset View",
    description: "Breathtaking sunset views from the famous white-washed buildings overlooking the Aegean Sea.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=60",
    location: "Santorini, Greece",
    category: "attraction",
    priceRange: "luxury",
    rating: 4.9,
    coordinates: { lat: 36.3932, lng: 25.4615 }
  },
  {
    name: "Tokyo Street Food Tour",
    description: "Experience authentic Japanese cuisine through guided street food tours in Tokyo's vibrant districts.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60",
    location: "Tokyo, Japan",
    category: "restaurant",
    priceRange: "budget",
    rating: 4.6,
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    name: "Swiss Alps Hiking",
    description: "Scenic hiking trails through the majestic Swiss Alps with panoramic mountain views and fresh alpine air.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60",
    location: "Swiss Alps, Switzerland",
    category: "activity",
    priceRange: "moderate",
    rating: 4.7,
    coordinates: { lat: 46.5197, lng: 6.6323 }
  },
  {
    name: "Bali Beach Resort",
    description: "Luxurious beachfront resort with traditional Balinese architecture and world-class spa services.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60",
    location: "Bali, Indonesia",
    category: "hotel",
    priceRange: "luxury",
    rating: 4.8,
    coordinates: { lat: -8.3405, lng: 115.0920 }
  },
  {
    name: "Colosseum Tour",
    description: "Ancient Roman amphitheater with guided tours revealing the history of gladiatorial combat and Roman architecture.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=60",
    location: "Rome, Italy",
    category: "landmark",
    priceRange: "moderate",
    rating: 4.5,
    coordinates: { lat: 41.8902, lng: 12.4922 }
  },
  {
    name: "New York Central Park",
    description: "Urban oasis in the heart of Manhattan, perfect for walking, cycling, and enjoying nature in the city.",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=800&q=60",
    location: "New York, USA",
    category: "attraction",
    priceRange: "budget",
    rating: 4.4,
    coordinates: { lat: 40.7829, lng: -73.9654 }
  },
  {
    name: "Dubai Desert Safari",
    description: "Thrilling desert adventure with camel rides, sandboarding, and traditional Bedouin camp experience.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=60",
    location: "Dubai, UAE",
    category: "activity",
    priceRange: "moderate",
    rating: 4.6,
    coordinates: { lat: 25.2048, lng: 55.2708 }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing places
    await Place.deleteMany({});
    console.log('🗑️ Cleared existing places');

    // Insert sample places
    await Place.insertMany(samplePlaces);
    console.log(`✅ Inserted ${samplePlaces.length} sample places`);

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
