import React, { useEffect, useState } from "react";
import { CancelIcon } from "../ui";
import { useFormik } from "formik";
import { deviceSchema } from "../../validation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  addDevice,
  fetchDevices,
  updateDevice,
} from "../../app/features/devices/deviceSlice";
import { DeviceType } from "../../app/types";
interface ModalProps {
  show: boolean;
  onClose: () => void;
  selectedDevice: DeviceType | null;
}
export const DeviceModal: React.FC<ModalProps> = ({
  show,
  onClose,
  selectedDevice,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      name: "",
      logo: null,
    },
    validationSchema: deviceSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("logo", values.logo ?? "");
      if (selectedDevice) {
        const resultAction = await dispatch(
          updateDevice({ id: selectedDevice._id, device: formData })
        );
        resetForm();
        onClose();
        setPreviewUrl(null);
        setFileName("");
        if (updateDevice.fulfilled.match(resultAction)) {
          dispatch(fetchDevices({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        const resultAction = await dispatch(addDevice(formData));
        resetForm();
        onClose();
        setPreviewUrl(null);
        setFileName("");
        if (addDevice.fulfilled.match(resultAction)) {
          dispatch(fetchDevices({ page: 1, perPage: 10, searchTerm: "" }));
        }
      }
    },
  });

  useEffect(() => {
    if (selectedDevice) {
      formik.setFieldValue("name", selectedDevice.name);
      formik.setFieldValue("logo", selectedDevice.logo);
      
      // Set preview for existing device logo
      if (typeof selectedDevice.logo === 'string') {
        setPreviewUrl(selectedDevice.logo);
        // Extract filename from URL or path
        const urlParts = selectedDevice.logo.split('/');
        setFileName(urlParts[urlParts.length - 1]);
      } else if (selectedDevice.logo && typeof selectedDevice.logo === 'object') {
        // Handle File object if available
        setFileName(selectedDevice.logo || "Selected file");
        
        // Create preview if possible
        try {
          const objectUrl = URL.createObjectURL(selectedDevice.logo);
          setPreviewUrl(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        } catch (error) {
          console.error("Could not create preview URL:", error);
        }
      }
    } else {
      setPreviewUrl(null);
      setFileName("");
    }
  }, [selectedDevice]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("logo", file);
      setFileName(file.name);
      
      // Create preview URL for the selected file
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <>
      <div
        id="default-modal"
        aria-hidden={!show}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="relative p-4 w-full max-w-sm max-h-full mx-auto"
        >
          <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
            <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
              <h3 className="text-[1.5rem] font-semibold text-white text-center">
                {`${selectedDevice ? "Update" : "Add"} Device`}
              </h3>
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => {
                  formik.resetForm();
                  setPreviewUrl(null);
                  setFileName("");
                  onClose();
                }}
              >
                <CancelIcon />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  {...formik.getFieldProps("name")}
                />
                <label
                  htmlFor="name"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Device name
                </label>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-600">{formik.errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Device Logo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input-color border-light-border hover:bg-gray-700 transition-all"
                    >
                      {previewUrl ? (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                          <img 
                            src={previewUrl} 
                            alt="Device Logo Preview" 
                            className="max-w-full max-h-24 object-contain mb-2"
                          />
                          <p className="text-xs text-gray-400 truncate w-full text-center px-2">
                            {fileName}
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
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                {formik.touched.logo && formik.errors.logo && (
                  <p className="text-red-600 mt-1 text-sm">{formik.errors.logo}</p>
                )}
              </div>
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  setPreviewUrl(null);
                  setFileName("");
                  onClose();
                }}
                className="bg-gray-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none"
              >
                {`${selectedDevice ? "Update" : "Add"} Device`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DeviceModal;
