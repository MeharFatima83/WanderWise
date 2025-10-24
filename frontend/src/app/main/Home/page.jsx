import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      {/* Navbar */}
      <nav className="fixed w-full top-0 left-0 bg-white/80 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
            Wander<span className="text-yellow-500">Wise</span>
          </Link>
          <div className="flex gap-6 font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition">About</Link>
            <Link to="/itinerary" className="hover:text-blue-600 transition">Itinerary</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="travel-slide"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-xl">
            Explore Incredible India 🌏
          </h1>
          <p className="text-lg mb-6 drop-shadow-lg">
            From the Himalayas to the beaches — find your perfect getaway.
          </p>
          <Link
            to="/itinerary"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full shadow-lg transition"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Destination Filter */}
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4 mt-12">
        {["All", "Beach", "Hills", "Heritage", "Adventure"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full font-semibold border ${
              filter === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Popular Indian Destinations 🇮🇳
          </h2>
          <p className="text-gray-600">
            Handpicked journeys that show the heart of India
          </p>
        </div>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((place, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
            >
              <img
                src={place.image}
                alt={place.name}
                className="h-80 w-full object-cover transform group-hover:scale-110 transition duration-500 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 p-6 text-white w-full">
                <h3 className="text-2xl font-bold mb-1">{place.name}</h3>
                <p className="text-sm text-gray-200">{place.location}</p>
                <p className="text-gray-100 text-sm mt-2 line-clamp-2">
                  {place.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm font-semibold">⏳ {place.days}</p>
                  <p className="text-yellow-400 font-bold text-lg">
                    ₹{place.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 text-center">
        <h3 className="text-3xl font-semibold mb-6">
          Ready to craft your dream itinerary?
        </h3>
        <Link
          to="/itinerary"
          className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
        >
          Plan Now
        </Link>
      </section>
    </div>
  );
}

const destinations = [
  {
    name: "Mussoorie",
    location: "Uttarakhand, India",
    image: "mussoorie.jpg",
    description: "The Queen of Hills — scenic views, waterfalls, and colonial charm.",
    days: "5 Days",
    price: 48000,
    category: "Hills",
  },
  {
    name: "Goa",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Golden beaches, vibrant nightlife, and endless fun under the sun.",
    days: "4 Days",
    price: 36000,
    category: "Beach",
  },
  {
    name: "Ladakh",
    location: "Leh-Ladakh, India",
    image: "ladakh.jpg",
    description: "Adventure, monasteries, and surreal landscapes at every turn.",
    days: "7 Days",
    price: 62000,
    category: "Adventure",
  },
  {
    name: "Kerala",
    location: "Backwaters, India",
    image: "kerala.jpg",
    description: "Serene backwaters, lush greenery, and Ayurvedic experiences.",
    days: "6 Days",
    price: 52000,
    category: "Beach",
  },
  {
    name: "Jaipur",
    location: "Rajasthan, India",
    image: "jaipur.jpg",
    description: "The Pink City — heritage forts, palaces, and royal culture.",
    days: "3 Days",
    price: 28000,
    category: "Heritage",
  },
  {
    name: "Andaman Islands",
    location: "Bay of Bengal, India",
    image: "andaman.jpg",
    description: "Turquoise waters, coral reefs, and tropical tranquility.",
    days: "5 Days",
    price: 57000,
    category: "Beach",
  },
  {
    name: "Pune",
    location: "Maharashtra, India",
    image: "pune.jpg",
    description: "Cultural city with vibrant cafes, historical landmarks, and pleasant weather.",
    days: "3 Days",
    price: 15000,
    category: "Heritage",
  },
  {
    name: "Mumbai",
    location: "Maharashtra, India",
    image: "marine.jpg",
    description: "The city of dreams with bustling markets, nightlife, and iconic landmarks.",
    days: "4 Days",
    price: 20000,
    category: "Beach",
  },
  {
    name: "Nainital",
    location: "Uttarakhand, India",
    image: "nainital.jpg",
    description: "Hill station with serene lakes, scenic views, and cool mountain air.",
    days: "3 Days",
    price: 18000,
    category: "Hills",
  },
];
