import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const BanModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const Switch = ({
    checked,
    onChange,
    id,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    id: string;
  }) => (
    <button
      type="button"
      id={id}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-600" : "bg-gray-400"
      }`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A2332] p-4 sm:p-6 rounded-lg text-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] flex flex-col">
        <h3 className="text-lg font-bold mb-4">Player</h3>
        <div
          className="overflow-y-auto scrollbar-width-none custom-scrollbar flex-1 p-1"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <Formik
            initialValues={{
              playerName: "",
              ipAddress: "",
              date: "",
              permanentBan: false,
              comment: "",
            }}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-custom-gray">
                      Player Name
                    </label>
                    <Field
                      type="text"
                      name="playerName"
                      className="w-full p-2 bg-[#242B3C] text-white rounded-[0.625rem] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Player Name"
                    />
                    <ErrorMessage
                      name="playerName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-custom-gray">
                      IP Address
                    </label>
                    <Field
                      type="text"
                      name="ipAddress"
                      className="w-full p-2 bg-[#242B3C] text-white rounded-[0.625rem] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="IP Address"
                    />
                    <ErrorMessage
                      name="ipAddress"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-custom-gray">Date</label>
                    <Field
                      type="date"
                      name="date"
                      className="w-full p-2 bg-[#242B3C] text-white rounded-[0.625rem] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={values.permanentBan}
                      onChange={(value) => setFieldValue("permanentBan", value)}
                      id="permanentBan"
                    />
                    <label htmlFor="permanentBan" className="text-custom-gray">
                      Permanent Ban (User will be banned forever)
                    </label>
                  </div>
                  <div>
                    <label className="block mb-2 text-custom-gray">
                      Comment
                    </label>
                    <Field
                      as="textarea"
                      name="comment"
                      className="w-full p-2 bg-[#242B3C] text-white rounded-[0.625rem] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                      placeholder="Comment"
                    />
                    <ErrorMessage
                      name="comment"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-[0.52rem] w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
                    disabled={isSubmitting}
                  >
                    Ban User
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-[0.52rem] w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

// Custom scrollbar styles (add this to your CSS file or use a Tailwind plugin)

export default BanModal;
