const API_BASE_URL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// User API functions
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
        throw new Error(data.message || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Logging in user:', credentials);
      const response = await fetch(`${API_BASE_URL}/users/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Test backend connection
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
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

// Places API functions
export const placesAPI = {
  getAllPlaces: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/places?${queryParams}`);
    return response.json();
  },

  getPlaceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/places/${id}`);
    return response.json();
  },

  createPlace: async (placeData) => {
    const response = await fetch(`${API_BASE_URL}/places`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(placeData)
    });
    return response.json();
  }
};

// Itinerary API functions
export const itineraryAPI = {
  getUserItineraries: async () => {
    const response = await fetch(`${API_BASE_URL}/itineraries`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getItineraryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  createItinerary: async (itineraryData) => {
    const response = await fetch(`${API_BASE_URL}/itineraries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itineraryData)
    });
    return response.json();
  },

  updateItinerary: async (id, itineraryData) => {
    const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(itineraryData)
    });
    return response.json();
  },

  deleteItinerary: async (id) => {
    const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Legacy function for backward compatibility
export const fetchSamples = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/places`);
    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error fetching samples:', error);
    return [];
  }
};