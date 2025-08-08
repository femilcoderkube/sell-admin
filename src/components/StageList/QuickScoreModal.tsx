import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CancelIcon } from "../ui"; // Adjust path to your CancelIcon component
import { Match } from "../../app/types";

interface QuickScoreModalProps {
  show: boolean;
  onClose: () => void;
  match: Match | null;
  onSubmit: (values: {
    team1Score: number;
    team2Score: number;
    matchId: string;
  }) => void;
}

const QuickScoreModal: React.FC<QuickScoreModalProps> = ({
  show,
  onClose,
  match,
  onSubmit,
}) => {
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      team1Score: "",
      team2Score: "",
    },
    validationSchema: Yup.object({
      team1Score: Yup.number()
        .required("Score is required")
        .min(0, "Score cannot be negative"),
      team2Score: Yup.number()
        .required("Score is required")
        .min(0, "Score cannot be negative"),
    }),
    onSubmit: (values) => {
      if (match) {
        try {
          onSubmit({
            team1Score: parseInt(values.team1Score),
            team2Score: parseInt(values.team2Score),
            matchId: match._id,
          });
          formik.resetForm();
          onClose();
        } catch (err) {
          setError("Failed to submit scores. Please try again.");
        }
      }
    },
    enableReinitialize: true,
  });

  // Reset form and errors when modal is opened
  useEffect(() => {
    if (show) {
      formik.resetForm({ values: { team1Score: "", team2Score: "" } });
      setError(null);
      formik.setTouched({}, false); // Clear touched fields
      formik.setErrors({}); // Clear validation errors
    }
  }, [show]);

  return (
    <div
      id="quickscore-modal"
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
              Quick Scoring
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="quickscore-modal"
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
            <div className="relative float-label-input custom-input mb-4">
              <label
                htmlFor="team1Score"
                className="block text-white text-sm font-medium mb-2"
              >
                {match?.opponent1?.team?.teamShortName || "Team 1"} Score{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="team1Score"
                name="team1Score"
                placeholder="Enter score"
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.team1Score && formik.errors.team1Score
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("team1Score")}
              />
              {formik.touched.team1Score && formik.errors.team1Score && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.team1Score}
                </p>
              )}
            </div>

            <div className="relative float-label-input custom-input mb-4">
              <label
                htmlFor="team2Score"
                className="block text-white text-sm font-medium mb-2"
              >
                {match?.opponent2?.team?.teamShortName || "Team 2"} Score{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="team2Score"
                name="team2Score"
                placeholder="Enter score"
                className={`w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[0.35rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                  formik.touched.team2Score && formik.errors.team2Score
                    ? "border border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("team2Score")}
              />
              {formik.touched.team2Score && formik.errors.team2Score && (
                <p className="text-red-600 mt-1 text-sm">
                  {formik.errors.team2Score}
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
              {formik.isSubmitting ? "Processing..." : "Submit Scores"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuickScoreModal;
