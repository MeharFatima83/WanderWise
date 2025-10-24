import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaRegClock, FaMoneyBillWave } from 'react-icons/fa';

export default function ItineraryDetailsPage() {
  // 1. Get the itinerary ID from the URL
  const { itineraryId } = useParams(); 
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Fetch the specific itinerary from the backend when the page loads
  useEffect(() => {
    const fetchItinerary = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view this.');
        setLoading(false);
        return;
      }

      try {
        // Use the backend route for getting a single itinerary
        const res = await fetch(`http://localhost:5000/api/itineraries/${itineraryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Itinerary not found or you do not have permission.');
        }

        const data = await res.json();
        setItinerary(data.itinerary); // Set the fetched itinerary in state

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId]); // Re-run this effect if the ID in the URL changes

  // 3. Show loading or error messages
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-2xl font-semibold text-blue-600">🔄 Loading Itinerary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <div className="text-5xl text-red-500 mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link 
            to="/itinerary" 
            className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return <div className="text-center py-20">Itinerary not found.</div>;
  }

  // Helper to format the date (can be customized)
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    // The date from your form is YYYY-MM-DD, so we adjust for timezone
    const date = new Date(dateString.replace(/-/g, '\/'));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 4. Display the itinerary details
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          {/* We'll use a placeholder image for now, as one isn't saved */}
          <img 
            src={`https://placehold.co/1200x400/3b82f6/ffffff?text=${itinerary.destination}`} 
            alt={itinerary.title}
            className="w-full h-48 sm:h-64 object-cover rounded-xl mb-6"
          />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {itinerary.title}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">{itinerary.description}</p>
            </div>
            <Link 
              to={`/itinerary/edit/${itinerary._id}`} // Link for a future "Edit" page
              className="mt-4 sm:mt-0 flex-shrink-0 inline-flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <FaEdit /> Edit Itinerary
            </Link>
          </div>
          <div className="border-t border-blue-100 my-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-500 text-2xl" />
              <div>
                <span className="text-sm font-semibold">Destination</span>
                <p className="font-bold text-gray-900">{itinerary.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-blue-500 text-2xl" />
              <div>
                <span className="text-sm font-semibold">Start Date</span>
                <p className="font-bold text-gray-900">{formatDate(itinerary.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaRegClock className="text-blue-500 text-2xl" />
              <div>
                <span className="text-sm font-semibold">Duration</span>
                <p className="font-bold text-gray-900">{itinerary.duration} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaMoneyBillWave className="text-green-500 text-2xl" />
              <div>
                <span className="text-sm font-semibold">Budget</span>
                <p className="font-bold text-gray-900">${itinerary.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Day-by-Day Itinerary (Placeholder) */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Day-by-Day Plan</h2>
          
          <div className="text-center text-gray-500 border-2 border-dashed border-gray-300 p-12 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon!</h3>
            <p>
              Your day-by-day plan will appear here.
            </p>
            <p className="mt-2 text-sm">
              Next step: Update your backend `createItinerary` function to automatically generate the `days` array!
            </p>
          </div>
          
          {/* TODO: Once your backend 'days' array is populated, you will loop through it here:
            <div className="space-y-6">
              {itinerary.days.map((day, index) => (
                <div key={index} className="border-b border-blue-100 pb-4">
                  <h3 className="text-2xl font-semibold text-blue-700">Day {day.day}</h3>
                  <p className="text-gray-600 mt-1">{day.description}</p>
                  <div className="mt-4 space-y-2">
                    {day.places.map((place, pIndex) => (
                      <div key={pIndex} className="p-3 bg-gray-50 rounded-lg">
                        {place.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          */}
        </div>
      </div>
    </div>
  );
}
