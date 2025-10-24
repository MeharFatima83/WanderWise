import React, { useState, useEffect } from "react";
// 1. Ensure useNavigate AND Link are imported
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
// Assuming your api functions are set up correctly to include the token
import { placesAPI, itineraryAPI } from "../../api/api";
// Comment out unused imports for now
// import PlaceCard from "../../../components/PlaceCard"; // Assuming you have this component
// import ProtectedRoute from "../../../components/ProtectedRoute"; // Assuming you have this

const ItineraryPage = () => {
  // 2. Initialize useNavigate
  const navigate = useNavigate();
  // Comment out unused 'user' variable for now
  const { /* user, */ isAuthenticated } = useAuth(); // Assuming useAuth provides the user object
  // Comment out unused 'places' state for now
  // const [places, setPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  // Comment out unused day/place selection state for now
  // const [selectedDay, setSelectedDay] = useState(1);
  // const [selectedPlaces, setSelectedPlaces] = useState([]);
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
    // Removed endDate as it wasn't in your previous form screenshot
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error on fetch

        // Fetch places regardless of login status (commented out as 'places' state is unused)
        // const placesDataPromise = placesAPI.getAllPlaces();

        // Fetch itineraries only if logged in
        const itinerariesDataPromise = isAuthenticated
          ? itineraryAPI.getUserItineraries()
          : Promise.resolve({ itineraries: [] });

        // Adjusted Promise.all since placesDataPromise is removed for now
        const [/* placesData */ itinerariesData] = await Promise.all([
          /* placesDataPromise */ Promise.resolve({ places: [] }), // Placeholder
          itinerariesDataPromise
        ]);

        // setPlaces(placesData.places || []); // Commented out
        setItineraries(itinerariesData.itineraries || []);

        // Automatically show create form if no itineraries exist
        if (isAuthenticated && (!itinerariesData.itineraries || itinerariesData.itineraries.length === 0)) {
           setShowCreateForm(true);
        }

      } catch (err) {
        console.error("Fetch data error:", err);
        setError('Failed to load data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]); // Rerun when login status changes

  // Comment out unused handlePlaceSelect function for now
  /*
  const handlePlaceSelect = (place) => {
    // This logic might move to the details/edit page later
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p._id === place._id);
      if (isSelected) {
        return prev.filter(p => p._id !== place._id);
      } else {
        return [...prev, place];
      }
    });
  };
  */

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setFormLoading(true);

    // Basic validation (can be more robust)
    if (!formData.title || !formData.destination || !formData.duration || !formData.budget || !formData.startDate) {
        setError("Please fill in all required fields.");
        setFormLoading(false);
        return;
    }

    try {
      const itineraryData = {
        title: formData.title,
        description: formData.description,
        destination: formData.destination,
        duration: parseInt(formData.duration),
        budget: parseInt(formData.budget),
        startDate: formData.startDate,
        // Backend should handle creating the initial empty 'days' array based on duration
      };

      // Make sure itineraryAPI.createItinerary sends the auth token!
      const result = await itineraryAPI.createItinerary(itineraryData);

      if (result.itinerary && result.itinerary._id) {
        // --- THIS IS THE KEY CHANGE ---
        // 3. Navigate to the details page on success
        navigate(`/itinerary/${result.itinerary._id}`);

        // No longer need to update local state or hide form here,
        // as we are leaving this page.
        // setItineraries(prev => [result.itinerary, ...prev]);
        // setShowCreateForm(false);
        // setFormData({ ... });

      } else {
         throw new Error(result.message || 'Itinerary created, but no ID returned.');
      }
    } catch (error) {
       console.error("Create itinerary error:", error);
       setError(`Failed to create itinerary: ${error.message || 'Unknown error'}`);
    } finally {
      setFormLoading(false);
    }
  };

  // --- UI Logic ---

  // Show login prompt if not authenticated
  if (!isAuthenticated && !loading) { // Check loading to prevent flash of login prompt
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Plan Your Journey
            </h1>
            <p className="text-gray-600 mb-6">Please log in to view and create your personalized travel itineraries.</p>
            {/* Ensure Link is used here */}
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-sm mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">🔄 Loading your travel plans...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message
  if (error && !showCreateForm) { // Don't show general load error if form error exists
    return (
       <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-pink-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-2xl shadow-xl p-8 text-center">
             <div className="text-5xl text-red-500 mb-4">❌</div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
             <p className="text-gray-600">{error}</p>
             {/* Optional: Add a retry button */}
          </div>
        </div>
      </div>
    );
  }

  // Main content for logged-in users
  return (
    // Commented out unused ProtectedRoute wrapper
    // <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-24 px-4"> {/* Increased top padding */}
        <div className="max-w-7xl mx-auto">

          {/* Always show header */}
           <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Your Itineraries
            </h1>
            <p className="text-gray-600 mb-6">Plan, explore, and relive your journey — one day at a time.</p>
             {/* Show button only if form isn't visible */}
            {!showCreateForm && (
                 <button
                   onClick={() => { setShowCreateForm(true); setError(''); }} // Clear errors when opening form
                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                 >
                   ✈️ Create New Itinerary
                 </button>
            )}
           </div>


          {/* Conditionally render Create Itinerary Form */}
          {showCreateForm && (
            <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  🗺️ Plan Your Next Trip
                </h2>
                <p className="text-gray-600 mt-2">Fill in the details below.</p>
              </div>

              {/* Display form-specific errors here */}
              {error && (
                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                   ❌ {error}
                 </div>
              )}

              <form onSubmit={handleCreateItinerary} className="grid gap-6">
                {/* Form fields - Use the structure from your CreateItineraryPage.js */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g., Mumbai Weekend" required className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl"/>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                       <input type="text" name="destination" value={formData.destination} onChange={handleFormChange} placeholder="e.g., Mumbai, India" required className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl"/>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Trip goals, interests..." rows="3" className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl resize-none"></textarea>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                       <input type="number" name="duration" value={formData.duration} onChange={handleFormChange} placeholder="e.g., 3" min="1" required className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl"/>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                       <input type="number" name="budget" value={formData.budget} onChange={handleFormChange} placeholder="e.g., 500" min="0" required className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl"/>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                       <input type="date" name="startDate" value={formData.startDate} onChange={handleFormChange} required className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl"/>
                    </div>
                 </div>

                {/* Submit/Cancel Buttons */}
                <div className="flex gap-4 mt-4">
                  <button type="submit" disabled={formLoading} className="flex-1 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50">
                    {formLoading ? '🔄 Creating...' : '✨ Create Itinerary'}
                  </button>
                  <button type="button" onClick={() => { setShowCreateForm(false); setError(''); }} className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100">
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Display Existing Itineraries (only if form is hidden) */}
          {!showCreateForm && itineraries.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Your Saved Trips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map(itin => (
                  // Ensure Link is used here
                  <Link
                    to={`/itinerary/${itin._id}`}
                    key={itin._id}
                    className="block bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer border border-blue-100 hover:border-blue-300"
                  >
                     <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{itin.title}</h3>
                     <p className="text-sm text-gray-500 mb-1">{itin.destination}</p>
                     <p className="text-xs text-gray-600 line-clamp-2 mb-3">{itin.description}</p>
                     <div className="flex justify-between items-center text-sm font-medium text-blue-700">
                       <span>📅 {itin.duration} Days</span>
                       <span>💰 ${itin.budget?.toLocaleString()}</span>
                     </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

           {/* Commented out unused Places section
           {!showCreateForm && (
             <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 ...">🏛️ Explore Places</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map(place => ( <PlaceCard key={place._id} place={place} onSelect={handlePlaceSelect} isSelected={selectedPlaces.some(p => p._id === place._id)} /> ))}
                </div>
             </div>
           )} */}

        </div>
      </div>
    // </ProtectedRoute>
  );
};

export default ItineraryPage;