import React, { useState, useEffect } from 'react';
// 1. Ensure useNavigate is imported
import { useParams, Link, useNavigate } from 'react-router-dom';
import { itineraryAPI } from '../../api/api'; // Assuming your API functions are here

export default function ItineraryDetailsPage() {
  const { itineraryId } = useParams();
  // 2. Initialize useNavigate
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itineraryId) {
        setError('Itinerary ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching itinerary with ID: ${itineraryId}`);
        // This API call should populate the 'place' details within each day's 'places' array
        const data = await itineraryAPI.getItineraryById(itineraryId);
        console.log('API Response:', data);

        if (data.itinerary) {
          setItinerary(data.itinerary);
          // *** Log fetched data for debugging days.places ***
          console.log('Fetched Itinerary Data (check days.places):', JSON.stringify(data.itinerary, null, 2));
          // *** END LOG ***
        } else {
          console.warn('API did not return a valid itinerary object:', data);
          setError(data.message || `Itinerary with ID ${itineraryId} not found or access denied.`);
        }
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError(`Failed to load itinerary. ${err.message || 'Please try again later.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
         return "Invalid Date";
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Important if backend saves UTC dates
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  // 3. Define the handler function for the edit button
  const handleEditClick = () => {
      if (itinerary && itinerary._id) {
          console.log(`Navigating to edit page for ID: ${itinerary._id}`);
          navigate(`/itinerary/edit/${itinerary._id}`);
      } else {
          console.error("Cannot edit: Itinerary data is not available or missing _id.");
          setError("Cannot edit itinerary at the moment.");
      }
  };

  // --- UI Logic ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
           <p className="text-gray-600">Loading itinerary details...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-red-50 to-pink-50 p-4">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 max-w-lg">
           <div className="text-4xl text-red-500 mb-3">😟</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Couldn't load itinerary</h2>
          <p className="text-red-700">{error}</p>
          <Link to="/itinerary" className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition duration-300">
            &larr; Back to My Itineraries
          </Link>
        </div>
      </div>
    );
  }

  if (!itinerary) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-yellow-50 to-orange-50 p-4">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-200 max-w-lg">
           <div className="text-4xl text-yellow-500 mb-3">🤔</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Itinerary Not Found</h2>
          <p className="text-yellow-800">We couldn't find the itinerary you're looking for.</p>
           <Link to="/itinerary" className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition duration-300">
             &larr; Back to My Itineraries
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg p-8 mb-8 overflow-hidden">
           <div className="relative z-10">
                <div className="mb-4">
                  <Link to="/itinerary" className="text-indigo-100 hover:text-white transition duration-300 text-sm">
                      &larr; Back to My Itineraries
                  </Link>
                </div>
                <h1 className="text-4xl font-bold mb-2">{itinerary.title}</h1>
                <p className="text-indigo-100 text-lg mb-6">{itinerary.description || `Your trip to ${itinerary.destination}`}</p>

                {/* Edit Button */}
                <button
                   onClick={handleEditClick}
                   className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg backdrop-blur-sm transition duration-300 cursor-pointer"
                >
                  ✏️ Edit Itinerary
                </button>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6 bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                  <div>
                    <span className="block text-xs uppercase text-indigo-200">Destination</span>
                    <span className="text-lg font-semibold">{itinerary.destination}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-indigo-200">Start Date</span>
                    <span className="text-lg font-semibold">{formatDate(itinerary.startDate)}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-indigo-200">Duration</span>
                    <span className="text-lg font-semibold">{itinerary.duration} Days</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-indigo-200">Budget</span>
                    <span className="text-lg font-semibold">${itinerary.budget?.toLocaleString()}</span>
                  </div>
                </div>
            </div>
        </div>

        {/* Day-by-Day Plan Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Day-by-Day Plan
          </h2>

          {/* Check if days array exists and has items */}
          {(!itinerary.days || itinerary.days.length === 0) ? (
            <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-3xl text-gray-400 mb-3">📅</div>
              <p className="text-gray-600 font-semibold">Your day-by-day plan is currently empty.</p>
              <p className="text-sm text-gray-500 mt-2">Edit the itinerary to add places and activities!</p>
            </div>
          ) : (
            // If days exist, map through them
            <div className="space-y-6">
              {itinerary.days
                .sort((a, b) => a.dayNumber - b.dayNumber) // Sort days just in case
                .map((day) => (
                <div key={day._id || day.dayNumber} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30 transition duration-300 hover:shadow-md">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                     Day {day.dayNumber}: {day.title || `Exploring ${itinerary.destination}`}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{day.description || 'Planned activities for the day.'}</p>

                  {/* Check if places array exists and has items for THIS day */}
                  {(!day.places || day.places.length === 0) ? (
                     <p className="text-sm text-gray-500 italic">No specific places added for this day yet.</p>
                  ) : (
                    // If places exist for this day, map through them
                    <div className="space-y-3">
                      {day.places.map((placeItem, index) => {
                        // The 'place' field should be populated by the backend query
                        const placeDetails = placeItem.place;

                        // Add a check in case population didn't work for some reason
                        if (!placeDetails) {
                          return (
                            <div key={index} className="p-3 bg-red-50 rounded border border-red-200 text-red-700 text-sm">
                              Error: Place details not found (ID: {placeItem.place}). Check backend population.
                            </div>
                          );
                        }

                        // Render the place details
                        return (
                          <div key={placeDetails._id || index} className="flex items-start gap-4 p-3 bg-white rounded shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                             <img
                               src={placeDetails.image || 'https://placehold.co/100x100/EEE/31343C?text=N/A'}
                               alt={placeDetails.name || 'Place'}
                               className="w-20 h-20 md:w-24 md:h-24 object-cover rounded flex-shrink-0 mt-1"
                               onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/EEE/31343C?text=N/A'; }}
                             />
                            <div className="flex-grow">
                              <h4 className="font-semibold text-gray-800">{placeDetails.name || 'Unknown Place'}</h4>
                              {/* --- Displays Location --- */}
                              <p className="text-xs text-gray-500 mb-1">
                                {placeDetails.category ? `${placeDetails.category} - ` : ''}
                                {placeDetails.location || 'Unknown Location'}
                              </p>
                              {/* --- End Location Display --- */}
                               <p className="text-sm text-gray-600 line-clamp-2">{placeDetails.description || 'No description available.'}</p>
                            </div>
                             <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full self-start capitalize">
                               {placeItem.timeSlot || 'Anytime'}
                             </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
