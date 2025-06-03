import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackIcon } from "../ui/index.tsx";
import { useFormik } from "formik";
import { addBadgeSchema } from "../../validation/index.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store.ts";
import { addRules } from "../../app/features/rules/ruleSlice.ts";
import { addBadges } from "../../app/features/badge/badgeSlice.ts";
import FileUpload from "../ui/UploadFile.tsx";

export const AddBadge: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      descriptionEN: "",
      descriptionAR: "",
      logo: null,
    },
    validationSchema: addBadgeSchema,
    onSubmit: async (values, { resetForm }) => {
      // Your form submission logic here
      console.log(values);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("descriptionEN", values.descriptionEN);
      formData.append("descriptionAR", values.descriptionAR);
      if (values.logo) {
        formData.append("logo", values.logo); // Only append logo if it exists
      }

      const resultAction = await dispatch(addBadges(formData));
      if (addBadges.fulfilled.match(resultAction)) {
        navigate("/admin-control/badge");
        resetForm();
      }
    },
  });

  const { getFieldProps, values, errors, touched } = formik;

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
            Add Badge
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
          <FileUpload
            label="Logo"
            id="head_img"
            onChange={(e) => formik.setFieldValue("logo", e.target.files?.[0])}
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
            Add Badge
          </button>
        </div>
      </form>
    </>
  );
};
