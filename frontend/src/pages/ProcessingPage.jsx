import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ProcessingPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Initializing...')

  const steps = [
    'Initializing...',
    'Extracting images from document...',
    'Running Graphics verification...',
    'Running Grammar check...',
    'Running Editorial review...',
    'Compiling results...',
    'Finalizing...',
  ]

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 20
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            navigate(`/results/${jobId}`)
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 1000)

    // Simulate status updates
    const statusInterval = setInterval(() => {
      setStatus((prev) => {
        const currentIndex = steps.indexOf(prev)
        if (currentIndex < steps.length - 1) {
          return steps[currentIndex + 1]
        }
        return prev
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(statusInterval)
    }
  }, [jobId, navigate])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12">
      <div className="max-w-md w-full px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-semibold text-primary mb-3 sm:mb-4">
            Analyzing
          </h1>
          <p className="text-base sm:text-lg text-light-gray">Your document is being processed</p>
        </div>

        {/* Animation Icon */}
        <div className="flex justify-center mb-16">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 animate-spin">
              <svg
                className="w-full h-full text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
          </div>
        </div>

        {/* Progress Bar - Minimal */}
        <div className="mb-12">
          <div className="relative h-1 bg-medium-gray rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="mt-6 text-center">
            <span className="text-3xl font-semibold text-primary">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-12">
          <p className="text-base text-light-gray animate-pulse">
            {status}
          </p>
        </div>

        {/* Job ID - Minimal */}
        <div className="text-center pt-8 border-t border-medium-gray border-opacity-30">
          <p className="text-xs uppercase tracking-widest text-light-gray mb-3">Job ID</p>
          <p className="font-mono text-sm text-primary break-all">{jobId}</p>
        </div>
      </div>
    </div>
  )
}
