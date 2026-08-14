import { useState } from 'react'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setResetToken('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage(
          data.message ||
            'Password reset token generated successfully.'
        )

        setResetToken(data.resetToken || '')
      } else {
        setMessage(
          data.message || 'Unable to reset password.'
        )
      }
    } catch (error) {
      console.error(
        'Forgot password error:',
        error
      )

      setMessage(
        'Cannot connect to the backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">

      <div className="forgot-password-card">

        <h1>Forgot Password? 🔐</h1>

        <p>
          Enter your registered email address to
          reset your password.
        </p>

        <form onSubmit={handleForgotPassword}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Generating Token...'
              : 'Reset Password'}
          </button>

        </form>

        {message && (
          <p className="forgot-message">
            {message}
          </p>
        )}

        {resetToken && (
          <div className="reset-token-box">

            <h3>Development Reset Token</h3>

            <p>
              Copy this token and use it on the
              Reset Password page.
            </p>

            <textarea
              value={resetToken}
              readOnly
              rows="5"
            />

            <a
              href={`/reset-password?token=${encodeURIComponent(
                resetToken
              )}`}
            >
              Continue to Reset Password →
            </a>

          </div>
        )}

        <p>
          <a href="/login">
            ← Back to Login
          </a>
        </p>

      </div>

    </div>
  )
}

export default ForgotPassword