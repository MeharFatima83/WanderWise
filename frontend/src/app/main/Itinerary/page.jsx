import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { placesAPI, itineraryAPI } from "../../api/api";
import PlaceCard from "../../../components/PlaceCard";
import ProtectedRoute from "../../../components/ProtectedRoute";

const ItineraryPage = () => {
  const { isAuthenticated } = useAuth();
  const [places, setPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: '',
    budget: '',
    startDate: '',
    endDate: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesData, itinerariesData] = await Promise.all([
          placesAPI.getAllPlaces(),
          isAuthenticated ? itineraryAPI.getUserItineraries() : Promise.resolve({ itineraries: [] })
        ]);
        
        setPlaces(placesData.places || []);
        setItineraries(itinerariesData.itineraries || []);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handlePlaceSelect = (place) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p._id === place._id);
      if (isSelected) {
        return prev.filter(p => p._id !== place._id);
      } else {
        return [...prev, place];
      }
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const itineraryData = {
        ...formData,
        duration: parseInt(formData.duration),
        budget: parseInt(formData.budget),
        days: Array.from({ length: parseInt(formData.duration) }, (_, i) => ({
          dayNumber: i + 1,
          title: `Day ${i + 1} - ${formData.destination}`,
          description: `Explore ${formData.destination} on day ${i + 1}`,
          places: [],
          budget: Math.floor(parseInt(formData.budget) / parseInt(formData.duration))
        }))
      };
      
      const result = await itineraryAPI.createItinerary(itineraryData);
      if (result.itinerary) {
        setItineraries(prev => [result.itinerary, ...prev]);
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          destination: '',
          duration: '',
          budget: '',
          startDate: '',
          endDate: ''
        });
      }
    } catch (error) {
      setError('Failed to create itinerary');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Your Itinerary
            </h1>
            <p className="text-gray-600 mb-6">Please log in to view and create your personalized travel itineraries.</p>
            <a href="/login" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Login to Continue
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">🔄 Loading your itineraries...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Oops! Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8 text-center hover:shadow-2xl transition-all duration-300">
            <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Your Itinerary
            </h1>
            <p className="text-gray-600 mb-6">Plan, explore, and relive your journey — one day at a time.</p>
            {itineraries.length === 0 && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ✈️ Create New Itinerary
              </button>
            )}
          </div>

          {/* Create Itinerary Form */}
          {showCreateForm && (
            <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  🗺️ Create New Itinerary
                </h2>
                <p className="text-gray-600 mt-2">Fill in the details to start planning your trip</p>
              </div>
              
              <form onSubmit={handleCreateItinerary} className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="e.g., Amazing Paris Adventure"
                      className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleFormChange}
                      placeholder="e.g., Paris, France"
                      className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe your trip and what you want to experience..."
                    rows="3"
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      placeholder="e.g., 5"
                      min="1"
                      max="30"
                      className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleFormChange}
                      placeholder="e.g., 2000"
                      min="0"
                      className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {formLoading ? '🔄 Creating...' : '✨ Create Itinerary'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:border-blue-300"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {itineraries.length > 0 ? (
            <>
              {/* Day Selector */}
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-6 mb-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-wrap justify-center gap-4">
                  {itineraries[0].days.map((day) => (
          <button
                      key={day.dayNumber}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                        selectedDay === day.dayNumber
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedDay(day.dayNumber)}
                    >
                      📅 Day {day.dayNumber}
          </button>
        ))}
                </div>
      </div>

              {/* Itinerary Details */}
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    🗺️ {itineraries[0].days.find(d => d.dayNumber === selectedDay)?.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {itineraries[0].days.find(d => d.dayNumber === selectedDay)?.description}
                  </p>
                  <div className="flex justify-center gap-6">
                    <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                      💰 Budget: ${itineraries[0].budget}
                    </span>
                    <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                      📅 Duration: {itineraries[0].duration} days
                    </span>
                  </div>
        </div>
      </div>

              {/* Places Section */}
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  🏛️ Places to Visit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map(place => (
                    <PlaceCard
                      key={place._id}
                      place={place}
                      onSelect={handlePlaceSelect}
                      isSelected={selectedPlaces.some(p => p._id === place._id)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8 text-center hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🗺️ No Itineraries Yet</h2>
              <p className="text-gray-600 mb-6">Create your first travel itinerary to get started!</p>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">🏛️ Explore Places</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map(place => (
                    <PlaceCard
                      key={place._id}
                      place={place}
                      onSelect={handlePlaceSelect}
                      isSelected={selectedPlaces.some(p => p._id === place._id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Popular Destinations */}
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              🌍 Popular Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60" alt="Paris" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">🇫🇷 Paris Getaway</h3>
                <p className="text-gray-600">Romantic 3-day tour with Eiffel Tower, cafes, and Seine cruise.</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=60" alt="Bali" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">🏝️ Bali Escape</h3>
                <p className="text-gray-600">Relax in beaches, temples, and the tropical paradise of Bali.</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60" alt="Switzerland" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">🏔️ Swiss Adventure</h3>
                <p className="text-gray-600">Mountains, chocolate, and scenic train rides through Alps.</p>
          </div>
          </div>
          </div>
        </div>
    </div>
    </ProtectedRoute>
  );
};

export default ItineraryPage;
