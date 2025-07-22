import React, { useEffect, useState } from "react";
import { CancelIcon } from "../ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdminType } from "../../app/types";
import { fetchAdmin, updateAdmin } from "../../app/features/admins/adminSlice";
import toast from "react-hot-toast";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  selectedAdmin: AdminType | null;
}

// Define available roles
const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "Operator", label: "Operator" },
];

// Validation schema
const adminSchema = Yup.object({
  userName: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  role: Yup.string()
    .required("Role is required")
    .oneOf(["admin", "Operator"], "Invalid role selected"),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  // isActive: Yup.boolean().required("Active status is required"),
});

export const EditAdminModal: React.FC<ModalProps> = ({
  show,
  onClose,
  selectedAdmin,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (selectedAdmin) {
      // Get admin data from localStorage
      const adminData = localStorage.getItem("admin");
      let currentUserRole = "";

      if (adminData) {
        try {
          const parsedAdminData = JSON.parse(adminData);
          currentUserRole = parsedAdminData.role;
        } catch (error) {
          console.error("Error parsing admin data from localStorage", error);
        }
      }

      if (
        currentUserRole === "Superadmin" ||
        currentUserRole === "superadmin"
      ) {
        // SuperAdmin can edit both Admin and Operator
        setCanEdit(true);
      } else if (
        currentUserRole === "admin" &&
        selectedAdmin.role === "Operator"
      ) {
        // Admin can only edit Operator
        setCanEdit(true);
      } else {
        // Operator cannot edit anyone
        setCanEdit(false);
      }
    }
  }, [selectedAdmin]);

  const formik = useFormik({
    initialValues: {
      userName: selectedAdmin?.userName || "",
      role: selectedAdmin?.role || "",
      phoneNumber: selectedAdmin?.phoneNumber || "",
      // isActive: selectedAdmin?.isActive ?? true,
    },
    validationSchema: adminSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!selectedAdmin || !canEdit) return;

      const data = {
        userName: values.userName,
        role: values.role,
        phoneNumber: values.phoneNumber,
        // isActive: values.isActive,
      };

      const resultAction = await dispatch(
        updateAdmin({ id: selectedAdmin._id, admin: data })
      );

      if (updateAdmin.fulfilled.match(resultAction)) {
        toast.success(`${values?.role?.toLowerCase()} created successfully`);
        dispatch(fetchAdmin({ page: 1, perPage: 10, searchTerm: "" }));
        onClose();
      }
    },
  });
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
    <>
      <div
        id="edit-admin-modal"
        aria-hidden={!show}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="relative p-4 w-full max-w-sm max-h-full mx-auto"
        >
          <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
            <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
              <h3 className="text-[1.5rem] font-semibold text-white text-center">
                Edit Admin
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

            <div className="p-4 md:p-5 space-y-4">
              {!canEdit ? (
                <div className="text-red-500 text-center">
                  You don't have permission to edit this admin.
                </div>
              ) : (
                <>
                  <div className="relative float-label-input custom-input mb-4">
                    <input
                      type="text"
                      id="userName"
                      placeholder=" "
                      className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                      {...formik.getFieldProps("userName")}
                    />
                    <label
                      htmlFor="userName"
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Username
                    </label>
                    {formik.touched.userName && formik.errors.userName && (
                      <p className="text-red-600 !m-0 mt-1">
                        {formik.errors.userName}
                      </p>
                    )}
                  </div>

                  <div className="relative float-label-input custom-input mb-4">
                    <select
                      id="role"
                      className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                      {...formik.getFieldProps("role")}
                    >
                      <option value="">Select a role</option>
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="role"
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Role
                    </label>
                    {formik.touched.role && formik.errors.role && (
                      <p className="text-red-600 !m-0 mt-1">
                        {formik.errors.role}
                      </p>
                    )}
                  </div>

                  <div className="relative float-label-input custom-input mb-4">
                    <input
                      type="text"
                      id="phoneNumber"
                      placeholder=" "
                      className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                      {...formik.getFieldProps("phoneNumber")}
                    />
                    <label
                      htmlFor="phoneNumber"
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Phone Number
                    </label>
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <p className="text-red-600 !m-0 mt-1">
                          {formik.errors.phoneNumber}
                        </p>
                      )}
                  </div>

                  {/* <div className="flex items-center mb-4">
                    <label htmlFor="isActive" className="text-white mr-3 ml-3">
                      Is Active
                    </label>
                    <Switch
                      checked={formik.values.isActive}
                      onChange={() => {
                        formik.setFieldValue(
                          "isActive",
                          !formik.values.isActive
                        );
                      }}
                      id="isActive"
                    />
                  </div> */}
                </>
              )}
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                className="bg-gray-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canEdit}
                className="bg-primary-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none disabled:opacity-50"
              >
                Update Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAdminModal;
