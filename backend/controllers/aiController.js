const openai = require("../services/aiService");

// ==========================================
// AI CAREER GUIDANCE
// ==========================================

const getCareerRecommendation = async (req, res) => {
  try {
    const { career } = req.body;

    if (!career || !career.trim()) {
      return res.status(400).json({
        message: "Career interest is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `You are an AI career guidance assistant.

The student's career interest is: ${career}

Provide personalized career guidance for this career interest.

Include:

Career Guidance:
Explain the career and what the student can expect.

Personalized Career Insights:
Explain important strengths and abilities useful for this career.

Career Growth Suggestions:
Suggest skills the student should develop.

Future Scope:
Explain future opportunities and growth potential.`,
    });

    res.json({
      response: response.output_text,
      insights:
        "The guidance is based on the student's selected career interest.",
    });
  } catch (error) {
    console.error("AI Error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message:
          "AI service is currently unavailable because the API has no credits remaining.",
      });
    }

    res.status(500).json({
      message: "Failed to generate career guidance",
    });
  }
};


// ==========================================
// LEARNING PATH
// ==========================================

const getLearningPath = async (req, res) => {
  try {
    const { career } = req.body;

    if (!career || !career.trim()) {
      return res.status(400).json({
        message: "Career goal is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `You are an AI learning path advisor.

The student's career goal is: ${career}

Create a personalized learning roadmap for this career.

Include:

Learning Path:
Explain the complete learning journey.

Beginner Level:
List the basic skills and topics the student should learn.

Intermediate Level:
List the intermediate skills and topics.

Advanced Level:
List advanced skills and topics.

Recommended Courses:
Suggest useful types of courses or learning resources.

Certifications:
Suggest relevant certifications.

Projects:
Suggest practical projects the student can build.

Career Preparation:
Suggest how the student can prepare for this career.`,
    });

    res.json({
      roadmap: response.output_text,
    });
  } catch (error) {
    console.error("Learning Path AI Error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message:
          "AI service is currently unavailable because the API has no credits remaining.",
      });
    }

    res.status(500).json({
      message: "Failed to generate learning path",
    });
  }
};


// ==========================================
// SKILL GAP ANALYSIS
// ==========================================

const getSkillGapAnalysis = async (req, res) => {
  try {
    const { currentSkills, requiredSkills, career } = req.body;

    if (!career || !career.trim()) {
      return res.status(400).json({
        message: "Career is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `You are an AI skill gap analysis assistant.

Career goal: ${career}

Current skills:
${currentSkills || "Not provided"}

Required skills:
${requiredSkills || "Not provided"}

Analyze the student's skill gap.

Include:

Current Skills:
Summarize the student's existing skills.

Missing Skills:
Identify the important skills the student is missing.

Skill Gap Analysis:
Explain the difference between current skills and required skills.

Improvement Recommendations:
Suggest what the student should learn to close the skill gap.

Priority Skills:
List the most important skills to learn first.`,
    });

    res.json({
      analysis: response.output_text,
    });
  } catch (error) {
    console.error("Skill Gap AI Error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message:
          "AI service is currently unavailable because the API has no credits remaining.",
      });
    }

    res.status(500).json({
      message: "Failed to generate skill gap analysis",
    });
  }
};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
  getCareerRecommendation,
  getLearningPath,
  getSkillGapAnalysis,
};