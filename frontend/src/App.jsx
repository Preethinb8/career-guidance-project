import './App.css'
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Assessment from './pages/Assessment'
import Profile from './pages/Profile'
import Recommendations from './pages/Recommendations'
import Dashboard from './pages/Dashboard'
import SkillAssessment from './pages/SkillAssessment'
import AICareerGuidance from './pages/AICareerGuidance'
import LearningPath from './pages/LearningPath'
import SkillGapAnalysis from './pages/SkillGapAnalysis'
import Chatbot from './pages/Chatbot'
import ProgressTracking from './pages/ProgressTracking'
import Analytics from './pages/Analytics'
import Admin from './pages/Admin'
import ProtectedRoute from './ProtectedRoute'

function Home() {
  const [selectedCareer, setSelectedCareer] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <h2>CareerGuide AI</h2>

        <nav>
          <Link to="/">Home</Link>

          <a href="#careers">Careers</a>

          <a href="#about">About</a>

          {/* ADMIN LINK */}
          <Link to="/admin">Admin</Link>

          {/* ANALYTICS LINK */}
          <Link to="/analytics">Analytics</Link>

          {localStorage.getItem('user') ? (
            <button onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </nav>
      </header>

      <main>

        {/* HERO SECTION */}
        <section className="hero" id="home">

          <div className="hero-content">

            <p className="tagline">
              AI-POWERED CAREER GUIDANCE
            </p>

            <h1>
              Discover the
              <span> Career </span>
              That's Right for You
            </h1>

            <p className="description">
              Explore your strengths, assess your skills, and get
              personalized career recommendations powered by AI.
            </p>

            <div className="buttons">

              <Link
                to="/assessment"
                className="primary-btn"
              >
                Start Career Assessment
              </Link>

              <a
                href="#careers"
                className="secondary-btn"
              >
                Explore Careers
              </a>

            </div>

          </div>

          <div className="hero-card">

            <div className="card-icon">
              🎯
            </div>

            <h2>
              Your Career Journey Starts Here
            </h2>

            <p>
              Take a simple assessment and discover career paths
              that match your interests and skills.
            </p>

          </div>

        </section>

        {/* FEATURES */}
        <section className="features" id="careers">

          <h2>
            How CareerGuide AI Helps You
          </h2>

          <div className="feature-container">

            {/* CAREER QUIZ */}
            <Link
              to="/assessment"
              className="feature-card"
            >
              <div>📝</div>

              <h3>
                Career Quiz
              </h3>

              <p>
                Answer questions about your interests and preferences.
              </p>
            </Link>

            {/* SKILL ASSESSMENT */}
            <Link
              to="/skill-assessment"
              className="feature-card"
            >
              <div>💡</div>

              <h3>
                Skill Assessment
              </h3>

              <p>
                Understand your strengths and identify areas to improve.
              </p>
            </Link>

            {/* CAREER RECOMMENDATIONS */}
            <Link
              to="/recommendations"
              className="feature-card"
            >
              <div>🤖</div>

              <h3>
                Career Recommendations
              </h3>

              <p>
                Get personalized career suggestions based on your profile.
              </p>
            </Link>

            {/* AI CAREER GUIDANCE */}
            <Link
              to="/ai-career-guidance"
              className="feature-card"
            >
              <div>🧠</div>

              <h3>
                AI Career Guidance
              </h3>

              <p>
                Get personalized AI-powered career guidance and insights.
              </p>
            </Link>

            {/* LEARNING PATH */}
            <Link
              to="/learning-path"
              className="feature-card"
            >
              <div>📚</div>

              <h3>
                Learning Path
              </h3>

              <p>
                Get a personalized learning roadmap for your career goal.
              </p>
            </Link>

            {/* SKILL GAP ANALYSIS */}
            <Link
              to="/skill-gap-analysis"
              className="feature-card"
            >
              <div>📊</div>

              <h3>
                Skill Gap Analysis
              </h3>

              <p>
                Compare your current skills with the skills required
                for your career goal.
              </p>
            </Link>

            {/* PROGRESS TRACKING */}
            <Link
              to="/progress"
              className="feature-card"
            >
              <div>📈</div>

              <h3>
                Progress Tracking
              </h3>

              <p>
                Track your learning milestones, completed courses,
                skill progress, and achievements.
              </p>
            </Link>

            {/* AI CAREER CHATBOT */}
            <Link
              to="/chatbot"
              className="feature-card"
            >
              <div>💬</div>

              <h3>
                AI Career Chatbot
              </h3>

              <p>
                Ask career questions and get guidance for learning,
                resumes, and interviews.
              </p>
            </Link>

          </div>

        </section>

        {/* ABOUT */}
        <section
          className="about-section"
          id="about"
        >

          <h2>
            About CareerGuide AI
          </h2>

          <p>
            CareerGuide AI helps students explore their interests,
            understand their strengths, and discover suitable career paths.
          </p>

        </section>

        {/* CAREER PATHS */}
        <section className="career-paths">

          <h2>
            Explore Career Paths
          </h2>

          <div className="career-path-container">

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('Software Developer')
              }
            >
              <div>👨‍💻</div>

              <h3>
                Software Developer
              </h3>

              <p>
                Build websites, applications, and software solutions.
              </p>
            </div>

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('Data Analyst')
              }
            >
              <div>📊</div>

              <h3>
                Data Analyst
              </h3>

              <p>
                Analyze data and generate useful business insights.
              </p>
            </div>

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('UI/UX Designer')
              }
            >
              <div>🎨</div>

              <h3>
                UI/UX Designer
              </h3>

              <p>
                Design useful and enjoyable digital experiences.
              </p>
            </div>

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('Digital Marketer')
              }
            >
              <div>📱</div>

              <h3>
                Digital Marketer
              </h3>

              <p>
                Promote products and services using digital platforms.
              </p>
            </div>

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('Business Analyst')
              }
            >
              <div>📈</div>

              <h3>
                Business Analyst
              </h3>

              <p>
                Analyze business problems and improve organizational processes.
              </p>
            </div>

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('Cybersecurity Analyst')
              }
            >
              <div>🔐</div>

              <h3>
                Cybersecurity Analyst
              </h3>

              <p>
                Protect systems, networks, and data from security threats.
              </p>
            </div>

            <div
              className="career-path-card"
              onClick={() =>
                setSelectedCareer('AI/ML Engineer')
              }
            >
              <div>🤖</div>

              <h3>
                AI/ML Engineer
              </h3>

              <p>
                Build intelligent systems using artificial intelligence
                and machine learning.
              </p>
            </div>

          </div>

        </section>

        {/* CAREER POPUP */}
        {selectedCareer && (

          <div className="career-popup">

            <div className="career-popup-card">

              <button
                className="close-btn"
                onClick={() => setSelectedCareer('')}
              >
                ×
              </button>

              <h2>
                {selectedCareer}
              </h2>

              {selectedCareer === 'Software Developer' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Programming, problem-solving, logical thinking,
                    teamwork, and debugging.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    HTML, CSS, JavaScript, Python, databases,
                    Git, and software development.
                  </p>
                </>
              )}

              {selectedCareer === 'Data Analyst' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Mathematics, statistics, analytical thinking,
                    problem-solving, and data visualization.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    Excel, SQL, Python, statistics, data visualization,
                    Power BI, and data analysis.
                  </p>
                </>
              )}

              {selectedCareer === 'UI/UX Designer' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Creativity, visual design, user research,
                    communication, and problem-solving.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    Design principles, wireframing, prototyping,
                    user research, Figma, and user experience design.
                  </p>
                </>
              )}

              {selectedCareer === 'Digital Marketer' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Communication, creativity, analytical thinking,
                    content creation, and marketing skills.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    Digital marketing, SEO, social media marketing,
                    content marketing, Google Analytics, and advertising.
                  </p>
                </>
              )}

              {selectedCareer === 'Business Analyst' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Analytical thinking, communication, problem-solving,
                    business knowledge, and decision-making.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    Business analysis, Excel, SQL, data analysis,
                    requirements gathering, process modeling,
                    and documentation.
                  </p>
                </>
              )}

              {selectedCareer === 'Cybersecurity Analyst' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Problem-solving, networking knowledge,
                    analytical thinking, attention to detail,
                    and security awareness.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    Computer networks, Linux, cybersecurity fundamentals,
                    ethical security practices, threat analysis,
                    and security tools.
                  </p>
                </>
              )}

              {selectedCareer === 'AI/ML Engineer' && (
                <>
                  <h3>🛠️ Important Skills</h3>

                  <p>
                    Mathematics, statistics, programming,
                    analytical thinking, problem-solving,
                    and machine learning concepts.
                  </p>

                  <h3>📚 What to Learn</h3>

                  <p>
                    Python, mathematics, statistics, machine learning,
                    data analysis, deep learning basics, and AI concepts.
                  </p>
                </>
              )}

              <button
                className="primary-btn"
                onClick={() => setSelectedCareer('')}
              >
                Close
              </button>

            </div>

          </div>

        )}

        {/* FOOTER */}
        <footer className="footer">

          <p>
            © 2026 CareerGuide AI. All rights reserved.
          </p>

        </footer>

      </main>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* PHASE 1 */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skill-assessment"
          element={
            <ProtectedRoute>
              <SkillAssessment />
            </ProtectedRoute>
          }
        />

        {/* PHASE 2 */}
        <Route
          path="/ai-career-guidance"
          element={
            <ProtectedRoute>
              <AICareerGuidance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning-path"
          element={
            <ProtectedRoute>
              <LearningPath />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skill-gap-analysis"
          element={
            <ProtectedRoute>
              <SkillGapAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressTracking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App