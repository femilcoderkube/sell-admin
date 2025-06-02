import React, { useState } from "react";
import { FileUploadIcon } from "./svgs";

interface FileUploadProps {
  label: string;
  id: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, id, onChange }) => {
  const [fileName, setFileName] = useState<string>("No file chosen");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    setFileName(file ? file.name : "No file chosen");
  };

  return (
    <div className="relative mb-4">
      <label
        className="block w-full text-[0.94rem] text-custom-gray  focus:outline-0 focus:!border focus:!border-highlight-color  pb-[1.5rem] pt-[0.5rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
        htmlFor={id}
      >
        {label}
      </label>

      <input
        className="hidden"
        id={id}
        type="file"
        onChange={(e) => {
          onChange(e);
          handleFileChange(e);
        }}
      />

      <div
        className="absolute bottom-1 w-full flex justify-between left-0 font-medium text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-white"
        id="user_avatar_help"
      >
        {fileName}
        <FileUploadIcon />
      </div>
    </div>
  );
};

export default FileUpload;
