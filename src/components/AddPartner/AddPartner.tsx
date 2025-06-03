import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackIcon } from "../ui/index.tsx";
import FileUpload from "../ui/UploadFile.tsx";
import { useFormik } from "formik";
import { addPartnerSchema } from "../../validation/index.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store.ts";
import { addPartner } from "../../app/features/partners/partnerSlice.ts";

export const AddPartner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
      partnerUrl: "",
      shortName: "",
      description: "",
      partnerPic: null,
      backgroundImage: null,
      prizePool: "",
      order: "",
      partnerNews: [],
      partnerSponsors: [],
      websiteUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      youtubeUrl: "",
      twitchUrl: "",
      instagramUrl: "",
      discordUrl: "",
    },
    validationSchema: addPartnerSchema,
    onSubmit: async(values, {resetForm}) => {
      // Your form submission logic here
      console.log(values);
      const formData = new FormData();
      formData.append("nameEn", values.nameEn);
      formData.append("nameAr", values.nameAr);
      formData.append("partnerUrl", values.partnerUrl);
      formData.append("shortName", values.shortName);
      formData.append("description", values.description);
      formData.append("prizePool", values.prizePool);
      formData.append("order", values.order);
      formData.append("partnerPic", values.partnerPic);
      formData.append("backgroundImage", values.backgroundImage);
      for(let item of values.partnerNews){
        formData.append("partnerNewsimages", item.image);
      }
      const newsUrls = values.partnerNews.map(item => item.url);
      console.log("news urls: ", newsUrls)
      formData.append("partnerNewsUrls", JSON.stringify(newsUrls));
      for(let item of values.partnerSponsors){
        formData.append("partnerSponsorsimages", item.image);
      }
      const sponsorUrls = values.partnerSponsors.map(item => item.url);
      formData.append("partnerSponsorsUrls", JSON.stringify(sponsorUrls));
      formData.append("websiteUrl", values.websiteUrl);
      formData.append("facebookUrl", values.facebookUrl);
      formData.append("twitterUrl", values.twitterUrl);
      formData.append("youtubeUrl", values.youtubeUrl);
      formData.append("twitchUrl", values.twitchUrl);
      formData.append("instagramUrl", values.instagramUrl);
      formData.append("discordUrl", values.discordUrl);

      const resultAction = await dispatch(addPartner(formData));
      if(addPartner.fulfilled.match(resultAction)){
        navigate("/admin-control/partners");
        resetForm();
      }
    },
  });

  const { getFieldProps, values, errors, touched } = formik;

  const handleAddNews = () => {
    formik.setFieldValue("partnerNews", [
      ...values.partnerNews,
      { image: null, url: "" },
    ]);
  };

  const handleAddSponsor = () => {
    formik.setFieldValue("partnerSponsors", [
      ...values.partnerSponsors,
      { image: null, url: "" },
    ]);
  };

  return (
    <>
      <div className="nf_leg_steps-block">
        <div className="nf_step_head-con relative flex items-center pb-5 border-b border-light-border">
          <Link
            to={"/admin-control/partners"}
            className="absolute left-0 flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
          >
            <span>
              <BackIcon />
            </span>
            Back
          </Link>
          <h3 className="flex-1 text-white text-center font-bold text-[1.5rem]">
            Add Partner
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
            Partner Name in English
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
            Partner Name in Arabic
          </label>
        </div>

        {/* Partner URL */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("partnerUrl")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Partner URL
          </label>
        </div>

        {/* Short Name */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("shortName")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Short Name
          </label>
          {touched.shortName && errors.shortName && (
            <p className="text-red-600 mt-1">{errors.shortName}</p>
          )}
        </div>

        {/* Partner Description */}
        <div className="relative float-label-input custom-input mb-4">
          <textarea
            placeholder=" "
            rows={4}
            className="border-0 w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("description")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Partner Description
          </label>
        </div>

        {/* Partner Picture */}
        <FileUpload
          label="Partner Picture"
          id={`partner_picture`}
          onChange={(e) => {
            formik.setFieldValue("partnerPic", e.target.files?.[0]);
          }}
        />
        {touched.partnerPic && errors.partnerPic && (
          <p className="text-red-600 mt-1">{errors.partnerPic}</p>
        )}

        {/* Background Image */}
        <FileUpload
          label="Background Image"
          id={`background_image`}
          onChange={(e) => {
            formik.setFieldValue("backgroundImage", e.target.files?.[0]);
          }}
        />
        {touched.backgroundImage && errors.backgroundImage && (
          <p className="text-red-600 mt-1">{errors.backgroundImage}</p>
        )}

        {/* Prize Pool */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("prizePool")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Prize Pool
          </label>
          {touched.prizePool && errors.prizePool && (
            <p className="text-red-600 mt-1">{errors.prizePool}</p>
          )}
        </div>

        {/* Order */}
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="text"
            placeholder=" "
            className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            {...getFieldProps("order")}
          />
          <label className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
            Order
          </label>
          {touched.order && errors.order && (
            <p className="text-red-600 mt-1">{errors.order}</p>
          )}
        </div>

        {/* Partner News */}
        <h4 className="text-white mb-5 text-[1.0625rem] font-medium">
          Partner News
        </h4>
        {values.partnerNews.map((item, index) => (
          <div key={index} className="flex gap-3 mb-4">
            <FileUpload
              label="News Image"
              id={`news_image_${index}`}
              onChange={(e) => {
                formik.setFieldValue(
                  `partnerNews[${index}].image`,
                  e.target.files?.[0]
                );
              }}
            />
            <input
              type="text"
              placeholder="News URL"
              className="block w-full text-[0.94rem] text-white bg-input-color rounded-[0.52rem] px-3"
              onChange={(e) => {
                formik.setFieldValue(
                  `partnerNews[${index}].url`,
                  e.target.value
                );
              }}
              value={values.partnerNews[index]?.url}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddNews} className="text-blue-500">
          + Add News
        </button>

        {/* Partner Sponsors */}
        <h4 className="text-white mb-5 text-[1.0625rem] font-medium">
          Partner Sponsors
        </h4>
        {values.partnerSponsors.map((item, index) => (
          <div key={index} className="flex gap-3 mb-4">
            <FileUpload
              label="Sponsor Image"
              id={`sponsor_image_${index}`}
              onChange={(e) => {
                formik.setFieldValue(
                  `partnerSponsors[${index}].image`,
                  e.target.files?.[0]
                );
              }}
            />
            <input
              type="text"
              placeholder="Sponsor URL"
              className="block w-full text-[0.94rem] text-white bg-input-color rounded-[0.52rem] px-3"
              onChange={(e) => {
                formik.setFieldValue(
                  `partnerSponsors[${index}].url`,
                  e.target.value
                );
              }}
              value={values.partnerSponsors[index]?.url}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSponsor}
          className="text-blue-500"
        >
          + Add Sponsor
        </button>

        {/* Social Media Links */}
        {[
          { key: "websiteUrl", label: "Website" },
          { key: "facebookUrl", label: "Facebook" },
          { key: "twitterUrl", label: "Twitter" },
          { key: "youtubeUrl", label: "YouTube" },
          { key: "twitchUrl", label: "Twitch" },
          { key: "instagramUrl", label: "Instagram" },
          { key: "discordUrl", label: "Discord" },
        ].map((platform) => (
          <div
            className="relative float-label-input custom-input mb-4"
            key={platform.key}
          >
            <input
              type="text"
              placeholder=" "
              className="block w-full text-[0.94rem] text-white bg-input-color rounded-[0.52rem] px-3"
              onChange={(e) => {
                formik.setFieldValue(platform.key, e.target.value);
              }}
              value={values[platform.key]}
            />
            <label className="absolute top-3 left-0 translate-y-[0.2rem] text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
              {platform.label}
            </label>
          </div>
        ))}

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
            Add Partner
          </button>
        </div>
      </form>
    </>
  );
};
