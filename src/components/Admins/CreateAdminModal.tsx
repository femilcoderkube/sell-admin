import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { CancelIcon } from "../ui";
import {
  createAdmin,
  fetchAccessModules,
} from "../../app/features/admins/newadminSlice";
import { fetchAdmin } from "../../app/features/admins/adminSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubModule {
  key: string;
  nameEn: string;
  nameAr: string;
  hasAccess: boolean;
}

interface Module {
  key: string;
  nameEn: string;
  nameAr: string;
  hasAccess: boolean;
  subModules?: SubModule[];
}

// Define available roles
const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
];

const validationSchema = Yup.object({
  userName: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  role: Yup.string()
    .required("Role is required")
    .oneOf(
      roleOptions.map((option) => option.value),
      "Invalid role selected"
    ),
});

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { accessModules, loading, error } = useSelector(
    (state: RootState) =>
      state.newadmin || { accessModules: [], loading: false, error: null }
  );

  const [modules, setModules] = useState<Module[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState({
    userName: "",
    role: "admin",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchAccessModules({ email: "admin@gmail.com", password: "12345678" })
      );
    } else {
      // Reset form when modal closes
      setFormValues({
        userName: "",
        role: "admin",
        email: "",
        password: "",
        phoneNumber: "",
      });
      setModules([]);
      setCurrentStep(1);
      setSubmissionError(null);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (accessModules && accessModules.length > 0 && modules.length === 0) {
      setModules(
        accessModules.map((module) => ({
          key: module.key,
          nameEn: module.nameEn,
          nameAr: module.nameAr,
          hasAccess: module.hasAccess || false,
          subModules: module.subModules?.map((sub) => ({
            key: sub.key,
            nameEn: sub.nameEn,
            nameAr: sub.nameAr,
            hasAccess: sub.hasAccess || false,
          })),
        }))
      );
    }
  }, [accessModules]);

  const handleModuleChange = (moduleKey: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.key === moduleKey
          ? {
              ...module,
              hasAccess: !module.hasAccess,
              subModules: module.subModules?.map((sub) => ({
                ...sub,
                hasAccess: !module.hasAccess ? false : sub.hasAccess,
              })),
            }
          : module
      )
    );
  };

  const handleSubModuleChange = (moduleKey: string, subModuleKey: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.key === moduleKey
          ? {
              ...module,
              subModules: module.subModules?.map((sub) =>
                sub.key === subModuleKey
                  ? { ...sub, hasAccess: !sub.hasAccess }
                  : sub
              ),
            }
          : module
      )
    );
  };

  const handleNext = (values: typeof formValues) => {
    setFormValues(values);
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const result = await dispatch(
        createAdmin({
          ...formValues,
          adminAccess: { modules },
        })
      ).unwrap();
      await dispatch(
        fetchAdmin({ page: 1, perPage: 10, searchTerm: "" })
      ).unwrap();
      onClose();
    } catch (err) {
      setSubmissionError("Failed to create admin. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const initialValues = {
    userName: formValues.userName,
    role: formValues.role,
    email: formValues.email,
    password: formValues.password,
    phoneNumber: formValues.phoneNumber,
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              Create New Admin - Step {currentStep} of 2
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {currentStep === 1 && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleNext}
                enableReinitialize
              >
                {({ isSubmitting: formikSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <Field
                        type="text"
                        name="userName"
                        placeholder="Username"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="userName"
                        component="div"
                        className="text-red-600 text-[0.94rem] mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        as="select"
                        name="role"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" label="Select a role" />
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-red-600 text-[0.94rem] mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-600 text-[0.94rem] mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 text-[0.94rem] mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-600 text-[0.94rem] mt-1"
                      />
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-2">
                      <button
                        type="submit"
                        disabled={formikSubmitting}
                        className="bg-blue-700 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none disabled:opacity-50"
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {currentStep === 2 && (
              <>
                {loading && (
                  <p className="text-gray-400 text-[0.94rem]">Loading...</p>
                )}
                {error && (
                  <p className="text-red-600 text-[0.94rem]">{error}</p>
                )}
                {submissionError && (
                  <p className="text-red-600 text-[0.94rem]">
                    {submissionError}
                  </p>
                )}

                {!loading && !error && modules.length > 0 && (
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div
                        key={index}
                        className="border-b pb-4 border-light-border"
                      >
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={module.hasAccess}
                              onChange={() => handleModuleChange(module.key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                          <h3 className="text-[1.2rem] font-semibold text-white">
                            {module.nameEn} ({module.nameAr})
                          </h3>
                        </div>
                        {module.subModules && module.subModules.length > 0 && (
                          <div className="ml-4 mt-2">
                            <h4 className="text-[1rem] font-medium text-gray-400">
                              Submodules:
                            </h4>
                            <ul className="list-disc ml-6 text-gray-400 text-[0.94rem]">
                              {module.subModules.map((subModule, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="flex items-center gap-2 mb-1"
                                >
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={subModule.hasAccess}
                                      onChange={() =>
                                        handleSubModuleChange(
                                          module.key,
                                          subModule.key
                                        )
                                      }
                                      disabled={!module.hasAccess}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all disabled:opacity-50"></div>
                                  </label>
                                  {subModule.nameEn} ({subModule.nameAr})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!loading && !error && modules.length === 0 && (
                  <p className="text-gray-400 text-[0.94rem]">
                    No access modules available
                  </p>
                )}
                <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-700 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="bg-gray-500 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none disabled:opacity-50"
                  >
                    Previous
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;
