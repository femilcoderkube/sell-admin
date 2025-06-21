// src/components/CommonModal.tsx
import React from "react";
import { X } from "lucide-react"; // Ensure lucide-react is installed

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#1E2235] rounded-xl max-w-[90vw] sm:max-w-2xl w-full flex flex-col shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Fixed */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-[#2A2E3F]">
          <h3 className="text-white text-xl sm:text-2xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-h-[60vh] sm:max-h-[70vh]">
          <div className="text-gray-200 text-sm sm:text-base">{children}</div>
        </div>

        {/* Footer: Fixed */}
        <div className="p-6 sm:p-8 border-t border-[#2A2E3F] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2A2E3F] text-white py-2 px-4 rounded-lg hover:bg-[#3A3F5A] transition-colors duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
