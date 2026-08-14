import { useEffect, useState } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [recommendations, setRecommendations] = useState([])
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token')

        if (!user?.id || !token) {
          setError('Login session not found. Please login again.')
          setLoading(false)
          return
        }

        const authHeaders = {
          Authorization: `Bearer ${token}`
        }

        const recommendationResponse = await fetch(
          `http://localhost:5000/api/recommendations/${user.id}`,
          {
            method: 'GET',
            headers: authHeaders
          }
        )

        const profileResponse = await fetch(
          `http://localhost:5000/api/profile/${user.id}`,
          {
            method: 'GET',
            headers: authHeaders
          }
        )

        const skillResponse = await fetch(
          `http://localhost:5000/api/skills/${user.id}`,
          {
            method: 'GET',
            headers: authHeaders
          }
        )

        const assessmentResponse = await fetch(
          `http://localhost:5000/api/assessment/${user.id}`,
          {
            method: 'GET',
            headers: authHeaders
          }
        )

        if (recommendationResponse.ok) {
          const data = await recommendationResponse.json()
          setRecommendations(data.recommendations || [])
        }

        if (profileResponse.ok) {
          const data = await profileResponse.json()
          setProfile(data)
        }

        if (skillResponse.ok) {
          const data = await skillResponse.json()
          setSkills(data)
        }

        if (assessmentResponse.ok) {
          const data = await assessmentResponse.json()
          setAssessment(data)
        }

        setLoading(false)
      } catch (error) {
        console.error('Dashboard error:', error)
        setError('Cannot connect to the backend.')
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-icon">⏳</div>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we load your career information.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const user = JSON.parse(localStorage.getItem('user'))

  const topCareer =
    recommendations.length > 0
      ? recommendations[0]
      : null

  const getSkillPercentage = (score) => {
    if (!score) return 0
    return Math.min((score / 8) * 100, 100)
  }

  const getRankIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div className="dashboard-header-icon">
          🎯
        </div>

        <div>
          <h1>
            Welcome to Your Dashboard, {user?.name || 'Student'} 👋
          </h1>

          <p>
            Track your profile, assessment results, skills,
            and recommended career paths.
          </p>
        </div>
      </div>


      {/* STUDENT INFORMATION */}

      <section className="dashboard-card profile-card">

        <div className="section-title">
          <span className="section-icon">👤</span>

          <div>
            <h2>Student Information</h2>
            <p>Your personal and educational details</p>
          </div>
        </div>

        <div className="profile-grid">

          <div className="profile-item">
            <span>Name</span>
            <strong>
              {user?.name || 'Not available'}
            </strong>
          </div>

          <div className="profile-item">
            <span>Email</span>
            <strong>
              {user?.email || 'Not available'}
            </strong>
          </div>

          <div className="profile-item">
            <span>Education</span>
            <strong>
              {profile?.education || 'Not completed'}
            </strong>
          </div>

          <div className="profile-item">
            <span>Phone</span>
            <strong>
              {profile?.phone || 'Not available'}
            </strong>
          </div>

        </div>

      </section>


      {/* CAREER ASSESSMENT */}

      <section className="dashboard-card">

        <div className="section-title">
          <span className="section-icon">🎯</span>

          <div>
            <h2>Career Assessment</h2>
            <p>Your personality and career preferences</p>
          </div>
        </div>

        <div className="assessment-grid">

          <div className="assessment-box">
            <span>Status</span>
            <strong className="completed">
              {assessment ? 'Completed ✅' : 'Not completed'}
            </strong>
          </div>

          <div className="assessment-box">
            <span>Questions Completed</span>
            <strong>
              8 / 8
            </strong>
          </div>

          <div className="assessment-box">
            <span>Personality Type</span>
            <strong className="personality">
              {assessment?.personalityType || 'Analytical'}
            </strong>
          </div>

        </div>

      </section>


      {/* SKILL ASSESSMENT */}

      <section className="dashboard-card">

        <div className="section-title">
          <span className="section-icon">📊</span>

          <div>
            <h2>Skill Assessment</h2>
            <p>Overview of your current skill levels</p>
          </div>
        </div>

        {skills ? (

          <div className="skills-container">

            <div className="skill-row">

              <div className="skill-label">
                <span>Technical Skills</span>
                <strong>
                  {skills.technicalScore} / 8
                </strong>
              </div>

              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{
                    width: `${getSkillPercentage(
                      skills.technicalScore
                    )}%`
                  }}
                />
              </div>

            </div>


            <div className="skill-row">

              <div className="skill-label">
                <span>Aptitude</span>
                <strong>
                  {skills.aptitudeScore} / 8
                </strong>
              </div>

              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{
                    width: `${getSkillPercentage(
                      skills.aptitudeScore
                    )}%`
                  }}
                />
              </div>

            </div>


            <div className="skill-row">

              <div className="skill-label">
                <span>Communication</span>
                <strong>
                  {skills.communicationScore} / 8
                </strong>
              </div>

              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{
                    width: `${getSkillPercentage(
                      skills.communicationScore
                    )}%`
                  }}
                />
              </div>

            </div>


            <div className="total-score-box">

              <span>Total Skill Score</span>

              <strong>
                {skills.totalScore} / 24
              </strong>

            </div>

          </div>

        ) : (

          <div className="empty-state">
            Skill assessment not completed yet.
          </div>

        )}

      </section>


      {/* TOP CAREER */}

      {topCareer && (

        <section className="dashboard-card top-career-card">

          <div className="top-career-badge">
            ⭐ Strongest Career Match
          </div>

          <div className="top-career-content">

            <div className="top-career-icon">
              🥇
            </div>

            <div>

              <span className="top-career-label">
                Top Career Recommendation
              </span>

              <h2>
                {topCareer.career}
              </h2>

              <p>
                This career has the highest match score
                based on your assessment.
              </p>

            </div>

            <div className="top-score">

              <span>Matching Score</span>

              <strong>
                {topCareer.score}
              </strong>

            </div>

          </div>

        </section>

      )}


      {/* ALL CAREER RECOMMENDATIONS */}

      <section className="dashboard-card">

        <div className="section-title">
          <span className="section-icon">🏆</span>

          <div>
            <h2>Career Recommendations</h2>
            <p>Careers matched to your assessment results</p>
          </div>
        </div>

        {recommendations.length > 0 ? (

          <div className="career-list">

            {recommendations.map((item, index) => (

              <div
                key={item.career}
                className={`career-recommendation ${
                  index === 0 ? 'first-career' : ''
                }`}
              >

                <div className="career-rank">
                  {getRankIcon(index)}
                </div>

                <div className="career-info">

                  <h3>
                    {item.career}
                  </h3>

                  {index === 0 && (
                    <span className="best-career">
                      ⭐ Strongest Match
                    </span>
                  )}

                </div>

                <div className="career-score">

                  <span>Score</span>

                  <strong>
                    {item.score}
                  </strong>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-state">
            No recommendations available yet.
          </div>

        )}

      </section>


      {/* PROFILE DETAILS */}

      {profile && (

        <section className="dashboard-card">

          <div className="section-title">
            <span className="section-icon">📝</span>

            <div>
              <h2>Profile Details</h2>
              <p>Your career interests and skills</p>
            </div>
          </div>

          <div className="details-grid">

            <div className="detail-box">

              <span>Career Interests</span>

              <strong>
                {Array.isArray(profile.careerInterests)
                  ? profile.careerInterests.join(', ')
                  : profile.careerInterests || 'Not available'}
              </strong>

            </div>


            <div className="detail-box">

              <span>Technical Skills</span>

              <strong>
                {Array.isArray(profile.technicalSkills)
                  ? profile.technicalSkills.join(', ')
                  : profile.technicalSkills || 'Not available'}
              </strong>

            </div>


            <div className="detail-box">

              <span>Soft Skills</span>

              <strong>
                {Array.isArray(profile.softSkills)
                  ? profile.softSkills.join(', ')
                  : profile.softSkills || 'Not available'}
              </strong>

            </div>


            <div className="detail-box">

              <span>Preferred Industries</span>

              <strong>
                {Array.isArray(profile.preferredIndustries)
                  ? profile.preferredIndustries.join(', ')
                  : profile.preferredIndustries || 'Not available'}
              </strong>

            </div>

          </div>

        </section>

      )}


      {/* PROGRESS OVERVIEW */}

      <section className="dashboard-card">

        <div className="section-title">
          <span className="section-icon">📈</span>

          <div>
            <h2>Progress Overview</h2>
            <p>Your current project progress</p>
          </div>
        </div>

        <div className="progress-list">

          <div className="progress-item">
            <span>Profile</span>
            <strong className="status-complete">
              ✅ Completed
            </strong>
          </div>

          <div className="progress-item">
            <span>Career Assessment</span>
            <strong className="status-complete">
              ✅ Completed
            </strong>
          </div>

          <div className="progress-item">
            <span>Skill Assessment</span>
            <strong className={skills ? 'status-complete' : 'status-pending'}>
              {skills ? '✅ Completed' : '❌ Not completed'}
            </strong>
          </div>

          <div className="progress-item">
            <span>Career Recommendations</span>
            <strong
              className={
                recommendations.length > 0
                  ? 'status-complete'
                  : 'status-pending'
              }
            >
              {recommendations.length > 0
                ? '✅ Available'
                : '❌ Not available'}
            </strong>
          </div>

          <div className="progress-item">
            <span>Learning Roadmap</span>
            <strong className="status-phase">
              🔜 Phase 2
            </strong>
          </div>

        </div>

      </section>


      {/* ACTION BUTTONS */}

      <div className="dashboard-actions">

        <button
          className="dashboard-primary-btn"
          onClick={() => {
            window.location.href = '/recommendations'
          }}
        >
          🎯 View Full Recommendations →
        </button>

        <button
          className="dashboard-secondary-btn"
          onClick={() => {
            window.location.href = '/profile'
          }}
        >
          👤 View / Edit Profile
        </button>

        <button
          className="dashboard-logout-btn"
          onClick={() => {
            localStorage.removeItem('user')
            localStorage.removeItem('token')

            window.location.href = '/login'
          }}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  )
}

export default Dashboard