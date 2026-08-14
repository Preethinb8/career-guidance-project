import { useState } from 'react'

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  const [phone, setPhone] = useState('')
  const [education, setEducation] = useState('')
  const [careerInterests, setCareerInterests] = useState('')
  const [technicalSkills, setTechnicalSkills] = useState('')
  const [softSkills, setSoftSkills] = useState('')
  const [preferredIndustries, setPreferredIndustries] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user?.id || !token) {
      setMessage('Login session not found. Please login again.')
      return
    }

    // Basic Phase 1 form validation
    if (!phone.trim()) {
      setMessage('Please enter your phone number.')
      return
    }

    if (!education.trim()) {
      setMessage('Please enter your education details.')
      return
    }

    if (!careerInterests.trim()) {
      setMessage('Please enter your career interests.')
      return
    }

    if (!technicalSkills.trim()) {
      setMessage('Please enter your technical skills.')
      return
    }

    if (!softSkills.trim()) {
      setMessage('Please enter your soft skills.')
      return
    }

    if (!preferredIndustries.trim()) {
      setMessage('Please enter your preferred industries.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/profile',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            phone: phone.trim(),

            education: education.trim(),

            careerInterests: careerInterests
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),

            technicalSkills: technicalSkills
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),

            softSkills: softSkills
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),

            preferredIndustries: preferredIndustries
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Profile saved successfully! ✅')

        // Go to Career Assessment after saving profile
        setTimeout(() => {
          window.location.href = '/assessment'
        }, 1000)
      } else {
        setMessage(
          data.message || 'Failed to save profile.'
        )
      }
    } catch (error) {
      console.error('Profile error:', error)
      setMessage('Cannot connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <h1>
          Student Profile
        </h1>

        <p className="profile-description">
          Complete your profile for better career recommendations.
        </p>

        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFORMATION */}

          <h2>
            👤 Personal Information
          </h2>

          <div className="profile-field">

            <label>
              Name
            </label>

            <input
              type="text"
              value={user?.name || ''}
              readOnly
            />

          </div>

          <div className="profile-field">

            <label>
              Email
            </label>

            <input
              type="email"
              value={user?.email || ''}
              readOnly
            />

          </div>

          <div className="profile-field">

            <label>
              Phone
            </label>

            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

          </div>

          {/* EDUCATION */}

          <h2>
            🎓 Educational Details
          </h2>

          <div className="profile-field">

            <label>
              Education
            </label>

            <input
              type="text"
              placeholder="Example: B.Tech Computer Science"
              value={education}
              onChange={(e) =>
                setEducation(e.target.value)
              }
            />

          </div>

          {/* CAREER INTERESTS */}

          <h2>
            🎯 Career Interests
          </h2>

          <div className="profile-field">

            <label>
              Career Interests
            </label>

            <input
              type="text"
              placeholder="Example: Data Analyst, AI/ML Engineer"
              value={careerInterests}
              onChange={(e) =>
                setCareerInterests(e.target.value)
              }
            />

            <small>
              Enter multiple interests separated by commas.
            </small>

          </div>

          {/* TECHNICAL SKILLS */}

          <h2>
            💻 Technical Skills
          </h2>

          <div className="profile-field">

            <label>
              Technical Skills
            </label>

            <input
              type="text"
              placeholder="Example: Python, SQL, JavaScript"
              value={technicalSkills}
              onChange={(e) =>
                setTechnicalSkills(e.target.value)
              }
            />

            <small>
              Enter multiple skills separated by commas.
            </small>

          </div>

          {/* SOFT SKILLS */}

          <h2>
            🤝 Soft Skills
          </h2>

          <div className="profile-field">

            <label>
              Soft Skills
            </label>

            <input
              type="text"
              placeholder="Example: Communication, Leadership"
              value={softSkills}
              onChange={(e) =>
                setSoftSkills(e.target.value)
              }
            />

            <small>
              Enter multiple skills separated by commas.
            </small>

          </div>

          {/* PREFERRED INDUSTRIES */}

          <h2>
            🏢 Preferred Industries
          </h2>

          <div className="profile-field">

            <label>
              Preferred Industries
            </label>

            <input
              type="text"
              placeholder="Example: Technology, Finance, Healthcare"
              value={preferredIndustries}
              onChange={(e) =>
                setPreferredIndustries(e.target.value)
              }
            />

            <small>
              Enter multiple industries separated by commas.
            </small>

          </div>

          {/* SAVE */}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : 'Save Profile'}
          </button>

        </form>

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

      </div>

    </div>
  )
}

export default Profile