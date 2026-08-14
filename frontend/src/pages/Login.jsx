import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        if (!data.token) {
          setMessage(
            'Login successful, but server did not return a token.'
          )
          return
        }

        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )

        localStorage.setItem(
          'token',
          data.token
        )

        setMessage('Login successful!')

        // Go to Profile page after login
        window.location.href = '/profile'
      } else {
        setMessage(
          data.message || 'Invalid email or password'
        )
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Cannot connect to the backend.')
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🎯
        </div>

        <h1>
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Login to continue your career journey
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="register-text">
            {message}
          </p>
        )}

        <p className="forgot-password-text">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </p>

        <p className="register-text">
          Don't have an account?{' '}

          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login