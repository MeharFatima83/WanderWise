import React from 'react';
import { Link } from 'react-router-dom';
// Consider adding social media icons, e.g., from react-icons
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-4 mt-20 border-t border-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Column 1: Brand and Description */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="text-2xl font-bold text-white tracking-wide inline-block">
              Wander<span className="text-blue-400">Wise</span>
            </Link>
            <p className="text-sm">
              Your trusted travel companion for seamless itinerary planning and unforgettable journeys.
            </p>
            {/* Social Media Placeholder */}
            {/*
            <div className="flex space-x-4 pt-2 text-xl">
              <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition duration-300"><FaFacebook /></a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition duration-300"><FaTwitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-blue-400 transition duration-300"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition duration-300"><FaLinkedin /></a>
            </div>
            */}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-blue-400 transition duration-300 w-fit">Home</Link>
              <Link to="/about" className="hover:text-blue-400 transition duration-300 w-fit">About Us</Link>
              <Link to="/itinerary" className="hover:text-blue-400 transition duration-300 w-fit">Create Itinerary</Link>
              <Link to="/contact" className="hover:text-blue-400 transition duration-300 w-fit">Contact</Link>
            </nav>
          </div>

          {/* Column 3: Resources (Example) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Resources</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/faq" className="hover:text-blue-400 transition duration-300 w-fit">FAQ</Link>
              <Link to="/blog" className="hover:text-blue-400 transition duration-300 w-fit">Blog</Link>
              <Link to="/support" className="hover:text-blue-400 transition duration-300 w-fit">Support</Link>
            </nav>
          </div>

          {/* Column 4: Legal (Example) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Legal</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/privacy-policy" className="hover:text-blue-400 transition duration-300 w-fit">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-blue-400 transition duration-300 w-fit">Terms of Service</Link>
            </nav>
          </div>

        </div>

        {/* Bottom section: Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-xs">
          <p>&copy; {currentYear} WanderWise. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
