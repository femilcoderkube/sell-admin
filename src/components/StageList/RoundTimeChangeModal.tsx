import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CancelIcon } from "../ui"; // Adjust path to your CancelIcon component
import { Match } from "../../app/types";
import { setLocalZone, setOtherZone } from "../../utils/constant";

interface RoundTimeChangeModalProps {
  stageType: any;
  stageRound: any;
  stageGroups: any;
  show: boolean;
  onClose: () => void;
  matches: Match[];
  onSubmit: (values: {
    roundId: string;
    startDate: string;
    endDate: string;
  }) => void;
}

const RoundTimeChangeModal: React.FC<RoundTimeChangeModalProps> = ({
  stageType,
  stageRound,
  stageGroups,
  show,
  onClose,
  matches,
  onSubmit,
}) => {
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      groupId: stageType === "BattleRoyal" ? stageGroups[0]?._id : "",
      roundId: stageRound?.length > 0 ? stageRound[0]?._id : "",
      startDate: stageRound?.length > 0 ? stageRound[0]?.startTime : "",
      endDate: stageRound?.length > 0 ? stageRound[0]?.endTime : "",
    },
    validationSchema: Yup.object({
      ...(stageType === "BattleRoyal" && {
        groupId: Yup.string()
          .required("Group selection is required")
          .notOneOf(["-1"], "Please select a valid group"),
      }),
      roundId: Yup.string()
        .required("Round selection is required")
        .notOneOf(["-1"], "Please select a valid round"),
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
        const submitData: any = {
          roundId: values.roundId,
          startDate: values.startDate,
          endDate: values.endDate,
        };
        if (stageType === "BattleRoyal") {
          submitData.groupId = values.groupId;
        }
        onSubmit(submitData);
        formik.resetForm();
        onClose();
      } catch (err) {
        setError("Failed to submit round times. Please try again.");
      }
    },
    enableReinitialize: true,
  });

  // Handle round selection change to update startDate and endDate
  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoundId = e.target.value;
    formik.handleChange(e); // Update roundId in formik

    // Find the selected round from stageRound
    const selectedRound = stageRound.find(
      (round: any) => round._id === selectedRoundId
    );

    // Update startDate and endDate based on the selected round
    if (selectedRound) {
      formik.setFieldValue("startDate", selectedRound.startTime || "");
      formik.setFieldValue("endDate", selectedRound.endTime || "");
    } else {
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
    }
  };

  return (
    <div
      id="changetime-round-modal"
      aria-hidden={!show}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
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
        className="relative p-4 w-full max-w-sm max-h-[90vh] mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700 flex flex-col">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              Round Time Change
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="changetime-round-modal"
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

            {stageType === "BattleRoyal" && (
              <div className="relative mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Select Group <span className="text-red-500">*</span>
                </label>
                <div className="nf_top-filter nf_bg flex items-center">
                  <div className="nf_cust-select nf_simple-select focus-input w-full">
                    <select
                      className="form-control color-white cust-arrow w-full text-[0.78125rem] bg-input-color rounded-[0.52rem] px-3 py-[0.35rem] text-white focus:outline-0"
                      id="group_dropdown_time"
                      name="groupId"
                      value={formik.values.groupId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {stageGroups?.map((group: any) => (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {formik.touched.groupId && formik.errors.groupId && (
                  <p className="text-red-600 mt-1 text-sm">
                    {formik.errors.groupId}
                  </p>
                )}
              </div>
            )}

            <div className="relative mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Select Round <span className="text-red-500">*</span>
              </label>
              <div className="nf_top-filter nf_bg flex items-center">
                <div className="nf_cust-select nf_simple-select focus-input w-full">
                  <select
                    className="form-control color-white cust-arrow w-full text-[0.78125rem] bg-input-color rounded-[0.52rem] px-3 py-[0.35rem] text-white focus:outline-0"
                    id="round_dropdown_time"
                    name="roundId"
                    value={formik.values.roundId}
                    onChange={handleRoundChange} // Use custom handler
                    onBlur={formik.handleBlur}
                  >
                    {stageRound?.map((round: any) => (
                      <option key={round._id} value={round._id}>
                        {round.roundName}{" "}
                        {round.config
                          ? round.config.group_id === 0
                            ? "(WB)"
                            : round.config.group_id === 1
                            ? "(LB)"
                            : "(FB)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {formik.touched.roundId && formik.errors.roundId && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.roundId}
                </p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <label
                htmlFor="startDate"
                className="block text-white text-sm font-medium mb-2"
              >
                Round Start Datetime <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  formik.values.startDate
                    ? setLocalZone(
                        new Date(formik.values.startDate),
                        "Asia/Riyadh"
                      )
                    : null
                }
                onChange={(date: Date) =>
                  formik.setFieldValue(
                    "startDate",
                    setOtherZone(date, "Asia/Riyadh")
                  )
                }
                onBlur={() => formik.setFieldTouched("startDate", true)}
                showTimeSelect
                timeFormat="h:mm aa"
                dateFormat="yyyy-MM-dd h:mm aa"
                className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 appearance-none leading-normal ${
                  formik.touched.startDate && formik.errors.startDate
                    ? "border border-red-500"
                    : ""
                }`}
                id="startDate"
                name="startDate"
                placeholderText="Select start date"
                autoComplete="off"
                timeIntervals={15}
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
                Round End Datetime <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  formik.values.endDate
                    ? setLocalZone(
                        new Date(formik.values.endDate),
                        "Asia/Riyadh"
                      )
                    : null
                }
                onChange={(date: Date) =>
                  formik.setFieldValue(
                    "endDate",
                    setOtherZone(date, "Asia/Riyadh")
                  )
                }
                onBlur={() => formik.setFieldTouched("endDate", true)}
                showTimeSelect
                timeFormat="h:mm aa"
                dateFormat="yyyy-MM-dd h:mm aa"
                className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 appearance-none leading-normal ${
                  formik.touched.endDate && formik.errors.endDate
                    ? "border border-red-500"
                    : ""
                }`}
                id="endDate"
                name="endDate"
                placeholderText="Select end date"
                autoComplete="off"
                timeIntervals={15}
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
              className={`bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formik.isSubmitting ? "Processing..." : "Update Round Time"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoundTimeChangeModal;
