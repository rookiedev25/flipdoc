import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";

const DOC_TYPES = [".docx", ".pdf", ".ppt", ".txt", ".html"];

export default function HomePage() {
  const [displayText, setDisplayText] = useState("Word");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = DOC_TYPES[wordIndex];
    let delay;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        delay = setTimeout(
          () => setDisplayText(currentWord.slice(0, displayText.length + 1)),
          100,
        );
      } else {
        delay = setTimeout(() => setIsDeleting(true), 1400);
      }
    } else {
      if (displayText.length > 0) {
        delay = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 55);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % DOC_TYPES.length);
      }
    }

    return () => clearTimeout(delay);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Gradient Background - Monochromatic */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-light via-white to-gray-100" />

        {/* Floating Document Icons - Professional SVGs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* DOC Icon */}
          <div
            className="absolute top-20 left-[10%] opacity-10 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-800"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          {/* PDF Icon */}
          <div
            className="absolute top-32 right-[15%] opacity-10 animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-800"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <path d="M9 15v-2h1.5a1.5 1.5 0 0 1 0 3H9z" />
            </svg>
          </div>
          {/* Code/MD Icon */}
          <div
            className="absolute bottom-24 left-[20%] opacity-10 animate-bounce"
            style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-800"
            >
              <polyline points="16,18 22,12 16,6" />
              <polyline points="8,6 2,12 8,18" />
            </svg>
          </div>
          {/* Markdown Icon */}
          <div
            className="absolute bottom-32 right-[10%] opacity-10 animate-bounce"
            style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-800"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 15V9l2.5 3L12 9v6" />
              <path d="M17 13l-2-2v4" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                Document Conversion Tool
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight">
                <span className="block">
                  <span className="inline-block">
                    {displayText}
                    <span
                      className="cursor-blink"
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "0.85em",
                        backgroundColor: "#0066cc",
                        marginLeft: "4px",
                        verticalAlign: "-0.1em",
                        borderRadius: "2px",
                      }}
                    />
                  </span>
                </span>
                <span className="block">to Markdown.</span>
                <span className="block text-light-gray">Simplified.</span>
              </h1>
              <p className="text-lg text-light-gray mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Upload your document. Download clean Markdown, extracted images,
                and ready-to-use metadata — all in your browser.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
                <Link
                  to="/upload"
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform duration-150 text-base cursor-pointer"
                >
                  Start Converting
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-3.5 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform duration-150 text-base cursor-pointer"
                >
                  See How It Works
                </button>
              </div>
            </div>

            {/* Right: Visual Demo */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Conversion Flow Visual */}
                <div className="flex items-center justify-center gap-6">
                  {/* Source Documents - Stacked */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
                    <div className="w-32 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden">
                      <svg
                        className="w-10 h-10 mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
                      </svg>
                      <div className="flex flex-wrap justify-center gap-1 text-[10px] font-medium">
                        <span className="bg-white/20 px-1.5 py-0.5 rounded">
                          .docx
                        </span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded">
                          .pdf
                        </span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded">
                          .html
                        </span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded">
                          .txt
                        </span>
                      </div>
                    </div>
                    <p className="text-center text-xs text-light-gray mt-3">
                      Any Format
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-8 h-8 text-primary animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <span className="text-xs text-light-gray mt-1">
                      Convert
                    </span>
                  </div>

                  {/* Output */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
                    <div className="w-32 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex flex-col items-center justify-center text-white font-mono text-xs p-3">
                      <div className="text-green-400 mb-1"># Heading</div>
                      <div className="text-gray-400 text-[10px]">
                        Lorem ipsum...
                      </div>
                      <div className="text-blue-400 mt-2 text-[10px]">
                        ![image]()
                      </div>
                    </div>
                    <p className="text-center text-xs text-light-gray mt-3">
                      Markdown
                    </p>
                  </div>
                </div>

                {/* Output files indicator */}
                <div className="mt-6 flex justify-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    📄 .md
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    📋 .yml
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    🖼️ images
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Document Conversion — 2-col with feature bullets */}
      <section className="w-full bg-bg-light py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-light-gray mb-4">
                Conversion
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-5 leading-tight">
                Any Format,
                <br />
                One Output
              </h2>
              <p className="text-base sm:text-lg text-light-gray mb-8 font-light leading-relaxed">
                Upload Word docs, PDFs, PowerPoint slides, plain text, or HTML —
                FlipDoc converts them all into clean, publication-ready Markdown
                instantly.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Supports .docx, .pdf, .ppt, .txt, .html",
                  "Extracts all images automatically",
                  "Cleans formatting artifacts",
                  "Handles documents up to 50MB",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-primary"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/upload"
                className="inline-block px-7 py-2.5 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Try it now →
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black border-opacity-5 max-w-sm mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-light-gray mb-6">
                  Supported Inputs
                </p>
                {/* Input format tiles */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    {
                      ext: ".docx",
                      label: "Word",
                      color: "bg-blue-50 border-blue-100 text-blue-700",
                    },
                    {
                      ext: ".pdf",
                      label: "PDF",
                      color: "bg-red-50 border-red-100 text-red-700",
                    },
                    {
                      ext: ".ppt",
                      label: "PowerPoint",
                      color: "bg-orange-50 border-orange-100 text-orange-700",
                    },
                    {
                      ext: ".txt",
                      label: "Plain Text",
                      color: "bg-green-50 border-green-100 text-green-700",
                    },
                    {
                      ext: ".html",
                      label: "HTML",
                      color: "bg-purple-50 border-purple-100 text-purple-700",
                    },
                  ].map(({ ext, label, color }) => (
                    <div
                      key={ext}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border ${color}`}
                    >
                      <span className="text-base font-bold">{ext}</span>
                      <span className="text-xs font-medium opacity-70">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Arrow + output */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 border-t border-dashed border-black border-opacity-15" />
                  <div className="flex items-center gap-1.5 text-xs text-light-gray font-medium">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                    converts to
                  </div>
                  <div className="flex-1 border-t border-dashed border-black border-opacity-15" />
                </div>
                {/* Output tile */}
                <div className="flex items-center gap-3 px-4 py-3.5 bg-primary rounded-xl mb-5">
                  <span className="text-sm font-bold text-white">.md</span>
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">
                      Clean Markdown
                    </p>
                    <p className="text-white text-opacity-60 text-xs opacity-60">
                      Sections · Images · Metadata
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="pt-4 border-t border-black border-opacity-5">
                  <p className="text-xs text-light-gray">
                    All formats · Same clean output
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Output Files — Full-width dark inverted */}
      <section className="w-full bg-primary py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white opacity-50 mb-4">
            Output
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Everything you need.
            <br />
            In one ZIP.
          </h2>
          <p className="text-base sm:text-lg text-white opacity-70 mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Download clean Markdown, split sections, extracted images, and
            metadata — all ready for your documentation platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { label: "Clean Markdown", type: ".md" },
              { label: "Split Sections", type: "docs/" },
              { label: "Extracted Images", type: "media/" },
              { label: "MkDocs Config", type: ".yml" },
              { label: "Ready for Publishing", type: "ZIP" },
            ].map((v) => (
              <span
                key={v.label}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full text-white text-xs font-medium backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                {v.label}
                <span className="opacity-50">·</span>
                <span className="opacity-60">{v.type}</span>
              </span>
            ))}
          </div>
          <Link
            to="/upload"
            className="inline-block px-7 py-2.5 bg-white text-primary rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Start converting →
          </Link>
        </div>
      </section>

      {/* Feature 3: Preview — 2-col with mock preview */}
      <section className="w-full bg-bg-light py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            {/* Mock Preview Card */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black border-opacity-5 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-light-gray">
                    Output Preview
                  </span>
                  <span className="text-xs text-light-gray">
                    presentation.pptx
                  </span>
                </div>
                <div className="font-mono text-xs bg-bg-light rounded-xl p-4 mb-4 space-y-1">
                  <p className="text-primary">📁 converted_output.zip</p>
                  <p className="text-light-gray pl-4">├── 📄 document.md</p>
                  <p className="text-light-gray pl-4">├── 📄 mkdocs.yml</p>
                  <p className="text-light-gray pl-4">├── 📁 docs/</p>
                  <p className="text-light-gray pl-8">│ └── 12 section files</p>
                  <p className="text-light-gray pl-4">└── 📁 media/</p>
                  <p className="text-light-gray pl-8"> └── 8 images</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Sections", count: "12" },
                    { label: "Images", count: "8" },
                    { label: "Headings", count: "24" },
                  ].map(({ label, count }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-primary">
                          {label}
                        </span>
                        <span className="text-light-gray">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-black border-opacity-5">
                  <p className="text-xs text-light-gray">✓ Ready to download</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-light-gray mb-4">
                Preview
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-5 leading-tight">
                Preview
                <br />
                Before Download
              </h2>
              <p className="text-base sm:text-lg text-light-gray mb-8 font-light leading-relaxed">
                See your converted Markdown, browse sections, view extracted
                images, and copy content — all before downloading.
              </p>
              <Link
                to="/upload"
                className="inline-block px-7 py-2.5 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Try it yourself →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="w-full bg-white py-16 sm:py-24 lg:py-32"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-light-gray text-center mb-4">
            Process
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-16 text-center leading-tight">
            Three steps.
            <br />
            Zero hassle.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
            <div>
              <div className="text-4xl font-bold text-primary mb-5 opacity-20">
                01
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Upload
              </h3>
              <p className="text-sm text-light-gray leading-relaxed">
                Drop any supported file — .docx, .pdf, .ppt, .txt, or .html —
                and select your conversion options.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-5 opacity-20">
                02
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Convert
              </h3>
              <p className="text-sm text-light-gray leading-relaxed">
                We extract content, clean formatting, split sections, and
                generate metadata.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-5 opacity-20">
                03
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Download
              </h3>
              <p className="text-sm text-light-gray leading-relaxed">
                Preview your results and download everything as a ready-to-use
                ZIP package.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-bg-light py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-5">
            Ready to convert?
          </h2>
          <p className="text-lg text-light-gray mb-8 max-w-xl mx-auto">
            Transform any document into clean Markdown in seconds. No sign-up
            required.
          </p>
          <Link
            to="/upload"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
