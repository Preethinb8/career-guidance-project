const openai = require("../services/aiService");

const chatWithCareerAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `You are a career guidance assistant.

Student question: ${question}

Provide a helpful and clear answer related to:

1. Career guidance
2. Career-related queries
3. Learning guidance
4. Resume improvement suggestions
5. Interview preparation tips

For resume questions, suggest improvements in skills, structure, projects, and descriptions.

For interview questions, provide preparation guidance, common topics to practice, and tips for answering confidently.`,
    });

    res.status(200).json({
      question,
      response: response.output_text,
    });
  } catch (error) {
    console.error(error);

    if (error.status === 429) {
      return res.status(429).json({
        message:
          "AI service is currently unavailable because the API has no credits remaining.",
      });
    }

    res.status(500).json({
      message: "Failed to generate career guidance response",
    });
  }
};

module.exports = {
  chatWithCareerAI,
};