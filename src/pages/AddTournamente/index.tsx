import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { Layout } from "../../components/layout";
import ModalPopUp from "../../components/ui/ModalPopUp";
import FileUpload from "../../components/ui/UploadFile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fetchGames } from "../../app/features/games/gameSlice";
import { fetchPartners } from "../../app/features/partners/partnerSlice"; // Added partner fetch
import { fetchDevices } from "../../app/features/devices/deviceSlice";
import { uploadFile } from "../../app/features/fileupload/fileUploadSlice";
import downarr from "../../assets/images/down_arr.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { baseURL } from "../../axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import {
  addTournament,
  updateTournament,
} from "../../app/features/tournament/tournamentSlice";

// Type Definitions
interface Tournament {
  title: string;
  titleAr: string;
  partner: { value: string; label: string } | null;
  game: { value: string; label: string } | null;
  platform: { value: string; label: string } | null;
  tournamentType: string;
  minPlayersPerTeam: number;
  maxPlayersPerTeam: number;
  maxParticipants: number;
  description: string;
  descriptionAr: string;
  prizepool: number;
  rules: File | string | null;
  timeLine: Array<{
    title: string;
    titleAr: string;
    startDate: string;
    endDate: string;
  }>;
  customRegistrationFields: Array<{
    fieldName: string;
    fieldType: string;
    required: boolean;
  }>;
  logo: File | string | null;
  headerPhoto: File | string | null;
  internalPhoto: File | string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  messages: string[];
  registrationStartDate: string;
  registrationEndDate: string;
  randomMessages: Array<{ randomText: string; tags: string[] }>;
}

// Validation Schema (defined above)
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Tournament Title is required")
    .matches(/^\S.*\S$/, "Tournament Title cannot start or end with spaces"),
  titleAr: Yup.string()
    .required("Tournament Title (Arabic) is required")
    .matches(
      /^\S.*\S$/,
      "Tournament Title (Arabic) cannot start or end with spaces"
    ),
  partner: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required("Partner is required"),
    })
    .nullable()
    .required("Partner is required"),
  game: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required("Game is required"),
    })
    .nullable()
    .required("Game is required"),
  platform: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required("Platform is required"),
    })
    .nullable()
    .required("Platform is required"),
  tournamentType: Yup.string().required("Tournament Type is required"),
  minPlayersPerTeam: Yup.number().when("tournamentType", {
    is: "Team",
    then: (schema) =>
      schema
        .min(1, "Minimum players per team must be at least 1")
        .required("Minimum players per team is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  maxPlayersPerTeam: Yup.number().when("tournamentType", {
    is: "Team",
    then: (schema) =>
      schema
        .min(
          Yup.ref("minPlayersPerTeam"),
          "Max players must be greater than or equal to min players"
        )
        .required("Maximum players per team is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  maxParticipants: Yup.number()
    .min(2, "Maximum participants must be at least 2")
    .required("Maximum participants is required"),
  description: Yup.string().required("Description is required"),
  descriptionAr: Yup.string().required("Description (Arabic) is required"),
  prizepool: Yup.number()
    .min(0, "Prizepool must be non-negative")
    .required("Prizepool is required"),
  timeLine: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string()
          .required("Timeline title is required")
          .matches(
            /^\S.*\S$/,
            "Timeline title cannot start or end with spaces"
          ),
        titleAr: Yup.string()
          .required("Timeline (Arabic) title is required")
          .matches(
            /^\S.*\S$/,
            "Timeline title (Arabic) cannot start or end with spaces"
          ),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date()
          .required("End date is required")
          .min(Yup.ref("startDate"), "End date must be after start date"),
      })
    )
    .min(1, "At least one timeline entry is required"),
  customRegistrationFields: Yup.array().of(
    Yup.object().shape({
      fieldName: Yup.string().required("Field name is required"),
      fieldType: Yup.string().required("Field type is required"),
      required: Yup.boolean(),
    })
  ),
  logo: Yup.mixed().required("Logo is required"),
  rules: Yup.mixed().required("Rules PDF is required"),
  headerPhoto: Yup.mixed().required("Header Photo is required"),
  internalPhoto: Yup.mixed().required("Internal Photo is required"),
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date().setTime(0), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  registrationStartDate: Yup.date() // Added
    .required("Registration start date is required")
    .min(
      new Date().setTime(0),
      "Registration start date cannot be in the past"
    ),
  registrationEndDate: Yup.date() // Added
    .required("Registration end date is required")
    .min(
      Yup.ref("registrationStartDate"),
      "Registration end date must be after registration start date"
    ),

  isActive: Yup.boolean(),
});
// Step 1: General Information
const TournamentStep1: FC<{ step: number }> = ({ step }) => {
  const dispatch = useDispatch();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    setFieldTouched,
  } = useFormikContext<Tournament>();

  const loadPartnerOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(
      fetchPartners({ page, perPage, search })
    );
    const data = response.payload;
    const options: any[] = data?.data.result.map((partner: any) => ({
      value: partner._id,
      label: partner.nameEn,
    }));

    return {
      options,
      hasMore: page * perPage < data.data.totalItem,
      additional: { page: page + 1 },
    };
  };

  const loadGameOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(
      fetchGames({ page, perPage, searchTerm: search })
    );
    const data = response.payload;
    const options: any[] = data?.data.result.map((game: any) => ({
      value: game._id,
      label: game.name,
    }));

    return {
      options,
      hasMore: page * perPage < data.data.totalItem,
      additional: { page: page + 1 },
    };
  };

  const loadPlatformOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(
      fetchDevices({ page, perPage, search })
    );
    const data = response.payload;
    const options: any[] = data?.data.result.map((platform: any) => ({
      value: platform._id,
      label: platform.name,
    }));

    return {
      options,
      hasMore: page * perPage < data.data.totalItem,
      additional: { page: page + 1 },
    };
  };

  useEffect(() => {
    if (values.tournamentType === "Solo") {
      setFieldValue("minPlayersPerTeam", 1);
      setFieldValue("maxPlayersPerTeam", 1);
    }
  }, [values.tournamentType, setFieldValue]);

  useEffect(() => {
    if (!values.startDate) {
      const today = new Date().toISOString();
      setFieldValue("startDate", today);
    }
  }, [setFieldValue, values.startDate]);

  return (
    <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        General Information
      </h4>

      <div className="relative float-label-input custom-input mb-4">
        <Field
          type="text"
          id="title"
          name="title"
          placeholder=" "
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.title && errors.title ? "border border-red-500" : ""
          }`}
        />
        <label
          htmlFor="title"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Tournament Title
        </label>
        {touched.title && errors.title && (
          <div className="text-red-500 text-[0.7rem] mt-1">{errors.title}</div>
        )}
      </div>

      <div className="relative float-label-input custom-input mb-4">
        <Field
          type="text"
          id="titleAr"
          name="titleAr"
          placeholder=" "
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal`}
        />
        <label
          htmlFor="titleAr"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          عنوان البطولة
        </label>
        {touched.titleAr && errors.titleAr && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.titleAr}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <AsyncPaginate
          id="partner"
          name="partner"
          value={values.partner}
          loadOptions={loadPartnerOptions}
          onChange={(selected: any) => setFieldValue("partner", selected)}
          onBlur={() => setFieldTouched("partner", true)}
          additional={{ page: 1 }}
          placeholder="Select partner"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#212739",
              border:
                touched.partner && errors.partner
                  ? "1px solid #ef4444"
                  : "none",
              borderRadius: "0.52rem",
              paddingLeft: "0.75rem",
              color: "#fff",
              boxShadow: "none",
              "&:hover": { borderColor: "#2792FF" },
              "&:focus": { borderColor: "#2792FF" },
            }),
            input: (base) => ({
              ...base,
              color: "#fff",
              fontSize: "0.78125rem",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#fff",
              fontSize: "0.78125rem",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#6B7280",
              fontSize: "0.78125rem",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#212739",
              borderRadius: "0.52rem",
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? "#007EFF"
                : isFocused
                ? "#2B3245"
                : "#212739",
              color: "#fff",
              fontSize: "0.78125rem",
              padding: "0.5rem 0.75rem",
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: "#6B7280",
              "&:hover": { color: "#fff" },
            }),
          }}
          components={{
            DropdownIndicator: () => (
              <img
                src={downarr}
                alt="dropdown"
                style={{ width: "16px", marginRight: "10px" }}
              />
            ),
          }}
        />
        {touched.partner && errors.partner && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.partner.label}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <AsyncPaginate
          id="game"
          name="game"
          value={values.game}
          loadOptions={loadGameOptions}
          onChange={(selected: any) => setFieldValue("game", selected)}
          onBlur={() => setFieldTouched("game", true)}
          additional={{ page: 1 }}
          placeholder="Select game"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#212739",
              border:
                touched.game && errors.game ? "1px solid #ef4444" : "none",
              borderRadius: "0.52rem",
              paddingLeft: "0.75rem",
              color: "#fff",
              boxShadow: "none",
              "&:hover": { borderColor: "#2792FF" },
              "&:focus": { borderColor: "#2792FF" },
            }),
            input: (base) => ({
              ...base,
              color: "#fff",
              fontSize: "0.78125rem",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#fff",
              fontSize: "0.78125rem",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#6B7280",
              fontSize: "0.78125rem",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#212739",
              borderRadius: "0.52rem",
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? "#007EFF"
                : isFocused
                ? "#2B3245"
                : "#212739",
              color: "#fff",
              fontSize: "0.78125rem",
              padding: "0.5rem 0.75rem",
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: "#6B7280",
              "&:hover": { color: "#fff" },
            }),
          }}
          components={{
            DropdownIndicator: () => (
              <img
                src={downarr}
                alt="dropdown"
                style={{ width: "16px", marginRight: "10px" }}
              />
            ),
          }}
        />
        {touched.game && errors.game && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.game.label}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <AsyncPaginate
          id="platform"
          name="platform"
          value={values.platform}
          loadOptions={loadPlatformOptions}
          onChange={(selected: any) => setFieldValue("platform", selected)}
          onBlur={() => setFieldTouched("platform", true)}
          additional={{ page: 1 }}
          placeholder="Select platform"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#212739",
              border:
                touched.platform && errors.platform
                  ? "1px solid #ef4444"
                  : "none",
              borderRadius: "0.52rem",
              paddingLeft: "0.75rem",
              color: "#fff",
              boxShadow: "none",
              "&:hover": { borderColor: "#2792FF" },
              "&:focus": { borderColor: "#2792FF" },
            }),
            input: (base) => ({
              ...base,
              color: "#fff",
              fontSize: "0.78125rem",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#fff",
              fontSize: "0.78125rem",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#6B7280",
              fontSize: "0.78125rem",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#212739",
              borderRadius: "0.52rem",
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? "#007EFF"
                : isFocused
                ? "#2B3245"
                : "#212739",
              color: "#fff",
              fontSize: "0.78125rem",
              padding: "0.5rem 0.75rem",
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: "#6B7280",
              "&:hover": { color: "#fff" },
            }),
          }}
          components={{
            DropdownIndicator: () => (
              <img
                src={downarr}
                alt="dropdown"
                style={{ width: "16px", marginRight: "10px" }}
              />
            ),
          }}
        />
        {touched.platform && errors.platform && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.platform.label}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <label
          htmlFor="tournamentType"
          className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Tournament Type
        </label>
        <Field
          as="select"
          id="tournamentType"
          name="tournamentType"
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.tournamentType && errors.tournamentType
              ? "border border-red-500"
              : ""
          }`}
          style={{
            backgroundImage: `url(${downarr})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px 16px",
          }}
        >
          <option value="" disabled>
            Select tournament type
          </option>
          <option value="Solo">Solo</option>
          <option value="Team">Team</option>
        </Field>
        {touched.tournamentType && errors.tournamentType && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.tournamentType}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="relative float-label-input custom-input">
          <DatePicker
            selected={values.startDate ? new Date(values.startDate) : null}
            onChange={(date: Date) =>
              setFieldValue("startDate", date.toISOString())
            }
            onBlur={() => setFieldTouched("startDate", true)}
            showTimeSelect
            timeFormat="h:mm aa"
            dateFormat="yyyy-MM-dd h:mm aa"
            className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
              touched.startDate && errors.startDate
                ? "border border-red-500"
                : ""
            }`}
            id="startDate"
            name="startDate"
            placeholderText="Select start date"
            autoComplete="off"
            timeIntervals={15}
            // minDate={new Date()}
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
            calendarClassName="custom-datepicker"
          />
          <label
            htmlFor="startDate"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Start Date
          </label>
          {touched.startDate && errors.startDate && (
            <div className="text-red-500 text-[0.7rem] mt-1">
              {errors.startDate}
            </div>
          )}
        </div>
        <div className="relative float-label-input custom-input">
          <DatePicker
            selected={values.endDate ? new Date(values.endDate) : null}
            onChange={(date: Date) =>
              setFieldValue("endDate", date.toISOString())
            }
            onBlur={() => setFieldTouched("endDate", true)}
            showTimeSelect
            timeFormat="h:mm aa"
            dateFormat="yyyy-MM-dd h:mm aa"
            className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
              touched.endDate && errors.endDate ? "border border-red-500" : ""
            }`}
            id="endDate"
            name="endDate"
            timeIntervals={15}
            placeholderText="Select end date"
            autoComplete="off"
            // minDate={values.startDate ? new Date(values.startDate) : new Date()}
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
            calendarClassName="custom-datepicker"
          />
          <label
            htmlFor="endDate"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            End Date
          </label>
          {touched.endDate && errors.endDate && (
            <div className="text-red-500 text-[0.7rem] mt-1">
              {errors.endDate}
            </div>
          )}
        </div>
      </div>

      {/* Update grid to 2x2 for date fields */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="relative float-label-input custom-input">
          <DatePicker
            selected={
              values.registrationStartDate
                ? new Date(values.registrationStartDate)
                : null
            }
            onChange={(date: Date) =>
              setFieldValue("registrationStartDate", date.toISOString())
            }
            onBlur={() => setFieldTouched("registrationStartDate", true)}
            showTimeSelect
            timeFormat="h:mm aa"
            dateFormat="yyyy-MM-dd h:mm aa"
            className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
              touched.registrationStartDate && errors.registrationStartDate
                ? "border border-red-500"
                : ""
            }`}
            id="registrationStartDate"
            name="registrationStartDate"
            placeholderText="Select registration start date"
            autoComplete="off"
            timeIntervals={15}
            // minDate={new Date()}
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
            calendarClassName="custom-datepicker"
          />
          <label
            htmlFor="registrationStartDate"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Registration Start Date
          </label>
          {touched.registrationStartDate && errors.registrationStartDate && (
            <div className="text-red-500 text-[0.7rem] mt-1">
              {errors.registrationStartDate}
            </div>
          )}
        </div>
        <div className="relative float-label-input custom-input">
          <DatePicker
            selected={
              values.registrationEndDate
                ? new Date(values.registrationEndDate)
                : null
            }
            onChange={(date: Date) =>
              setFieldValue("registrationEndDate", date.toISOString())
            }
            onBlur={() => setFieldTouched("registrationEndDate", true)}
            showTimeSelect
            timeFormat="h:mm aa"
            dateFormat="yyyy-MM-dd h:mm aa"
            className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
              touched.registrationEndDate && errors.registrationEndDate
                ? "border border-red-500"
                : ""
            }`}
            id="registrationEndDate"
            name="registrationEndDate"
            timeIntervals={15}
            placeholderText="Select registration end date"
            autoComplete="off"
            // minDate={
            //   values.registrationStartDate
            //     ? new Date(values.registrationStartDate)
            //     : new Date()
            // }
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
            calendarClassName="custom-datepicker"
          />
          <label
            htmlFor="registrationEndDate"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Registration End Date
          </label>
          {touched.registrationEndDate && errors.registrationEndDate && (
            <div className="text-red-500 text-[0.7rem] mt-1">
              {errors.registrationEndDate}
            </div>
          )}
        </div>
      </div>

      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Publish</span>
        <label className="inline-flex items-center cursor-pointer">
          <Field
            type="checkbox"
            name="isActive"
            checked={values.isActive}
            onChange={() => setFieldValue("isActive", !values.isActive)}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div>

      <style>{`
        .custom-datepicker {
          background-color: #212739;
          border: none;
          border-radius: 0.52rem;
          padding: 0.5rem;
          font-size: 0.78125rem;
          color: #fff;
          font-family: inherit;
          display: flex;
        }
        .custom-datepicker .react-datepicker__header {
          background-color: #2b3245;
          border-bottom: none;
          padding: 0.5rem;
        }
        .custom-datepicker .react-datepicker__current-month,
        .custom-datepicker .react-datepicker__day-name {
          color: #fff;
          font-size: 0.78125rem;
        }
        .custom-datepicker .react-datepicker__day {
          color: #fff;
          border-radius: 0.3rem;
          padding: 0.3rem;
        }
        .custom-datepicker .react-datepicker__day:hover {
          background-color: #2b3245;
        }
        .custom-datepicker .react-datepicker__day--selected,
        .custom-datepicker .react-datepicker__day--keyboard-selected {
          background-color: #007eff;
          color: #fff;
        }
        .custom-datepicker .react-datepicker__day--disabled {
          color: #6b7280;
          opacity: 0.5;
        }
        .custom-datepicker .react-datepicker__navigation {
          top: 0.75rem;
        }
        .custom-datepicker .react-datepicker__navigation-icon::before {
          border-color: #fff;
        }
        .custom-datepicker .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Step 2: Tournament Details
const TournamentStep2: FC<{ step: number }> = ({ step }) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    setFieldTouched,
  } = useFormikContext<Tournament>();

  return (
    <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Tournament Details
      </h4>

      {values.tournamentType === "Team" && (
        <>
          <div className="relative float-label-input custom-input mb-4">
            <Field
              type="number"
              id="minPlayersPerTeam"
              name="minPlayersPerTeam"
              placeholder=" "
              min="1"
              className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                touched.minPlayersPerTeam && errors.minPlayersPerTeam
                  ? "border border-red-500"
                  : ""
              }`}
            />
            <label
              htmlFor="minPlayersPerTeam"
              className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
            >
              Minimum Players Per Team
            </label>
            {touched.minPlayersPerTeam && errors.minPlayersPerTeam && (
              <div className="text-red-500 text-[0.7rem] mt-1">
                {errors.minPlayersPerTeam}
              </div>
            )}
          </div>

          <div className="relative float-label-input custom-input mb-4">
            <Field
              type="number"
              id="maxPlayersPerTeam"
              name="maxPlayersPerTeam"
              placeholder=" "
              min={values.minPlayersPerTeam || 1}
              className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                touched.maxPlayersPerTeam && errors.maxPlayersPerTeam
                  ? "border border-red-500"
                  : ""
              }`}
            />
            <label
              htmlFor="maxPlayersPerTeam"
              className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
            >
              Maximum Players Per Team
            </label>
            {touched.maxPlayersPerTeam && errors.maxPlayersPerTeam && (
              <div className="text-red-500 text-[0.7rem] mt-1">
                {errors.maxPlayersPerTeam}
              </div>
            )}
          </div>
        </>
      )}

      <div className="relative float-label-input custom-input mb-4">
        <Field
          type="number"
          id="maxParticipants"
          name="maxParticipants"
          placeholder=" "
          min="2"
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.maxParticipants && errors.maxParticipants
              ? "border border-red-500"
              : ""
          }`}
        />
        <label
          htmlFor="maxParticipants"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Maximum Participants
        </label>
        {touched.maxParticipants && errors.maxParticipants && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.maxParticipants}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <label
          htmlFor="description"
          className="block text-[0.78125rem] font-bold text-custom-gray mb-2"
        >
          Description
        </label>
        <ReactQuill
          value={values.description}
          onChange={(value) => setFieldValue("description", value)}
          className={`custom-quill-editor bg-[#2B3245] rounded-[0.52rem] text-white ${
            touched.description && errors.description
              ? "border border-red-500"
              : ""
          }`}
        />
        {touched.description && errors.description && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.description}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <label
          htmlFor="descriptionAr"
          className="block text-[0.78125rem] font-bold text-custom-gray mb-2"
        >
          وصف
        </label>
        <ReactQuill
          value={values.descriptionAr}
          onChange={(value) => setFieldValue("descriptionAr", value)}
          className={`custom-quill-editor bg-[#2B3245] rounded-[0.52rem] text-white ${
            touched.descriptionAr && errors.descriptionAr
              ? "border border-red-500"
              : ""
          }`}
        />
        {touched.descriptionAr && errors.descriptionAr && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.descriptionAr}
          </div>
        )}
      </div>

      <div className="relative float-label-input custom-input mb-4">
        <Field
          type="number"
          id="prizepool"
          name="prizepool"
          placeholder=" "
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.prizepool && errors.prizepool ? "border border-red-500" : ""
          }`}
        />
        <label
          htmlFor="prizepool"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Total Prizepool
        </label>
        {touched.prizepool && errors.prizepool && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.prizepool}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">Timeline</h5>
        <FieldArray name="timeLine">
          {({ push, remove }) => (
            <>
              {values.timeLine.map((timeline, index) => (
                <div
                  key={index}
                  className="mb-4 bg-input-color p-4 rounded-[0.52rem]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-white text-[0.78125rem] font-medium">
                      Timeline #{index + 1}
                    </h6>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-gray-gradient hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{ width: "1.25rem" }}
                        />
                      </button>
                    )}
                  </div>
                  <div className="relative float-label-input custom-input mb-4">
                    <Field
                      type="text"
                      id={`timeLine[${index}].title`}
                      name={`timeLine[${index}].title`}
                      placeholder=" "
                      className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        touched.timeLine?.[index]?.title &&
                        errors.timeLine?.[index]?.title
                          ? "border border-red-500"
                          : ""
                      }`}
                    />
                    <label
                      htmlFor={`timeLine[${index}].title`}
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Title
                    </label>
                    {touched.timeLine?.[index]?.title &&
                      errors.timeLine?.[index]?.title && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.timeLine[index].title}
                        </div>
                      )}
                  </div>
                  <div className="relative float-label-input custom-input mt-4 mb-4">
                    <Field
                      type="text"
                      id={`timeLine[${index}].titleAr`}
                      name={`timeLine[${index}].titleAr`}
                      placeholder=" "
                      className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        touched.timeLine?.[index]?.titleAr &&
                        errors.timeLine?.[index]?.titleAr
                          ? "border border-red-500"
                          : ""
                      }`}
                    />
                    <label
                      htmlFor={`timeLine[${index}].titleAr`}
                      className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      عنوان
                    </label>
                    {touched.timeLine?.[index]?.titleAr &&
                      errors.timeLine?.[index]?.titleAr && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.timeLine[index].titleAr}
                        </div>
                      )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="relative float-label-input custom-input">
                      <DatePicker
                        selected={
                          values.timeLine[index]?.startDate
                            ? new Date(values.timeLine[index].startDate)
                            : null
                        }
                        onChange={(date: Date) =>
                          setFieldValue(
                            `timeLine[${index}].startDate`,
                            date ? date.toISOString() : ""
                          )
                        }
                        onBlur={() =>
                          setFieldTouched(`timeLine[${index}].startDate`, true)
                        }
                        showTimeSelect
                        timeFormat="h:mm aa"
                        dateFormat="yyyy-MM-dd h:mm aa"
                        className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                          touched.timeLine?.[index]?.startDate &&
                          errors.timeLine?.[index]?.startDate
                            ? "border border-red-500"
                            : ""
                        }`}
                        id={`timeLine[${index}].startDate`}
                        name={`timeLine[${index}].startDate`}
                        placeholderText="Select start date"
                        autoComplete="off"
                        // minDate={new Date()}
                        popperPlacement="bottom-start"
                        wrapperClassName="w-full"
                        calendarClassName="custom-datepicker"
                      />
                      <label
                        htmlFor={`timeLine[${index}].startDate`}
                        className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                      >
                        Start Date
                      </label>
                      {touched.timeLine?.[index]?.startDate &&
                        errors.timeLine?.[index]?.startDate && (
                          <div className="text-red-500 text-[0.7rem] mt-1">
                            {errors.timeLine[index].startDate}
                          </div>
                        )}
                    </div>
                    <div className="relative float-label-input custom-input">
                      <DatePicker
                        selected={
                          values.timeLine[index]?.endDate
                            ? new Date(values.timeLine[index].endDate)
                            : null
                        }
                        onChange={(date: Date) =>
                          setFieldValue(
                            `timeLine[${index}].endDate`,
                            date ? date.toISOString() : ""
                          )
                        }
                        onBlur={() =>
                          setFieldTouched(`timeLine[${index}].endDate`, true)
                        }
                        showTimeSelect
                        timeFormat="h:mm aa"
                        dateFormat="yyyy-MM-dd h:mm aa"
                        className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                          touched.timeLine?.[index]?.endDate &&
                          errors.timeLine?.[index]?.endDate
                            ? "border border-red-500"
                            : ""
                        }`}
                        id={`timeLine[${index}].endDate`}
                        name={`timeLine[${index}].endDate`}
                        placeholderText="Select end date"
                        autoComplete="off"
                        // minDate={
                        //   values.timeLine[index]?.startDate
                        //     ? new Date(values.timeLine[index].startDate)
                        //     : new Date()
                        // }
                        popperPlacement="bottom-start"
                        wrapperClassName="w-full"
                        calendarClassName="custom-datepicker"
                      />
                      <label
                        htmlFor={`timeLine[${index}].endDate`}
                        className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                      >
                        End Date
                      </label>
                      {touched.timeLine?.[index]?.endDate &&
                        errors.timeLine?.[index]?.endDate && (
                          <div className="text-red-500 text-[0.7rem] mt-1">
                            {errors.timeLine[index].endDate}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  push({ title: "", titleAr: "", startDate: "", endDate: "" })
                }
                className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
              >
                + Add Timeline Entry
              </button>
              {touched.timeLine &&
                errors.timeLine &&
                typeof errors.timeLine === "string" && (
                  <div className="text-red-500 text-[0.7rem] mt-1">
                    {errors.timeLine}
                  </div>
                )}
            </>
          )}
        </FieldArray>
      </div>

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">
          Custom Registration Fields
        </h5>
        <FieldArray name="customRegistrationFields">
          {({ push, remove }) => (
            <>
              {values.customRegistrationFields.map((field, index) => (
                <div
                  key={index}
                  className="mb-4 bg-input-color p-4 rounded-[0.52rem]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-white text-[0.78125rem] font-medium">
                      Field #{index + 1}
                    </h6>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-gray-gradient hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{ width: "1.25rem" }}
                        />
                      </button>
                    )}
                  </div>
                  <div className="relative flex-1 custom-input mb-4">
                    <label
                      htmlFor={`customRegistrationFields[${index}].fieldName`}
                      className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Field Name
                    </label>
                    <Field
                      as="input"
                      type="text"
                      id={`customRegistrationFields[${index}].fieldName`}
                      name={`customRegistrationFields[${index}].fieldName`}
                      className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 leading-normal ${
                        touched.customRegistrationFields?.[index]?.fieldName &&
                        errors.customRegistrationFields?.[index]?.fieldName
                          ? "border border-red-500"
                          : ""
                      }`}
                    />
                    {touched.customRegistrationFields?.[index]?.fieldName &&
                      errors.customRegistrationFields?.[index]?.fieldName && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.customRegistrationFields[index].fieldName}
                        </div>
                      )}
                  </div>
                  <div className="relative flex-1 custom-input mb-4">
                    <label
                      htmlFor={`customRegistrationFields[${index}].fieldType`}
                      className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Field Type
                    </label>
                    <Field
                      as="select"
                      id={`customRegistrationFields[${index}].fieldType`}
                      name={`customRegistrationFields[${index}].fieldType`}
                      className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        touched.customRegistrationFields?.[index]?.fieldType &&
                        errors.customRegistrationFields?.[index]?.fieldType
                          ? "border border-red-500"
                          : ""
                      }`}
                      style={{
                        backgroundImage: `url(${downarr})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                        backgroundSize: "16px 16px",
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                    </Field>
                    {touched.customRegistrationFields?.[index]?.fieldType &&
                      errors.customRegistrationFields?.[index]?.fieldType && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.customRegistrationFields[index].fieldType}
                        </div>
                      )}
                  </div>
                  <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal">
                    <span className="text-white font-medium">Required</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <Field
                        type="checkbox"
                        name={`customRegistrationFields[${index}].required`}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  push({ fieldName: "", fieldType: "text", required: false })
                }
                className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
              >
                + Add Custom Field
              </button>
            </>
          )}
        </FieldArray>
      </div>

      <style>{`
        .custom-quill-editor .ql-container {
          background-color: #2B3245;
          border-radius: 0.52rem;
          color: #fff;
          font-size: 0.78125rem;
        }
        .custom-quill-editor .ql-toolbar {
          background-color: #212739;
          border-radius: 0.52rem 0.52rem 0 0;
        }
        .custom-quill-editor .ql-editor {
          min-height: 100px;
        }
          .custom-datepicker {
          background-color: #212739;
          border: none;
          border-radius: 0.52rem;
          padding: 0.5rem;
          font-size: 0.78125rem;
          color: #fff;
          font-family: inherit;
          display: flex

        }
        .custom-datepicker .react-datepicker__header {
          background-color: #2b3245;
          border-bottom: none;
          padding: 0.5rem;
        }
        .custom-datepicker .react-datepicker__current-month,
        .custom-datepicker .react-datepicker__day-name {
          color: #fff;
          font-size: 0.78125rem;
        }
        .custom-datepicker .react-datepicker__day {
          color: #fff;
          border-radius: 0.3rem;
          padding: 0.3rem;
        }
        .custom-datepicker .react-datepicker__day:hover {
          background-color: #2b3245;
        }
        .custom-datepicker .react-datepicker__day--selected,
        .custom-datepicker .react-datepicker__day--keyboard-selected {
          background-color: #007eff;
          color: #fff;
        }
        .custom-datepicker .react-datepicker__day--disabled {
          color: #6b7280;
          opacity: 0.5;
        }
        .custom-datepicker .react-datepicker__navigation {
          top: 0.75rem;
        }
        .custom-datepicker .react-datepicker__navigation-icon::before {
          border-color: #fff;
        }
        .custom-datepicker .react-datepicker__triangle {
          display: none;
        }
        e {
           display: flex;
           height: 300px;
        }
      `}</style>
    </div>
  );
};

// Step 3: Media and Rules
const TournamentStep3: FC<{ step: number; tournamentData?: any }> = ({
  step,
  tournamentData,
}) => {
  const dispatch = useDispatch();
  const { values, errors, touched, setFieldValue } =
    useFormikContext<Tournament>();

  const [logoFile, setLogoFile] = useState<string | undefined>();
  const [pdfFile, setPdfFile] = useState<string | undefined>();
  const [headerPhoto, setHeaderPhoto] = useState<string | undefined>();
  const [internalPhoto, setInternalPhoto] = useState<string | undefined>();

  const handleFileUpload =
    (field: string, setFile: (url: string | undefined) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(uploadFile(formData))
          .then((result: any) => {
            if (result?.payload?.data) {
              const fileUrl = result.payload.data; // Store only the relative path
              setFile(fileUrl);
              setFieldValue(field, fileUrl);
            }
          })
          .catch((err: any) => {
            console.error("File upload error:", err);
          });
      }
    };

  return (
    <>
      <style>
        {`
          .grid-container {
            max-width: 42.5rem;
            margin: 0 auto;
            padding: 1rem;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .grid-container h4 {
            grid-column: 1 / -1;
            text-align: center;
            color: white;
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 1.25rem;
          }
          .file-upload-section {
            display: flex;
            flex-direction: column;
          }
          .error-text {
            color: #ef4444;
            font-size: 0.7rem;
            margin-top: 0.25rem;
          }
          @media (max-width: 768px) {
            .grid-container {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      <div className="grid-container">
        <h4>Media and Rules</h4>

        <div className="file-upload-section">
          <FileUpload
            previewUrl={
              logoFile
                ? `${baseURL}/api/v1/${logoFile}`
                : tournamentData?.logo
                ? `${baseURL}/api/v1/${tournamentData.logo}`
                : ""
            }
            label="Logo (Suggested: 270*330px)"
            id="logo"
            onChange={handleFileUpload("logo", setLogoFile)}
            accept="image/*"
          />
          {touched.logo && errors.logo && (
            <div className="error-text">{errors.logo}</div>
          )}
        </div>

        <div className="file-upload-section">
          <FileUpload
            previewUrl={
              headerPhoto
                ? `${baseURL}/api/v1/${headerPhoto}`
                : tournamentData?.headerPhoto
                ? `${baseURL}/api/v1/${tournamentData.headerPhoto}`
                : ""
            }
            label="Header Photo (Suggested: 600*400px)"
            id="headerPhoto"
            onChange={handleFileUpload("headerPhoto", setHeaderPhoto)}
            accept="image/*"
          />
          {touched.headerPhoto && errors.headerPhoto && (
            <div className="error-text">{errors.headerPhoto}</div>
          )}
        </div>

        <div className="file-upload-section">
          <FileUpload
            previewUrl={
              internalPhoto
                ? `${baseURL}/api/v1/${internalPhoto}`
                : tournamentData?.internalPhoto
                ? `${baseURL}/api/v1/${tournamentData.internalPhoto}`
                : ""
            }
            label="Internal Photo (Suggested: 300*300px)"
            id="internalPhoto"
            onChange={handleFileUpload("internalPhoto", setInternalPhoto)}
            accept="image/*"
          />
          {touched.internalPhoto && errors.internalPhoto && (
            <div className="error-text">{errors.internalPhoto}</div>
          )}
        </div>

        <div className="file-upload-section">
          <FileUpload
            previewUrl={
              pdfFile
                ? "/pdf-2127829_640.webp"
                : tournamentData?.rules
                ? "/pdf-2127829_640.webp"
                : ""
            }
            label="Rules (PDF)"
            id="rules"
            onChange={handleFileUpload("rules", setPdfFile)}
            accept="application/pdf"
            ispdf={true}
          />
          {touched.rules && errors.rules && (
            <div className="error-text">{errors.rules}</div>
          )}
        </div>
      </div>
    </>
  );
};

// Step 4: Messages
const TournamentStep4: FC<{ step: number }> = ({ step }) => {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<Tournament>();

  const handleTagToggle = (
    tag: string,
    index: number,
    currentTags: string[]
  ) => {
    if (currentTags.includes(tag)) {
      setFieldValue(
        `randomMessages[${index}].tags`,
        currentTags.filter((t) => t !== tag)
      );
    } else {
      setFieldValue(`randomMessages[${index}].tags`, [...currentTags, tag]);
    }
  };

  return (
    <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Messages
      </h4>

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">Messages</h5>
        <FieldArray name="messages">
          {({ push, remove }) => (
            <>
              {values.messages.map((message, index) => (
                <div
                  key={index}
                  className="mb-4 bg-input-color p-4 rounded-[0.52rem]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-white text-[0.78125rem] font-medium">
                      Message #{index + 1}
                    </h6>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-gray-gradient hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{ width: "1.25rem" }}
                        />
                      </button>
                    )}
                  </div>
                  <div className="relative flex-1 custom-input">
                    <label
                      htmlFor={`messages[${index}]`}
                      className="block text-[0.78125rem] font-bold text-custom-gray mb-2"
                    >
                      Message {index + 1}
                    </label>
                    <ReactQuill
                      value={message}
                      onChange={(value) =>
                        setFieldValue(`messages[${index}]`, value)
                      }
                      className={`custom-quill-editor bg-[#2B3245] rounded-[0.52rem] text-white ${
                        touched.messages?.[index] && errors.messages?.[index]
                          ? "border border-red-500"
                          : ""
                      }`}
                    />
                    {touched.messages?.[index] && errors.messages?.[index] && (
                      <div className="text-red-500 text-[0.7rem] mt-1">
                        {errors.messages[index]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => push("")}
                className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
              >
                + Add Message
              </button>
              {touched.messages &&
                errors.messages &&
                typeof errors.messages === "string" && (
                  <div className="text-red-500 text-[0.7rem] mt-1">
                    {errors.messages}
                  </div>
                )}
            </>
          )}
        </FieldArray>
      </div>

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">
          Random Messages
        </h5>
        <FieldArray name="randomMessages">
          {({ push, remove }) => (
            <>
              {values.randomMessages.map((randomMessage, index) => (
                <div
                  key={index}
                  className="mb-4 bg-input-color p-4 rounded-[0.52rem]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-white text-[0.78125rem] font-medium">
                      Random Message #{index + 1}
                    </h6>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-gray-gradient hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{ width: "1.25rem" }}
                        />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative flex-1 custom-input mb-4">
                      <label
                        htmlFor={`randomMessages[${index}].randomText`}
                        className="block text-[0.78125rem] font-bold text-custom-gray mb-2"
                      >
                        Random Message {index + 1}
                      </label>
                      <ReactQuill
                        value={randomMessage.randomText}
                        onChange={(value) =>
                          setFieldValue(
                            `randomMessages[${index}].randomText`,
                            value
                          )
                        }
                        className={`custom-quill-editor bg-[#2B3245] rounded-[0.52rem] text-white ${
                          touched.randomMessages?.[index]?.randomText &&
                          errors.randomMessages?.[index]?.randomText
                            ? "border border-red-500"
                            : ""
                        }`}
                      />
                      {touched.randomMessages?.[index]?.randomText &&
                        errors.randomMessages?.[index]?.randomText && (
                          <div className="text-red-500 text-[0.7rem] mt-1">
                            {errors.randomMessages[index].randomText}
                          </div>
                        )}
                    </div>
                    <div className="relative flex-1 custom-input">
                      <label className="block text-[0.78125rem] font-bold text-custom-gray mb-2">
                        Tags for Random Message {index + 1}
                      </label>
                      <div className="bg-[#212739] p-3 rounded-[0.5rem]">
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="Add a tag..."
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                e.currentTarget.value.trim()
                              ) {
                                const newTag = e.currentTarget.value.trim();
                                setFieldValue(`randomMessages[${index}].tags`, [
                                  ...randomMessage.tags,
                                  newTag,
                                ]);
                                e.currentTarget.value = "";
                                e.preventDefault();
                              }
                            }}
                            className={`w-full text-[0.78125rem] text-white focus:outline-none focus:border-[#2792FF] pt-[0.5rem] pb-[0.35rem] bg-input-color rounded-[0.1rem] px-3 appearance-none leading-normal ${
                              touched.randomMessages?.[index]?.tags &&
                              errors.randomMessages?.[index]?.tags
                                ? "border border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {randomMessage.tags.map((tag, tagIndex) => (
                            <div
                              key={tagIndex}
                              className="flex items-center bg-[#2792FF] text-white text-[0.78125rem] px-2 py-1 rounded-[0.52rem]"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() =>
                                  handleTagToggle(
                                    tag,
                                    index,
                                    randomMessage.tags
                                  )
                                }
                                className="ml-2 text-white hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      {touched.randomMessages?.[index]?.tags &&
                        errors.randomMessages?.[index]?.tags && (
                          <div className="text-red-500 text-[0.7rem] mt-1">
                            {typeof errors.randomMessages[index].tags ===
                            "string"
                              ? errors.randomMessages[index].tags
                              : "At least one tag is required"}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => push({ randomText: "", tags: [] })}
                className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
              >
                + Add Random Message
              </button>
              {touched.randomMessages &&
                errors.randomMessages &&
                typeof errors.randomMessages === "string" && (
                  <div className="text-red-500 text-[0.7rem] mt-1">
                    {errors.randomMessages}
                  </div>
                )}
            </>
          )}
        </FieldArray>
      </div>

      <style>{`
        .custom-quill-editor .ql-container {
          background-color: #2B3245;
          border-radius: 0.52rem;
          color: #fff;
          font-size: 0.78125rem;
        }
        .custom-quill-editor .ql-toolbar {
          background-color: #212739;
          border-radius: 0.52rem 0.52rem 0 0;
        }
        .custom-quill-editor .ql-editor {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
};

// Main Component
export const AddTournament: FC = () => {
  const location = useLocation();
  const tournamentData = location?.state?.tournament;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const pID = window.location.pathname.split("/")[1];

  const initialValues: Tournament = {
    title: tournamentData?.title || "",
    titleAr: tournamentData?.titleAr || "",
    partner: tournamentData?.partner?._id
      ? {
          value: tournamentData.partner._id,
          label: tournamentData.partner.nameEn,
        }
      : null,
    game: tournamentData?.game?._id
      ? { value: tournamentData.game._id, label: tournamentData.game.name }
      : null,
    platform: tournamentData?.platform?._id
      ? {
          value: tournamentData.platform._id,
          label: tournamentData.platform.name,
        }
      : null,
    tournamentType: tournamentData?.tournamentType || "",
    minPlayersPerTeam: tournamentData?.minPlayersPerTeam || 0,
    maxPlayersPerTeam: tournamentData?.maxPlayersPerTeam || 0,
    maxParticipants: tournamentData?.maxParticipants || 0,
    description: tournamentData?.description || "",
    descriptionAr: tournamentData?.descriptionAr || "",
    prizepool: tournamentData?.prizepool || 0,
    rules: tournamentData?.rules || null,
    timeLine:
      tournamentData?.timeLine?.length > 0
        ? tournamentData.timeLine
        : [{ title: "", titleAr: "", startDate: "", endDate: "" }],
    customRegistrationFields:
      tournamentData?.customRegistrationFields?.length > 0
        ? tournamentData.customRegistrationFields
        : [{ fieldName: "Game ID", fieldType: "text", required: true }],
    logo: tournamentData?.logo || null,
    headerPhoto: tournamentData?.headerPhoto || null,
    internalPhoto: tournamentData?.internalPhoto || null,
    startDate: tournamentData?.startDate || "",
    endDate: tournamentData?.endDate || "",
    registrationStartDate: tournamentData?.registrationStartDate || "", // Added
    registrationEndDate: tournamentData?.registrationEndDate || "", // Added
    isActive: tournamentData?.isActive ?? true,
    messages:
      tournamentData?.messages?.length > 0 ? tournamentData.messages : [""],
    randomMessages:
      tournamentData?.randomMessages?.length > 0
        ? tournamentData.randomMessages
        : [{ randomText: "", tags: [] }],
  };

  const handleSubmit = (values: Tournament) => {
    const bodyData = {
      title: values.title,
      titleAr: values.titleAr,
      partner: values.partner?.value || pID,
      game: values.game?.value,
      platform: values.platform?.value,
      tournamentType: values.tournamentType,
      minPlayersPerTeam:
        values.tournamentType === "Team" ? values.minPlayersPerTeam : undefined,
      maxPlayersPerTeam:
        values.tournamentType === "Team" ? values.maxPlayersPerTeam : undefined,
      maxParticipants: values.maxParticipants,
      description: values.description,
      descriptionAr: values.descriptionAr,
      prizepool: values.prizepool,
      rules: values.rules,
      timeLine: values.timeLine,
      customRegistrationFields: values.customRegistrationFields,
      logo: values.logo,
      headerPhoto: values.headerPhoto,
      internalPhoto: values.internalPhoto,
      startDate: values.startDate,
      endDate: values.endDate,
      registrationStartDate: values.registrationStartDate,
      registrationEndDate: values.registrationEndDate,
      isActive: values.isActive,
      messages: values.messages.filter((msg) => msg.trim().length > 0),
      randomMessages: values.randomMessages.filter(
        (msg) => msg.randomText.trim().length > 0 || msg.tags.length > 0
      ),
    };

    if (tournamentData?._id) {
      dispatch(
        updateTournament({ id: tournamentData._id, tournament: bodyData })
      ).then((result) => {
        if (updateTournament.fulfilled.match(result)) {
          navigate(`/${pID}/tournament`);
        }
        setShowModal(false);
      });
    } else {
      dispatch(addTournament(bodyData)).then((result) => {
        if (addTournament.fulfilled.match(result)) {
          navigate(`/${pID}/tournament`);
        }
        setShowModal(false);
      });
    }
  };

  const nextStep = (
    validateForm: (values?: any) => Promise<any>,
    values: Tournament
  ) => {
    validateForm().then((errors) => {
      const stepFields = {
        1: [
          "title",
          "titleAr",
          "partner",
          "game",
          "platform",
          "tournamentType",
          "startDate",
          "endDate",
          "isActive",
        ],
        2: [
          "minPlayersPerTeam",
          "maxPlayersPerTeam",
          "maxParticipants",
          "description",
          "descriptionAr",
          "prizepool",
          "timeLine",
          "customRegistrationFields",
        ],
        3: ["logo", "rules", "headerPhoto", "internalPhoto"],
        4: ["messages", "randomMessages"],
      };

      const currentStepErrors = Object.keys(errors).some((key) =>
        stepFields[step].includes(key)
      );

      if (!currentStepErrors) {
        if (step < 4) {
          setStep(step + 1);
        } else {
          setShowModal(true);
        }
      }
    });
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const btnBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleStepClick = (
    selectedStep: number,
    validateForm: (values?: any) => Promise<any>,
    values: Tournament
  ) => {
    validateForm().then((errors) => {
      const stepFields = {
        1: [
          "title",
          "titleAr",
          "partner",
          "game",
          "platform",
          "tournamentType",
          "startDate",
          "endDate",
          "isActive",
        ],
        2: [
          "minPlayersPerTeam",
          "maxPlayersPerTeam",
          "maxParticipants",
          "description",
          "descriptionAr",
          "prizepool",
          "timeLine",
          "customRegistrationFields",
        ],
        3: ["logo", "rules", "headerPhoto", "internalPhoto"],
        4: ["messages", "randomMessages"],
      };

      const previousStepErrors = Object.keys(errors).some((key) =>
        stepFields[Math.min(step, selectedStep)].includes(key)
      );

      if (!previousStepErrors || selectedStep < step) {
        setStep(selectedStep);
      }
    });
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ validateForm, values }) => (
          <Form>
            <div className="nf_leg_steps-block">
              <div className="nf_step_head-con flex items-center pb-4 border-b border-light-border">
                <a
                  href="#"
                  className="flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
                  onClick={btnBack}
                >
                  <span>
                    <svg
                      width="1.26rem"
                      height="1.26rem"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.125 3.75L6.875 10L13.125 16.25"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Back
                </a>
                <h3 className="flex-1 text-white text-center font-bold text-[1.25rem]">
                  {tournamentData?._id
                    ? "Update Tournament"
                    : "Add New Tournament"}
                </h3>
              </div>
            </div>

            <div className="leg_steps--con flex items-center justify-center my-[1.67rem] gap-[0.35rem]">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`leg_steps--num flex items-center gap-[0.35rem] ${
                    step >= num ? "active-step" : ""
                  }`}
                  onClick={() => handleStepClick(num, validateForm, values)}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className={`steps-num leading-none ${
                      step >= num ? "bg-[#007EFF]" : "bg-light-border"
                    } w-[1.67rem] h-[1.67rem] flex items-center justify-center text-white rounded-[1.67rem]`}
                  >
                    {num}
                  </span>
                  {num !== 4 && (
                    <span
                      className={`step-line inline-block w-[1rem] h-[0.1rem] ${
                        step > num ? "bg-[#007EFF]" : "bg-light-border"
                      } rounded-[0.2rem]`}
                    ></span>
                  )}
                </div>
              ))}
            </div>

            {step === 1 && <TournamentStep1 step={step} />}
            {step === 2 && <TournamentStep2 step={step} />}
            {step === 3 && (
              <TournamentStep3 step={step} tournamentData={tournamentData} />
            )}
            {step === 4 && <TournamentStep4 step={step} />}

            <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
              <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 duration-300 focus:outline-none disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => nextStep(validateForm, values)}
                  className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none disabled:opacity-50"
                >
                  {step === 4 ? "Submit" : "Next Step"}
                </button>
              </div>
            </div>
            {showModal && (
              <ModalPopUp
                onCancel={() => setShowModal(false)}
                isUpdate={location.state ? true : false}
                isTrunament={true}
              />
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
