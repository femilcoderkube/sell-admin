import React, { useEffect, useState } from "react";
import { CancelIcon } from "../ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDraftingPhase } from "../../app/features/draftingPhase/draftingPhaseSlice";
import { fetchLeagueById } from "../../app/features/league/leagueSlice";
import { setLocalZone, setOtherZone } from "../../utils/constant";

interface DraftingModalProps {
  show: boolean;
  onClose: () => void;
  leagueId: string;
  draft: any;
}

export const DraftingModal: React.FC<DraftingModalProps> = ({
  show,
  onClose,
  leagueId,
  draft,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  // Validation schema
  const draftingSchema = Yup.object().shape({
    totalTeams: Yup.number()
      .min(1, "Total teams must be at least 1")
      .required("Total teams is required")
      .integer("Total teams must be an integer"),
    totalPlayers: Yup.number()
      .min(1, "Total players must be at least 1")
      .required("Total players is required")
      .integer("Total players must be an integer")
      .test(
        "divisible-by-teams",
        "Total players must be divisible by total teams",
        function (value) {
          const totalTeams = this.parent.totalTeams;
          if (!value || !totalTeams) return false;
          return value % totalTeams === 0;
        }
      ),
    startTime: Yup.date()
      .required("Start time is required")
      // .min((new Date()), "Start time cannot be in the past")
      .typeError("Start time must be a valid date"),
    pickTimeSeconds: Yup.number()
      .min(10, "Pick time must be at least 10 seconds")
      .test(
        "multiple-of-10",
        "Pick time must be in multiples of 10 (e.g., 10, 20, 30, 40)",
        (value: any) => value % 10 === 0
      )
      .required("Pick time is required")
      .integer("Pick time must be an integer"),
  });

  const formik = useFormik({
    initialValues: {
      totalTeams: draft?.totalTeams ? draft?.totalTeams : null,
      totalPlayers: draft?.totalPlayers ? draft?.totalPlayers : null,
      startTime: draft?.startTime ? draft?.startTime : (null as Date | null),
      pickTimeSeconds: draft?.pickTimeSeconds ? draft?.pickTimeSeconds : null,
    },
    validationSchema: draftingSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setError(null);
        const resultAction = await dispatch(
          addDraftingPhase({
            id: draft?._id,
            payload: {
              totalTeams: values.totalTeams,
              totalPlayers: values.totalPlayers,
              startTime: values.startTime ? values.startTime : "",
              pickTimeSeconds: values.pickTimeSeconds,
              isUpdate: draft?.status === "not_active" ? false : true,
            },
          })
        );
        if (addDraftingPhase.fulfilled.match(resultAction)) {
          handleSuccess(resetForm);
          dispatch(fetchLeagueById(leagueId));
        } else {
          setError("Failed to add drafting phase. Please try again.");
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
  };

  useEffect(() => {
    if (!show) {
      formik.resetForm();
      setError(null);
    }
  }, [show]);

  return (
    <div
      id="drafting-modal"
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
              Drafting Phase
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="drafting-modal"
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

          <div className="p-4 md:p-5 space-y-4 max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            <div className="relative float-label-input custom-input mb-4">
              <input
                type="number"
                id="totalTeams"
                placeholder=" "
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.totalTeams && formik.errors.totalTeams
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("totalTeams")}
              />
              <label
                htmlFor="totalTeams"
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Total Teams <span className="text-red-500">*</span>
              </label>
              {formik.touched.totalTeams && formik.errors.totalTeams && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.totalTeams}
                </p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <input
                type="number"
                id="totalPlayers"
                placeholder=" "
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.totalPlayers && formik.errors.totalPlayers
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("totalPlayers")}
              />
              <label
                htmlFor="totalPlayers"
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Total Players <span className="text-red-500">*</span>
              </label>
              {formik.touched.totalPlayers && formik.errors.totalPlayers && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.totalPlayers}
                </p>
              )}
              {/* {formik.values.totalTeams && formik.values.totalPlayers && (
                <p className="text-white mt-1 text-sm">
                  Players per team:{" "}
                  {formik.values.totalPlayers / formik.values.totalTeams}
                </p>
              )} */}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <DatePicker
                selected={setLocalZone(formik.values.startTime, "Asia/Riyadh")}
                onChange={(date: Date) =>
                  formik.setFieldValue(
                    "startTime",
                    setOtherZone(date, "Asia/Riyadh")
                  )
                }
                onBlur={() => formik.setFieldTouched("startTime", true)}
                showTimeSelect
                timeFormat="h:mm aa"
                dateFormat="yyyy-MM-dd h:mm aa"
                className={`block_cup block w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.startTime && formik.errors.startTime
                    ? "border border-red-500"
                    : ""
                }`}
                id="startTime"
                name="startTime"
                placeholderText="Select start time"
                autoComplete="off"
                timeIntervals={15}
                minDate={new Date()}
                popperPlacement="bottom-start"
                wrapperClassName="w-full"
                calendarClassName="custom-datepicker"
              />
              <label
                htmlFor="startTime"
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Start Time <span className="text-red-500">*</span>
              </label>
              {formik.touched.startTime && formik.errors.startTime && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.startTime}
                </p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <input
                type="number"
                id="pickTimeSeconds"
                step="10"
                placeholder=" "
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.pickTimeSeconds &&
                  formik.errors.pickTimeSeconds
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("pickTimeSeconds")}
              />
              <label
                htmlFor="pickTimeSeconds"
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Pick Time (Seconds) <span className="text-red-500">*</span>
              </label>
              {formik.touched.pickTimeSeconds &&
                formik.errors.pickTimeSeconds && (
                  <p className="text-red-600 mt-1 text-sm">
                    {formik.errors.pickTimeSeconds}
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
              className={`bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formik.isSubmitting ? "Processing..." : "Submit"}
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

export default DraftingModal;
