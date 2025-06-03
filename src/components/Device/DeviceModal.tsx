import React, { useEffect } from "react";
import FileUpload from "../ui/UploadFile";
import { CancelIcon } from "../ui";
import { useFormik } from "formik";
import { deviceSchema } from "../../validation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  addDevice,
  fetchDevices,
  updateDevice,
} from "../../app/features/devices/deviceSlice";
import { DeviceType } from "../../app/types";
interface ModalProps {
  show: boolean;
  onClose: () => void;
  selectedDevice: DeviceType | null;
}
export const DeviceModal: React.FC<ModalProps> = ({
  show,
  onClose,
  selectedDevice,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      name: "",
      logo: null,
    },
    validationSchema: deviceSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("logo", values.logo ?? "");
      if (selectedDevice) {
        const resultAction = await dispatch(
          updateDevice({ id: selectedDevice._id, device: formData })
        );
        resetForm();
        onClose();
        if (updateDevice.fulfilled.match(resultAction)) {
          dispatch(fetchDevices({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        const resultAction = await dispatch(addDevice(formData));
        resetForm();
        onClose();
        if (addDevice.fulfilled.match(resultAction)) {
          dispatch(fetchDevices({ page: 1, perPage: 10, searchTerm: "" }));
        }
      }
    },
  });

  useEffect(() => {
    if (selectedDevice) {
      formik.setFieldValue("name", selectedDevice.name);
      formik.setFieldValue("logo", selectedDevice.logo);
    }
  }, [selectedDevice]);

  return (
    <>
      <div
        id="default-modal"
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
                {`${selectedDevice ? "Update" : "Add"} Device`}
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
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
                  {...formik.getFieldProps("name")}
                />
                <label
                  htmlFor="name"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Device name
                </label>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-600">{formik.errors.name}</p>
                )}
              </div>

              <FileUpload
                label="Device Logo"
                id="head_img"
                onChange={(e) =>
                  formik.setFieldValue("logo", e.target.files?.[0])
                }
              />
              {formik.touched.logo && formik.errors.logo && (
                <p className="text-red-600 !m-0 mt-1">{formik.errors.logo}</p>
              )}
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b ">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                className="bg-gray-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none "
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none "
              >
                {`${selectedDevice ? "Update" : "Add"} Device`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DeviceModal;
