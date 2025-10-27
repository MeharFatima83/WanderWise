import React, { useState, useEffect } from "react";
// Make sure Link is imported
import { Link } from "react-router-dom";

// Hardcoded destinations data (using your specified image URLs)
const destinations = [
  {
    name: "Mussoorie",
    location: "Uttarakhand, India",
    image: "mussoorie.jpg", // Kept as provided
    description: "The Queen of Hills — scenic views, waterfalls, and colonial charm.",
    days: "5 Days",
    price: 48000,
    category: "Hills",
  },
  {
    name: "Goa",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", // Kept as provided
    description: "Golden beaches, vibrant nightlife, and endless fun under the sun.",
    days: "4 Days",
    price: 36000,
    category: "Beach",
  },
  {
    name: "Ladakh",
    location: "Leh-Ladakh, India",
    image: "ladakh.jpg", // Kept as provided
    description: "Adventure, monasteries, and surreal landscapes at every turn.",
    days: "7 Days",
    price: 62000,
    category: "Adventure",
  },
  {
    name: "Kerala",
    location: "Backwaters, India",
    image: "kerala.jpg", // Kept as provided
    description: "Serene backwaters, lush greenery, and Ayurvedic experiences.",
    days: "6 Days",
    price: 52000,
    category: "Beach",
  },
  {
    name: "Jaipur",
    location: "Rajasthan, India",
    image: "jaipur.jpg", // Kept as provided
    description: "The Pink City — heritage forts, palaces, and royal culture.",
    days: "3 Days",
    price: 28000,
    category: "Heritage",
  },
  {
    name: "Andaman Islands",
    location: "Bay of Bengal, India",
    image: "andaman.jpg", // Kept as provided
    description: "Turquoise waters, coral reefs, and tropical tranquility.",
    days: "5 Days",
    price: 57000,
    category: "Beach",
  },
  {
    name: "Pune",
    location: "Maharashtra, India",
    image: "pune.jpg", // Kept as provided
    description: "Cultural city with vibrant cafes, historical landmarks, and pleasant weather.",
    days: "3 Days",
    price: 15000,
    category: "Heritage",
  },
  {
    name: "Mumbai",
    location: "Maharashtra, India",
    image: "marine.jpg", // Kept as provided
    description: "The city of dreams with bustling markets, nightlife, and iconic landmarks.",
    days: "4 Days",
    price: 20000,
    category: "Beach",
  },
  {
    name: "Nainital",
    location: "Uttarakhand, India",
    image: "nainital.jpg", // Kept as provided
    description: "Hill station with serene lakes, scenic views, and cool mountain air.",
    days: "3 Days",
    price: 18000,
    category: "Hills",
  },
];


export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filter, setFilter] = useState("All");

  const slides = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const filteredDestinations =
    filter === "All"
      ? destinations
      : destinations.filter((place) => place.category === filter);

  return (
    <div className="bg-[#f9fafb] text-gray-800 min-h-screen font-sans">
      {/* Navbar is likely rendered outside this page component in App.js */}

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden pt-16"> {/* Added pt-16 for navbar offset */}
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="travel-slide"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
             // Removed onError handler to keep original image URLs
          />
        ))}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-xl">
            Explore Incredible India 🌏
          </h1>
          <p className="text-md sm:text-lg mb-6 drop-shadow-lg max-w-2xl mx-auto">
            From the Himalayas to the beaches — find your perfect getaway with personalized itineraries.
          </p>
          <Link
            to="/itinerary" // Link to itinerary creation page
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Destination Filter */}
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-3 sm:gap-4 mt-12 px-4">
        {["All", "Beach", "Hills", "Heritage", "Adventure"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 sm:px-5 py-2 rounded-full font-semibold border text-sm sm:text-base ${
              filter === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            } transition duration-300`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Popular Indian Destinations 🇮🇳
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Handpicked journeys that show the heart of India. Click on a destination to see places to visit!
          </p>
        </div>

        <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((place, idx) => (
            // --- WRAP CARD IN LINK ---
            // Use encodeURIComponent to handle spaces/special chars in names for the URL
            <Link
              to={`/destination/${encodeURIComponent(place.name)}`}
              key={idx}
              className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // Make Link the block container and add focus styles
            >
              {/* Card Content Div remains inside the Link */}
              <div>
                <img
                  src={place.image} // Use the image URL directly from your data
                  alt={place.name}
                  className="h-80 w-full object-cover transform group-hover:scale-110 transition duration-500 ease-in-out"
                  // Removed onError handler to keep original image URLs
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 p-5 sm:p-6 text-white w-full">
                  <h3 className="text-2xl font-bold mb-1 truncate">{place.name}</h3>
                  <p className="text-sm text-gray-200 mb-2">{place.location}</p>
                  <p className="text-gray-100 text-sm mt-2 line-clamp-2">
                    {place.description}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <p className="font-semibold bg-black/30 px-2 py-1 rounded">⏳ {place.days}</p>
                    <p className="text-yellow-400 font-bold text-lg bg-black/30 px-2 py-1 rounded">
                      ₹{place.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            // --- END LINK WRAPPER ---
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 text-center mt-8">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-6 px-4">
          Ready to craft your dream itinerary?
        </h3>
        <Link
          to="/itinerary" // Link to itinerary creation page
          className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Plan Now
        </Link>
      </section>

      {/* Footer is likely rendered outside this page component in App.js */}
    </div>
  );
}

