import React, { useEffect, useState } from "react";
import FileUpload from "../ui/UploadFile";
import { CancelIcon } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  addGame,
  fetchGames,
  updateGame,
} from "../../app/features/games/gameSlice";
import { GameType } from "../../app/types";
import { baseURL } from "../../axios";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  selectedGame: GameType | null;
}

// Validation schema
const gameSchema = Yup.object().shape({
  name: Yup.string()
    // .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Game name is required")
    .matches(/^\S.*\S$/, "Name cannot start or end with spaces"),
  shortName: Yup.string()
    .min(2, "Short name must be at least 2 characters")
    .max(20, "Short name cannot exceed 20 characters")
    .required("Short name is required")
    .matches(/^\S.*\S$/, "Name cannot start or end with spaces"),
  color: Yup.string()
    .matches(/^#[0-9A-F]{6}$/i, "Invalid hex color code")
    .required("Color is required"),
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
    )
    .required("A logo is required"),
});

export const GameModal: React.FC<ModalProps> = ({
  show,
  onClose,
  selectedGame,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: selectedGame?.name || "",
      shortName: selectedGame?.shortName || "",
      logo: selectedGame?.logo || null,
      color: selectedGame?.color || "#000000",
      logoUrl: selectedGame?.logo || "",
    },
    validationSchema: gameSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setError(null);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("shortName", values.shortName);
        formData.append("color", values.color);

        // Handle logo for new game (must be File) and existing game (can be string or File)
        if (selectedGame) {
          if (values.logo instanceof File) {
            formData.append("logo", values.logo);
          } else if (values.logoUrl) {
            formData.append("logo", values.logoUrl);
          }
          const resultAction = await dispatch(
            updateGame({ id: selectedGame._id, device: formData })
          );
          if (updateGame.fulfilled.match(resultAction)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to update game. Please try again.");
          }
        } else {
          if (!(values.logo instanceof File)) {
            setError("A new logo file is required for new games.");
            return;
          }
          formData.append("logo", values.logo);
          const resultAction = await dispatch(addGame(formData));
          if (addGame.fulfilled.match(resultAction)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to add game. Please try again.");
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
    setLogoPreview(undefined);
    setLogoFileName("");
    setError(null);
    onClose();
    dispatch(fetchGames({ page: 1, perPage: 10, searchTerm: "" }));
  };

  useEffect(() => {
    if (selectedGame?.logo && typeof selectedGame.logo === "string") {
      setLogoPreview(baseURL + "/api/v1/" + selectedGame.logo);
      const urlParts = selectedGame.logo.split("/");
      setLogoFileName(urlParts[urlParts.length - 1]);
      formik.setFieldValue("logo", selectedGame.logo);
    } else {
      setLogoPreview(undefined);
      setLogoFileName("");
      formik.setFieldValue("logo", null);
    }
    // Cleanup object URLs
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setLogoFileName(file.name);
        const objectUrl = URL.createObjectURL(file);
        setLogoPreview(objectUrl);
      } catch (err) {
        formik.setFieldError(
          "logo",
          "Error processing file. Please try another."
        );
      }
    } else {
      formik.setFieldValue("logo", selectedGame?.logo || null);
      setLogoPreview(
        selectedGame?.logo
          ? baseURL + "/api/v1/" + selectedGame.logo
          : undefined
      );
      setLogoFileName(
        selectedGame?.logo ? selectedGame.logo.split("/").pop() || "" : ""
      );
    }
  };

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
              {`${selectedGame ? "Update" : "Add"} game`}
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={() => {
                formik.resetForm();
                setLogoPreview(undefined);
                setLogoFileName("");
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
                Game title <span className="text-red-500">*</span>
              </label>
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 !m-0 mt-1">{formik.errors.name}</p>
              )}
            </div>
            <div className="relative float-label-input custom-input mb-4">
              <input
                type="text"
                id="shortName"
                placeholder=" "
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.shortName && formik.errors.shortName
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("shortName")}
              />
              <label
                htmlFor="shortName"
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Short name <span className="text-red-500">*</span>
              </label>
              {formik.touched.shortName && formik.errors.shortName && (
                <p className="text-red-600 !m-0 mt-1">
                  {formik.errors.shortName}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 mb-4">
              <FileUpload
                label="Game Logo"
                id="head_img"
                onChange={handleLogoChange}
                fileName={logoFileName}
                previewUrl={logoPreview}
                accept="image/png,image/jpeg,image/gif,image/svg+xml"
              />
              {formik.touched.logo && formik.errors.logo && (
                <p className="text-red-600 !m-0 mt-1">{formik.errors.logo}</p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <div className="flex items-center relative">
                <input
                  type="color"
                  id="color"
                  className="w-0 h-0 opacity-0 absolute"
                  {...formik.getFieldProps("color")}
                  onChange={(e) => {
                    formik.setFieldValue("color", e.target.value);
                  }}
                />
                <input
                  type="text"
                  id="color-text"
                  placeholder=" "
                  className={`w-full text-[0.94rem] text-white focus:outline-none focus:border focus:border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 pr-10 block appearance-none leading-normal ${
                    formik.touched.color && formik.errors.color
                      ? "border border-red-500"
                      : ""
                  }`}
                  {...formik.getFieldProps("color")}
                />
                <div
                  onClick={() => {
                    document.getElementById("color")?.click();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: formik.values.color }}
                ></div>
                <label
                  htmlFor="color-text"
                  className={`absolute left-3 transition-all duration-200 text-[0.94rem] font-bold text-custom-gray pointer-events-none ${
                    formik.values.color
                      ? "top-1 -translate-y-0.5 font-normal text-[13px]"
                      : "focus:top-1 text-[13px]"
                  }`}
                >
                  Game Color <span className="text-red-500">*</span>
                </label>
              </div>
              {formik.touched.color && formik.errors.color && (
                <p className="text-red-600 !m-0 mt-1">{formik.errors.color}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setLogoPreview(undefined);
                setLogoFileName("");
                setError(null);
                onClose();
              }}
              className="bg-gray-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`bg-primary-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formik.isSubmitting
                ? "Processing..."
                : `${selectedGame ? "Update" : "Add"} game`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GameModal;
