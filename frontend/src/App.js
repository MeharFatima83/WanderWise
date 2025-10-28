import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar.jsx'; // Ensure this path is correct
import Footer from './components/footer.jsx'; // Ensure this path is correct

// Import Page Components
import HomePage from './app/main/Home/page.jsx';
import AboutPage from './app/main/About/page.jsx';
import ItineraryPage from './app/main/Itinerary/page.jsx'; // Main itinerary list/create page
import ContactPage from './app/main/contact/page.jsx';
import LoginPage from './app/main/user-login/page.jsx';
import SignupPage from './app/main/user-signup/page.jsx';
import ItineraryDetailsPage from './app/main/itinerary-details/page.jsx';
import EditItineraryPage from './app/main/itinerary-edit/page.jsx';
// *** ADD IMPORT FOR DESTINATION PLACES PAGE ***
import DestinationPlacesPage from './app/main/destination-places/page.jsx'; // Ensure this path is correct

// Import Auth Context Provider
import { AuthProvider } from './context/AuthContext.jsx'; // Ensure this path is correct

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Render Navbar and Footer outside Routes so they appear on all pages */}
        <Navbar />
        <main className="main-content"> {/* Optional: Add a main tag for content */}
          <Routes>
            {/* Core Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Itinerary Related Pages */}
            <Route path="/itinerary" element={<ItineraryPage />} /> {/* List/Create Itineraries */}
            <Route path="/itinerary/:itineraryId" element={<ItineraryDetailsPage />} /> {/* View Specific Itinerary */}
            <Route path="/itinerary/edit/:itineraryId" element={<EditItineraryPage />} /> {/* Edit Specific Itinerary */}

            {/* *** ADD ROUTE FOR DESTINATION PLACES PAGE *** */}
            <Route path="/destination/:destinationName" element={<DestinationPlacesPage />} />

            {/* Catch-all route to redirect unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

