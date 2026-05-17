import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function DashboardPage() {
  const [filter, setFilter] = useState('all')

  // Mock data
  const jobs = [
    {
      id: 'job_1234567890',
      fileName: 'technical_manual_v2.pdf',
      uploadedAt: '2026-05-17T10:30:00Z',
      status: 'completed',
      bots: ['graphics', 'grammar', 'editorial'],
      score: 85,
    },
    {
      id: 'job_1234567891',
      fileName: 'user_guide.docx',
      uploadedAt: '2026-05-16T14:20:00Z',
      status: 'completed',
      bots: ['graphics'],
      score: 92,
    },
    {
      id: 'job_1234567892',
      fileName: 'api_documentation.pdf',
      uploadedAt: '2026-05-15T09:15:00Z',
      status: 'completed',
      bots: ['grammar', 'editorial'],
      score: 78,
    },
    {
      id: 'job_1234567893',
      fileName: 'release_notes.pdf',
      uploadedAt: '2026-05-14T16:45:00Z',
      status: 'processing',
      bots: ['graphics', 'grammar'],
      score: null,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-primary text-white'
      case 'processing':
        return 'bg-medium-gray text-white'
      case 'failed':
        return 'bg-dark-gray text-light-gray'
      default:
        return 'bg-bg-light text-light-gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'processing':
        return '⏳'
      case 'failed':
        return '❌'
      default:
        return '•'
    }
  }

  const filteredJobs =
    filter === 'all'
      ? jobs
      : jobs.filter((job) => job.status === filter)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-semibold text-primary mb-2 sm:mb-3">Dashboard</h1>
          <p className="text-base sm:text-xl text-light-gray">Your document history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="bg-bg-light rounded-2xl sm:rounded-3xl p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-light-gray uppercase tracking-widest">Total</p>
                <p className="text-3xl sm:text-4xl font-semibold text-primary mt-2 sm:mt-3">
                  {jobs.length}
                </p>
              </div>
              <span className="text-3xl sm:text-5xl">📄</span>
            </div>
          </div>
          <div className="bg-bg-light rounded-2xl sm:rounded-3xl p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-light-gray uppercase tracking-widest">Completed</p>
                <p className="text-3xl sm:text-4xl font-semibold text-primary mt-2 sm:mt-3">
                  {jobs.filter((j) => j.status === 'completed').length}
                </p>
              </div>
              <span className="text-3xl sm:text-5xl">✅</span>
            </div>
          </div>
          <div className="bg-bg-light rounded-2xl sm:rounded-3xl p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-light-gray uppercase tracking-widest">Processing</p>
                <p className="text-3xl sm:text-4xl font-semibold text-primary mt-2 sm:mt-3">
                  {jobs.filter((j) => j.status === 'processing').length}
                </p>
              </div>
              <span className="text-3xl sm:text-5xl">⏳</span>
            </div>
          </div>
          <div className="bg-bg-light rounded-2xl sm:rounded-3xl p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-light-gray uppercase tracking-widest">Avg. Score</p>
                <p className="text-3xl sm:text-4xl font-semibold text-primary mt-2 sm:mt-3">
                  {Math.round(
                    jobs
                      .filter((j) => j.score)
                      .reduce((acc, j) => acc + j.score, 0) /
                      jobs.filter((j) => j.score).length
                  )}%
                </p>
              </div>
              <span className="text-3xl sm:text-5xl">📊</span>
            </div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="mb-6 sm:mb-12 flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {['all', 'completed', 'processing'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium transition-colors capitalize text-xs sm:text-sm ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-bg-light text-primary hover:bg-medium-gray hover:bg-opacity-10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <Link
            to="/upload"
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-primary text-white rounded-full hover:bg-dark-gray transition-colors font-medium text-xs sm:text-sm"
          >
            + New
          </Link>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-medium-gray border-opacity-10 bg-bg-light">
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-light-gray uppercase tracking-widest">
                    Document
                  </th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-light-gray uppercase tracking-widest hidden sm:table-cell">
                    Uploaded
                  </th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-light-gray uppercase tracking-widest hidden md:table-cell">
                    Bots
                  </th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-light-gray uppercase tracking-widest hidden sm:table-cell">
                    Score
                  </th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-light-gray uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-light-gray uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-medium-gray border-opacity-10 hover:bg-bg-light transition-colors"
                    >
                      <td className="px-4 sm:px-8 py-4 sm:py-6">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span className="text-xl sm:text-2xl">📄</span>
                          <span className="font-semibold text-primary text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                            {job.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base text-light-gray whitespace-nowrap hidden sm:table-cell">
                        {formatDate(job.uploadedAt)}
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6 hidden md:table-cell">
                        <div className="flex gap-2 flex-wrap">
                          {job.bots.map((bot) => (
                            <span
                              key={bot}
                              className="px-2 sm:px-3 py-1 bg-bg-light text-primary text-xs rounded-full capitalize font-medium"
                            >
                              {bot === 'graphics' && '🖼️'}
                              {bot === 'grammar' && '✍️'}
                              {bot === 'editorial' && '📋'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6 hidden sm:table-cell">
                        {job.score ? (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="font-semibold text-primary text-sm sm:text-base">
                              {job.score}%
                            </span>
                            <div className="w-12 sm:w-16 bg-medium-gray bg-opacity-30 rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${job.score}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-light-gray">-</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                            job.status
                          )}`}
                        >
                          <span>{getStatusIcon(job.status)}</span>
                          <span className="capitalize">{job.status}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {job.status === 'completed' && (
                            <>
                              <Link
                                to={`/results/${job.id}`}
                                className="text-primary hover:underline text-sm font-semibold"
                              >
                                View
                              </Link>
                              <button className="text-light-gray hover:text-primary text-sm font-semibold">
                                ⬇️
                              </button>
                            </>
                          )}
                          {job.status === 'processing' && (
                            <Link
                              to={`/processing/${job.id}`}
                              className="text-primary hover:underline text-sm font-semibold"
                            >
                              Check Status
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-light-gray">No documents found</p>
                      <Link
                        to="/upload"
                        className="text-primary hover:underline mt-2 inline-block"
                      >
                        Upload your first document
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
