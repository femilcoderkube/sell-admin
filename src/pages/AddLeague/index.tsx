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
import { fetchPartners } from "../../app/features/partners/partnerSlice";
import { fetchDevices } from "../../app/features/devices/deviceSlice";
import { uploadFile } from "../../app/features/fileupload/fileUploadSlice";
import downarr from "../../assets/images/down_arr.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { baseURL } from "../../axios";
import { TimePickerField } from "../../components/ui/TimePickerField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

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
      days: string[];
      startTime: string;
      endTime: string;
    };
  };
  qualifyingLine: number;
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
  }>;
  logo: File | null;
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
}

interface StepProps {
  step: number;
}

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
  queueSettings: Yup.object().shape({
    alwaysOn: Yup.boolean(),
    schedule: Yup.object().when("alwaysOn", {
      is: false,
      then: (schema) =>
        schema.shape({
          days: Yup.array()
            .of(Yup.string())
            .min(1, "At least one day must be selected")
            .required("Days are required"),
          startTime: Yup.string()
            .matches(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              "Start time must be a valid time (HH:MM)"
            )
            .required("Start time is required"),
          endTime: Yup.string()
            .matches(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
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
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  qualifyingLine: Yup.number()
    .min(1, "Qualifying line must be at least 1")
    .required("Qualifying line is required"),
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
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date().setTime(0), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
});

const LeagueStep1: FC<StepProps> = ({ step }) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark", // 🔥 this enables dark mode
    },
  });
  const dispatch = useDispatch();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    setFieldTouched,
  } = useFormikContext();

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
            minDate={new Date()}
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
            placeholderText="Select end date"
            autoComplete="off"
            minDate={values.startDate ? new Date(values.startDate) : new Date()}
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
                setFieldValue("queueSettings.schedule", {
                  days: [],
                  startTime: "",
                  endTime: "",
                });
              }
            }}
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div>

      {!values.queueSettings.alwaysOn && (
        <div className="mb-4">
          <h5 className="text-white mb-2 text-base font-medium">
            Queue Schedule
          </h5>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <label
                key={day}
                className="inline-flex items-center cursor-pointer"
              >
                <Field
                  type="checkbox"
                  name="queueSettings.schedule.days"
                  value={day}
                  checked={values.queueSettings.schedule.days.includes(day)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const currentDays = values.queueSettings.schedule.days;
                    const updatedDays = e.target.checked
                      ? [...currentDays, day]
                      : currentDays.filter((d: string) => d !== day);
                    setFieldValue("queueSettings.schedule.days", updatedDays);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                <span className="ml-2 text-[0.78125rem] text-white">{day}</span>
              </label>
            ))}
          </div>
          {touched.queueSettings?.schedule?.days &&
            errors.queueSettings?.schedule?.days && (
              <div className="text-red-500 text-[0.7rem] mb-2">
                {errors.queueSettings.schedule.days}
              </div>
            )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <TimePickerField
              label="Start Time"
              name="queueSettings.schedule.startTime"
            />
            <TimePickerField
              label="End Time"
              name="queueSettings.schedule.endTime"
            />
          </div>
        </div>
      )}

      <div className="relative float-label-input custom-input mb-4">
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
          Total Week of The Star Price
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
                        minDate={new Date()}
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
                        minDate={
                          values.timeLine[index]?.startDate
                            ? new Date(values.timeLine[index].startDate)
                            : new Date()
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

                  {/* <div className="relative flex-1 custom-input mb-4">
                    <label
                      htmlFor={`customRegistrationFields[${index}].fieldName`}
                      className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                    >
                      Field Name
                    </label>
                    <Field
                      as="select"
                      id={`customRegistrationFields[${index}].fieldName`}
                      name={`customRegistrationFields[${index}].fieldName`}
                      className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal ${
                        touched.customRegistrationFields?.[index]?.fieldName &&
                        errors.customRegistrationFields?.[index]?.fieldName
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
                      <option value="gameid">Game ID</option>
                    </Field>
                    {touched.customRegistrationFields?.[index]?.fieldName &&
                      errors.customRegistrationFields?.[index]?.fieldName && (
                        <div className="text-red-500 text-[0.7rem] mt-1">
                          {errors.customRegistrationFields[index].fieldName}
                        </div>
                      )}
                  </div> */}
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
                      {/* <option value="select">Select</option> */}
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
                    fieldName: "Game ID",
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

// Step 3: Media and Rules
const LeagueStep3: FC<StepProps> = ({ step, leagueData }: any) => {
  const dispatch = useDispatch();
  const { values, errors, touched, setFieldValue } = useFormikContext<League>();

  const [imgFile, setImgFile] = useState();
  const [pdfFile, setPdfFile] = useState();

  const handleFileUploadForImage =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(uploadFile(formData))
          .then((result: any) => {
            if (result?.payload?.data) {
              setImgFile(`${baseURL}/api/v1/${result?.payload?.data}`);
              setFieldValue(field, result.payload.data);
            }
          })
          .catch((err: any) => {
            console.log("err", err);
          });
      }
    };
  const handleFileUploadForPDf =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(uploadFile(formData))
          .then((result: any) => {
            if (result?.payload?.data) {
              setPdfFile(`${baseURL}/api/v1/${result?.payload?.data}`);

              setFieldValue(field, result.payload.data);
            }
          })
          .catch((err: any) => {
            console.log("err", err);
          });
      }
    };

  return (
    <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Media and Rules
      </h4>

      <div className="mb-4">
        <FileUpload
          previewUrl={
            imgFile
              ? imgFile
              : leagueData?.logo
              ? `${baseURL}/api/v1/${leagueData?.logo}`
              : ""
          }
          label="Logo (270*330)"
          id="logo"
          onChange={handleFileUploadForImage("logo")}
          // accept="image/*"
        />
        {touched.logo && errors.logo && (
          <div className="text-red-500 text-[0.7rem] mt-1">{errors.logo}</div>
        )}
      </div>

      <div className="mb-4">
        <FileUpload
          previewUrl={
            pdfFile
              ? "/pdf-2127829_640.webp"
              : leagueData?.logo
              ? `/pdf-2127829_640.webp`
              : ""
          }
          label="Rules (PDF)"
          id="rules"
          onChange={handleFileUploadForPDf("rules")}
          accept="application/pdf"
          ispdf={true}
        />
        {touched.rules && errors.rules && (
          <div className="text-red-500 text-[0.7rem] mt-1">{errors.rules}</div>
        )}
      </div>
    </div>
  );
};

// Main AddLeague Component
export const AddLeague: FC = () => {
  const location = useLocation();
  const leagueData = location.state;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  let pID = window.location.pathname.split("/")[1];

  // Initialize form values
  const [initialValues, setInitialValues] = useState<League>({
    title: leagueData?.title ? leagueData.title : "",
    titleAr: leagueData?.titleAr ? leagueData.titleAr : "",
    partner: leagueData?.partner ? leagueData.partner : pID,
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
      ? leagueData?.queueSettings
      : {
          alwaysOn: false,
          schedule: { days: [], startTime: "", endTime: "" },
        },
    qualifyingLine: leagueData?.qualifyingLine ? leagueData.qualifyingLine : 0,
    prizepool: leagueData?.prizepool ? leagueData?.prizepool : 0,
    rules: leagueData?.rules ? leagueData?.rules : null,
    timeLine:
      leagueData?.timeLine.length > 0
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
      leagueData?.customRegistrationFields.length > 0
        ? leagueData?.customRegistrationFields
        : [
            {
              fieldName: "Game ID",
              fieldType: "text",
              required: true, // First field is required by default
            },
          ],
    logo: leagueData?.logo ? leagueData?.logo : null,
    startDate: leagueData?.startDate
      ? new Date(leagueData?.startDate).toISOString()
      : "",
    endDate: leagueData?.endDate
      ? new Date(leagueData?.endDate).toISOString()
      : "",
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
      queueSettings: values.queueSettings,
      qualifyingLine: values.qualifyingLine,
      prizepool: values.prizepool,
      rules: values.rules,
      timeLine: values.timeLine,
      customRegistrationFields: values.customRegistrationFields,
      logo: values.logo,
      startDate: values.startDate,
      endDate: values.endDate,
    };

    if (location?.state?._id) {
      dispatch(updateLeague({ id: location.state._id, league: bodyData })).then(
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
          "qualifyingLine",
          "prizepool",
          "timeLine",
          "customRegistrationFields",
        ],
        3: ["logo", "rules"],
      };

      const currentStepErrors = Object.keys(errors).some((key) =>
        stepFields[step].includes(key)
      );

      if (!currentStepErrors) {
        if (step < 3) {
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
      navigate(`/${pID}/leagues`);
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
          "qualifyingLine",
          "prizepool",
          "timeLine",
          "customRegistrationFields",
        ],
        3: ["logo", "rules"],
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
                  {leagueData?._id ? "Update League" : "Add New League"}
                </h3>
              </div>
            </div>

            <div className="leg_steps--con flex items-center justify-center my-[1.67rem] gap-[0.35rem]">
              {[1, 2, 3].map((num) => (
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
                  {num !== 3 && (
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
                  {step === 3 ? "Submit" : "Next Step"}
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
