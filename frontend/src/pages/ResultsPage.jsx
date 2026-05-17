import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ResultsPage() {
  const { jobId } = useParams()
  const [activeTab, setActiveTab] = useState('graphics')

  // Mock results data
  const results = {
    graphics: {
      status: 'completed',
      violations: [
        {
          id: 1,
          severity: 'high',
          type: 'Image Resolution',
          description: 'Image on page 3 has low resolution (72 DPI)',
          page: 3,
          recommendation: 'Replace with image that has minimum 300 DPI',
        },
        {
          id: 2,
          severity: 'medium',
          type: 'Missing Alt Text',
          description: 'Figure 2.1 is missing alternative text',
          page: 5,
          recommendation: 'Add descriptive alt text for accessibility',
        },
        {
          id: 3,
          severity: 'low',
          type: 'Image Alignment',
          description: 'Image on page 8 is not properly centered',
          page: 8,
          recommendation: 'Align image to match document formatting standards',
        },
      ],
      score: 75,
    },
    grammar: {
      status: 'completed',
      violations: [
        {
          id: 1,
          severity: 'medium',
          type: 'Subject-Verb Agreement',
          description: 'Line 42: "The data are" should be "The data is"',
          page: 2,
          recommendation: 'Check subject-verb agreement',
        },
      ],
      score: 92,
    },
    editorial: {
      status: 'completed',
      violations: [
        {
          id: 1,
          severity: 'low',
          type: 'Inconsistent Terminology',
          description: 'Document uses both "user" and "end-user" inconsistently',
          page: 'Multiple',
          recommendation: 'Choose one term and use it consistently',
        },
      ],
      score: 88,
    },
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200'
      case 'medium': return 'bg-amber-50 border-amber-200'
      case 'low': return 'bg-green-50 border-green-200'
      default: return 'bg-bg-light border-gray-200'
    }
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-amber-100 text-amber-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  const currentResults = results[activeTab]

  return (
    <div className="min-h-screen bg-bg-light py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Analysis Results
          </h1>
          <p className="text-sm sm:text-base text-light-gray">Job ID: {jobId}</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link
              to="/upload"
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-dark-gray transition-colors text-sm"
            >
              Upload Another
            </Link>
            <button className="px-4 py-2 border border-primary text-primary rounded-full hover:bg-bg-light transition-colors text-sm">
              Download Report
            </button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(results).map(([key, data]) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-primary cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab(key)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-primary capitalize">
                  {key === 'graphics' && '🖼️'}
                  {key === 'grammar' && '✍️'}
                  {key === 'editorial' && '📋'} {key} Check
                </h3>
                <div className="text-3xl font-bold text-primary">
                  {data.score}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <p className="text-sm text-light-gray mt-3">
                {data.violations.length} issues found
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-medium-gray">
            <div className="flex">
              {Object.keys(results).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 px-6 py-4 font-semibold text-center transition-colors capitalize ${
                    activeTab === key
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-light-gray hover:text-primary'
                  }`}
                >
                  {key === 'graphics' && '🖼️'} {key}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {currentResults.violations.length > 0 ? (
              <div className="space-y-4">
                {currentResults.violations.map((violation) => (
                  <div
                    key={violation.id}
                    className={`border rounded-lg p-4 ${getSeverityColor(
                      violation.severity
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {violation.type}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(
                              violation.severity
                            )}`}
                          >
                            {violation.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {violation.description}
                        </p>
                      </div>
                      <div className="text-right text-sm font-semibold">
                        Page {violation.page}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-black border-opacity-10">
                      <p className="text-sm font-semibold text-gray-700">
                        Recommendation
                      </p>
                      <p className="text-sm mt-1 text-gray-600">{violation.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-light-gray">✅ No issues found!</p>
              </div>
            )}
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">
            Export Results
          </h3>
          <div className="flex gap-3 justify-center flex-wrap">
            <button className="px-4 sm:px-6 py-2 bg-primary text-white rounded-full hover:bg-dark-gray transition-colors text-sm">
              📥 PDF Report
            </button>
            <button className="px-4 sm:px-6 py-2 border border-primary text-primary rounded-full hover:bg-bg-light transition-colors text-sm">
              📊 CSV
            </button>
            <button className="px-4 sm:px-6 py-2 border border-medium-gray text-primary rounded-full hover:bg-bg-light transition-colors text-sm">
              📋 Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
