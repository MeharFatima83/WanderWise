import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itineraryAPI } from '../../api/api'; // Adjust path if needed

export default function EditItineraryPage() {
  const { itineraryId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    duration: '',
    budget: '',
    startDate: '',
    // Note: We don't need endDate in the form, it will be recalculated on the backend
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [originalItinerary, setOriginalItinerary] = useState(null); // To compare changes

  // Format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      // Ensure month and day are 2 digits
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error formatting date for input:", e);
      return '';
    }
  };

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
        const data = await itineraryAPI.getItineraryById(itineraryId);
        if (data.itinerary) {
          setOriginalItinerary(data.itinerary); // Store original
          // Pre-fill form data
          setFormData({
            title: data.itinerary.title || '',
            destination: data.itinerary.destination || '',
            description: data.itinerary.description || '',
            duration: data.itinerary.duration?.toString() || '', // Ensure it's a string for input
            budget: data.itinerary.budget?.toString() || '',     // Ensure it's a string for input
            startDate: formatDateForInput(data.itinerary.startDate), // Format date correctly
          });
        } else {
          setError(data.message || `Itinerary with ID ${itineraryId} not found.`);
        }
      } catch (err) {
        console.error("Error fetching itinerary for edit:", err);
        setError(`Failed to load itinerary. ${err.message || 'Please try again.'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [itineraryId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Basic validation
    if (!formData.title || !formData.destination || !formData.duration || !formData.budget || !formData.startDate) {
        setError("Please fill in all required fields.");
        setSaving(false);
        return;
    }

    // Prepare only the changed data to send (optional optimization)
    const updatedData = {};
    for (const key in formData) {
       // Compare with original formatted date for startDate
       const originalValue = (key === 'startDate')
           ? formatDateForInput(originalItinerary?.[key])
           : originalItinerary?.[key]?.toString();

       if (formData[key] !== originalValue) {
           updatedData[key] = (key === 'duration' || key === 'budget')
               ? parseInt(formData[key]) // Send numbers for duration/budget
               : formData[key];
       }
    }

    // If nothing changed, just navigate back
    if (Object.keys(updatedData).length === 0) {
        navigate(`/itinerary/${itineraryId}`); // Navigate back to details page
        setSaving(false);
        return;
    }


    try {
      console.log('Updating itinerary with data:', updatedData);
      const result = await itineraryAPI.updateItinerary(itineraryId, updatedData);

      if (result.itinerary) {
        console.log('Update successful:', result);
        navigate(`/itinerary/${itineraryId}`); // Navigate back to details page on success
      } else {
        throw new Error(result.message || 'Update failed, no itinerary returned.');
      }
    } catch (err) {
      console.error("Error updating itinerary:", err);
      setError(`Failed to update itinerary: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  // --- UI Logic ---

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
         <p>Loading itinerary data...</p> {/* Add spinner later */}
       </div>
     );
  }

  if (error && !originalItinerary) { // Show fatal error only if itinerary couldn't load at all
     return (
       <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
         <div className="text-center p-6 bg-white rounded-lg shadow-md border border-red-200">
           <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Itinerary</h2>
           <p className="text-red-600">{error}</p>
           <Link to="/itinerary" className="mt-4 inline-block text-blue-600 hover:underline">
             Back to My Itineraries
           </Link>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-24 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-200 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ✏️ Edit Itinerary
          </h1>
           <p className="text-gray-600 mt-2">Update the details for your trip: <span className="font-medium">{originalItinerary?.title}</span></p>
        </div>

        {/* Display non-fatal errors during save */}
        {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                ❌ {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Amazing Paris Adventure"
                  required
                  className="py-3 px-4 block w-full border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                 <input
                   type="text"
                   name="destination"
                   value={formData.destination}
                   onChange={handleChange}
                   placeholder="e.g., Paris, France"
                   required
                   className="py-3 px-4 block w-full border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your trip..."
                rows="3"
                className="py-3 px-4 block w-full border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
               />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                 <input
                   type="number"
                   name="duration"
                   value={formData.duration}
                   onChange={handleChange}
                   placeholder="e.g., 5"
                   min="1"
                   required
                   className="py-3 px-4 block w-full border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                 <input
                   type="number"
                   name="budget"
                   value={formData.budget}
                   onChange={handleChange}
                   placeholder="e.g., 2000"
                   min="0"
                   required
                   className="py-3 px-4 block w-full border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                 <input
                   type="date"
                   name="startDate"
                   value={formData.startDate}
                   onChange={handleChange}
                   required
                   className="py-3 px-4 block w-full border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
              </div>
           </div>

           {/* --- Day and Place Editing (Placeholder for now) --- */}
           {/*
           <div className="mt-4 border-t border-indigo-200 pt-6">
                <h2 className="text-xl font-semibold text-center mb-4 text-indigo-700">Edit Day Plan (Coming Soon)</h2>
                <p className="text-center text-gray-500 text-sm">Functionality to add/remove/reorder places for each day will be added here.</p>
           </div>
           */}

          {/* Buttons */}
          <div className="flex gap-4 mt-6 border-t border-indigo-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
            >
              {saving ? '💾 Saving...' : '✅ Save Changes'}
            </button>
            <Link
              to={`/itinerary/${itineraryId}`} // Link back to the details page
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 text-center text-sm"
            >
              ❌ Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
