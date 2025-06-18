import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  addBadges,
  updateBadges,
  fetchBadges,
} from "../../app/features/badge/badgeSlice";
import * as Yup from "yup";
import { BadgeType } from "../../app/types";
import { CancelIcon } from "../ui";
import { baseURL } from "../../axios";

interface BadgeModalProps {
  show: boolean;
  onClose: () => void;
  selectedBadge: BadgeType | null;
}

// Enhanced validation schema
const addBadgeSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Badge name is required")
    .matches(/^\S.*\S$/, "Name cannot start or end with spaces"),
  descriptionEN: Yup.string()
    .min(10, "English description must be at least 10 characters")
    .max(500, "English description cannot exceed 500 characters")
    .required("English description is required")
    .matches(/^\S.*\S$/, "English description cannot start or end with spaces"),
  descriptionAR: Yup.string()
    .min(10, "Arabic description must be at least 10 characters")
    .max(500, "Arabic description cannot exceed 500 characters")
    .required("Arabic description is required")
    .matches(/^\S.*\S$/, "Arabic description cannot start or end with spaces"),
  logo: Yup.mixed()
    .required("A logo is required")
    .test("fileSize", "File size must be less than 2MB", (value) => {
      if (value instanceof File) {
        return value.size <= 2 * 1024 * 1024;
      }
      return true;
    })
    .test(
      "fileType",
      "Only image files are allowed (PNG, JPG, GIF, SVG)",
      (value) => {
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

const BadgeModal: React.FC<BadgeModalProps> = ({
  show,
  onClose,
  selectedBadge,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isNewLogo, setIsNewLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      descriptionEN: "",
      descriptionAR: "",
      logo: null as File | string | null,
    },
    validationSchema: addBadgeSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setError(null);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("descriptionEN", values.descriptionEN);
        formData.append("descriptionAR", values.descriptionAR);

        if (selectedBadge) {
          if (values.logo && typeof values.logo !== "string") {
            formData.append("logo", values.logo);
          }
          const result = await dispatch(
            updateBadges({ id: selectedBadge._id, badge: formData })
          );
          if (updateBadges.fulfilled.match(result)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to update badge. Please try again.");
          }
        } else {
          if (!values.logo || typeof values.logo === "string") {
            setError("Please upload a valid logo.");
            return;
          }
          formData.append("logo", values.logo);
          const result = await dispatch(addBadges(formData));
          if (addBadges.fulfilled.match(result)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to add badge. Please try again.");
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
    setLogoPreview(null);
    setFileName("");
    setIsNewLogo(false);
    onClose();
    dispatch(fetchBadges({ page: 1, perPage: 10, searchTerm: "" }));
  };

  useEffect(() => {
    if (selectedBadge) {
      formik.setValues({
        name: selectedBadge.name || "",
        descriptionEN: selectedBadge.descriptionEN || "",
        descriptionAR: selectedBadge.descriptionAR || "",
        logo: selectedBadge.logo || null,
      });
      if (selectedBadge.logo && !isNewLogo) {
        setLogoPreview(baseURL + "/api/v1/" + selectedBadge.logo);
        const urlParts = selectedBadge.logo.split("/");
        setFileName(urlParts[urlParts.length - 1]);
      }
    } else {
      setLogoPreview(null);
      setFileName("");
      setIsNewLogo(false);
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [selectedBadge]);

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
        setLogoPreview(objectUrl);
        setIsNewLogo(true);
      } catch (err) {
        formik.setFieldError(
          "logo",
          "Error processing file. Please try another."
        );
      }
    }
  };

  return (
    <div
      aria-hidden={!show}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="relative p-4 w-full max-w-lg max-h-[90vh] mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm flex flex-col">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              {`${selectedBadge ? "Update" : "Add"} Badge`}
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => {
                formik.resetForm();
                setLogoPreview(null);
                setFileName("");
                setIsNewLogo(false);
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
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Badge Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 ${
                  formik.touched.name && formik.errors.name
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Description (EN) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descriptionEN"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 resize-y min-h-[100px] ${
                  formik.touched.descriptionEN && formik.errors.descriptionEN
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("descriptionEN")}
              />
              {formik.touched.descriptionEN && formik.errors.descriptionEN && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.descriptionEN}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Description (AR) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descriptionAR"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 resize-y min-h-[100px] ${
                  formik.touched.descriptionAR && formik.errors.descriptionAR
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("descriptionAR")}
              />
              {formik.touched.descriptionAR && formik.errors.descriptionAR && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.descriptionAR}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Logo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="logo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input-color border-light-border hover:bg-gray-700 transition-all"
                  >
                    {logoPreview ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                        <img
                          src={logoPreview}
                          alt="Badge Logo Preview"
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
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.logo as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setLogoPreview(null);
                setFileName("");
                setIsNewLogo(false);
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
              className={`bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formik.isSubmitting
                ? "Processing..."
                : `${selectedBadge ? "Update" : "Add"} Badge`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BadgeModal;

export type { BadgeType };
