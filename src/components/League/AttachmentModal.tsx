import { useState, useEffect } from "react";
import { baseURL } from "../../axios";

// Define props for the AttachmentModal component
interface AttachmentModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  attachments: string[]; // Full URLs from API, no null values
  initialIndex?: number; // Optional, defaults to 0
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isModalOpen,
  closeModal,
  attachments,
  initialIndex = 0,
}) => {
  // State to track the currently displayed attachment index
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Handle next/previous navigation
  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % attachments.length);
  };

  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? attachments.length - 1 : prevIndex - 1
    );
  };

  // Handle Esc key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  // Handle arrow key navigation
  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent): void => {
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleArrowKeys);
    return () => window.removeEventListener("keydown", handleArrowKeys);
  }, []);

  // If modal is not open or there are no attachments, don't render
  if (!isModalOpen || attachments.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-xl sm:rounded-2xl max-w-lg sm:max-w-xl lg:max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden relative border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-700/50 bg-gray-800/50">
          <h2 className="text-white text-lg sm:text-xl font-semibold truncate pr-2">
            Proof Attachment{" "}
            {attachments.length > 1
              ? `(${currentIndex + 1}/${attachments.length})`
              : ""}
          </h2>
          <button
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200 text-gray-300 hover:text-white flex-shrink-0"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image Container */}
        <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-6 bg-gray-800/30 flex items-center justify-center min-h-[30vh] sm:min-h-[35vh] lg:min-h-[40vh] max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] overflow-hidden relative">
          <img
            src={`${baseURL}/api/v1/${attachments[currentIndex]}`}
            alt={`Proof attachment ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-md sm:rounded-lg shadow-lg ring-1 ring-gray-600/30"
          />

          {/* Navigation Buttons (only show if there are multiple attachments) */}
          {attachments.length > 1 && (
            <>
              <button
                className="absolute left-2 sm:left-3 lg:left-4 top-1/2 transform -translate-y-1/2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-white transition-colors duration-200"
                onClick={handlePrev}
                aria-label="Previous attachment"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="absolute right-2 sm:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-white transition-colors duration-200"
                onClick={handleNext}
                aria-label="Next attachment"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
