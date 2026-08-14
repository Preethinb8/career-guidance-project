import { useState } from 'react'
import './Login.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Registration successful! You can now login.')
        setName('')
        setEmail('')
        setPassword('')
      } else {
        setMessage(data.message || 'Registration failed')
      }
    } catch (error) {
      setMessage('Cannot connect to the backend.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🎯
        </div>

        <h1>Create Account</h1>

        <p className="login-subtitle">
          Create your CareerGuide AI account
        </p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Register
          </button>
        </form>

        {message && (
          <p className="register-text">
            {message}
          </p>
        )}

        <p className="register-text">
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>
    </div>
  )
}

export default Register