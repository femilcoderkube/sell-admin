import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CancelIcon } from "../ui"; // Adjust path to your CancelIcon component
import { Match } from "../../app/types";
import { fetchTournamentAllMatches } from "../../app/features/tournament/tournamentMatchesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface MultipleMatchTimeChangeModalProps {
  show: boolean;
  stageId: any;
  onClose: () => void;

  onSubmit: (values: {
    matchIds: string[];
    startDate: string;
    endDate: string;
  }) => void;
}

const MultipleMatchTimeChangeModal: React.FC<
  MultipleMatchTimeChangeModalProps
> = ({ show, stageId, onClose, onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const { allmatches, allmatchesLoading } = useSelector(
    (state: RootState) => state.tournamentMatches
  );
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      matchIds: [] as string[],
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      matchIds: Yup.array()
        .min(1, "At least one match must be selected")
        .required("At least one match must be selected"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string()
        .required("End date is required")
        .test(
          "is-after-start",
          "End date must be after start date",
          function (value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return true;
            return new Date(value) > new Date(startDate);
          }
        ),
    }),
    onSubmit: (values) => {
      try {
        onSubmit({
          matchIds: values.matchIds,
          startDate: values.startDate,
          endDate: values.endDate,
        });
        formik.resetForm();
        onClose();
      } catch (err) {
        setError("Failed to update match times. Please try again.");
      }
    },
    enableReinitialize: true,
  });

  // Reset form and errors when modal is opened
  useEffect(() => {
    if (show) {
      formik.resetForm({
        values: { matchIds: [], startDate: "", endDate: "" },
      });
      setError(null);
      formik.setTouched({}, false);
      formik.setErrors({});
      dispatch(fetchTournamentAllMatches({ stageId: stageId }));
    }
  }, [show]);

  // Handle checkbox change for match selection
  const handleMatchSelection = (matchId: string) => {
    const currentMatchIds = formik.values.matchIds;
    if (currentMatchIds.includes(matchId)) {
      formik.setFieldValue(
        "matchIds",
        currentMatchIds.filter((id) => id !== matchId)
      );
    } else {
      formik.setFieldValue("matchIds", [...currentMatchIds, matchId]);
    }
  };

  return (
    <div
      id="multiple-match-time-modal"
      aria-hidden={!show}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
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
      <form
        onSubmit={formik.handleSubmit}
        className="relative p-4 w-full max-w-lg max-h-[90vh] mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700 flex flex-col">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              Change Match Times
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="multiple-match-time-modal"
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
                Select Matches <span className="text-red-500">*</span>
              </label>

              {allmatches?.length > 0 && (
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="mr-2"
                    checked={
                      formik.values.matchIds.length > 0 &&
                      formik.values.matchIds.length === allmatches.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Select all
                        formik.setFieldValue(
                          "matchIds",
                          allmatches.map((m) => m._id)
                        );
                      } else {
                        // Deselect all
                        formik.setFieldValue("matchIds", []);
                      }
                    }}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm text-white cursor-pointer"
                  >
                    Select All
                  </label>
                </div>
              )}

              <div className="max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-input-color">
                {allmatchesLoading ? (
                  <p className="text-gray-400">Loading matches...</p>
                ) : allmatches.length === 0 ? (
                  <p className="text-gray-400">No matches available</p>
                ) : (
                  allmatches.map((match) => (
                    <div key={match._id} className="flex items-center mb-2 text-white">
                      <input
                        type="checkbox"
                        id={`match-${match._id}`}
                        checked={formik.values.matchIds.includes(match._id)}
                        onChange={() => handleMatchSelection(match._id)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`match-${match._id}`}
                        className="text-sm cursor-pointer"
                      >
                        {match?.config?.id + 1}{" "}
                        {match.opponent1?.team?.teamName ||
                          match.opponent1?.user?.username ||
                          "-"}{" "}
                        vs{" "}
                        {match.opponent2?.team?.teamName ||
                          match.opponent2?.user?.username ||
                          "-"}{" "}
                        ({match.stageRoundId?.roundName})
                      </label>
                    </div>
                  ))
                )}
              </div>

              {formik.touched.matchIds && formik.errors.matchIds && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.matchIds}
                </p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <label
                htmlFor="startDate"
                className="block text-white text-sm font-medium mb-2"
              >
                Start Date and Time <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  formik.values.startDate
                    ? new Date(formik.values.startDate)
                    : null
                }
                onChange={(date: Date) =>
                  formik.setFieldValue("startDate", date.toISOString())
                }
                onBlur={() => formik.setFieldTouched("startDate", true)}
                showTimeSelect
                timeFormat="h:mm aa"
                dateFormat="yyyy-MM-dd h:mm aa"
                className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 appearance-none leading-normal ${formik.touched.startDate && formik.errors.startDate
                    ? "border border-red-500"
                    : ""
                  }`}
                id="startDate"
                name="startDate"
                placeholderText="Select start date"
                autoComplete="off"
                timeIntervals={15}
                minDate={new Date()}
                popperPlacement="bottom-start"
                wrapperClassName="w-full"
                calendarClassName="custom-datepicker"
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.startDate}
                </p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <label
                htmlFor="endDate"
                className="block text-white text-sm font-medium mb-2"
              >
                End Date and Time <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  formik.values.endDate ? new Date(formik.values.endDate) : null
                }
                onChange={(date: Date) =>
                  formik.setFieldValue("endDate", date.toISOString())
                }
                onBlur={() => formik.setFieldTouched("endDate", true)}
                showTimeSelect
                timeFormat="h:mm aa"
                dateFormat="yyyy-MM-dd h:mm aa"
                className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 appearance-none leading-normal ${formik.touched.endDate && formik.errors.endDate
                    ? "border border-red-500"
                    : ""
                  }`}
                id="endDate"
                name="endDate"
                placeholderText="Select end date"
                autoComplete="off"
                timeIntervals={15}
                minDate={new Date(formik.values.startDate || new Date())}
                popperPlacement="bottom-start"
                wrapperClassName="w-full"
                calendarClassName="custom-datepicker"
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.endDate}
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
              className={`bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ${formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {formik.isSubmitting ? "Processing..." : "Update Times"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MultipleMatchTimeChangeModal;
