import React, { useState, useEffect, useRef } from "react";
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
import { checkAdminExists } from "../../app/features/admins/adminSlice";
import { AppDispatch } from "../../app/store";
import toast from "react-hot-toast";

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
  { value: "Operator", label: "Operator" },
];

// Cache for validation results to avoid duplicate API calls
const validationCache = new Map<
  string,
  { result: boolean; timestamp: number }
>();
const CACHE_DURATION = 30000; // 30 seconds

// Password generation utility
const generateStrongPassword = (length: number = 12): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = lowercase + uppercase + numbers + symbols;

  // Ensure at least one character from each category
  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// Password strength checker
const checkPasswordStrength = (
  password: string
): { strength: string; color: string; percentage: number } => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 1;

  if (score <= 2)
    return { strength: "Weak", color: "bg-red-500", percentage: 25 };
  if (score <= 4)
    return { strength: "Medium", color: "bg-yellow-500", percentage: 50 };
  if (score <= 5)
    return { strength: "Strong", color: "bg-green-500", percentage: 75 };
  return { strength: "Very Strong", color: "bg-green-600", percentage: 100 };
};

// Eye icons for show/hide password
const EyeIcon = () => (
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
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
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const createValidationSchema = (dispatch: AppDispatch) => {
  const checkWithCache = async (
    key: string,
    checkFn: () => Promise<boolean>
  ) => {
    const cached = validationCache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }

    const result = await checkFn();
    validationCache.set(key, { result, timestamp: now });
    return result;
  };

  const validateUsername = async (value: string) => {
    if (!value || value.length < 3) return true;

    return checkWithCache(`username_${value}`, async () => {
      try {
        const resultAction = await dispatch(
          checkAdminExists({ userName: value })
        );
        if (checkAdminExists.fulfilled.match(resultAction)) {
          return resultAction.payload.data;
        }
        return false;
      } catch (error) {
        console.error("Error checking username existence:", error);
        return false;
      }
    });
  };

  const validateEmail = async (value: string) => {
    if (!value) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return true;

    return checkWithCache(`email_${value}`, async () => {
      try {
        const resultAction = await dispatch(checkAdminExists({ email: value }));
        if (checkAdminExists.fulfilled.match(resultAction)) {
          return resultAction.payload.data;
        }
        return false;
      } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
      }
    });
  };

  return Yup.object({
    userName: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .test(
        "check-username-exists",
        "Username already exists",
        validateUsername
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test("check-email-exists", "Email already exists", validateEmail),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    phoneNumber: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
      .required("Phone number is required"),
    role: Yup.string()
      .required("Role is required")
      .oneOf(
        roleOptions.map((option) => option.value),
        "Invalid role selected"
      ),
  });
};

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch: AppDispatch = useDispatch();
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
  const [validationSchema, setValidationSchema] = useState(() =>
    createValidationSchema(dispatch)
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  // Password visibility and generation states
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "",
    color: "",
    percentage: 0,
  });

  const formikRef = useRef<any>(null);

  useEffect(() => {
    setValidationSchema(createValidationSchema(dispatch));
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAccessModules(formValues?.role));
      // Clear validation cache when modal opens
      validationCache.clear();
    } else {
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
      setExpandedModules(new Set());
      setShowPassword(false);
      setPasswordStrength({ strength: "", color: "", percentage: 0 });
    }
  }, [isOpen, dispatch, formValues?.role]);

  useEffect(() => {
    if (accessModules && accessModules.length > 0 && modules.length === 0) {
      const mappedModules = accessModules.map((module) => ({
        key: module.key,
        nameEn: module.nameEn,
        nameAr: module.nameAr,
        partnerColor: module.partnerColor,
        isPartner: module.isPartner || false,
        partnerId: module.partnerId || null,
        hasAccess: module.hasAccess || false,
        subModules: module.subModules?.map((sub) => ({
          key: sub.key,
          nameEn: sub.nameEn,
          nameAr: sub.nameAr,
          hasAccess: sub.hasAccess || false,
        })),
      }));

      setModules(mappedModules);

      // Auto-expand modules that have access
      const expanded = new Set<string>();
      mappedModules.forEach((module) => {
        if (module.hasAccess) {
          expanded.add(module.key);
        }
      });
      setExpandedModules(expanded);
    }
  }, [accessModules, modules.length]);

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

    // Toggle expanded state
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleKey)) {
        newSet.delete(moduleKey);
      } else {
        newSet.add(moduleKey);
      }
      return newSet;
    });
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

  const toggleModuleExpansion = (moduleKey: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleKey)) {
        newSet.delete(moduleKey);
      } else {
        newSet.add(moduleKey);
      }
      return newSet;
    });
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
      toast.success(`${formValues?.role?.toLowerCase()} created successfully`)
      await dispatch(
        fetchAdmin({ page: 1, perPage: 10, searchTerm: "" })
      ).unwrap();
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to create admin. Please try again.";
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePassword = (setFieldValue: any) => {
    const newPassword = generateStrongPassword();
    setFieldValue("password", newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const password = e.target.value;
    setFieldValue("password", password);
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength({ strength: "", color: "", percentage: 0 });
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
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      <div className="relative p-4 w-full max-w-4xl max-h-full mx-auto">
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

          <div className="p-4 md:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {currentStep === 1 && (
              <Formik
                ref={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleNext}
                enableReinitialize
                validateOnChange={true}
                validateOnBlur={true}
              >
                {({
                  isSubmitting: formikSubmitting,
                  setFieldTouched,
                  setFieldError,
                  values,
                  errors,
                  setFieldValue,
                }) => (
                  <Form className="space-y-4">
                    <div>
                      <Field
                        type="text"
                        name="userName"
                        placeholder="Username"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          setFieldTouched("userName", true);
                          // Clear previous error when user starts typing again
                          if (
                            errors.userName &&
                            e.target.value !== values.userName
                          ) {
                            setFieldError("userName", undefined);
                          }
                        }}
                      />
                      <ErrorMessage
                        name="userName"
                        component="div"
                        className="text-red-400 text-sm mt-1 animate-fade-in"
                      />
                    </div>
                    <div>
                      <Field
                        as="select"
                        name="role"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onChange={(e: any) => {
                          const newRole = e.target.value;
                          setFieldValue("role", newRole);
                          setFormValues((prev) => ({
                            ...prev,
                            role: newRole,
                          }));
                        }}
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
                        className="text-red-400 text-sm mt-1 animate-fade-in"
                      />
                    </div>
                    <div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          setFieldTouched("email", true);
                          // Clear previous error when user starts typing again
                          if (errors.email && e.target.value !== values.email) {
                            setFieldError("email", undefined);
                          }
                        }}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-400 text-sm mt-1 animate-fade-in"
                      />
                    </div>

                    {/* Enhanced Password Field */}
                    <div>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="w-full p-3 pr-20 rounded-lg bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handlePasswordChange(e, setFieldValue)
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          {/* Generate Password Button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleGeneratePassword(setFieldValue)
                            }
                            className="px-2 py-1 mr-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                            title="Generate Strong Password"
                          >
                            <RefreshIcon />
                          </button>
                          {/* Show/Hide Password Button */}
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-3 py-1 text-gray-400 hover:text-white transition-colors duration-200"
                            title={
                              showPassword ? "Hide Password" : "Show Password"
                            }
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>

                      {/* Password Strength Indicator */}
                      {values.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">
                              Password Strength:
                            </span>
                            <span
                              className={`text-xs font-medium ${passwordStrength.strength === "Weak"
                                ? "text-red-400"
                                : passwordStrength.strength === "Medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                                }`}
                            >
                              {passwordStrength.strength}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{
                                width: `${passwordStrength.percentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-400 text-sm mt-1 animate-fade-in"
                      />

                      {/* Password Requirements */}
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Password must contain:</p>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li
                            className={
                              values.password?.length >= 8
                                ? "text-green-400"
                                : ""
                            }
                          >
                            • At least 8 characters
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(values.password || "")
                                ? "text-green-400"
                                : ""
                            }
                          >
                            • One uppercase letter
                          </li>
                          <li
                            className={
                              /[a-z]/.test(values.password || "")
                                ? "text-green-400"
                                : ""
                            }
                          >
                            • One lowercase letter
                          </li>
                          <li
                            className={
                              /\d/.test(values.password || "")
                                ? "text-green-400"
                                : ""
                            }
                          >
                            • One number
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <Field
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-400 text-sm mt-1 animate-fade-in"
                      />
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-3 mt-6">
                      <button
                        type="submit"
                        disabled={formikSubmitting}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 w-full text-white hover:from-blue-700 hover:to-blue-800 font-medium rounded-lg text-sm px-5 py-3 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next Step
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-600 w-full text-white hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-3 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
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
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Admin Access Permissions
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Configure module access permissions for the new admin. Click
                    on modules to expand and configure submodule permissions.
                  </p>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-400">
                      Loading modules...
                    </span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {submissionError && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
                    <p className="text-red-400 text-sm">{submissionError}</p>
                  </div>
                )}

                {!loading && !error && modules.length > 0 && (
                  <div className="space-y-3">
                    {modules.map((module) => (
                      <div
                        key={module.key}
                        className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden transition-all duration-200 hover:border-gray-600"
                      >
                        {/* Module Header */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={module.hasAccess}
                                  onChange={() =>
                                    handleModuleChange(module.key)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-200"></div>
                              </label>
                              <div>
                                <h3 className="text-lg font-medium text-white">
                                  {module.nameEn}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {module.nameAr}
                                </p>
                              </div>
                            </div>

                            {module.subModules &&
                              module.subModules.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleModuleExpansion(module.key)
                                  }
                                  className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                  <svg
                                    className={`w-5 h-5 transform transition-transform duration-200 ${expandedModules.has(module.key)
                                      ? "rotate-180"
                                      : ""
                                      }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              )}
                          </div>

                          {module.subModules &&
                            module.subModules.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                {
                                  module.subModules.filter(
                                    (sub) => sub.hasAccess
                                  ).length
                                }{" "}
                                of {module.subModules.length} submodules enabled
                              </div>
                            )}
                        </div>

                        {/* Submodules */}
                        {module.subModules &&
                          module.subModules.length > 0 &&
                          expandedModules.has(module.key) && (
                            <div className="border-t border-gray-700 bg-gray-900/30">
                              <div className="p-4 space-y-3">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">
                                  Submodule Permissions
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {module.subModules.map((subModule) => (
                                    <div
                                      key={subModule.key}
                                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${module.hasAccess
                                        ? "bg-gray-800 border-gray-600 hover:border-gray-500"
                                        : "bg-gray-800/50 border-gray-700 opacity-50"
                                        }`}
                                    >
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={
                                            subModule.hasAccess &&
                                            module.hasAccess
                                          }
                                          onChange={() =>
                                            handleSubModuleChange(
                                              module.key,
                                              subModule.key
                                            )
                                          }
                                          disabled={!module.hasAccess}
                                          className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all duration-200 peer-disabled:opacity-50"></div>
                                      </label>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                          {subModule.nameEn}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                          {subModule.nameAr}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}

                {!loading && !error && modules.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📋</div>
                    <p className="text-gray-400 text-lg">
                      No access modules available
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Contact your administrator to configure access modules.
                    </p>
                  </div>
                )}

                <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-green-700 w-full text-white hover:from-green-700 hover:to-green-800 font-medium rounded-lg text-sm px-5 py-3 duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Admin...
                      </span>
                    ) : (
                      "Create Admin"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="bg-gray-600 w-full text-white hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-3 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous Step
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
