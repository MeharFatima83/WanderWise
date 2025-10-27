import React from 'react';

// AboutPage Component using Tailwind CSS
const AboutPage = () => {
  return (
    // Main container with background and padding
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 pt-24 pb-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* --- Hero Section --- */}
        <header className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl overflow-hidden relative">
          {/* Optional decorative background pattern */}
          <div className="absolute inset-0 opacity-10 pattern-dots pattern-white pattern-bg-transparent pattern-size-4"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">About WanderWise</h1>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto drop-shadow-sm">
              WanderWise is your trusted travel companion — designed to simplify trip planning,
              explore dream destinations, and make every journey unforgettable.
            </p>
          </div>
        </header>

        {/* --- Our Story Section --- */}
        <section className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-lg p-8 md:p-12 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image */}
            <div className="md:w-1/2 flex-shrink-0">
              <img
                // Using a different, potentially more relevant image
                src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&q=80"
                alt="Travel Planning"
                className="rounded-xl shadow-md object-cover w-full h-64 md:h-80"
              />
            </div>
            {/* Text */}
            <div className="md:w-1/2 text-gray-700 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Our Story
              </h2>
              <p className="text-base leading-relaxed">
                Founded by passionate travelers, WanderWise started with a single idea —
                to bring all travel tools together in one easy-to-use platform. We wanted
                to eliminate the chaos of planning and make traveling a joyful experience
                from start to finish.
              </p>
              <p className="text-base leading-relaxed">
                Today, WanderWise helps users across the world plan smarter trips with
                intuitive itinerary creation, destination recommendations, and practical travel insights.
              </p>
            </div>
          </div>
        </section>

        {/* --- Our Mission Section --- */}
        <section className="text-center py-12 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            To empower travelers with the freedom to explore — without limits, stress, or confusion.
            We believe in making every journey meaningful, memorable, and effortless.
          </p>
        </section>

        {/* --- Meet the Team Section --- */}
        <section className="bg-white/90 backdrop-blur-sm border border-cyan-100 rounded-2xl shadow-lg p-8 md:p-12 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Meet the Team
          </h2>
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Card 1 */}
            <div className="team-card text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png" // Female icon
                alt="Meher Fatima"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-sm bg-blue-100"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/E0E7FF/3B82F6?text=MF'; }} // Placeholder fallback
              />
              <h3 className="text-xl font-semibold text-gray-800">Meher Fatima</h3>
              <p className="text-blue-700 font-medium">Founder & Lead Developer</p>
            </div>
            {/* Team Card 2 */}
            <div className="team-card text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2922/2922656.png" // Female icon
                alt="Sarah Khan"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-sm bg-indigo-100"
                 onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/E0E7FF/4F46E5?text=SK'; }}
              />
              <h3 className="text-xl font-semibold text-gray-800">Sarah Khan</h3>
              <p className="text-indigo-700 font-medium">Creative Designer</p>
            </div>
            {/* Team Card 3 */}
            <div className="team-card text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" // Male icon
                alt="Ali Raza"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-sm bg-purple-100"
                 onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/EDE9FE/7C3AED?text=AR'; }}
              />
              <h3 className="text-xl font-semibold text-gray-800">Ali Raza</h3>
              <p className="text-purple-700 font-medium">Marketing Strategist</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AboutPage;