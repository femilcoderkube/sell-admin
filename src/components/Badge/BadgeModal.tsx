import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addBadges, updateBadges, fetchBadges } from "../../app/features/badge/badgeSlice";
import { addBadgeSchema } from "../../validation";
import { BadgeType } from "../../app/types";
import { CancelIcon } from "../ui";
import { baseURL } from "../../axios";

interface BadgeModalProps {
  show: boolean;
  onClose: () => void;
  selectedBadge: BadgeType | null;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ show, onClose, selectedBadge }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isNewLogo, setIsNewLogo] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      descriptionEN: "",
      descriptionAR: "",
      logo: null as File | string | null,
    },
    validationSchema: addBadgeSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("descriptionEN", values.descriptionEN);
      formData.append("descriptionAR", values.descriptionAR);
      if (selectedBadge) {
        if (values.logo && typeof values.logo !== "string") {
          formData.append("logo", values.logo);
        }
        const result = await dispatch(updateBadges({ id: selectedBadge._id, badge: formData }));
        if (updateBadges.fulfilled.match(result)) {
          resetForm();
          setLogoPreview(null);
          setFileName("");
          setIsNewLogo(false);
          onClose();
          dispatch(fetchBadges({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        if (!values.logo || typeof values.logo === "string") {
          return;
        }
        formData.append("logo", values.logo);
        const result = await dispatch(addBadges(formData));
        if (addBadges.fulfilled.match(result)) {
          resetForm();
          setLogoPreview(null);
          setFileName("");
          setIsNewLogo(false);
          onClose();
          dispatch(fetchBadges({ page: 1, perPage: 10, searchTerm: "" }));
        }
      }
    },
  });

  useEffect(() => {
    if (selectedBadge) {
      formik.setValues({
        name: selectedBadge.name || "",
        descriptionEN: selectedBadge.descriptionEN || "",
        descriptionAR: selectedBadge.descriptionAR || "",
        logo: selectedBadge.logo || null,
      });
      if (selectedBadge.logo && !isNewLogo) {
        setLogoPreview(baseURL + "/api/v1/" + selectedBadge.logo);
        const urlParts = selectedBadge.logo.split("/");
        setFileName(urlParts[urlParts.length - 1]);
      }
    } else {
      setLogoPreview(null);
      setFileName("");
      setIsNewLogo(false);
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [selectedBadge]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("logo", file);
      setFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      setIsNewLogo(true);
    }
  };

  return (
    <div
      aria-hidden={!show}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="relative p-4 w-full max-w-lg max-h-full mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              {`${selectedBadge ? "Update" : "Add"} Badge`}
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => {
                formik.resetForm();
                setLogoPreview(null);
                setFileName("");
                setIsNewLogo(false);
                onClose();
              }}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Badge Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 text-sm">{formik.errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Description (EN) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="descriptionEN"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                {...formik.getFieldProps("descriptionEN")}
              />
              {formik.touched.descriptionEN && formik.errors.descriptionEN && (
                <p className="text-red-600 text-sm">{formik.errors.descriptionEN}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Description (AR)</label>
              <input
                type="text"
                name="descriptionAR"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                {...formik.getFieldProps("descriptionAR")}
              />
              {formik.touched.descriptionAR && formik.errors.descriptionAR && (
                <p className="text-red-600 text-sm">{formik.errors.descriptionAR}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Logo <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="logo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input-color border-light-border hover:bg-gray-700 transition-all"
                  >
                    {logoPreview ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                        <img 
                          src={logoPreview} 
                          alt="Badge Logo Preview" 
                          className="max-w-full max-h-24 object-contain mb-2"
                        />
                        <p className="text-xs text-gray-400 truncate w-full text-center px-2">
                          {fileName}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
                      </div>
                    )}
                    <input 
                      id="logo-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              {formik.touched.logo && formik.errors.logo && (
                <p className="text-red-600 text-sm">{formik.errors.logo as string}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setLogoPreview(null);
                setFileName("");
                setIsNewLogo(false);
                onClose();
              }}
              className="bg-gray-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none"
            >
              {`${selectedBadge ? "Update" : "Add"} Badge`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BadgeModal;

export type { BadgeType }; 