import { useEffect, useState } from 'react'

function Admin() {
  const [users, setUsers] = useState([])
  const [assessments, setAssessments] = useState([])
  const [careerPaths, setCareerPaths] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token')

        const headers = {
          Authorization: `Bearer ${token}`
        }

        // Users
        const userResponse = await fetch(
          'http://localhost:5000/api/admin/users',
          { headers }
        )

        const userData = await userResponse.json()

        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch users')
        }

        setUsers(userData.users || [])

        // Assessments
        const assessmentResponse = await fetch(
          'http://localhost:5000/api/admin/assessments',
          { headers }
        )

        const assessmentData = await assessmentResponse.json()

        if (!assessmentResponse.ok) {
          throw new Error(
            assessmentData.message || 'Failed to fetch assessments'
          )
        }

        setAssessments(assessmentData.assessments || [])

        // Career Paths
        const careerResponse = await fetch(
          'http://localhost:5000/api/admin/career-paths',
          { headers }
        )

        const careerData = await careerResponse.json()

        if (!careerResponse.ok) {
          throw new Error(
            careerData.message || 'Failed to fetch career paths'
          )
        }

        setCareerPaths(careerData.careerPaths || [])

        // Analytics and Reports
        const analyticsResponse = await fetch(
          'http://localhost:5000/api/admin/analytics',
          { headers }
        )

        const analyticsData = await analyticsResponse.json()

        if (!analyticsResponse.ok) {
          throw new Error(
            analyticsData.message || 'Failed to fetch analytics'
          )
        }

        setAnalytics(analyticsData.analytics || null)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      {loading && <p>Loading admin data...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {/* Manage Users */}
          <h2>Manage Users</h2>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div>
              {users.map((user) => (
                <div key={user._id}>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {/* Manage Assessments */}
          <h2>Manage Assessments</h2>

          {assessments.length === 0 ? (
            <p>No assessments found.</p>
          ) : (
            <div>
              {assessments.map((assessment) => (
                <div key={assessment._id}>
                  <p>Assessment ID: {assessment._id}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {/* Manage Career Paths */}
          <h2>Manage Career Paths</h2>

          {careerPaths.length === 0 ? (
            <p>No career paths found.</p>
          ) : (
            <div>
              {careerPaths.map((career, index) => (
                <div key={index}>
                  <p>{career}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {/* View Analytics and Reports */}
          <h2>View Analytics and Reports</h2>

          {analytics ? (
            <div>
              <p>Total Users: {analytics.totalUsers}</p>

              <p>Total Assessments: {analytics.totalAssessments}</p>

              <p>
                Assessment Completion Rate:{' '}
                {analytics.assessmentCompletionRate}%
              </p>

              <h3>Most Recommended Careers</h3>

              {analytics.mostRecommendedCareers &&
              analytics.mostRecommendedCareers.length > 0 ? (
                <div>
                  {analytics.mostRecommendedCareers.map((career, index) => (
                    <div key={index}>
                      <p>
                        {career._id || career.career}: {career.count}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No career recommendation data found.</p>
              )}

              <h3>Student Progress Reports</h3>

              {analytics.studentProgressReports &&
              analytics.studentProgressReports.length > 0 ? (
                <div>
                  {analytics.studentProgressReports.map((student, index) => (
                    <div key={index}>
                      <p>
                        Student:{' '}
                        {student.name ||
                          student.userName ||
                          student.email ||
                          'Unknown'}
                      </p>

                      {student.email && <p>Email: {student.email}</p>}

                      {student.progress !== undefined && (
                        <p>Progress: {student.progress}%</p>
                      )}

                      <hr />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No student progress reports found.</p>
              )}
            </div>
          ) : (
            <p>No analytics data found.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Admin