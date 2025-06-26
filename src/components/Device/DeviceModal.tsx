import React, { useCallback, useEffect, useState } from "react";
import { CancelIcon } from "../ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  addDevice,
  checkDeviceExists,
  fetchDevices,
  updateDevice,
} from "../../app/features/devices/deviceSlice";
import { DeviceType } from "../../app/types";
import { baseURL } from "../../axios";
import { debounce } from "lodash";
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
  const [error, setError] = useState<string | null>(null);

  const debouncedCheckDevice = useCallback(
    debounce(async (value, id, resolve) => {
      console.log(`Checking device: ${value}`);
      if (value) {
        const result = await dispatch(checkDeviceExists({ device: value, id }));
        console.log(`Result for ${value}:`, result.payload);
        resolve(result.payload.data ? "Device already exists" : undefined);
      } else {
        resolve(undefined);
      }
    }, 500),
    [dispatch]
  );

  // Validation schema
  const deviceSchema = Yup.object().shape({
    name: Yup.string()
      // .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Device name is required")
      .test(
        "check-device-exists",
        "Device already exists",
        (value) =>
          new Promise((resolve) => {
            debouncedCheckDevice(value, selectedDevice?._id, resolve);
          })
      )
      .matches(/^\S.*\S$/, "Name cannot start or end with spaces"),
    logo: Yup.mixed()
      .test("logo-required", "A logo is required", function (value) {
        return value !== null && value !== undefined;
      })
      .test("fileSize", "File size must be less than 2MB", function (value) {
        if (value instanceof File) {
          return value.size <= 2 * 1024 * 1024;
        }
        return true;
      })
      .test(
        "fileType",
        "Only image files are allowed (PNG, JPG, GIF, SVG)",
        function (value) {
          if (value instanceof File) {
            return [
              "image/png",
              "image/jpeg",
              "image/gif",
              "image/svg+xml",
            ].includes(value.type);
          }
          return true;
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: selectedDevice?.name || "",
      logo: selectedDevice?.logo || null,
    },
    validationSchema: deviceSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setError(null);
        const formData = new FormData();
        formData.append("name", values.name);

        if (selectedDevice) {
          // For updates, only append logo if a new File is selected
          if (values.logo instanceof File) {
            formData.append("logo", values.logo);
          } else if (selectedDevice.logo) {
            formData.append("logo", selectedDevice.logo); // Keep existing logo URL
          }
          const resultAction = await dispatch(
            updateDevice({ id: selectedDevice._id, device: formData })
          );
          if (updateDevice.fulfilled.match(resultAction)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to update device. Please try again.");
          }
        } else {
          // For new devices, logo must be a File
          if (!(values.logo instanceof File)) {
            setError("A logo file is required for new devices.");
            return;
          }
          formData.append("logo", values.logo);
          const resultAction = await dispatch(addDevice(formData));
          if (addDevice.fulfilled.match(resultAction)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to add device. Please try again.");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSuccess = (resetForm: () => void) => {
    resetForm();
    setPreviewUrl(null);
    setFileName("");
    setError(null);
    onClose();
    dispatch(fetchDevices({ page: 1, perPage: 10, searchTerm: "" }));
  };

  useEffect(() => {
    if (selectedDevice) {
      formik.setValues({
        name: selectedDevice.name || "",
        logo: selectedDevice.logo || null,
      });

      // Set preview for existing device logo
      if (selectedDevice.logo) {
        const fullUrl = `${baseURL}/api/v1/${selectedDevice.logo}`;
        console.log("fullUrl", fullUrl);
        setPreviewUrl(fullUrl);
        const urlParts = selectedDevice.logo.split("/");
        setFileName(urlParts[urlParts.length - 1]);
      } else {
        setPreviewUrl(null);
        setFileName("");
      }
    } else {
      formik.resetForm();
      setPreviewUrl(null);
      setFileName("");
    }

    // Cleanup object URLs
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDevice]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (file.size > 2 * 1024 * 1024) {
          formik.setFieldError("logo", "File size must be less than 2MB");
          return;
        }
        if (
          !["image/png", "image/jpeg", "image/gif", "image/svg+xml"].includes(
            file.type
          )
        ) {
          formik.setFieldError(
            "logo",
            "Only image files are allowed (PNG, JPG, GIF, SVG)"
          );
          return;
        }
        formik.setFieldValue("logo", file);
        setFileName(file.name);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } catch (err) {
        formik.setFieldError(
          "logo",
          "Error processing file. Please try another."
        );
      }
    } else {
      // Revert to existing logo if no new file is selected
      formik.setFieldValue("logo", selectedDevice?.logo || null);
      if (selectedDevice?.logo && typeof selectedDevice.logo === "string") {
        setPreviewUrl(`${baseURL}/api/v1/${selectedDevice.logo}`);
        const urlParts = selectedDevice.logo.split("/");
        setFileName(urlParts[urlParts.length - 1]);
      } else {
        setPreviewUrl(null);
        setFileName("");
      }
    }
  };

  // Clean up debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedCheckDevice.cancel();
    };
  }, []);

  return (
    <div
      id="default-modal"
      aria-hidden={!show}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="relative p-4 w-full max-w-sm max-h-[90vh] mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700 flex flex-col">
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
                setError(null);
                onClose();
              }}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            <div className="relative float-label-input custom-input mb-4">
              <input
                type="text"
                id="name"
                placeholder=" "
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.name && formik.errors.name
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("name")}
              />
              <label
                htmlFor="name"
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Device name <span className="text-red-500">*</span>
              </label>
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.name}
                </p>
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
                        <svg
                          className="w-8 h-8 mb-4 text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, GIF, SVG (max 2MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="logo-upload"
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/gif,image/svg+xml"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              {formik.touched.logo && formik.errors.logo && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.logo}
                </p>
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
                setError(null);
                onClose();
              }}
              className="bg-gray-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formik.isSubmitting
                ? "Processing..."
                : `${selectedDevice ? "Update" : "Add"} Device`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeviceModal;
