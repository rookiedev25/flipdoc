import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useConversion } from "../context/ConversionContext";
import { createDownloadZip, downloadZip } from "../utils/docConverter";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { file, result, reset, status } = useConversion();
  const [activeTab, setActiveTab] = useState("preview");
  const [downloading, setDownloading] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  // Redirect if no result
  if (status !== "completed" || !result) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-light-gray mb-4">
            No conversion results found
          </p>
          <Link
            to="/upload"
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-dark-gray transition-colors"
          >
            Upload a Document
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const blob = await createDownloadZip(result, file.name);
      const zipFilename = file.name.replace(/\.[^/.]+$/, "") + "_converted.zip";
      downloadZip(blob, zipFilename);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error creating download. Please try again.");
    }
    setDownloading(false);
  };

  const handleCopyToClipboard = async (content, sectionId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  const handleNewConversion = () => {
    reset();
    navigate("/upload");
  };

  const tabs = [
    { id: "preview", label: "Markdown Preview", emoji: "📄" },
    { id: "sections", label: "Sections", emoji: "📑" },
    { id: "metadata", label: "Metadata", emoji: "📋" },
    { id: "images", label: "Images", emoji: "🖼️" },
  ];

  return (
    <div className="min-h-screen bg-bg-light py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Conversion Complete
          </h1>
          <p className="text-sm sm:text-base text-light-gray">{file?.name}</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-5 py-2 bg-primary text-white rounded-full hover:bg-dark-gray disabled:bg-medium-gray transition-colors text-sm font-medium flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <span className="animate-spin">⏳</span> Preparing...
                </>
              ) : (
                <>📥 Download All (ZIP)</>
              )}
            </button>
            <button
              onClick={handleNewConversion}
              className="px-5 py-2 border border-primary text-primary rounded-full hover:bg-white transition-colors text-sm font-medium"
            >
              Convert Another
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary">
            <p className="text-xs uppercase tracking-wider text-light-gray mb-1">
              Sections
            </p>
            <p className="text-2xl font-bold text-primary">
              {result.stats.totalSections}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary">
            <p className="text-xs uppercase tracking-wider text-light-gray mb-1">
              Headings
            </p>
            <p className="text-2xl font-bold text-primary">
              {result.stats.totalHeadings}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary">
            <p className="text-xs uppercase tracking-wider text-light-gray mb-1">
              Images
            </p>
            <p className="text-2xl font-bold text-primary">
              {result.stats.totalImages}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-xs uppercase tracking-wider text-light-gray mb-1">
              Status
            </p>
            <p className="text-lg font-bold text-green-600">✓ Ready</p>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-medium-gray border-opacity-20">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary bg-primary bg-opacity-5"
                      : "text-light-gray hover:text-primary"
                  }`}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Preview Tab */}
            {activeTab === "preview" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-primary">
                    Converted Markdown
                  </h3>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(result.cleanedMarkdown, "preview")
                    }
                    className="px-3 py-1 text-xs border border-medium-gray rounded-full hover:bg-bg-light transition-colors"
                  >
                    {copiedSection === "preview" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="bg-bg-light rounded-xl p-4 overflow-auto max-h-[500px]">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {result.cleanedMarkdown}
                  </pre>
                </div>
              </div>
            )}

            {/* Sections Tab */}
            {activeTab === "sections" && (
              <div>
                <h3 className="font-semibold text-primary mb-4">
                  Split Sections ({result.splitDocs.length} files)
                </h3>
                <div className="space-y-3">
                  {result.splitDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="border border-medium-gray border-opacity-20 rounded-xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 bg-bg-light">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📄</span>
                          <div>
                            <p className="font-medium text-primary text-sm">
                              {doc.filename}
                            </p>
                            <p className="text-xs text-light-gray">
                              {doc.heading}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyToClipboard(
                              doc.content,
                              `section-${index}`,
                            )
                          }
                          className="px-3 py-1 text-xs border border-medium-gray rounded-full hover:bg-white transition-colors"
                        >
                          {copiedSection === `section-${index}`
                            ? "✓ Copied!"
                            : "📋 Copy"}
                        </button>
                      </div>
                      <details className="group">
                        <summary className="px-4 py-2 text-xs text-primary cursor-pointer hover:bg-primary hover:bg-opacity-5">
                          Preview content →
                        </summary>
                        <div className="px-4 py-3 bg-white border-t border-medium-gray border-opacity-10">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-40 overflow-auto">
                            {doc.content.substring(0, 500)}
                            {doc.content.length > 500 && "..."}
                          </pre>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Tab */}
            {activeTab === "metadata" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-primary">mkdocs.yml</h3>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(result.yamlContent, "yaml")
                    }
                    className="px-3 py-1 text-xs border border-medium-gray rounded-full hover:bg-bg-light transition-colors"
                  >
                    {copiedSection === "yaml" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="bg-bg-light rounded-xl p-4 overflow-auto max-h-[500px]">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {result.yamlContent}
                  </pre>
                </div>
                <p className="mt-3 text-xs text-light-gray">
                  💡 Tip: Update the placeholder values (ENTER_*,
                  &lt;PRODUCT_NAME&gt;, etc.) with your actual metadata.
                </p>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === "images" && (
              <div>
                <h3 className="font-semibold text-primary mb-4">
                  Extracted Images ({result.images.length})
                </h3>
                {result.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {result.images.map((img, index) => (
                      <div
                        key={index}
                        className="border border-medium-gray border-opacity-20 rounded-xl overflow-hidden bg-bg-light"
                      >
                        <div className="aspect-square flex items-center justify-center p-2">
                          <img
                            src={`data:${img.contentType};base64,${img.data}`}
                            alt={img.filename}
                            className="max-w-full max-h-full object-contain rounded"
                          />
                        </div>
                        <div className="px-3 py-2 bg-white border-t border-medium-gray border-opacity-10">
                          <p className="text-xs font-medium text-primary truncate">
                            {img.filename}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-bg-light rounded-xl">
                    <span className="text-4xl mb-3 block">🖼️</span>
                    <p className="text-light-gray">
                      No images found in document
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Download Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-primary mb-4 text-center">
            Download Package Contents
          </h3>
          <div className="bg-bg-light rounded-xl p-4 font-mono text-sm">
            <div className="text-light-gray mb-2">
              📁 {file?.name.replace(/\.[^/.]+$/, "")}_converted.zip
            </div>
            <div className="pl-4 space-y-1 text-gray-700">
              <div>├── 📄 {file?.name.replace(/\.[^/.]+$/, "")}.md</div>
              <div>├── 📄 mkdocs.yml</div>
              <div>├── 📁 docs/</div>
              <div className="pl-4 text-light-gray">
                │ └── {result.splitDocs.length} section files
              </div>
              {result.images.length > 0 && (
                <>
                  <div>└── 📁 media/</div>
                  <div className="pl-4 text-light-gray">
                    └── {result.images.length} images
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-8 py-3 bg-primary text-white rounded-full hover:bg-dark-gray disabled:bg-medium-gray transition-colors font-medium"
            >
              {downloading ? "Preparing Download..." : "📥 Download ZIP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
