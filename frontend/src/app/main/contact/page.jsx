"use client";

import React, { useState } from 'react';

const Contact = () => {
  const [contactNumber, setContactNumber] = useState('');

  const handleContactChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setContactNumber(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12 px-4">
      <div className="mt-7 max-w-lg mx-auto bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="block text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              📞 Contact Us
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Feel free to reach out by filling the form below.
            </p>
          </div>

          <div className="mt-6">
            <form>
              <div className="grid gap-y-5">

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={contactNumber}
                    onChange={handleContactChange}
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                    required
                  />
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Enter 10 digits only
                  </p>
                </div>

                {/* Queries */}
                <div>
                  <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Query
                  </label>
                  <textarea
                    id="query"
                    name="query"
                    rows="4"
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 resize-none"
                    placeholder="Write your query here..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  📤 Submit
                </button>

              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;