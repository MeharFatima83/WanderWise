const API_BASE_URL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  // --- FIX: Use the correct key 'authToken' ---
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// --- User API functions (No changes needed below, but included for completeness) ---
export const userAPI = {
  signup: async (userData) => {
    try {
      console.log('Signing up user:', userData);
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        // Throw error with message from backend
        throw new Error(data.message || 'Signup failed');
      }

      return data; // Contains token and user info
    } catch (error) {
      console.error('Signup error in API:', error);
      // Re-throw the error so the component catch block can handle it
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Logging in user:', credentials);
      const response = await fetch(`${API_BASE_URL}/users/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         // NOTE: Login doesn't usually send 'credentials: include' unless using cookies for session *instead* of tokens
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
         throw new Error(data.message || 'Login failed');
      }

       // Expecting { token, user } from backend
      return data;
    } catch (error) {
      console.error('Login error in API:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders() // Uses the corrected helper
      });

      // Handle potential non-JSON error responses (like 401 Unauthorized)
      if (!response.ok) {
          const errorText = await response.text(); // Read error as text first
          let errorMessage = `Failed to get profile: ${response.statusText}`;
          try {
              // Try parsing as JSON in case backend sends JSON error object
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorMessage;
          } catch (e) {
             // If not JSON, use the text directly if available
             if (errorText) errorMessage = errorText;
          }
          throw new Error(errorMessage);
      }

      const data = await response.json(); // Now safe to parse as JSON
      return data; // Expecting { user }

    } catch (error) {
      console.error('Get profile error in API:', error);
      // If the error came from backend (like invalid token), remove the bad token
      if (error.message.includes('Invalid') || error.message.includes('expired') || error.message.includes('required')) {
         localStorage.removeItem('authToken');
         // Optionally, trigger a logout or redirect here if using AuthContext
      }
      throw error;
    }
  },

  // Test backend connection
  testConnection: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      console.log('Backend test:', data);
      return data;
    } catch (error) {
      console.error('Backend test error:', error);
      throw error;
    }
  },

  // Test health endpoint
  testHealth: async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      console.log('Health check:', data);
      return data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};

// --- Places API functions ---
export const placesAPI = {
  getAllPlaces: async (filters = {}) => {
     try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/places?${queryParams}`);
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to fetch places');
        }
        return response.json(); // Expecting { places }
     } catch (error) {
         console.error('Get all places error in API:', error);
         throw error;
     }
  },

  getPlaceById: async (id) => {
     try {
        const response = await fetch(`${API_BASE_URL}/places/${id}`);
         if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to fetch place details');
        }
        return response.json(); // Expecting { place }
     } catch (error) {
         console.error('Get place by ID error in API:', error);
         throw error;
     }
  },

  createPlace: async (placeData) => {
     try {
        const response = await fetch(`${API_BASE_URL}/places`, {
          method: 'POST',
          headers: getAuthHeaders(), // Uses corrected helper
          body: JSON.stringify(placeData)
        });
         if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to create place');
        }
        return response.json(); // Expecting { message, place }
     } catch (error) {
         console.error('Create place error in API:', error);
         throw error;
     }
  }
};

// --- Itinerary API functions ---
export const itineraryAPI = {
  getUserItineraries: async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/itineraries`, {
          headers: getAuthHeaders() // Uses corrected helper
        });
         if (!response.ok) {
             // Handle cases like 401 Unauthorized if token is bad
             if (response.status === 401 || response.status === 403) {
                 localStorage.removeItem('authToken'); // Remove invalid token
                 // Consider redirecting to login or throwing specific error
             }
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to fetch itineraries');
        }
        return response.json(); // Expecting { itineraries }
    } catch (error) {
         console.error('Get user itineraries error in API:', error);
         throw error;
    }
  },

  getItineraryById: async (id) => {
     try {
        const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
          headers: getAuthHeaders() // Uses corrected helper
        });
         if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to fetch itinerary details');
        }
        return response.json(); // Expecting { itinerary }
     } catch (error) {
         console.error('Get itinerary by ID error in API:', error);
         throw error;
     }
  },

  createItinerary: async (itineraryData) => {
     try {
        const response = await fetch(`${API_BASE_URL}/itineraries`, {
          method: 'POST',
          headers: getAuthHeaders(), // Uses corrected helper
          body: JSON.stringify(itineraryData)
        });

         // Check response status *before* trying to parse JSON
         if (!response.ok) {
             // Try to get error message from backend response body
             let errorMessage = `Failed to create itinerary: ${response.statusText}`;
             try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
             } catch(e) {
                // If response is not JSON, use status text
             }
             throw new Error(errorMessage);
        }
        return response.json(); // Expecting { message, itinerary }
     } catch (error) {
         console.error('Create itinerary error in API:', error);
         throw error; // Re-throw so component can catch it
     }
  },

  updateItinerary: async (id, itineraryData) => {
     try {
        const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(), // Uses corrected helper
          body: JSON.stringify(itineraryData)
        });
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to update itinerary');
        }
        return response.json(); // Expecting { message, itinerary }
     } catch (error) {
         console.error('Update itinerary error in API:', error);
         throw error;
     }
  },

  deleteItinerary: async (id) => {
     try {
        const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders() // Uses corrected helper
        });
         if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Failed to delete itinerary');
        }
        return response.json(); // Expecting { message }
     } catch (error) {
         console.error('Delete itinerary error in API:', error);
         throw error;
     }
  }
};

// Legacy function (Keep if needed, otherwise can remove)
export const fetchSamples = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/places`);
    if (!response.ok) throw new Error('Failed to fetch samples');
    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error fetching samples:', error);
    return [];
  }
};