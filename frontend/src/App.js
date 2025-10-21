import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/footer.jsx';

import HomePage from './app/main/Home/page.jsx';
import AboutPage from './app/main/About/page.jsx';
import ItineraryPage from './app/main/Itinerary/page.jsx';
import ContactPage from './app/main/contact/page.jsx'; // <-- fixed path/casing
import LoginPage from './app/main/user-login/page.jsx';
import SignupPage from './app/main/user-signup/page.jsx';

import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

