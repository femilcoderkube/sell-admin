import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  createBannedUser,
  fetchBannedUsers,
  setPage,
} from "../../app/features/bannedusers/bannedUsersSlice";
import { setLocalZone, setOtherZone } from "../../utils/constant";

const BanModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const Switch = ({ checked, onChange, id }) => {
    return (
      <button
        type="button"
        id={id}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#1A2332] ${
          checked ? "bg-blue-600 shadow-lg" : "bg-gray-500"
        }`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span className="sr-only">Toggle</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
            checked ? "translate-x-6 scale-110" : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  const validationSchema = Yup.object().shape({
    playerName: Yup.string()
      .max(50, "Player name must be 50 characters or less")
      .test(
        "playerName-or-ipAddress",
        "Either Player Name or IP Address is required",
        function (value) {
          const { ipAddress } = this.parent;
          return Boolean(value?.trim()) || Boolean(ipAddress?.trim());
        }
      )
      .matches(/^\S.*\S$/, "playerName cannot start or end with spaces"),
    ipAddress: Yup.string()
      .nullable()
      .matches(/^\S.*\S$/, "ipAddress cannot start or end with spaces"),
    date: Yup.date()
      .nullable()
      .when("permanentBan", {
        is: false,
        then: (schema) =>
          schema.required("Ban date is required for non-permanent ban"),
        otherwise: (schema) => schema.notRequired(),
      }),
    permanentBan: Yup.boolean(),
    comment: Yup.string()
      .required("Reason for ban is required")
      .max(500, "Comment must be 500 characters or less")
      .matches(/^\S.*\S$/, "Comment cannot start or end with spaces"),
  });

  const initialValues = {
    playerName: "",
    ipAddress: "",
    date: null,
    permanentBan: false,
    comment: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const userData = {
        username: values.playerName,
        Date: values.date?.toISOString(),
        ipAddress: values.ipAddress,
        isPermanent: values.permanentBan,
        comment: values.comment,
      };

      const result = await dispatch(createBannedUser(userData));

      if (createBannedUser.fulfilled.match(result)) {
        resetForm();
        onClose();
        dispatch(setPage(1));
        dispatch(fetchBannedUsers({ page: 1, perPage: 10, searchTerm: "" }));
      }
      resetForm();
      onClose();
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A2332] rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 border border-gray-700/50">
        <div className="px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-white">Ban Users</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-gray-700/50 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="space-y-2">
                  <ErrorMessage
                    name="playerName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="playerName"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Player Name
                  </label>
                  <Field
                    type="text"
                    name="playerName"
                    className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter player name"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="ipAddress"
                    className="block text-sm font-medium text-gray-300"
                  >
                    IP Address
                  </label>
                  <Field
                    type="text"
                    name="ipAddress"
                    className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                    placeholder="xxx.xxx.xxx.xxx"
                  />
                  <ErrorMessage
                    component="div"
                    name="ipAddress"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="bg-[#242B3C]/50 rounded-xl p-4 border-gray-600/20 border mt-4">
                  <div className="flex items-start space-x-3">
                    <Switch
                      checked={values.permanentBan}
                      onChange={(value) => setFieldValue("permanentBan", value)}
                      id="permanentBan"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="permanentBan"
                        className="block text-sm font-medium text-white cursor-pointer"
                      >
                        Permanent Ban
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        User will be banned permanently and cannot rejoin
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Ban Date
                  </label>
                  <DatePicker
                    onChange={(date) =>
                      setFieldValue(
                        "date",
                        setOtherZone(date as any, "Asia/Riyadh")
                      )
                    }
                    selected={
                      values.date
                        ? setLocalZone(new Date(values.date), "Asia/Riyadh")
                        : null
                    }
                    showTimeSelect
                    timeFormat="h:mm aa"
                    dateFormat="yyyy-MM-dd h:mm aa"
                    className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                    placeholderText="Select ban date"
                    wrapperClassName="w-full"
                    disabled={values.permanentBan}
                    calendarClassName="custom-datepicker"
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Reason for Ban
                  </label>
                  <Field
                    as="textarea"
                    name="comment"
                    className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none placeholder-gray-400"
                    rows={3}
                    placeholder="Provide details about the ban reason..."
                  />
                  <ErrorMessage
                    name="comment"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="px-6 py-5 bg-[#242B3C]/30 rounded-b-2xl border-t border-gray-700/50 mt-6">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-500/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Banning..." : "Ban User"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <style>{`
        .custom-datepicker {
          background-color: #212739;
          border: none;
          border-radius: 0.52rem;
          padding: 0.5rem;
          font-size: 0.78125rem;
          color: #fff;
          font-family: inherit;
          display: flex

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
          e {
    display: flex;
    height: 300px;
}
      `}</style>
    </div>
  );
};

export default BanModal;
