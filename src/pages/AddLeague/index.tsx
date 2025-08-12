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
import { addLeague, updateLeague } from "../../app/features/league/leagueSlice";
import { fetchGames } from "../../app/features/games/gameSlice";
// import { fetchPartners } from "../../app/features/partners/partnerSlice";
import { fetchDevices } from "../../app/features/devices/deviceSlice";
import { uploadFile } from "../../app/features/fileupload/fileUploadSlice";
import downarr from "../../assets/images/down_arr.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { baseURL } from "../../axios";
import { TimePickerField } from "../../components/ui/TimePickerField";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { convertSchedule } from "../../utils/constant";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

// Type Definitions
interface Winner {
  badgeId: string;
  position: number;
  points: number;
  prize: string;
}

interface League {
  title: string;
  titleAr: string;
  partner: { value: string; label: string } | null;
  game: { value: string; label: string } | null;
  device: { value: string; label: string } | null;
  // platform: string;
  format: string;
  playersPerTeam: number;
  weekOfTheStarPrice: number;
  // maxMatchesPerPlayer: {
  //   isActive: boolean;
  //   maxMatches: number;
  // };
  queueSettings: {
    alwaysOn: boolean;
    schedule: {
      days: Array<{
        day: string;
        alwaysOn: boolean;
        time: Array<{
          startTime: string;
          endTime: string;
        }>;
      }>;
    };
  };
  // qualifyingLine: number;
  prizepool: number;
  rules: File | null;
  timeLine: Array<{
    title: string;
    titleAr: string;
    description: string;
    startDate: string;
    endDate: string;
  }>;
  customRegistrationFields: Array<{
    fieldName: string;
    fieldType: string;
    required: boolean;
    checkboxText: string;
    image: string;
  }>;
  logo: File | null;
  headerPhoto: File | null;
  internalPhoto: File | null;
  // cardPhoto: File | null;
  hydraulicsImage?: File | null;
  mobileHeader?: File | null;
  bannerImage?: File | null;
  isFeatured?: boolean;
  leagueBannerLink?: string;
  positions?: Winner[];
  waitingList?: boolean;
  verifiedAccounts?: boolean;
  startDate: string;
  endDate: string;
  messages: string[]; // Changed from single message to array
  randomMessages: Array<{ randomText: string; tags: string[] }>;
  isWeekOfTheStar: boolean; // <-- NEW KEY
}

interface StepProps {
  step: number;
}

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("League Title is required")
    .matches(/^\S.*\S$/, "League Title cannot start or end with spaces"),
  titleAr: Yup.string()
    .required("League Title (Arabic) is required")
    .matches(
      /^\S.*\S$/,
      "League Title (Arabic) cannot start or end with spaces"
    ),
  game: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required("Game is required"),
    })
    .nullable()
    .required("Game is required"),
  device: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required("Device is required"),
    })
    .nullable()
    .required("Device is required"),
  format: Yup.string().required("Format is required"),
  playersPerTeam: Yup.number()
    .min(1, "Players per team must be at least 1")
    .required("Players per team is required"),
  // maxMatchesPerPlayer: Yup.object().shape({
  //   isActive: Yup.boolean(),
  //   maxMatches: Yup.number().when("isActive", {
  //     is: true,
  //     then: (schema) =>
  //       schema
  //         .min(1, "Maximum matches must be at least 1")
  //         .required("Maximum matches is required when limit is active"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  // }),
  // queueSettings: Yup.object().shape({
  //   alwaysOn: Yup.boolean(),
  //   schedule: Yup.object().when("alwaysOn", {
  //     is: false,
  //     then: (schema) =>
  //       schema.shape({
  //         days: Yup.array()
  //           .of(
  //             Yup.object().shape({
  //               day: Yup.string().required("Day is required"),
  //               time: Yup.array()
  //                 .of(
  //                   Yup.object().shape({
  //                     startTime: Yup.string()
  //                       .matches(
  //                         /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  //                         "Start time must be a valid time (HH:MM)"
  //                       )
  //                       .required("Start time is required"),
  //                     endTime: Yup.string()
  //                       .matches(
  //                         /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  //                         "End time must be a valid time (HH:MM)"
  //                       )
  //                       .required("End time is required")
  //                       .test(
  //                         "is-after-start",
  //                         "End time must be after start time",
  //                         function (endTime) {
  //                           const startTime = this.parent.startTime;
  //                           if (!startTime || !endTime) return true;
  //                           return (
  //                             new Date(`1970-01-01T${endTime}:00`) >
  //                             new Date(`1970-01-01T${startTime}:00`)
  //                           );
  //                         }
  //                       ),
  //                   })
  //                 )
  //                 .min(1, "At least one time slot is required")
  //                 .required("Time slots are required"),
  //             })
  //           )
  //           .min(1, "At least one day with time slots is required")
  //           .required("Days are required"),
  //       }),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  // }),
  queueSettings: Yup.object().shape({
    alwaysOn: Yup.boolean(),
    schedule: Yup.object().when("alwaysOn", {
      is: false,
      then: (schema) =>
        schema.shape({
          days: Yup.array()
            .of(
              Yup.object().shape({
                day: Yup.string().required("Day is required"),
                alwaysOn: Yup.boolean(),
                time: Yup.array().when("alwaysOn", {
                  is: false,
                  then: (schema) =>
                    schema
                      .of(
                        Yup.object().shape({
                          startTime: Yup.string()
                            .matches(
                              timeRegex,
                              "Start time must be a valid time (HH:MM)"
                            )
                            .required("Start time is required"),
                          endTime: Yup.string()
                            .matches(
                              timeRegex,
                              "End time must be a valid time (HH:MM)"
                            )
                            .required("End time is required")
                            .test(
                              "is-after-start",
                              "End time must be after start time",
                              function (endTime) {
                                const startTime = this.parent.startTime;
                                if (!startTime || !endTime) return true;
                                return (
                                  new Date(`1970-01-01T${endTime}:00`) >
                                  new Date(`1970-01-01T${startTime}:00`)
                                );
                              }
                            ),
                        })
                      )
                      .min(1, "At least one time slot is required")
                      .required("Time slots are required"),
                  otherwise: (schema) => schema.notRequired(),
                }),
              })
            )
            .min(1, "At least one day with time slots is required")
            .required("Days are required"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  // qualifyingLine: Yup.number()
  //   .min(1, "Qualifying line must be at least 1")
  //   .required("Qualifying line is required"),
  prizepool: Yup.number()
    .min(0, "Prizepool must be non-negative")
    .required("Prizepool is required"),
  weekOfTheStarPrice: Yup.number()
    .min(0, "Week of The Star Price must be non-negative")
    .required("Week of The Star Price is required"),
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
          .required("Timeline(AR) title is required")
          .matches(
            /^\S.*\S$/,
            "Timeline title(AR) cannot start or end with spaces"
          ),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date()
          .required("End date is required")
          .min(Yup.ref("startDate"), "End date must be after start date"),
        // description: Yup.string().required("Timeline description is required"),
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
  // cardPhoto: Yup.mixed().required("Card Photo is required"),
  startDate: Yup.date().required("Start date is required"),
  // .min(new Date().setTime(0), "Start date cannot be in the past"),
  endDate: Yup.date().required("End date is required"),
  // .min(Yup.ref("startDate"), "End date must be after start date"),
  // messages: Yup.array()
  //   .of(
  //     Yup.string().test(
  //       "not-empty",
  //       "Message cannot be empty",
  //       (value) => !value || !!value.replace(/<[^>]+>/g, "").trim()
  //     )
  //   )
  //   .min(1, "At least one message is required")
  //   .test("first-not-empty", "Message 1 cannot be empty", (value) =>
  //     value && value[0] ? !!value[0].replace(/<[^>]+>/g, "").trim() : false
  //   ),
  // randomMessages: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       randomText: Yup.string().test(
  //         "not-empty",
  //         "Random Message cannot be empty",
  //         (value) => !value || !!value.replace(/<[^>]+>/g, "").trim()
  //       ),
  //       tags: Yup.array()
  //         .of(
  //           Yup.string()
  //             .trim()
  //             .min(1, "Tag cannot be empty")
  //             .required("Tag is required")
  //         )
  //         .min(1, "At least one tag is required"),
  //     })
  //   )
  //   .min(1, "At least one random message is required")
  //   .test("first-not-empty", "Random Message 1 cannot be empty", (value) =>
  //     value && value[0]?.randomText
  //       ? !!value[0].randomText.replace(/<[^>]+>/g, "").trim()
  //       : false
  //   ),
  isWeekOfTheStar: Yup.boolean(), // <-- NEW KEY, no required
});

const LeagueStep1: FC<StepProps> = ({ step }) => {
  const dispatch = useDispatch();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    setFieldTouched,
  } = useFormikContext<any>();

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

  const loadDevicesOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(
      fetchDevices({ page, perPage, search })
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

  // Update playersPerTeam when format changes to 1v1
  React.useEffect(() => {
    if (values.format === "1v1") {
      setFieldValue("playersPerTeam", 1);
    }
  }, [values.format, setFieldValue]);

  // Set default StartDate to today if not already set
  React.useEffect(() => {
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
          League Title
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
          لقب الدوري
        </label>
        {touched.titleAr && errors.titleAr && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.titleAr}
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
          placeholder="Select the game"
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
          id="device"
          name="device"
          value={values.device}
          loadOptions={loadDevicesOptions}
          onChange={(selected: any) => setFieldValue("device", selected)}
          onBlur={() => setFieldTouched("device", true)}
          additional={{ page: 1 }}
          placeholder="Select the device"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#212739",
              border:
                touched.device && errors.device ? "1px solid #ef4444" : "none",
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
        {touched.device && errors.device && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.device.label}
          </div>
        )}
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <label
          htmlFor="format"
          className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Format
        </label>
        <Field
          as="select"
          id="format"
          name="format"
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.format && errors.format ? "border border-red-500" : ""
          }`}
          style={{
            backgroundImage: `url(${downarr})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px 16px",
          }}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleChange(e);
            if (e.target.value === "1v1") {
              setFieldValue("playersPerTeam", 1);
            }
          }}
        >
          <option value="" disabled>
            Select format
          </option>
          {/* <option value="party queue">Party Queue</option> */}
          <option value="solo queue">Solo Queue</option>
          {/* <option value="1v1">1v1</option> */}
        </Field>
        {touched.format && errors.format && (
          <div className="text-red-500 text-[0.7rem] mt-1">{errors.format}</div>
        )}
      </div>

      <div className="relative float-label-input custom-input mb-4">
        <Field
          type="number"
          id="playersPerTeam"
          name="playersPerTeam"
          placeholder=" "
          min="1"
          max="5"
          disabled={values.format === "1v1"}
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.playersPerTeam && errors.playersPerTeam
              ? "border border-red-500"
              : ""
          } ${values.format === "1v1" ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        <label
          htmlFor="playersPerTeam"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Players Per Team
        </label>
        {touched.playersPerTeam && errors.playersPerTeam && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.playersPerTeam}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="relative float-label-input custom-input">
          <DatePicker
            selected={values.startDate ? new Date(values.startDate) : null}
            onChange={(date: Date) => setFieldValue("startDate", date)}
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
            onChange={(date: Date) => setFieldValue("endDate", date)}
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

      <style>{`
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
      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Is Week Of The Star?</span>
        <label className="inline-flex items-center cursor-pointer">
          <Field
            type="checkbox"
            name="isWeekOfTheStar"
            checked={values.isWeekOfTheStar}
            onChange={() =>
              setFieldValue("isWeekOfTheStar", !values.isWeekOfTheStar)
            }
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div>
    </div>
  );
};

const LeagueStep2: FC<StepProps> = ({ step }) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    setFieldTouched,
  } = useFormikContext<League>();

  const [previews, setPreviews] = useState<{ [key: number]: string | null }>(
    {}
  );
  const [uploadErrors, setUploadErrors] = useState({});
  const dispatch = useDispatch();

  const [openDays, setOpenDays] = useState({});

  const toggleDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Handle file change for image uploads
  // const handleFileChange = (index: number, file: File | null) => {
  //   if (file) {
  //     setFieldValue(`customRegistrationFields[${index}].image`, file);
  //     const objectUrl = URL.createObjectURL(file);
  //     setPreviews((prev) => ({ ...prev, [index]: objectUrl }));
  //   } else {
  //     setFieldValue(`customRegistrationFields[${index}].image`, null);
  //     setPreviews((prev) => ({ ...prev, [index]: null }));
  //   }
  // };

  // Handle file change and upload to API
  const handleFileChange = async (index: number, file: File | null) => {
    if (!file) {
      setFieldValue(`customRegistrationFields[${index}].image`, null);
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        if (newPreviews[index] && newPreviews[index]?.startsWith("blob:")) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = null;
        return newPreviews;
      });
      setUploadErrors((prev) => ({ ...prev, [index]: null }));
      return;
    }

    // Generate local preview
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [index]: previewUrl }));

    // Prepare form data for API
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await dispatch(uploadFile(formData));
      if (result?.payload?.data) {
        const fileUrl = `${result.payload.data}`;
        setFieldValue(`customRegistrationFields[${index}].image`, fileUrl);
        setPreviews((prev) => ({ ...prev, [index]: fileUrl })); // Update preview to server URL
        setUploadErrors((prev) => ({ ...prev, [index]: null }));
      } else {
        throw new Error("No file URL returned from API");
      }
    } catch (err) {
      console.error("File upload error:", err);
      setUploadErrors((prev) => ({
        ...prev,
        [index]: "Failed to upload image",
      }));
      setFieldValue(`customRegistrationFields[${index}].image`, null);
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        if (newPreviews[index]?.startsWith("blob:")) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = null;
        return newPreviews;
      });
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setFieldValue(`customRegistrationFields[${index}].image`, null);
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      if (newPreviews[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]!);
      }
      delete newPreviews[index];
      return newPreviews;
    });
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  // Initialize previews for edit mode
  useEffect(() => {
    const newPreviews: { [key: number]: string | null } = {};
    values.customRegistrationFields.forEach((field, index) => {
      if (field.image && typeof field.image === "string" && !previews[index]) {
        newPreviews[index] = field.image.startsWith(baseURL)
          ? field.image
          : `${field.image}`;
      }
    });
    setPreviews((prev) => ({ ...prev, ...newPreviews }));

    return () => {
      // Cleanup only blob URLs on unmount
      Object.entries(previews).forEach(([index, preview]) => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [values.customRegistrationFields]);

  return (
    <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        League Details
      </h4>

      {/* <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Limit Matches Per Player</span>
        <label className="inline-flex items-center cursor-pointer">
          <Field
            type="checkbox"
            name="maxMatchesPerPlayer.isActive"
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div> */}

      {/* {values.maxMatchesPerPlayer.isActive && (
        <div className="relative float-label-input custom-input mb-4">
          <Field
            type="number"
            id="maxMatches"
            name="maxMatchesPerPlayer.maxMatches"
            placeholder=" "
            className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
              touched.maxMatchesPerPlayer?.maxMatches &&
              errors.maxMatchesPerPlayer?.maxMatches
                ? "border border-red-500"
                : ""
            }`}
          />
          <label
            htmlFor="maxMatches"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Maximum Matches
          </label>
          {touched.maxMatchesPerPlayer?.maxMatches &&
            errors.maxMatchesPerPlayer?.maxMatches && (
              <div className="text-red-500 text-[0.7rem] mt-1">
                {errors.maxMatchesPerPlayer.maxMatches}
              </div>
            )}
        </div>
      )} */}
      <>
        <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
          <span className="text-white font-medium">Always On Queue</span>
          <label className="inline-flex items-center cursor-pointer">
            <Field
              type="checkbox"
              name="queueSettings.alwaysOn"
              className="sr-only peer"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e);
                if (e.target.checked) {
                  setFieldValue("queueSettings.schedule", { days: [] });
                  setOpenDays({});
                }
              }}
            />
            <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
          </label>
        </div>

        {!values?.queueSettings?.alwaysOn && (
          <div className="mb-4">
            <h5 className="text-white mb-2 text-base font-medium">
              Queue Schedule
            </h5>
            <div className="mb-4">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => {
                const dayData = values?.queueSettings?.schedule?.days.find(
                  (d) => d.day === day
                );
                return (
                  <div key={day} className="mb-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <Field
                            type="checkbox"
                            name={`queueSettings.schedule.days[${values?.queueSettings?.schedule?.days.findIndex(
                              (d) => d.day === day
                            )}].day`}
                            checked={!!dayData}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const updatedDays = [
                                ...(values?.queueSettings?.schedule?.days ||
                                  []),
                              ];
                              if (e.target.checked) {
                                updatedDays.push({
                                  day,
                                  alwaysOn: false,
                                  time: [{ startTime: "", endTime: "" }],
                                });
                                setOpenDays((prev) => ({
                                  ...prev,
                                  [day]: true,
                                }));
                              } else {
                                const index = updatedDays.findIndex(
                                  (d) => d.day === day
                                );
                                if (index !== -1) {
                                  updatedDays.splice(index, 1);
                                  setOpenDays((prev) => {
                                    const newOpenDays = { ...prev };
                                    delete newOpenDays[day];
                                    return newOpenDays;
                                  });
                                }
                              }
                              setFieldValue(
                                "queueSettings.schedule.days",
                                updatedDays
                              );
                            }}
                            className="sr-only peer"
                          />
                          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                          <span className="ml-2 text-[0.78125rem] text-white capitalize">
                            {day}
                          </span>
                        </label>
                        {dayData && (
                          <span className="text-[0.78125rem] text-white ml-2">
                            {dayData.time
                              ?.filter((slot) => slot.startTime && slot.endTime)
                              ?.map((slot, index) => (
                                <span
                                  key={index}
                                  className="bg-custom-gray ml-2 py-[0.125rem] px-1 rounded"
                                >
                                  {index > 0 && ""}
                                  {`${slot.startTime} - ${slot.endTime}`}
                                </span>
                              )) || ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {dayData && (
                          <>
                            <label className="inline-flex items-center cursor-pointer mr-3">
                              <Field
                                type="checkbox"
                                name={`queueSettings.schedule.days[${values?.queueSettings?.schedule?.days.findIndex(
                                  (d) => d.day === day
                                )}].alwaysOn`}
                                checked={dayData.alwaysOn}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const updatedDays = [
                                    ...values?.queueSettings?.schedule?.days,
                                  ];
                                  const dayIndex = updatedDays.findIndex(
                                    (d) => d.day === day
                                  );
                                  if (dayIndex !== -1) {
                                    updatedDays[dayIndex].alwaysOn =
                                      e.target.checked;
                                    // Do not clear time slots or change openDays
                                    setFieldValue(
                                      "queueSettings.schedule.days",
                                      updatedDays
                                    );
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                              <span className="ml-2 text-[0.78125rem] text-white">
                                24-Hour Operation
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => toggleDay(day)}
                              className="text-white text-[0.78125rem] focus:outline-none"
                            >
                              {openDays[day] ? <ChevronUp /> : <ChevronDown />}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {dayData && openDays[day] && (
                      <div className="border p-2 rounded border-[#243c5a] time__pic-wrap">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="grid grid-cols-2 gap-3 flex-grow">
                            <div className="text-white text-[0.78125rem]">
                              Start
                            </div>
                            <div className="text-white text-[0.78125rem]">
                              End
                            </div>
                          </div>
                          <div className="text-white text-[0.78125rem]">
                            Action
                          </div>
                        </div>
                        {dayData.time.map((_: any, index: number) => {
                          const dayIndex =
                            values?.queueSettings?.schedule?.days.findIndex(
                              (d) => d.day === day
                            );
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 mb-2"
                            >
                              <div className="grid grid-cols-2 gap-3 flex-grow">
                                <TimePickerField
                                  name={`queueSettings.schedule.days[${dayIndex}].time[${index}].startTime`}
                                />
                                <TimePickerField
                                  name={`queueSettings.schedule.days[${dayIndex}].time[${index}].endTime`}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedDays = [
                                    ...values?.queueSettings?.schedule?.days,
                                  ];
                                  const dayIndex = updatedDays.findIndex(
                                    (d) => d.day === day
                                  );
                                  if (dayIndex !== -1) {
                                    updatedDays[dayIndex].time = updatedDays[
                                      dayIndex
                                    ].time.filter(
                                      (_: any, i: number) => i !== index
                                    );
                                    if (
                                      updatedDays[dayIndex].time.length === 0
                                    ) {
                                      updatedDays.splice(dayIndex, 1);
                                      setOpenDays((prev) => {
                                        const newOpenDays = { ...prev };
                                        delete newOpenDays[day];
                                        return newOpenDays;
                                      });
                                    }
                                    setFieldValue(
                                      "queueSettings.schedule.days",
                                      updatedDays
                                    );
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 text-[0.78125rem] font-medium txt_delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedDays = [
                              ...values?.queueSettings?.schedule?.days,
                            ];
                            const dayIndex = updatedDays.findIndex(
                              (d) => d.day === day
                            );
                            if (dayIndex !== -1) {
                              updatedDays[dayIndex].time = [
                                ...updatedDays[dayIndex].time,
                                { startTime: "", endTime: "" },
                              ];
                              setFieldValue(
                                "queueSettings.schedule.days",
                                updatedDays
                              );
                              setOpenDays((prev) => ({ ...prev, [day]: true }));
                            }
                          }}
                          className="mt-2 text-[0.78125rem] text-white bg-primary-gradient hover:bg-primary-gradient-dark rounded-[0.52rem] px-3 py-1"
                        >
                          Add Time Slot
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {touched.queueSettings?.schedule?.days &&
              errors.queueSettings?.schedule?.days &&
              typeof errors?.queueSettings?.schedule?.days === "string" && (
                <div className="text-red-500 text-[0.7rem] mb-2">
                  {errors?.queueSettings?.schedule?.days}
                </div>
              )}
          </div>
        )}
      </>

      {/* <div className="relative float-label-input custom-input mb-4">
        <Field
          type="number"
          id="qualifyingLine"
          name="qualifyingLine"
          placeholder=" "
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.qualifyingLine && errors.qualifyingLine
              ? "border border-red-500"
              : ""
          }`}
        />
        <label
          htmlFor="qualifyingLine"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Qualifying Line
        </label>
        {touched.qualifyingLine && errors.qualifyingLine && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.qualifyingLine}
          </div>
        )}
      </div> */}

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
      <div className="relative float-label-input custom-input mb-4">
        <Field
          type="number"
          id="weekOfTheStarPrice"
          name="weekOfTheStarPrice"
          placeholder=" "
          className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal ${
            touched.weekOfTheStarPrice && errors.weekOfTheStarPrice
              ? "border border-red-500"
              : ""
          }`}
        />
        <label
          htmlFor="weekOfTheStarPrice"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Star of the week price
        </label>
        {touched.weekOfTheStarPrice && errors.weekOfTheStarPrice && (
          <div className="text-red-500 text-[0.7rem] mt-1">
            {errors.weekOfTheStarPrice}
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
                    {index !== 0 && ( // Only show delete button for fields after the first one
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
                            date ? date : ""
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
                            date ? date : ""
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
                        minDate={
                          values.timeLine[index]?.startDate &&
                          new Date(values.timeLine[index].startDate)
                        }
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
                    {index !== 0 && ( // Only show delete button for fields after the first one
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
                      readOnly={index === 0}
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
                      readOnly={index === 0}
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
                      {/* <option value="select">Select</option> */}
                    </Field>
                    {touched.customRegistrationFields?.[index]?.fieldType &&
                      errors.customRegistrationFields?.[index]?.fieldType && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.customRegistrationFields[index].fieldType}
                        </div>
                      )}
                  </div>
                  <div className="relative flex-1 custom-input mb-4">
                    <label
                      htmlFor={`customRegistrationFields[${index}].image`}
                      className="block text-[0.78125rem] font-bold text-custom-gray mb-2"
                    >
                      Upload Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id={`customRegistrationFields[${index}].image`}
                        onChange={(e) =>
                          handleFileChange(index, e.target.files?.[0] || null)
                        }
                        className="block w-full text-[0.78125rem] text-white bg-[#2B3245] rounded-[0.52rem] px-3 py-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2792FF] file:text-white hover:file:bg-[#1c74d1]"
                      />
                      {previews[index] && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-2 right-2 text-gray-400 bg-transparent rounded-full hover:bg-gray-600 hover:text-white p-1 transition duration-200"
                          title="Remove Image"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="sr-only">Remove Image</span>
                        </button>
                      )}
                    </div>
                    {previews[index] && (
                      <div className="mt-2">
                        <img
                          src={`${baseURL}/api/v1/${previews[index]}`}
                          alt="Preview"
                          className="max-w-full h-auto rounded-[0.52rem]"
                          style={{ maxHeight: "100px" }}
                        />
                      </div>
                    )}
                    {touched.customRegistrationFields?.[index]?.image &&
                      errors.customRegistrationFields?.[index]?.image && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.customRegistrationFields[index].image}
                        </div>
                      )}

                    {uploadErrors[index] && (
                      <div className="text-red-500 text-[0.7rem] mt-1">
                        {uploadErrors[index]}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="relative flex-1 custom-input mb-4">
                      <label
                        htmlFor={`customRegistrationFields[${index}].checkboxText`}
                        className="block text-[0.78125rem] font-bold text-custom-gray mb-2"
                      >
                        Checkbox Text
                      </label>
                      <ReactQuill
                        value={
                          values.customRegistrationFields[index].checkboxText
                        }
                        onChange={(value) =>
                          setFieldValue(
                            `customRegistrationFields[${index}].checkboxText`,
                            value
                          )
                        }
                        className={`custom-quill-editor bg-[#2B3245] rounded-[0.52rem] text-white ${
                          touched.customRegistrationFields?.[index]
                            ?.checkboxText &&
                          errors.customRegistrationFields?.[index]?.checkboxText
                            ? "border border-red-500"
                            : ""
                        }`}
                      />

                      {touched.customRegistrationFields?.[index]
                        ?.checkboxText &&
                        errors.customRegistrationFields?.[index]
                          ?.checkboxText && (
                          <div className="text-red-500 text-[0.7rem] mt-1">
                            {
                              errors.customRegistrationFields[index]
                                .checkboxText
                            }
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal">
                    <span className="text-white font-medium">Required</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <Field
                        type="checkbox"
                        name={`customRegistrationFields[${index}].required`}
                        className="sr-only peer"
                        checked={index === 0 ? true : field.required} // First field is always required
                        disabled={index === 0} // Disable checkbox for first field
                      />
                      <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  push({
                    fieldName: "",
                    fieldType: "text",
                    required: false,
                  })
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

const LeagueStep3: FC<StepProps> = ({ step, leagueData }: any) => {
  const dispatch = useDispatch();
  const { values, errors, touched, setFieldValue } = useFormikContext<League>();

  const [imgFile, setImgFile] = useState<string | undefined>();
  const [pdfFile, setPdfFile] = useState<string | undefined>();
  const [headerPhoto, setHeaderPhoto] = useState<string | undefined>();
  // const [cardPhoto, setCardPhoto] = useState<string | undefined>();
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
              const fileUrl = `${baseURL}/api/v1/${result?.payload?.data}`;
              setFile(fileUrl);
              setFieldValue(field, result.payload.data);
            }
          })
          .catch((err: any) => {
            console.log("err", err);
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
              imgFile
                ? imgFile
                : leagueData?.logo
                ? `${baseURL}/api/v1/${leagueData?.logo}`
                : ""
            }
            label="Outside photo (Suggested: 270*330px)"
            id="logo"
            onChange={handleFileUpload("logo", setImgFile)}
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
                ? headerPhoto
                : leagueData?.headerPhoto
                ? `${baseURL}/api/v1/${leagueData?.headerPhoto}`
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

        {/* <div className="file-upload-section">
          <FileUpload
            previewUrl={
              cardPhoto
                ? cardPhoto
                : leagueData?.cardPhoto
                ? `${baseURL}/api/v1/${leagueData?.cardPhoto}`
                : ""
            }
            label="Card Photo"
            id="cardPhoto"
            onChange={handleFileUpload("cardPhoto", setCardPhoto)}
            accept="image/*"
          />
          {touched.cardPhoto && errors.cardPhoto && (
            <div className="error-text">{errors.cardPhoto}</div>
          )}
        </div> */}

        <div className="file-upload-section">
          <FileUpload
            previewUrl={
              internalPhoto
                ? internalPhoto
                : leagueData?.internalPhoto
                ? `${baseURL}/api/v1/${leagueData?.internalPhoto}`
                : ""
            }
            label="Inside photo (Suggested: 300*300px)"
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
                : leagueData?.rules
                ? `/pdf-2127829_640.webp`
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

const LeagueStep4: FC<StepProps> = ({ step }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<League>();
  const handleTagToggle = (
    tag: string,
    index: number,
    currentTags: string[]
  ) => {
    if (currentTags.includes(tag)) {
      // Remove tag
      setFieldValue(
        `randomMessages[${index}].tags`,
        currentTags.filter((t) => t !== tag)
      );
    } else {
      // Add tag
      setFieldValue(`randomMessages[${index}].tags`, [...currentTags, tag]);
    }
  };

  return (
    <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Additional Information
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
                          <div className="relative float-label-input custom-input">
                            <input
                              // className="border-0 focus-0"
                              type="text"
                              placeholder="Add a tag..."
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  e.currentTarget.value.trim()
                                ) {
                                  const newTag = e.currentTarget.value.trim();
                                  setFieldValue(
                                    `randomMessages[${index}].tags`,
                                    [...randomMessage.tags, newTag]
                                  );
                                  e.currentTarget.value = ""; // Reset input
                                  e.preventDefault();
                                }
                              }}
                              className={`
                              w-full text-[0.78125rem] text-white focus:outline-none focus:border-[#2792FF] pt-[0.5rem] pb-[0.35rem] bg-input-color rounded-[0.1rem] px-3 appearance-none leading-normal
                              ${
                                touched.randomMessages?.[index]?.tags &&
                                errors.randomMessages?.[index]?.tags
                                  ? "border border-red-500"
                                  : ""
                              }`}
                            />
                            {/* <label className="absolute top-0 left-0 translate-y-[0.1rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">
                              Add Custom Tag
                            </label> */}
                          </div>
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
                      {/* <div className="flex flex-wrap gap-2 mb-2">
                        {randomMessage.tags.map((tag, tagIndex) => (
                          <div
                            key={tagIndex}
                            className="flex items-center bg-[#2792FF] text-white text-[0.78125rem] px-2 py-1 rounded-[0.52rem]"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                handleTagToggle(tag, index, randomMessage.tags)
                              }
                              className="ml-2 text-white hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div> */}
                      {/* <div className="flex flex-wrap gap-2">
                        {predefinedTags
                          .filter((tag) => !randomMessage.tags.includes(tag))
                          .map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() =>
                                handleTagToggle(tag, index, randomMessage.tags)
                              }
                              className="bg-[#2B3245] text-white text-[0.78125rem] px-2 py-1 rounded-[0.52rem] hover:bg-[#2792FF] transition duration-200"
                            >
                              {tag}
                            </button>
                          ))}
                      </div> */}
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

export const AddLeague: FC = () => {
  const location = useLocation();

  const leagueData = location?.state?.league;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  let pID = window.location.pathname.split("/")[1];

  // Initialize form values
  const [initialValues, setInitialValues] = useState<League>({
    title: leagueData?.title ? leagueData?.title : "",
    titleAr: leagueData?.titleAr ? leagueData?.titleAr : "",
    partner: leagueData?.partner ? leagueData?.partner : pID,
    game: leagueData?.game?._id
      ? { value: leagueData?.game?._id, label: leagueData?.game?.name }
      : "",
    device: leagueData?.platform?._id
      ? {
          value: leagueData?.platform?._id,
          label: leagueData?.platform?.name,
        }
      : "",
    // platform: "",
    format: leagueData?.format ? leagueData?.format : "solo queue",
    playersPerTeam: leagueData?.playersPerTeam ? leagueData?.playersPerTeam : 0,
    weekOfTheStarPrice: leagueData?.weekOfTheStarPrice
      ? leagueData?.weekOfTheStarPrice
      : 0,
    // maxMatchesPerPlayer: leagueData?.maxMatchesPerPlayer
    //   ? leagueData?.maxMatchesPerPlayer
    //   : { isActive: false, maxMatches: 0 },
    queueSettings: leagueData?.queueSettings
      ? {
          ...leagueData.queueSettings,
          schedule: leagueData.queueSettings.schedule
            ? {
                ...leagueData.queueSettings.schedule,
                startTime: leagueData.queueSettings.schedule.startTime,
                endTime: leagueData.queueSettings.schedule.endTime,
              }
            : { days: [], startTime: "", endTime: "" },
        }
      : {
          alwaysOn: false,
          schedule: { days: [], startTime: "", endTime: "" },
        },
    // qualifyingLine: leagueData?.qualifyingLine ? leagueData?.qualifyingLine : 0,
    prizepool: leagueData?.prizepool ? leagueData?.prizepool : 0,
    rules: leagueData?.rules ? leagueData?.rules : null,
    headerPhoto: leagueData?.headerPhoto ? leagueData?.headerPhoto : null,
    internalPhoto: leagueData?.internalPhoto ? leagueData?.internalPhoto : null,
    // cardPhoto: leagueData?.cardPhoto ? leagueData?.cardPhoto : null,
    timeLine:
      leagueData?.timeLine?.length > 0
        ? leagueData?.timeLine
        : [
            {
              title: "",
              titleAr: "",
              startDate: "",
              endDate: "",
              // description: ""
            },
          ],
    customRegistrationFields:
      leagueData?.customRegistrationFields?.length > 0
        ? leagueData?.customRegistrationFields
        : [
            {
              fieldName: "Game ID",
              fieldType: "text",
              required: true, // First field is required by default
            },
          ],
    logo: leagueData?.logo ? leagueData?.logo : null,
    startDate: leagueData?.startDate ? leagueData?.startDate : "",
    endDate: leagueData?.endDate ? leagueData?.endDate : "",
    messages: leagueData?.messages?.length > 0 ? leagueData.messages : [""],
    randomMessages:
      leagueData?.randomMessages?.length > 0
        ? leagueData.randomMessages
        : [{ randomText: "", tags: [] }],
    isWeekOfTheStar:
      typeof leagueData?.isWeekOfTheStar === "boolean"
        ? leagueData.isWeekOfTheStar
        : false, // default false
  });

  const handleSubmit = (values: League) => {
    const bodyData = {
      title: values.title,
      titleAr: values.titleAr,
      partner: leagueData?.partner || pID,
      game: values.game?.value || "",
      platform: values.device?.value || "",
      format: values.format,
      playersPerTeam: values.playersPerTeam,
      // maxMatchesPerPlayer: values.maxMatchesPerPlayer,
      weekOfTheStarPrice: values.weekOfTheStarPrice,
      // queueSettings: values.queueSettings,
      queueSettings: values.queueSettings,

      // qualifyingLine: values.qualifyingLine,
      prizepool: values.prizepool,
      rules: values.rules,
      headerPhoto: values.headerPhoto,
      internalPhoto: values.internalPhoto,
      // cardPhoto: values.cardPhoto,
      timeLine: values.timeLine,
      customRegistrationFields: values.customRegistrationFields,
      logo: values.logo,
      startDate: values.startDate,
      endDate: values.endDate,

      ...(values.messages &&
        values.messages.length > 0 &&
        values.messages.some((msg) => msg && msg.trim().length > 0) && {
          messages: values.messages,
        }),

      ...(values.randomMessages &&
        values.randomMessages.length > 0 &&
        values.randomMessages.some(
          (item) =>
            (item.randomText && item.randomText.trim().length > 0) ||
            (item.tags && item.tags.length > 0)
        ) && { randomMessages: values.randomMessages }),
      isWeekOfTheStar: values.isWeekOfTheStar, // <-- pass to backend
    };

    if (leagueData?._id) {
      dispatch(updateLeague({ id: leagueData?._id, league: bodyData })).then(
        (result) => {
          if (updateLeague.fulfilled.match(result)) {
            navigate(`/${pID}/leagues`);
          }
          setShowModal(false);
        }
      );
    } else {
      dispatch(addLeague(bodyData)).then((result) => {
        if (addLeague.fulfilled.match(result)) {
          navigate(`/${pID}/leagues`);
        }
        setShowModal(false);
      });
    }
  };

  const nextStep = (
    validateForm: (values?: any) => Promise<any>,
    values: League
  ) => {
    validateForm().then((errors) => {
      const stepFields = {
        1: [
          "title",
          "game",
          "partner",
          "device",
          "format",
          "playersPerTeam",
          "startDate",
          "endDate",
        ],
        2: [
          // "maxMatchesPerPlayer",
          "weekOfTheStarPrice",
          "queueSettings",
          // "qualifyingLine",
          "prizepool",
          "timeLine",
          "customRegistrationFields",
        ],
        3: [
          "logo",
          "rules",
          "headerPhoto",
          "internalPhoto",
          // "cardPhoto"
        ],
        4: ["message", "randomMessage"], // New step fields
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
    values: League
  ) => {
    validateForm().then((errors) => {
      const stepFields = {
        1: [
          "title",
          "game",
          "partner",
          "device",
          "format",
          "playersPerTeam",
          "startDate",
          "endDate",
        ],
        2: [
          // "maxMatchesPerPlayer",
          "weekOfTheStarPrice",
          "queueSettings",
          // "qualifyingLine",
          "prizepool",
          "timeLine",
          "customRegistrationFields",
        ],
        3: [
          "logo",
          "rules",
          "headerPhoto",
          "internalPhoto",
          // "cardPhoto"
        ],
        4: ["message", "randomMessage"], // New step fields
      };

      const previousStepErrors = Object.keys(errors).some((key) =>
        stepFields[Math.min(step, selectedStep)].includes(key)
      );

      if (!previousStepErrors || selectedStep < step) {
        setStep(selectedStep);
      }
    });
  };

  // New function to handle direct save
  const handleDirectSave = (
    values: League,
    submitForm: () => Promise<void>
  ) => {
    submitForm().then(() => {
      // setShowModal(true);
    });
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ validateForm, values, submitForm }) => (
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
                  {leagueData?._id ? "Update League" : "Add New League"}
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

            {step === 1 && <LeagueStep1 step={step} />}
            {step === 2 && <LeagueStep2 step={step} />}
            {step === 3 && <LeagueStep3 step={step} leagueData={leagueData} />}
            {step === 4 && <LeagueStep4 step={step} />}

            <div
              className={`max-w-[42.5rem] mx-auto genral_form-info mb-4 flex items-center ${
                leagueData?._id ? "justify-between" : "justify-end"
              }`}
            >
              {/* Direct Save/Update Button */}
              {leagueData?._id && (
                <button
                  type="button"
                  onClick={() => handleDirectSave(values, submitForm)}
                  className="bg-green-600 w-[7.25rem] text-white hover:opacity-[0.75] duration-300 font-medium rounded-lg text-sm px-5 py-2.5  focus:outline-none"
                >
                  Direct Update
                </button>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="bg-gray-gradient w-[6.25rem]  text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-sm px-5 py-2.5  duration-300 focus:outline-none disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => nextStep(validateForm, values)}
                  className="bg-primary-gradient w-[6.25rem]  text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-sm px-5 py-2.5  focus:outline-none disabled:opacity-50"
                >
                  {step === 4 ? "Submit" : "Next Step"}
                </button>
              </div>
            </div>

            {showModal && (
              <ModalPopUp
                onCancel={() => setShowModal(false)}
                isUpdate={location.state ? true : false}
              />
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
