import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full bg-white py-20 sm:py-32 lg:py-40 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-primary mb-6 sm:mb-8 leading-tight tracking-tight">
            Document<br />Verification
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-light-gray mb-8 sm:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Verify technical documentation for violations with AI precision.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/upload"
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity text-base sm:text-lg"
            >
              Get Started
            </Link>
            <button className="px-8 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors text-base sm:text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Feature 1: Document Parsing — 2-col with feature bullets */}
      <section className="w-full bg-bg-light py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-light-gray mb-4">Parsing</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-5 leading-tight">
                Intelligent<br />Document Parsing
              </h2>
              <p className="text-base sm:text-lg text-light-gray mb-8 font-light leading-relaxed">
                Automatically extract and analyze document content with advanced AI technology.
              </p>
              <ul className="space-y-3 mb-8">
                {['Supports PDF and Word formats', 'Extracts images, tables, and text', 'Handles documents up to 50MB'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-primary">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/upload" className="inline-block px-7 py-2.5 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm">
                Try it free →
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black border-opacity-5 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-light-gray">Parsing Preview</span>
                  <span className="text-xs text-light-gray">manual_v2.pdf</span>
                </div>
                {/* Simulated document body */}
                <div className="bg-bg-light rounded-2xl p-4 mb-5">
                  <div className="space-y-2">
                    <div className="h-2 bg-primary rounded-full w-full opacity-20" />
                    <div className="h-2 bg-primary rounded-full w-4/5 opacity-20" />
                    <div className="h-2 bg-primary rounded-full w-full opacity-20" />
                    {/* Highlighted image block */}
                    <div className="h-14 bg-primary bg-opacity-5 border border-primary border-opacity-15 rounded-xl my-3 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-primary opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-primary opacity-50 font-medium">Figure 2.1</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full w-3/4 opacity-20" />
                    <div className="h-2 bg-primary rounded-full w-full opacity-20" />
                    {/* Highlighted table block */}
                    <div className="mt-3 border border-primary border-opacity-15 rounded-lg overflow-hidden">
                      <div className="h-2 bg-primary bg-opacity-10" />
                      <div className="grid grid-cols-3 gap-px bg-primary bg-opacity-10 p-px">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-white h-3" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Extraction stats */}
                <div className="space-y-3">
                  {[
                    { label: 'Text Blocks', count: '124' },
                    { label: 'Images', count: '8' },
                    { label: 'Tables', count: '3' },
                  ].map(({ label, count }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">{label}</span>
                      <span className="text-sm text-light-gray">{count} extracted</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-black border-opacity-5">
                  <p className="text-xs text-light-gray">Processing complete · 2.4 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Violation Detection — Full-width dark inverted */}
      <section className="w-full bg-primary py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white opacity-50 mb-4">Detection</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Catch every violation.<br />Before it matters.
          </h2>
          <p className="text-base sm:text-lg text-white opacity-70 mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Identify graphics issues, grammar errors, and editorial violations in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { label: 'Low Resolution Image', type: 'Graphics' },
              { label: 'Subject-Verb Agreement', type: 'Grammar' },
              { label: 'Inconsistent Terminology', type: 'Editorial' },
              { label: 'Missing Alt Text', type: 'Accessibility' },
              { label: 'Style Guide Violation', type: 'Editorial' },
            ].map((v) => (
              <span key={v.label} className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full text-white text-xs font-medium backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                {v.label}
                <span className="opacity-50">·</span>
                <span className="opacity-60">{v.type}</span>
              </span>
            ))}
          </div>
          <Link to="/upload" className="inline-block px-7 py-2.5 bg-white text-primary rounded-full font-medium hover:opacity-90 transition-opacity text-sm">
            See it in action →
          </Link>
        </div>
      </section>

      {/* Feature 3: Reports — 2-col with mock score card */}
      <section className="w-full bg-bg-light py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            {/* Mock Score Card */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black border-opacity-5 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-light-gray">Analysis Report</span>
                  <span className="text-xs text-light-gray">technical_manual.pdf</span>
                </div>
                <div className="text-5xl font-bold text-primary mb-1">85%</div>
                <p className="text-sm text-light-gray mb-6">Overall score</p>
                <div className="space-y-4">
                  {[
                    { label: 'Graphics', score: 75 },
                    { label: 'Grammar', score: 92 },
                    { label: 'Editorial', score: 88 },
                  ].map(({ label, score }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-primary">{label}</span>
                        <span className="text-light-gray">{score}%</span>
                      </div>
                      <div className="h-1 bg-bg-light rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-black border-opacity-5">
                  <p className="text-xs text-light-gray">3 issues found · 2 high severity</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-light-gray mb-4">Reporting</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-5 leading-tight">
                Detailed<br />Results Report
              </h2>
              <p className="text-base sm:text-lg text-light-gray mb-8 font-light leading-relaxed">
                Get a comprehensive breakdown with scores per category, severity levels, and clear fix recommendations.
              </p>
              <Link to="/upload" className="inline-block px-7 py-2.5 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm">
                View sample report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-white py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-light-gray text-center mb-4">Process</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-16 text-center leading-tight">
            Three steps.<br />Zero hassle.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
            <div>
              <div className="text-4xl font-bold text-primary mb-5 opacity-20">01</div>
              <h3 className="text-xl font-semibold text-primary mb-3">Upload</h3>
              <p className="text-base text-light-gray leading-relaxed">
                Select and upload your document in PDF or Word format.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-5 opacity-20">02</div>
              <h3 className="text-xl font-semibold text-primary mb-3">Analyze</h3>
              <p className="text-base text-light-gray leading-relaxed">
                Our AI engine runs comprehensive checks in seconds.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-5 opacity-20">03</div>
              <h3 className="text-xl font-semibold text-primary mb-3">Review</h3>
              <p className="text-base text-light-gray leading-relaxed">
                Get detailed results with clear, actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary text-white py-20 sm:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            Ready to verify?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-70 max-w-xl mx-auto font-light">
            Start improving your documentation today.
          </p>
          <Link
            to="/upload"
            className="inline-block px-8 py-3 bg-white text-primary rounded-full font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  )
}
