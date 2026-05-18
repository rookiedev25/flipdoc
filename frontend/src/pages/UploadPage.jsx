import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversion } from "../context/ConversionContext";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const { file, options, setFile, setOptions, status } = useConversion();
  const navigate = useNavigate();

  const conversionOptions = [
    {
      id: "cleanMarkdown",
      name: "Clean Markdown",
      description: "Remove artifacts and fix formatting",
      emoji: "✨",
    },
    {
      id: "splitByHeadings",
      name: "Split by Headings",
      description: "Create separate files for each section",
      emoji: "📑",
    },
    {
      id: "generateYaml",
      name: "Generate Metadata",
      description: "Create mkdocs.yml with navigation",
      emoji: "📋",
    },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit");
      return;
    }

    // Only accept DOCX files (mammoth.js limitation)
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isDocx =
      validTypes.includes(selectedFile.type) ||
      selectedFile.name.endsWith(".docx");

    if (!isDocx) {
      alert("Please upload a Word document (.docx)");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleOptionToggle = (optionId) => {
    setOptions({ [optionId]: !options[optionId] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }
    navigate("/processing");
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-white flex flex-col overflow-y-auto sm:overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full flex flex-col h-full py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 shrink-0">
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary mb-1">
            Convert
          </h1>
          <p className="text-sm sm:text-base text-light-gray">
            Upload your Word document to convert to Markdown
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-6 sm:gap-8 flex-1 min-h-0"
        >
          {/* Left: File Upload */}
          <div className="flex-1 flex flex-col min-h-[200px] sm:min-h-0">
            <div
              className={`flex-1 bg-bg-light rounded-3xl border-2 border-dashed transition-all flex items-center justify-center ${
                dragActive
                  ? "border-primary border-opacity-60 bg-primary bg-opacity-5"
                  : "border-medium-gray border-opacity-20 hover:border-opacity-40"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                accept=".docx"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center space-y-4 p-8 text-center w-full h-full justify-center"
              >
                {file ? (
                  <>
                    <div className="text-5xl">📄</div>
                    <div>
                      <p className="text-lg sm:text-xl font-semibold text-primary">
                        {file.name}
                      </p>
                      <p className="text-sm text-light-gray mt-1">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-primary underline">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">📁</div>
                    <div>
                      <p className="text-lg sm:text-xl font-semibold text-primary">
                        Choose a file
                      </p>
                      <p className="text-sm sm:text-base text-light-gray mt-1">
                        or drag and drop
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-light-gray">
                      Word documents (.docx) up to 50MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Right: Conversion Options + Submit */}
          <div className="sm:w-80 flex flex-col gap-4 shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-primary shrink-0">
              Conversion Options
            </h2>
            <div className="flex flex-col gap-3">
              {conversionOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-4 rounded-2xl bg-bg-light hover:bg-medium-gray hover:bg-opacity-10 cursor-pointer transition-colors border border-medium-gray border-opacity-10"
                >
                  <input
                    type="checkbox"
                    checked={options[option.id]}
                    onChange={() => handleOptionToggle(option.id)}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <p className="font-semibold text-primary text-sm">
                        {option.name}
                      </p>
                      <p className="text-xs text-light-gray">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      options[option.id]
                        ? "bg-primary border-primary text-white text-xs"
                        : "border-medium-gray border-opacity-40"
                    }`}
                  >
                    {options[option.id] && "✓"}
                  </div>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 shrink-0 pt-2 pb-4 sm:pb-0">
              <button
                type="submit"
                disabled={status === "processing" || !file}
                className="w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark-gray disabled:bg-medium-gray disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {status === "processing" ? "Processing..." : "Convert Document"}
              </button>
              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={!file}
                className="w-full px-6 py-3 border border-medium-gray border-opacity-30 text-primary rounded-full font-semibold hover:border-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
