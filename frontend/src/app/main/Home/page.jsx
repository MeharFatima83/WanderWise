import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="app-container">
      <section className="hero" aria-label="Hero">
        <div className="left">
          <span className="kicker">WanderWise · AI Itinerary</span>
          <h1>Create personalized travel plans in seconds — powered by AI</h1>
          <p className="lead">
            Generate day-by-day itineraries, optimized budgets and local recommendations. Enter destination, budget and duration to get started.
          </p>

          <div className="cta">
            <Link to="/itinerary" className="primary">
              Create itinerary
            </Link>
            <Link to="/about" className="secondary">
              Learn more
            </Link>
          </div>
        </div>

        <div className="right">
          <div className="hero-card" role="img" aria-label="Example itinerary preview">
            <img
              src="/assets/hero-screenshot.png"
              alt="Itinerary preview screenshot"
            />
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <h3 style={{ margin: "0 0 .5rem" }}>Fast</h3>
          <p style={{ margin: 0, color: "#6b7280" }}>Generate full plans in seconds.</p>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <h3 style={{ margin: "0 0 .5rem" }}>Custom</h3>
          <p style={{ margin: 0, color: "#6b7280" }}>Tailor activities to your budget & duration.</p>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <h3 style={{ margin: "0 0 .5rem" }}>Download</h3>
          <p style={{ margin: 0, color: "#6b7280" }}>Export PDF or share with friends.</p>
        </div>
      </section>
    </div>
  );
}
