import { useEffect, useState } from 'react'
import './Assessment.css'
import API_URL from '../api'

function Recommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [message, setMessage] = useState('Loading recommendations...')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token')

        if (!user?.id || !token) {
          setError('Login session not found. Please login again.')
          setMessage('')
          return
        }

        const response = await fetch(
          `${API_URL}/api/recommendations/${user.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(
            data.message || 'Failed to load recommendations.'
          )
          setMessage('')
          return
        }

        setRecommendations(data.recommendations || [])
        setMessage('')
      } catch (error) {
        console.error('Recommendation error:', error)

        setError('Cannot connect to the backend.')
        setMessage('')
      }
    }

    loadRecommendations()
  }, [])

  const getRankIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'

    return `#${index + 1}`
  }

  const handleRetake = () => {
    window.location.href = '/assessment'
  }

  const handleDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="recommendations-page">

      <div className="recommendations-header">

        <div className="recommendation-main-icon">
          🎯
        </div>

        <h1>
          Career Recommendations
        </h1>

        <p>
          Based on your career assessment, these career
          paths may be a good match for you.
        </p>

      </div>

      {message && (
        <div className="recommendation-message">
          {message}
        </div>
      )}

      {error && (
        <div className="recommendation-error">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations-container">

          {recommendations.map((item, index) => (

            <div
              className={`recommendation-card ${
                index === 0 ? 'top-recommendation' : ''
              }`}
              key={item.career}
            >

              <div className="recommendation-rank">
                {getRankIcon(index)}
              </div>

              <div className="recommendation-content">

                <h2>
                  {item.career}
                </h2>

                <div className="score-box">

                  <span>
                    Matching Score
                  </span>

                  <strong>
                    {item.score}
                  </strong>

                </div>

                {index === 0 && (
                  <div className="best-match">
                    ⭐ Strongest Career Match
                  </div>
                )}

                {index === 0 && (
                  <p className="recommendation-description">
                    This career has the highest match score
                    based on your interests, personality,
                    and assessment results.
                  </p>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

      <div className="recommendation-actions">

        <button
          className="recommendation-secondary-btn"
          onClick={handleRetake}
        >
          🔄 Retake Assessment
        </button>

        <button
          className="recommendation-primary-btn"
          onClick={handleDashboard}
        >
          📊 Go to Dashboard →
        </button>

      </div>

    </div>
  )
}

export default Recommendations