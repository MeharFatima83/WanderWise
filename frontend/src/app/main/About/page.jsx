import React from "react";

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Intro Section */}
      <section className="about-hero">
        <h1>About WanderWise</h1>
        <p>
          WanderWise is your trusted travel companion — designed to simplify trip planning, 
          explore dream destinations, and make every journey unforgettable.
        </p>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Travel"
          />
        </div>
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Founded by passionate travelers, WanderWise started with a single idea — 
            to bring all travel tools together in one easy-to-use platform. We wanted 
            to eliminate the chaos of planning and make traveling a joyful experience 
            from start to finish.
          </p>
          <p>
            Today, WanderWise helps users across the world plan smarter trips with 
            real-time itineraries, destination recommendations, and budget insights.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          To empower travelers with the freedom to explore — without limits, stress, or confusion.  
          We believe in making every journey meaningful, memorable, and effortless.
        </p>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png" alt="Team Member" />
            <h3>Meher Fatima</h3>
            <p>Founder & Lead Developer</p>
          </div>
          <div className="team-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922656.png" alt="Team Member" />
            <h3>Sarah Khan</h3>
            <p>Creative Designer</p>
          </div>
          <div className="team-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="Team Member" />
            <h3>Ali Raza</h3>
            <p>Marketing Strategist</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
