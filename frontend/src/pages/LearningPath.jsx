import { useState } from "react";

function LearningPath() {
  const [career, setCareer] = useState("");
  const [missingSkills, setMissingSkills] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLearningPath = async () => {
    if (!career.trim()) {
      setError("Please enter a career.");
      return;
    }

    setLoading(true);
    setRoadmap("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const skillsArray = missingSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const response = await fetch(
        "http://localhost:5000/api/ai/learning-path",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            career: career,
            missingSkills: skillsArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate learning path"
        );
      }

      setRoadmap(data.roadmap || "");
    } catch (error) {
      console.error("Learning Path Error:", error);
      setError(error.message || "Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learning-path">
      <h1 className="learning-path-title">
        📚 Learning Path
      </h1>

      <p>
        Get a customized learning roadmap for your career goal.
      </p>

      <input
        type="text"
        placeholder="Enter your career..."
        value={career}
        onChange={(e) => setCareer(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter missing skills (comma separated)..."
        value={missingSkills}
        onChange={(e) => setMissingSkills(e.target.value)}
      />

      <button onClick={getLearningPath} disabled={loading}>
        {loading ? "Generating..." : "Generate Learning Path"}
      </button>

      {error && <p>⚠️ {error}</p>}

      {roadmap && (
        <div>
          <h2>🗺️ Your Learning Roadmap</h2>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {roadmap}
          </pre>
        </div>
      )}
    </div>
  );
}

export default LearningPath;