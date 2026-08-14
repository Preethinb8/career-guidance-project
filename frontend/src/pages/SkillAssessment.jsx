import { useState } from 'react'

const skillQuestions = [
  {
    category: 'Technical Skills',
    question: 'How comfortable are you with programming?',
    options: [
      { text: 'Beginner', score: 1 },
      { text: 'Intermediate', score: 2 },
      { text: 'Advanced', score: 3 },
      { text: 'Expert', score: 4 }
    ]
  },
  {
    category: 'Technical Skills',
    question: 'How comfortable are you with databases and SQL?',
    options: [
      { text: 'Beginner', score: 1 },
      { text: 'Intermediate', score: 2 },
      { text: 'Advanced', score: 3 },
      { text: 'Expert', score: 4 }
    ]
  },
  {
    category: 'Aptitude',
    question: 'How confident are you in logical problem solving?',
    options: [
      { text: 'Needs improvement', score: 1 },
      { text: 'Average', score: 2 },
      { text: 'Good', score: 3 },
      { text: 'Excellent', score: 4 }
    ]
  },
  {
    category: 'Aptitude',
    question: 'How comfortable are you with analyzing information?',
    options: [
      { text: 'Needs improvement', score: 1 },
      { text: 'Average', score: 2 },
      { text: 'Good', score: 3 },
      { text: 'Excellent', score: 4 }
    ]
  },
  {
    category: 'Communication',
    question: 'How confident are you when communicating with others?',
    options: [
      { text: 'Needs improvement', score: 1 },
      { text: 'Average', score: 2 },
      { text: 'Good', score: 3 },
      { text: 'Excellent', score: 4 }
    ]
  },
  {
    category: 'Communication',
    question: 'How comfortable are you presenting your ideas?',
    options: [
      { text: 'Needs improvement', score: 1 },
      { text: 'Average', score: 2 },
      { text: 'Good', score: 3 },
      { text: 'Excellent', score: 4 }
    ]
  }
]

function SkillAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [completed, setCompleted] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnswer = async (option) => {
    console.log(
      'ANSWER CLICKED:',
      currentQuestion + 1,
      option
    )

    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestion] = option.score

    setAnswers(updatedAnswers)

    // Move to next question
    if (currentQuestion < skillQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      return
    }

    const user = JSON.parse(
      localStorage.getItem('user')
    )

    const token = localStorage.getItem('token')

    console.log('USER DATA:', user)

    if (!user?.id || !token) {
      setMessage(
        'Login session not found. Please login again.'
      )
      return
    }

    // Calculate scores
    const technicalScore = updatedAnswers
      .slice(0, 2)
      .reduce(
        (total, score) => total + score,
        0
      )

    const aptitudeScore = updatedAnswers
      .slice(2, 4)
      .reduce(
        (total, score) => total + score,
        0
      )

    const communicationScore = updatedAnswers
      .slice(4, 6)
      .reduce(
        (total, score) => total + score,
        0
      )

    const totalScore =
      technicalScore +
      aptitudeScore +
      communicationScore

    console.log('SENDING SKILL DATA:', {
      userId: user.id,
      technicalScore,
      aptitudeScore,
      communicationScore,
      totalScore
    })

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/skills',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.id,
            technicalScore,
            aptitudeScore,
            communicationScore,
            totalScore
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage(
          'Skill assessment saved successfully! ✅'
        )

        setCompleted(true)

        return
      }

      setMessage(
        data.message ||
          'Failed to save skill assessment.'
      )
    } catch (error) {
      console.error(
        'Skill assessment error:',
        error
      )

      setMessage(
        'Cannot connect to the backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  const restartAssessment = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setCompleted(false)
    setMessage('')
  }

  // Completed screen
  if (completed) {
    const technicalScore = answers
      .slice(0, 2)
      .reduce(
        (total, score) => total + score,
        0
      )

    const aptitudeScore = answers
      .slice(2, 4)
      .reduce(
        (total, score) => total + score,
        0
      )

    const communicationScore = answers
      .slice(4, 6)
      .reduce(
        (total, score) => total + score,
        0
      )

    const totalScore =
      technicalScore +
      aptitudeScore +
      communicationScore

    return (
      <div className="skill-assessment-page">

        <h1>
          Skill Assessment Completed 🎉
        </h1>

        <p>
          Your technical, aptitude, and
          communication skills have been
          evaluated.
        </p>

        <p>{message}</p>

        <h2>Your Skill Scores</h2>

        <p>
          <strong>
            Technical Skills:
          </strong>{' '}
          {technicalScore} / 8
        </p>

        <p>
          <strong>
            Aptitude:
          </strong>{' '}
          {aptitudeScore} / 8
        </p>

        <p>
          <strong>
            Communication:
          </strong>{' '}
          {communicationScore} / 8
        </p>

        <p>
          <strong>
            Total Score:
          </strong>{' '}
          {totalScore} / 24
        </p>

        <button
          onClick={restartAssessment}
        >
          Retake Skill Assessment
        </button>

        {/* NEXT PHASE 1 STEP */}
        <button
          onClick={() => {
            window.location.href =
              '/recommendations'
          }}
        >
          View Career Recommendations
        </button>

      </div>
    )
  }

  const question =
    skillQuestions[currentQuestion]

  return (
    <div className="skill-assessment-page">

      <h1>
        Skill Assessment
      </h1>

      <p>
        Question {currentQuestion + 1} of{' '}
        {skillQuestions.length}
      </p>

      <h3>
        {question.category}
      </h3>

      <h2>
        {question.question}
      </h2>

      <div className="skill-options">

        {question.options.map(
          (option, index) => (
            <button
              key={index}
              onClick={() =>
                handleAnswer(option)
              }
              disabled={loading}
            >
              {loading &&
              currentQuestion ===
                skillQuestions.length - 1
                ? 'Saving...'
                : option.text}
            </button>
          )
        )}

      </div>

      {message && (
        <p>
          {message}
        </p>
      )}

    </div>
  )
}

export default SkillAssessment