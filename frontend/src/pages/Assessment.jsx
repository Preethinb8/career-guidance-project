import { useState } from 'react'
import API_URL from '../api'

const questions = [
  {
    question: 'Which type of activity do you enjoy most?',
    options: [
      'Programming',
      'Designing',
      'Analyzing information',
      'Managing people'
    ]
  },
  {
    question: 'Which skill do you enjoy using the most?',
    options: [
      'Logical thinking',
      'Creativity',
      'Communication',
      'Mathematics'
    ]
  },
  {
    question: 'Which type of work interests you most?',
    options: [
      'Building software',
      'Creating designs',
      'Working with data',
      'Managing projects'
    ]
  },
  {
    question: 'Which subject do you prefer?',
    options: [
      'Computer Science',
      'Art and Design',
      'Mathematics',
      'Business'
    ]
  },
  {
    question: 'What kind of problem do you enjoy solving?',
    options: [
      'Technical problems',
      'Creative problems',
      'Data-related problems',
      'Business problems'
    ]
  },
  {
    question: 'Which work environment do you prefer?',
    options: [
      'Technology company',
      'Creative studio',
      'Research or analytics team',
      'Business organization'
    ]
  },
  {
    question: 'Which activity sounds most interesting?',
    options: [
      'Writing code',
      'Designing user interfaces',
      'Finding patterns in data',
      'Planning and organizing projects'
    ]
  },
  {
    question: 'Which strength describes you best?',
    options: [
      'Problem solving',
      'Creativity',
      'Analytical thinking',
      'Leadership'
    ]
  }
]

function getPersonalityType(answers) {
  const scores = {
    Creative: 0,
    Analytical: 0,
    Logical: 0,
    Leadership: 0
  }

  answers.forEach((answer) => {
    if (
      [
        'Designing',
        'Creativity',
        'Creating designs',
        'Art and Design',
        'Creative problems',
        'Creative studio',
        'Designing user interfaces'
      ].includes(answer)
    ) {
      scores.Creative++
    }

    if (
      [
        'Analyzing information',
        'Working with data',
        'Mathematics',
        'Data-related problems',
        'Research or analytics team',
        'Finding patterns in data',
        'Analytical thinking'
      ].includes(answer)
    ) {
      scores.Analytical++
    }

    if (
      [
        'Programming',
        'Logical thinking',
        'Building software',
        'Computer Science',
        'Technical problems',
        'Technology company',
        'Writing code',
        'Problem solving'
      ].includes(answer)
    ) {
      scores.Logical++
    }

    if (
      [
        'Managing people',
        'Communication',
        'Managing projects',
        'Business',
        'Business problems',
        'Business organization',
        'Planning and organizing projects',
        'Leadership'
      ].includes(answer)
    ) {
      scores.Leadership++
    }
  })

  const personalityType = Object.keys(scores).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  )

  return personalityType
}

function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [personalityType, setPersonalityType] = useState('')
  const [aiRecommendation, setAiRecommendation] = useState('')

  const handleAnswer = async (answer) => {
    const updatedAnswers = [...answers]

    updatedAnswers[currentQuestion] = answer

    setAnswers(updatedAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      return
    }

    const detectedPersonality =
      getPersonalityType(updatedAnswers)

    setPersonalityType(detectedPersonality)

    setSaving(true)
    setSaveMessage('Saving your assessment...')

    const token = localStorage.getItem('token')

    if (!token) {
      console.error('Token not found')

      setSaveMessage(
        'Login session not found. Please login again.'
      )

      setSaving(false)
      setCompleted(true)

      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/assessment`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            answers: questions.map(
              (question, index) => ({
                question: question.question,
                answer: updatedAnswers[index]
              })
            ),

            personalityType: detectedPersonality
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        console.log(
          'Assessment saved successfully:',
          data
        )

        setSaveMessage(
          'Assessment saved successfully!'
        )
      } else {
        console.error(
          'Assessment save failed:',
          data
        )

        setSaveMessage(
          data.message ||
            'Failed to save assessment.'
        )
      }
    } catch (error) {
      console.error(
        'Assessment backend error:',
        error
      )

      setSaveMessage(
        'Cannot connect to the backend.'
      )
    }

    try {
      const aiResponse = await fetch(
        `${API_URL}/api/ai/career-recommendation`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            skills: updatedAnswers,
            interests: updatedAnswers,
            assessment: `Personality Type: ${detectedPersonality}`
          })
        }
      )

      const aiData = await aiResponse.json()

      if (aiResponse.ok) {
        setAiRecommendation(
          aiData.recommendation
        )
      } else {
        console.error(
          'AI recommendation failed:',
          aiData
        )
      }
    } catch (error) {
      console.error(
        'AI recommendation error:',
        error
      )
    }

    setSaving(false)
    setCompleted(true)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setCompleted(false)
    setSaving(false)
    setSaveMessage('')
    setPersonalityType('')
    setAiRecommendation('')
  }

  if (completed) {
    return (
      <div className="assessment-page">

        <h1>
          Career Assessment Completed 🎉
        </h1>

        <p>
          Great job! You have completed the
          career interest and personality
          assessment.
        </p>

        {saveMessage && (
          <p>
            <strong>
              {saveMessage}
            </strong>
          </p>
        )}

        <h2>Personality Result</h2>

        <p>
          <strong>
            Personality Type: {personalityType}
          </strong>
        </p>

        <p>
          This result is based on your assessment
          responses and represents your strongest
          career-related personality characteristic.
        </p>

        {aiRecommendation && (
          <>
            <h2>AI Career Recommendation</h2>

            <p>
              {aiRecommendation}
            </p>
          </>
        )}

        <h2>Your Answers</h2>

        {answers.map((answer, index) => (
          <div key={index}>

            <p>
              <strong>
                {index + 1}.{' '}
                {questions[index].question}
              </strong>
            </p>

            <p>
              Answer: {answer}
            </p>

          </div>
        ))}

        <button
          onClick={restartQuiz}
          disabled={saving}
        >
          Retake Assessment
        </button>

        <button
          onClick={() => {
            window.location.href =
              '/skill-assessment'
          }}
          disabled={saving}
        >
          Continue to Skill Assessment →
        </button>

      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="assessment-page">

      <h1>
        Career Assessment
      </h1>

      <p>
        Question {currentQuestion + 1} of{' '}
        {questions.length}
      </p>

      <h2>
        {question.question}
      </h2>

      <div className="assessment-options">

        {question.options.map(
          (option, index) => (
            <button
              key={index}
              onClick={() =>
                handleAnswer(option)
              }
              disabled={saving}
            >
              {option}
            </button>
          )
        )}

      </div>

      {saving && (
        <p>
          Saving your assessment...
        </p>
      )}

    </div>
  )
}

export default Assessment