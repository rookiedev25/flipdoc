import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [selectedBots, setSelectedBots] = useState({
    graphics: true,
    grammar: false,
    editorial: false,
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const bots = [
    {
      id: 'graphics',
      name: 'Graphics Verification',
      description: 'Check for graphics issues and violations',
      emoji: '🖼️',
    },
    {
      id: 'grammar',
      name: 'Grammar Check',
      description: 'Identify grammar and language issues',
      emoji: '✍️',
    },
    {
      id: 'editorial',
      name: 'Editorial Review',
      description: 'Check for editorial and style issues',
      emoji: '📋',
    },
  ]

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit')
        return
      }
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please upload a PDF or Word document')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleBotToggle = (botId) => {
    setSelectedBots((prev) => ({
      ...prev,
      [botId]: !prev[botId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a file')
      return
    }
    if (!Object.values(selectedBots).some((v) => v)) {
      alert('Please select at least one bot')
      return
    }

    setLoading(true)

    try {
      // TODO: Connect to backend API
      // For now, simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate job creation
      const jobId = 'job_' + Date.now()
      navigate(`/processing/${jobId}`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading file. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-white flex flex-col overflow-y-auto sm:overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full flex flex-col h-full py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 shrink-0">
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-1">Upload</h1>
          <p className="text-sm sm:text-base text-light-gray">Select your document to verify</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6 sm:gap-8 flex-1 min-h-0">
          {/* Left: File Upload */}
          <div className="flex-1 flex flex-col min-h-[200px] sm:min-h-0">
            <div className="flex-1 bg-bg-light rounded-3xl border-2 border-dashed border-medium-gray border-opacity-20 hover:border-opacity-40 transition-all flex items-center justify-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center space-y-4 p-8 text-center"
              >
                <div className="text-5xl">📁</div>
                <div>
                  <p className="text-lg sm:text-xl font-semibold text-primary">
                    {file ? file.name : 'Choose a file'}
                  </p>
                  <p className="text-sm sm:text-base text-light-gray mt-1">
                    or drag and drop
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-light-gray">
                  PDF or Word documents up to 50MB
                </p>
              </label>
            </div>
          </div>

          {/* Right: Bot Selection + Submit */}
          <div className="sm:w-80 flex flex-col gap-4 shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-primary shrink-0">Select Verification</h2>
            <div className="flex flex-col gap-3">
              {bots.map((bot) => (
                <label
                  key={bot.id}
                  className="flex items-center p-4 rounded-2xl bg-bg-light hover:bg-medium-gray hover:bg-opacity-10 cursor-pointer transition-colors border border-medium-gray border-opacity-10"
                >
                  <input
                    type="checkbox"
                    checked={selectedBots[bot.id]}
                    onChange={() => handleBotToggle(bot.id)}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{bot.emoji}</span>
                    <div>
                      <p className="font-semibold text-primary text-sm">{bot.name}</p>
                      <p className="text-xs text-light-gray">{bot.description}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      selectedBots[bot.id]
                        ? 'bg-primary border-primary text-white text-xs'
                        : 'border-medium-gray border-opacity-40'
                    }`}
                  >
                    {selectedBots[bot.id] && '✓'}
                  </div>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 shrink-0 pt-2 pb-4 sm:pb-0">
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark-gray disabled:bg-medium-gray disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {loading ? 'Processing...' : 'Verify Document'}
              </button>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="w-full px-6 py-3 border border-medium-gray border-opacity-30 text-primary rounded-full font-semibold hover:border-opacity-100 transition-colors text-sm sm:text-base"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
