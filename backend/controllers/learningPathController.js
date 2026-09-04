const aiService = require('../services/aiService')

const generateLearningPath = async (req, res) => {
  try {
    const { career, missingSkills } = req.body

    if (!career || !career.trim()) {
      return res.status(400).json({
        message: 'Career goal is required'
      })
    }

    if (!missingSkills || !Array.isArray(missingSkills)) {
      return res.status(400).json({
        message: 'missingSkills must be an array'
      })
    }

    const response = await aiService.responses.create({
      model: 'gemini-2.5-flash',
      input: `You are an AI learning path advisor.

Career goal:
${career}

Missing skills:
${missingSkills.join(', ')}

Create a personalized learning roadmap.

Include:

1. Learning Path
Explain the complete learning journey.

2. Beginner Level
List the basic skills and topics to learn.

3. Intermediate Level
List intermediate skills and topics.

4. Advanced Level
List advanced skills and topics.

5. Course Recommendations
Suggest useful types of courses or learning resources.

6. Certification Suggestions
Suggest relevant certifications.

7. Practical Projects
Suggest projects that will help develop the required skills.

8. Career Preparation
Explain how the student can prepare for this career.

Keep the roadmap clear and student-friendly.`
    })

    res.status(200).json({
      message: 'AI learning path generated successfully',
      learningPath: response.output_text
    })
  } catch (error) {
    console.error('Learning Path AI Error:', error)

    if (error.status === 429) {
      return res.status(429).json({
        message:
          'AI service is currently unavailable because the API quota has been exceeded.'
      })
    }

    res.status(500).json({
      message: 'Failed to generate learning path'
    })
  }
}

module.exports = {
  generateLearningPath
}