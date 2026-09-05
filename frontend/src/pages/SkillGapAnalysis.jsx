import { useState } from "react";

function SkillGapAnalysis() {
  const [career, setCareer] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const analyzeSkillGap = async () => {
    if (
      !career.trim() ||
      !currentSkills.trim() ||
      !requiredSkills.trim()
    ) {
      setError(
        "Please enter career, current skills, and required skills."
      );
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const currentSkillsArray = currentSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const requiredSkillsArray = requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const response = await fetch(
        "http://localhost:5000/api/ai/skill-gap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            career,
            currentSkills: currentSkillsArray,
            requiredSkills: requiredSkillsArray,
          }),
        }
      );

      const data = await response.json();

      console.log("Skill Gap Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Skill gap analysis failed"
        );
      }

      setResult(data.analysis || "");
    } catch (error) {
      console.error("Skill Gap Error:", error);

      setError(
        error.message || "Cannot connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-gap-analysis">

      <h1>📊 Skill Gap Analysis</h1>

      <p>
        Compare your current skills with the skills required
        for your career goal.
      </p>

      <input
        type="text"
        placeholder="Enter your career goal..."
        value={career}
        onChange={(e) => setCareer(e.target.value)}
      />

      <textarea
        placeholder="Enter your current skills (comma separated)..."
        value={currentSkills}
        onChange={(e) => setCurrentSkills(e.target.value)}
      />

      <textarea
        placeholder="Enter required skills (comma separated)..."
        value={requiredSkills}
        onChange={(e) => setRequiredSkills(e.target.value)}
      />

      <button
        onClick={analyzeSkillGap}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Skill Gap"}
      </button>

      {error && (
        <div>
          <p>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <div>
          <h2>🎯 AI Skill Gap Analysis</h2>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {result}
          </pre>
        </div>
      )}

    </div>
  );
}

export default SkillGapAnalysis;