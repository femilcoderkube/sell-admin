import React, { useEffect, useState } from "react";
import FileUpload from "../ui/UploadFile";
import { CancelIcon } from "../ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { baseURL } from "../../axios";

const ROLES = [
  "Player",
  "Referee",
  "Couch",
  "Team Manager",
  "Club admin",
  "Analyst",
  "Caster",
  "Host",
  "Media outlet",
  "Video Editor",
  "Graphic Designer",
  "Streamer",
  "Frontend creator",
  "Game developer",
  "Tournament Organizer",
  "Club Owner",
];

const SOCIAL_FIELDS = [
  { key: "discord", label: "Discord (Username)" },
  { key: "x", label: "X (Twitter)" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "Youtube" },
  { key: "twitch", label: "Twitch" },
  { key: "kick", label: "Kick" },
];

interface UsersModelProps {
  show: boolean;
  onClose: () => void;
  selectedUser: any;
  onSave: (form: any) => void;
}

// const Switch = ({
//   checked,
//   onChange,
//   id,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   id: string;
// }) => (
//   <button
//     type="button"
//     id={id}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
//       checked ? "bg-blue-600" : "bg-gray-400"
//     }`}
//     onClick={() => onChange(!checked)}
//     aria-pressed={checked}
//   >
//     <span className="sr-only">Toggle</span>
//     <span
//       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
//         checked ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// Validation schema for firstName, lastName, role, gender, and conditionally email, username, and password
const getValidationSchema = (isAddUser: boolean) =>
  Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .matches(/^\S.*\S$/, "Name cannot start or end with spaces"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .matches(/^\S.*\S$/, "Name cannot start or end with spaces"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
    phone: Yup.string().required("Phone is required"),
    nationality: Yup.string().required("Nationality is required"),
    ...(isAddUser && {
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .matches(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        ),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
  });

const UsersModel: React.FC<UsersModelProps> = ({
  show,
  onClose,
  selectedUser,
  onSave,
}) => {
  const [profilePicPreview, setProfilePicPreview] = useState<
    string | undefined
  >(undefined);
  const [profilePicFileName, setProfilePicFileName] = useState<string>("");

  const isAddUser = !selectedUser; // Determine if adding a new user

  const formik = useFormik({
    initialValues: {
      firstName: selectedUser?.firstName || "",
      lastName: selectedUser?.lastName || "",
      dateOfBirth: selectedUser?.dateOfBirth
        ? selectedUser.dateOfBirth.slice(0, 10)
        : "",
      gender: selectedUser?.gender || "",
      phone: selectedUser?.phone || "",
      nationality: selectedUser?.nationality || "",
      role: selectedUser?.role || ROLES[0],
      profilePicture: null as File | null,
      socialMediaHandles: selectedUser?.socialMediaHandles || {},
      // isBanned: selectedUser?.isBanned || false,
      profilePictureUrl: selectedUser?.profilePicture || "",
      email: selectedUser?.email || "",
      username: selectedUser?.username || "",
      password: "", // Added password
    },
    enableReinitialize: true,
    validationSchema: getValidationSchema(isAddUser),
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedUser?.profilePicture) {
      if (typeof selectedUser.profilePicture === "string") {
        setProfilePicPreview(
          baseURL + "/api/v1/" + selectedUser.profilePicture
        );
        const urlParts = selectedUser.profilePicture.split("/");
        setProfilePicFileName(urlParts[urlParts.length - 1]);
      } else if (selectedUser.profilePicture instanceof File) {
        const objectUrl = URL.createObjectURL(selectedUser.profilePicture);
        setProfilePicPreview(objectUrl);
        setProfilePicFileName(selectedUser.profilePicture.name);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setProfilePicPreview(undefined);
      setProfilePicFileName("");
    }
  }, [selectedUser]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("profilePicture", file);
      setProfilePicFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setProfilePicPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      formik.setFieldValue("profilePicture", null);
      setProfilePicPreview(undefined);
      setProfilePicFileName("");
    }
  };

  if (!show) return null;
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
        className="relative p-4 w-full max-w-2xl max-h-[90vh] mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              {selectedUser ? "Edit User" : "Add User"}
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isAddUser && (
                <>
                  <div className="relative float-label-input custom-input mb-4">
                    <input
                      type="email"
                      id="email"
                      placeholder=" "
                      className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        formik.touched.email && formik.errors.email
                          ? "border border-red-500"
                          : "focus:!border focus:!border-highlight-color"
                      }`}
                      {...formik.getFieldProps("email")}
                    />
                    <label
                      htmlFor="email"
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Email
                    </label>
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-xs mt-1">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div className="relative float-label-input custom-input mb-4">
                    <input
                      type="text"
                      id="username"
                      placeholder=" "
                      className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        formik.touched.username && formik.errors.username
                          ? "border border-red-500"
                          : "focus:!border focus:!border-highlight-color"
                      }`}
                      {...formik.getFieldProps("username")}
                    />
                    <label
                      htmlFor="username"
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Username
                    </label>
                    {formik.touched.username && formik.errors.username && (
                      <div className="text-red-500 text-xs mt-1">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>
                  <div className="relative float-label-input custom-input mb-4">
                    <input
                      type="password"
                      id="password"
                      placeholder=" "
                      className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        formik.touched.password && formik.errors.password
                          ? "border border-red-500"
                          : "focus:!border focus:!border-highlight-color"
                      }`}
                      {...formik.getFieldProps("password")}
                    />
                    <label
                      htmlFor="password"
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Password
                    </label>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-500 text-xs mt-1">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="firstName"
                  placeholder=" "
                  className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                    formik.touched.firstName && formik.errors.firstName
                      ? "border border-red-500"
                      : "focus:!border focus:!border-highlight-color"
                  }`}
                  {...formik.getFieldProps("firstName")}
                />
                <label
                  htmlFor="firstName"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  First Name
                </label>
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="lastName"
                  placeholder=" "
                  className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                    formik.touched.lastName && formik.errors.lastName
                      ? "border border-red-500"
                      : "focus:!border focus:!border-highlight-color"
                  }`}
                  {...formik.getFieldProps("lastName")}
                />
                <label
                  htmlFor="lastName"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Last Name
                </label>
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="date"
                  id="dateOfBirth"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  {...formik.getFieldProps("dateOfBirth")}
                />
                <label
                  htmlFor="dateOfBirth"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Date of Birth
                </label>
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <select
                  id="gender"
                  className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                    formik.touched.gender && formik.errors.gender
                      ? "border border-red-500"
                      : "focus:!border focus:!border-highlight-color"
                  } ${formik.values.gender ? "pt-[1.5rem]" : "pt-[0.35rem]"}`}
                  {...formik.getFieldProps("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label
                  htmlFor="gender"
                  className={`absolute left-3 transition-all duration-200 text-[0.94rem] font-bold text-custom-gray pointer-events-none ${
                    formik.values.gender
                      ? "top-1 -translate-y-0.5 font-normal text-[13px]"
                      : "top-1/2 -translate-y-1/2"
                  }`}
                >
                  Gender
                </label>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.gender}
                  </div>
                )}
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="phone"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  {...formik.getFieldProps("phone")}
                />
                <label
                  htmlFor="phone"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Phone
                </label>
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="nationality"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  {...formik.getFieldProps("nationality")}
                />
                <label
                  htmlFor="nationality"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Nationality
                </label>
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <select
                  id="role"
                  className={`w-full text-[0.94rem] text-white focus:outline-0 pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                    formik.touched.role && formik.errors.role
                      ? "border border-red-500"
                      : "focus:!border focus:!border-highlight-color"
                  } ${formik.values.role ? "pt-[1.5rem]" : "pt-[0.35rem]"}`}
                  {...formik.getFieldProps("role")}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="role"
                  className={`absolute left-3 transition-all duration-200 text-[0.94rem] font-bold text-custom-gray pointer-events-none ${
                    formik.values.role
                      ? "top-1 -translate-y-0.5 font-normal text-[13px]"
                      : "top-1/2 -translate-y-1/2"
                  }`}
                >
                  Role
                </label>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.role}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 mb-4">
                <FileUpload
                  label="Profile Picture"
                  id="profilePicture"
                  onChange={handleProfilePicChange}
                  fileName={profilePicFileName}
                  previewUrl={profilePicPreview}
                  ismandatory={false}
                />
              </div>
              {/* <div className="flex items-center gap-2 mb-4">
                <Switch
                  checked={formik.values.isBanned}
                  onChange={(v) => formik.setFieldValue("isBanned", v)}
                  id="isBanned"
                />
                <label htmlFor="isBanned" className="text-white">
                  Is Banned
                </label>
              </div> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {SOCIAL_FIELDS.map(({ key, label }) => (
                <div
                  key={key}
                  className="relative float-label-input custom-input mb-4"
                >
                  <input
                    type="text"
                    id={key}
                    placeholder=" "
                    className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                    value={formik.values.socialMediaHandles?.[key] || ""}
                    onChange={(e) =>
                      formik.setFieldValue("socialMediaHandles", {
                        ...formik.values.socialMediaHandles,
                        [key]: e.target.value,
                      })
                    }
                  />
                  <label
                    htmlFor={key}
                    className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
              className="bg-gray-400 w-1/2 text-white hover:bg-gray-500 font-medium rounded-lg text-[0.94rem] px-5 py-3 me-2 duration-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 w-1/2 text-white hover:bg-blue-700 duration-200 font-medium rounded-lg text-[0.94rem] px-5 py-3 focus:outline-none"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UsersModel;
