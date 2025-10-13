import { useState } from "react";
import "./App.css";

function App() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!destination || !budget || !duration) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    setItinerary("");

    try {
      const response = await fetch("http://localhost:5000/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination, budget, duration }),
      });

      const data = await response.json();
      setItinerary(data.itinerary || "No itinerary returned.");
    } catch (error) {
      console.error(error);
      setItinerary("Error fetching itinerary.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>WanderWise</h1>
      <p>AI-Powered Travel Itinerary Planner</p>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
        />
        <input
          type="number"
          placeholder="Budget (in USD)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <button
        onClick={handleGenerate}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "Generating..." : "Generate Itinerary"}
      </button>

      {itinerary && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>Itinerary</h2>
          {}
          <p style={{ color: "black", whiteSpace: "pre-line" }}>{itinerary}</p>
        </div>
      )}
    </div>
  );
}

export default App;

