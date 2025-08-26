import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import * as Yup from "yup";

import { CancelIcon } from "../ui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addPopup,
  fetchPopups,
  updatePopup,
} from "../../app/features/popup/popupsSlice";
import { setLocalZone, setOtherZone } from "../../utils/constant";

interface Popup {
  id?: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  expireDateTime: string;
  status: string;
}
interface PopupModalProps {
  show: boolean;
  onClose: () => void;
  selectedPopup: Popup | null;
}

// Validation schema for popup
const popupSchema = Yup.object().shape({
  titleEn: Yup.string()
    .min(3, "Title(EN) must be at least 3 characters")
    .max(100, "Title(EN) cannot exceed 100 characters")
    .required("Title(EN) is required")
    .matches(/^\S.*\S$/, "Title(EN) cannot start or end with spaces"),
  titleAr: Yup.string()
    .min(3, "Title(AR) must be at least 3 characters")
    .max(100, "Title(AR) cannot exceed 100 characters")
    .required("Title(AR) is required")
    .matches(/^\S.*\S$/, "Title(AR) cannot start or end with spaces"),
  descriptionEn: Yup.string()
    .min(10, "Description(EN) must be at least 10 characters")
    .max(500, "Description(EN) cannot exceed 500 characters")
    .required("Description(EN) is required")
    .matches(/^\S.*\S$/, "Description cannot start or end with spaces"),
  descriptionAr: Yup.string()
    .min(10, "Description(AR) must be at least 10 characters")
    .max(500, "Description(AR) cannot exceed 500 characters")
    .required("Description(AR) is required")
    .matches(/^\S.*\S$/, "Description cannot start or end with spaces"),
  expireDateTime: Yup.string().required("Expiration date is required"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Status must be active or inactive")
    .required("Status is required"),
});

const PopupModal: React.FC<PopupModalProps> = ({
  show,
  onClose,
  selectedPopup,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = React.useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      expireDateTime: "",
      status: "active",
    },
    // validationSchema: popupSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setError(null);
        const popupData: Popup = {
          titleEn: values.titleEn,
          titleAr: values.titleAr,
          descriptionEn: values.descriptionEn,
          descriptionAr: values.descriptionAr,
          expireDateTime: values.expireDateTime,
          status: values.status,
        };

        if (selectedPopup) {
          const result = await dispatch(
            updatePopup({ id: selectedPopup._id!, popup: popupData })
          );
          if (updatePopup.fulfilled.match(result)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to update popup. Please try again.");
          }
        } else {
          const result = await dispatch(addPopup(popupData));
          if (addPopup.fulfilled.match(result)) {
            handleSuccess(resetForm);
          } else {
            setError("Failed to add popup. Please try again.");
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
    setError(null);
    onClose();
    dispatch(fetchPopups({ page: 1, perPage: 10, searchTerm: "" }));
  };

  useEffect(() => {
    if (selectedPopup) {
      formik.setValues({
        titleEn: selectedPopup.titleEn || "",
        titleAr: selectedPopup.titleAr || "",
        descriptionEn: selectedPopup.descriptionEn || "",
        descriptionAr: selectedPopup.descriptionAr || "",
        expireDateTime: selectedPopup.expireDateTime || "",
        status: selectedPopup.status || "active",
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [selectedPopup]);

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
              {`${selectedPopup ? "Update" : "Add"} Popup`}
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => {
                formik.resetForm();
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
                Title (EN)
              </label>
              <input
                type="text"
                name="titleEn"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 ${
                  formik.touched.titleEn && formik.errors.titleEn
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("titleEn")}
              />
              {formik.touched.titleEn && formik.errors.titleEn && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.titleEn}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Title (AR)
              </label>
              <input
                type="text"
                name="titleAr"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 ${
                  formik.touched.titleAr && formik.errors.titleAr
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("titleAr")}
              />
              {formik.touched.titleAr && formik.errors.titleAr && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.titleAr}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Description (EN)
              </label>
              <textarea
                name="descriptionEn"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 resize-y min-h-[100px] ${
                  formik.touched.descriptionEn && formik.errors.descriptionEn
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("descriptionEn")}
              />
              {formik.touched.descriptionEn && formik.errors.descriptionEn && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.descriptionEn}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Description (AR)
              </label>
              <textarea
                name="descriptionAr"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 resize-y min-h-[100px] ${
                  formik.touched.descriptionAr && formik.errors.descriptionAr
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("descriptionAr")}
              />
              {formik.touched.descriptionAr && formik.errors.descriptionAr && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.descriptionAr}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Expiration Date
              </label>
              <DatePicker
                selected={
                  formik.values.expireDateTime
                    ? setLocalZone(
                        new Date(formik.values.expireDateTime),
                        "Asia/Riyadh"
                      )
                    : null
                }
                onChange={(date: Date) =>
                  formik.setFieldValue(
                    "expireDateTime",
                    setOtherZone(date, "Asia/Riyadh")
                  )
                }
                onBlur={() => formik.setFieldTouched("expireDateTime", true)}
                // showTimeSelect
                // timeFormat="h:mm aa"
                // dateFormat="yyyy-MM-dd h:mm aa"
                dateFormat="yyyy-MM-dd"
                className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 appearance-none leading-normal ${
                  formik.touched.expireDateTime && formik.errors.expireDateTime
                    ? "border border-red-500"
                    : ""
                }`}
                id="expireDateTime"
                name="expireDateTime"
                placeholderText="Select expiration date"
                autoComplete="off"
                timeIntervals={15}
                popperPlacement="bottom-start"
                wrapperClassName="w-full"
                calendarClassName="custom-datepicker"
              />
              {formik.touched.expireDateTime &&
                formik.errors.expireDateTime && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.expireDateTime}
                  </p>
                )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                className={`w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2 ${
                  formik.touched.status && formik.errors.status
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.status}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
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
                : `${selectedPopup ? "Update" : "Add"} Popup`}
            </button>
          </div>
        </div>
      </form>
      <style>{`
        .custom-datepicker {
          background-color: #212739;
          border: none;
          border-radius: 0.52rem;
          padding: 0.5rem;
          font-size: 0.78125rem;
          color: #fff;
          font-family: inherit;
          display: flex;
        }
        .custom-datepicker .react-datepicker__header {
          background-color: #2b3245;
          border-bottom: none;
          padding: 0.5rem;
        }
        .custom-datepicker .react-datepicker__current-month,
        .custom-datepicker .react-datepicker__day-name {
          color: #fff;
          font-size: 0.78125rem;
        }
        .custom-datepicker .react-datepicker__day {
          color: #fff;
          border-radius: 0.3rem;
          padding: 0.3rem;
        }
        .custom-datepicker .react-datepicker__day:hover {
          background-color: #2b3245;
        }
        .custom-datepicker .react-datepicker__day--selected,
        .custom-datepicker .react-datepicker__day--keyboard-selected {
          background-color: #007eff;
          color: #fff;
        }
        .custom-datepicker .react-datepicker__day--disabled {
          color: #6b7280;
          opacity: 0.5;
        }
        .custom-datepicker .react-datepicker__navigation {
          top: 0.75rem;
        }
        .custom-datepicker .react-datepicker__navigation-icon::before {
          border-color: #fff;
        }
        .custom-datepicker .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PopupModal;

export type { Popup };
