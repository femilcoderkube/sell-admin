import React from "react";
import { CircleAlert } from "lucide-react";

interface ModalProps {
  show: boolean;
  title?: string;
  buttonTitle?: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmationModal: React.FC<ModalProps> = ({
  show,
  title,
  buttonTitle,
  onClose,
  onDelete,
}) => {
  return (
    <>
      <div
        id="default-modal"
        aria-hidden={!show}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="relative p-4 w-full max-w-sm max-h-full mx-auto">
          <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700 flex flex-col items-center text-white">
            <div className="p-2">
              <CircleAlert />
            </div>
            <label className="text-lg">{title ? title : "Are you sure?"}</label>

            <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b ">
              <button
                type="button"
                className="bg-gray-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-primary-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none "
                onClick={onDelete}
              >
                {/* Yes, delete it! */}
                {buttonTitle ? buttonTitle : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
