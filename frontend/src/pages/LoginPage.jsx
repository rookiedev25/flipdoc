import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Connect to backend API to send OTP
      // For now, just move to OTP step
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStep('otp')
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Connect to backend API to verify OTP
      // For now, just navigate to dashboard
      await new Promise((resolve) => setTimeout(resolve, 500))
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-4xl font-semibold text-primary">FlipDoc</h1>
          <p className="text-lg text-light-gray mt-3">
            Sign in to verify documents
          </p>
        </div>

        {step === "email" ? (
          // Email Form
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-bg-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
            </div>

            {error && (
              <div className="p-4 bg-bg-light rounded-2xl text-sm text-primary border border-medium-gray border-opacity-20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-4 bg-primary text-white rounded-full font-semibold hover:bg-dark-gray disabled:bg-medium-gray transition-colors text-lg"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>

            <div className="text-center text-base text-light-gray">
              We'll send a code to your email
            </div>
          </form>
        ) : (
          // OTP Form
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">
                Enter Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength="6"
                required
                className="w-full px-4 py-4 text-center text-3xl letter-spacing bg-bg-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>

            {error && (
              <div className="p-4 bg-bg-light rounded-2xl text-sm text-primary border border-medium-gray border-opacity-20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-4 bg-primary text-white rounded-full font-semibold hover:bg-dark-gray disabled:bg-medium-gray transition-colors text-lg"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="w-full text-base text-primary hover:underline font-medium"
            >
              Use different email
            </button>

            <div className="text-center text-sm text-light-gray mt-4">
              Code sent to <strong>{email}</strong>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="my-10 border-t border-medium-gray border-opacity-10"></div>

        {/* Info */}
        <div className="text-center">
          <p className="text-base text-light-gray mb-6">
            New to FlipDoc? An account will be created automatically.
          </p>
          <Link
            to="/"
            className="text-base text-primary hover:underline font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
