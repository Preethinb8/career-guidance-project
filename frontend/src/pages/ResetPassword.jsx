import { useState } from 'react'
import API_URL from '../api'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleResetPassword = async (e) => {
    e.preventDefault()

    const token = new URLSearchParams(window.location.search).get('token')

    console.log('RESET TOKEN:', token)

    if (!token) {
      setMessage('Invalid or missing reset token.')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token,
            newPassword: password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Password reset successful! You can now login.')
      } else {
        setMessage(data.message || 'Password reset failed.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setMessage('Cannot connect to the backend.')
    }
  }

  return (
    <div>
      <h1>Reset Password</h1>

      <p>Enter your new password.</p>

      <form onSubmit={handleResetPassword}>
        <label>New Password</label>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />

        <button type="submit">
          Reset Password
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        <a href="/login">Back to Login</a>
      </p>
    </div>
  )
}

export default ResetPassword