import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BackIcon } from "../ui/index.tsx";
import { useFormik } from "formik";
import { addBadgeSchema } from "../../validation/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store.ts";
import {
  fetchBadgesById,
  updateBadges,
} from "../../app/features/badge/badgeSlice.ts";
import FileUpload from "../ui/UploadFile.tsx";
import { baseURL } from "../../axios.ts";

export const UpdateBadge: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const { badgeDetail } = useSelector((state: RootState) => state.badge);
  const formik = useFormik({
    initialValues: {
      name: "",
      descriptionEN: "",
      descriptionAR: "",
      logo: "",
    },
    validationSchema: addBadgeSchema,
    onSubmit: async (values, { resetForm }) => {
      // Your form submission logic here
      console.log(values);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("descriptionEN", values.descriptionEN);
      formData.append("descriptionAR", values.descriptionAR);
      if (values?.logo) {
        if (values?.logo instanceof File) {
          formData.append("logo", values.logo); // New file uploaded
        } else {
          formData.append("logo", values.logo); // Existing URL (adjust key if needed)
        }
      }

      const resultAction = await dispatch(
        updateBadges({ id: id, badge: formData })
      );
      if (updateBadges.fulfilled.match(resultAction)) {
        navigate("/admin-control/badge");
        resetForm();
      }
    },
  });

  const { getFieldProps, values, errors, touched } = formik;
  console.log("values", values?.logo);

  useEffect(() => {
    console.log("id: ", id);
    if (id) {
      dispatch(fetchBadgesById(id));
    }
  }, [id]);

  useEffect(() => {
    if (badgeDetail) {
      formik.setFieldValue("name", badgeDetail.name);
      formik.setFieldValue("descriptionEN", badgeDetail.descriptionEN);
      formik.setFieldValue("descriptionAR", badgeDetail.descriptionAR);
      formik.setFieldValue("logo", badgeDetail.logo);
      setPreviewUrl(badgeDetail.logo);
    }
  }, [badgeDetail]);

  return (
    <>
      <div className="nf_leg_steps-block">
        <div className="nf_step_head-con relative flex items-center pb-5 border-b border-light-border">
          <Link
            to={"/admin-control/badge"}
            className="absolute left-0 flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
          >
            <span>
              <BackIcon />
            </span>
            Back
          </Link>
          <h3 className="flex-1 text-white text-center font-bold text-[1.5rem]">
            Update Badge
          </h3>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="max-w-[42.5rem] mx-auto genral_form-info mb-4 mt-4"
      >
        <h4 className="text-white mb-5 text-[1.0625rem] font-medium text-center">
          General Information
        </h4>
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("name")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Name
          </label>
          {touched.name && errors.name && (
            <p className="text-red-600 mt-1">{errors.name}</p>
          )}
        </div>
        {/* Partner Name English */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("descriptionEN")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Description Title in English
          </label>
          {touched.descriptionEN && errors.descriptionEN && (
            <p className="text-red-600 mt-1">{errors.descriptionEN}</p>
          )}
        </div>

        {/* Partner Name Arabic */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("descriptionAR")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Description Title in Arabic
          </label>
        </div>
        <div className="relative float-label-input custom-input mb-4">
          <div className="mb-2">
            <p className="text-white">
              {newPreviewUrl ? "Uploaded Logo Preview:" : "Current Logo:"}
            </p>
            <img
              src={
                newPreviewUrl
                  ? newPreviewUrl
                  : `${baseURL}/api/v1/${previewUrl}`
              }
              alt={newPreviewUrl ? "Uploaded Badge Logo" : "Current Badge Logo"}
              className="w-32 h-32 object-cover rounded"
            />
          </div>
          <FileUpload
            label="Logo"
            id="head_img"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                formik.setFieldValue("logo", file);
                const newPreviewUrl = URL.createObjectURL(file);
                setNewPreviewUrl(newPreviewUrl);
              }
            }}
          />
          {formik.touched.logo && formik.errors.logo && (
            <p className="text-red-600 !m-0 mt-1">{formik.errors.logo}</p>
          )}
        </div>

        <div className="flex">
          <button
            type="button"
            className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none "
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-gradientw-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none "
          >
            Update Badge
          </button>
        </div>
      </form>
    </>
  );
};
