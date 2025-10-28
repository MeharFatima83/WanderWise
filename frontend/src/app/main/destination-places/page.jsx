import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { placesAPI } from '../../api/api'; // Adjust path if your api.js is elsewhere
import PlaceCard from '../../../components/PlaceCard'; // Adjust path to your PlaceCard component

export default function DestinationPlacesPage() {
  const { destinationName } = useParams(); // Get destination name from URL parameter
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Decode the destination name from the URL (handles spaces, etc.)
  const decodedDestinationName = decodeURIComponent(destinationName || '');

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!decodedDestinationName) {
        setError('Destination name is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching places for name: ${decodedDestinationName}`); // Log name being fetched
        // --- UPDATED: Fetch places filtering by NAME instead of LOCATION ---
        // Pass the filter object { name: ... } to the API call
        const data = await placesAPI.getAllPlaces({ name: decodedDestinationName });
        console.log('API Response for places:', data);

        if (data.places) {
          setPlaces(data.places);
        } else {
          console.warn('API did not return a valid places array:', data);
          setPlaces([]); // Set to empty array if no places found or error
        }
      } catch (err) {
        console.error("Error fetching places:", err);
        setError(`Failed to load places for ${decodedDestinationName}. ${err.message || 'Please try again later.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [decodedDestinationName]); // Re-fetch if the destinationName changes

  // --- UI Logic ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 pt-20">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
           <p className="text-gray-600">Loading places for {decodedDestinationName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-pink-100 p-4 pt-20">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 max-w-lg">
           <div className="text-4xl text-red-500 mb-3">😟</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Couldn't load places</h2>
          <p className="text-red-700">{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition duration-300">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-24 px-4"> {/* Added padding top */}
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
           {/* Back Link */}
           <div className="mb-4">
               <Link to="/" className="text-blue-600 hover:text-blue-800 transition duration-300 text-sm">
                   &larr; Back to Home
               </Link>
           </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Places to Visit in <span className="text-blue-600">{decodedDestinationName}</span>
          </h1>
          <p className="text-gray-600">Discover attractions, restaurants, and more.</p>
        </div>

        {/* Places Grid Section */}
        {places.length === 0 ? (
           <div className="text-center py-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 max-w-lg mx-auto shadow-md">
              <div className="text-3xl text-gray-400 mb-3">🗺️</div>
              <p className="text-gray-600 font-semibold">No places found for "{decodedDestinationName}" in our database yet.</p>
              <p className="text-sm text-gray-500 mt-2">Check back later or explore other destinations!</p>
           </div>
        ) : (
          <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              // Use PlaceCard component
              <PlaceCard
                key={place._id}
                place={place}
                // Removed onSelect and isSelected props as they might not be needed here
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

