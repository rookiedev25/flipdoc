import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "flipdoc_conversions";

// Demo data shown on first visit so the design is immediately visible
const DEMO_DATA = [
  {
    id: "demo_1",
    fileName: "technical_manual_v2.docx",
    convertedAt: "2026-05-17T10:30:00Z",
    stats: { images: 8, headings: 24, tables: 3, wordCount: 4200 },
    markdownSize: "42 KB",
  },
  {
    id: "demo_2",
    fileName: "user_guide.docx",
    convertedAt: "2026-05-16T14:20:00Z",
    stats: { images: 2, headings: 12, tables: 1, wordCount: 1800 },
    markdownSize: "18 KB",
  },
  {
    id: "demo_3",
    fileName: "api_documentation.docx",
    convertedAt: "2026-05-15T09:15:00Z",
    stats: { images: 0, headings: 38, tables: 7, wordCount: 6100 },
    markdownSize: "61 KB",
  },
];

export default function DashboardPage() {
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConversions(JSON.parse(stored));
      } catch {
        setConversions(DEMO_DATA);
      }
    } else {
      setConversions(DEMO_DATA);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversions([]);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-light-gray mb-3">
              Stored locally · Browser
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-primary">
              Conversion History
            </h1>
            <p className="text-base sm:text-lg text-light-gray mt-2 font-light">
              {conversions.length} document{conversions.length !== 1 ? "s" : ""}{" "}
              converted
            </p>
          </div>
          <div className="flex items-center gap-3">
            {conversions.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-light-gray hover:text-primary transition-colors"
              >
                Clear all
              </button>
            )}
            <Link
              to="/upload"
              className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-gray transition-colors"
            >
              + Convert new
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        {conversions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {conversions.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-black border-opacity-5 hover:shadow-md transition-shadow"
              >
                {/* File info */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 bg-bg-light rounded-xl flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-primary text-sm leading-tight truncate">
                      {c.fileName}
                    </p>
                    <p className="text-xs text-light-gray mt-1">
                      {formatDate(c.convertedAt)} · {formatTime(c.convertedAt)}
                    </p>
                  </div>
                </div>

                {/* Extraction stats */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {[
                    { label: "Images", value: c.stats.images },
                    { label: "Headings", value: c.stats.headings },
                    { label: "Tables", value: c.stats.tables },
                    {
                      label: "Words",
                      value:
                        c.stats.wordCount >= 1000
                          ? `${(c.stats.wordCount / 1000).toFixed(1)}k`
                          : c.stats.wordCount,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-bg-light rounded-xl p-2.5 text-center"
                    >
                      <p className="text-base font-bold text-primary">
                        {value}
                      </p>
                      <p className="text-[10px] text-light-gray leading-tight mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-black border-opacity-5">
                  <span className="text-xs text-light-gray">
                    {c.markdownSize} Markdown
                  </span>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-70 transition-opacity">
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 border border-black border-opacity-5">
              <svg
                className="w-8 h-8 text-light-gray"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              No conversions yet
            </h2>
            <p className="text-sm text-light-gray mb-8 max-w-xs leading-relaxed">
              Your converted documents will appear here, stored locally in your
              browser.
            </p>
            <Link
              to="/upload"
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-gray transition-colors"
            >
              Convert your first document
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
