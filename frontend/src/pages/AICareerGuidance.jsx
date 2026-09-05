import { useState } from "react";

function AICareerGuidance() {
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [insights, setInsights] = useState("");
  const [error, setError] = useState("");

  const getCareerGuidance = async () => {
    if (!career.trim()) {
      setError("Please enter a career or career interest.");
      return;
    }

    setLoading(true);
    setResult("");
    setInsights("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/ai/career-guidance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            career
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate career guidance"
        );
      }

      setResult(data.response || data.guidance || "");

      setInsights(
        data.insights ||
        "Personalized career insights will be provided based on your career interest, skills, and goals."
      );
    } catch (error) {
      console.error("AI Career Guidance Error:", error);
      setError(error.message || "Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-career-guidance">
      <h1>🤖 AI Career Guidance</h1>

      <p>
        Get personalized career guidance based on your career interest.
      </p>

      <input
        type="text"
        placeholder="Enter your career interest..."
        value={career}
        onChange={(e) => setCareer(e.target.value)}
      />

      <button onClick={getCareerGuidance} disabled={loading}>
        {loading ? "Generating..." : "Get AI Guidance"}
      </button>

      {error && (
        <div>
          <p>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <div>
          <h2>Career Guidance</h2>
          <p>{result}</p>
        </div>
      )}

      {insights && (
        <div>
          <h2>💡 Personalized Career Insights</h2>
          <p>{insights}</p>
        </div>
      )}
    </div>
  );
}

export default AICareerGuidance;