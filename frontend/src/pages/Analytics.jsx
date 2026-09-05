import { useEffect, useState } from 'react'
import './Analytics.css'

function Analytics() {
  const [userGrowth, setUserGrowth] = useState(null)
  const [careers, setCareers] = useState([])
  const [completionRate, setCompletionRate] = useState(0)
  const [progressReports, setProgressReports] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchAnalytics = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const userGrowthResponse = await fetch(
          'http://localhost:5000/api/analytics/user-growth',
          { headers }
        )

        const careersResponse = await fetch(
          'http://localhost:5000/api/analytics/recommended-careers',
          { headers }
        )

        const completionResponse = await fetch(
          'http://localhost:5000/api/analytics/assessment-completion',
          { headers }
        )

        const progressResponse = await fetch(
          'http://localhost:5000/api/analytics/student-progress',
          { headers }
        )

        const userGrowthData = await userGrowthResponse.json()
        const careersData = await careersResponse.json()
        const completionData = await completionResponse.json()
        const progressData = await progressResponse.json()

        setUserGrowth(userGrowthData.statistics)
        setCareers(careersData.careers || [])
        setCompletionRate(
          completionData.assessmentCompletionRate || 0
        )
        setProgressReports(
          progressData.studentProgressReports || []
        )
      } catch (error) {
        console.error('Analytics Error:', error)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="analytics-page">

      <h1>Analytics Dashboard</h1>

      <div className="analytics-cards">

        <div className="analytics-card">
          <h3>Total Users</h3>
          <p>{userGrowth?.totalUsers || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Assessment Completion</h3>
          <p>{completionRate}%</p>
        </div>

        <div className="analytics-card">
          <h3>Career Categories</h3>
          <p>{careers.length}</p>
        </div>

        <div className="analytics-card">
          <h3>Student Progress Reports</h3>
          <p>{progressReports.length}</p>
        </div>

      </div>

      <div className="analytics-section">

        <h2>Most Recommended Careers</h2>

        {careers.length === 0 ? (
          <p>No career data available.</p>
        ) : (
          careers.map((career, index) => (
            <div className="career-item" key={index}>
              <span>{career.career}</span>
              <strong>{career.count}</strong>
            </div>
          ))
        )}

      </div>

      <div className="analytics-section">

        <h2>Student Progress Reports</h2>

        {progressReports.length === 0 ? (
          <p>No progress reports available.</p>
        ) : (
          progressReports.map((report) => (
            <div className="progress-item" key={report._id}>

              <h3>
                {report.userId?.name || 'Student'}
              </h3>

              <p>
                {report.userId?.email || 'No email'}
              </p>

              <p>
                Milestones:{' '}
                {report.milestones?.filter(
                  (item) => item.completed
                ).length || 0}
                /{report.milestones?.length || 0}
              </p>

              <p>
                Courses:{' '}
                {report.courses?.filter(
                  (item) => item.completed
                ).length || 0}
                /{report.courses?.length || 0}
              </p>

              <p>
                Skills Tracked: {report.skills?.length || 0}
              </p>

            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default Analytics