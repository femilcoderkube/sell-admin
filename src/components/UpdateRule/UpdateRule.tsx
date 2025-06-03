import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BackIcon } from "../ui/index.tsx";
import { useFormik } from "formik";
import { addRuleSchema } from "../../validation/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store.ts";
import {
  fetchRulesById,
  updateRules,
} from "../../app/features/rules/ruleSlice.ts";

export const UpdateRule: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { ruleDetail } = useSelector((state: RootState) => state.rule);

  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
    },
    validationSchema: addRuleSchema,
    onSubmit: async (values, { resetForm }) => {
      // Your form submission logic here
      console.log(values);
      const bodyData: any = {
        titleEn: values.nameEn,
        titleAr: values.nameAr,
      };

      const resultAction = await dispatch(
        updateRules({ id: id, rule: bodyData })
      );
      if (updateRules.fulfilled.match(resultAction)) {
        navigate("/admin-control/rules");
        resetForm();
      }
    },
  });

  const { getFieldProps, values, errors, touched } = formik;

  useEffect(() => {
    console.log("id: ", id);
    if (id) {
      dispatch(fetchRulesById(id));
    }
  }, [id]);

  useEffect(() => {
    if (ruleDetail) {
      formik.setFieldValue("nameEn", ruleDetail.titleEn);
      formik.setFieldValue("nameAr", ruleDetail.titleAr);
    }
  }, [ruleDetail]);

  return (
    <>
      <div className="nf_leg_steps-block">
        <div className="nf_step_head-con relative flex items-center pb-5 border-b border-light-border">
          <Link
            to={"/admin-control/rules"}
            className="absolute left-0 flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
          >
            <span>
              <BackIcon />
            </span>
            Back
          </Link>
          <h3 className="flex-1 text-white text-center font-bold text-[1.5rem]">
            Update Rule
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

        {/* Partner Name English */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("nameEn")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Rule Title in English
          </label>
          {touched.nameEn && errors.nameEn && (
            <p className="text-red-600 mt-1">{errors.nameEn}</p>
          )}
        </div>

        {/* Partner Name Arabic */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("nameAr")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Rule Title in Arabic
          </label>
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
            Update Rule
          </button>
        </div>
      </form>
    </>
  );
};
