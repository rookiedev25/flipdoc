import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useConversion } from "../context/ConversionContext";
import { convertDocument } from "../utils/docConverter";

export default function ProcessingPage() {
  const navigate = useNavigate();
  const { file, progress, updateProgress, setResult, setError, status } =
    useConversion();
  const conversionStarted = useRef(false);

  useEffect(() => {
    // Redirect if no file selected
    if (!file) {
      navigate("/upload");
      return;
    }

    // Don't re-run if already completed
    if (status === "completed") {
      navigate("/results");
      return;
    }

    // Prevent duplicate conversion runs
    if (conversionStarted.current || status === "processing") {
      return;
    }

    conversionStarted.current = true;

    const runConversion = async () => {
      try {
        const result = await convertDocument(
          file,
          (step, percentage, message) => {
            updateProgress(step, percentage, message);
          },
        );

        setResult(result);

        // Small delay for UX before navigating
        setTimeout(() => {
          navigate("/results");
        }, 500);
      } catch (error) {
        console.error("Conversion error:", error);
        setError(error.message);
      }
    };

    runConversion();
  }, [file, navigate, updateProgress, setResult, setError, status]);

  const steps = [
    { id: "extracting", label: "Extracting content", icon: "📄" },
    { id: "converting", label: "Converting to Markdown", icon: "🔄" },
    { id: "cleaning", label: "Cleaning formatting", icon: "✨" },
    { id: "metadata", label: "Generating metadata", icon: "📋" },
    { id: "splitting", label: "Splitting sections", icon: "📑" },
    { id: "complete", label: "Complete", icon: "✅" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === progress.step);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12">
      <div className="max-w-md w-full px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-semibold text-primary mb-3 sm:mb-4">
            Converting
          </h1>
          <p className="text-base sm:text-lg text-light-gray">
            {file?.name || "Your document"} is being processed
          </p>
        </div>

        {/* Animation Icon */}
        <div className="flex justify-center mb-12">
          <div className="relative w-32 h-32">
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "3s" }}
            >
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
              <span className="text-4xl">
                {steps[currentStepIndex]?.icon || "📄"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-1 bg-medium-gray rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <div className="mt-6 text-center">
            <span className="text-3xl font-semibold text-primary">
              {Math.round(Math.min(progress.percentage, 100))}%
            </span>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-8">
          <p className="text-base text-light-gray animate-pulse">
            {progress.message || "Initializing..."}
          </p>
        </div>

        {/* Step Progress */}
        <div className="bg-bg-light rounded-2xl p-4 mb-8">
          <div className="space-y-2">
            {steps.slice(0, -1).map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
                    isActive ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <span
                    className={`text-lg ${isComplete ? "opacity-100" : "opacity-40"}`}
                  >
                    {isComplete ? "✅" : step.icon}
                  </span>
                  <span
                    className={`text-sm ${
                      isActive
                        ? "text-primary font-medium"
                        : isComplete
                          ? "text-primary"
                          : "text-light-gray"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* File Info */}
        <div className="text-center pt-6 border-t border-medium-gray border-opacity-30">
          <p className="text-xs uppercase tracking-widest text-light-gray mb-2">
            Processing
          </p>
          <p className="font-medium text-sm text-primary truncate">
            {file?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
