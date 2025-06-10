import React from "react";

interface FileUploadProps {
  label: string;
  id: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  previewUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, id, onChange, fileName, previewUrl }) => {
  const displayFileName = fileName || "No file chosen";

  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input-color border-light-border hover:bg-gray-700 transition-all"
          >
            {previewUrl ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-24 object-contain mb-2"
                />
                <p className="text-xs text-gray-400 truncate w-full text-center px-2">
                  {displayFileName}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
              </div>
            )}
            <input 
              id={id} 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={onChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
