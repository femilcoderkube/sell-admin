import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { AsyncPaginate } from "react-select-async-paginate";
import { AppDispatch } from "../../app/store";
import {
  addTeam,
  fetchTeams,
  updateTeam,
} from "../../app/features/team/teamSlice";
import downarr from "../../assets/images/down_arr.svg";
import { uploadFile } from "../../app/features/fileupload/fileUploadSlice";
import { baseURL } from "../../axios";
import { fetchUsers } from "../../app/features/users/usersSlice";
import FileUpload from "../ui/UploadFile";
import { countryData } from "../../utils/CountryCodes";

interface AddTeamModalProps {
  isOpen: boolean;
  selectedTeam: any;
  onClose: () => void;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  selectedTeam,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoImageUrl, setLogoImageUrl] = useState<string | undefined>(
    undefined
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (selectedTeam) {
      if (selectedTeam.logoImage) {
        const fullUrl = `${baseURL}/api/v1/${selectedTeam.logoImage}`;
        setLogoImageUrl(fullUrl);
      } else {
        setLogoImageUrl(undefined);
      }

      if (selectedTeam.backgroundImage) {
        const fullUrl = `${baseURL}/api/v1/${selectedTeam.backgroundImage}`;
        setBackgroundImageUrl(fullUrl);
      } else {
        setBackgroundImageUrl(undefined);
      }
    } else {
      setLogoImageUrl(undefined);
      setBackgroundImageUrl(undefined);
    }

    return () => {
      if (logoImageUrl && logoImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoImageUrl);
      }
      if (backgroundImageUrl && backgroundImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
    };
  }, [selectedTeam]);

  if (!isOpen) return null;

  const validationSchema = Yup.object().shape({
    teamName: Yup.string()
      .required("Team name is required")
      .max(50, "Team name must be 50 characters or less")
      .matches(/^\S.*\S$/, "Team name cannot start or end with spaces"),
    teamShortName: Yup.string()
      .required("Team short name is required")
      .max(10, "Team short name must be 10 characters or less")
      .matches(/^\S.*\S$/, "Team short name cannot start or end with spaces"),
    region: Yup.string()
      .required("Region is required")
      .matches(/^\S.*\S$/, "Region cannot start or end with spaces"),
    members: Yup.array()
      .of(
        Yup.object().shape({
          user: Yup.object()
            .shape({
              value: Yup.string().required(),
              label: Yup.string().required("User Name is required"),
            })
            .required("User Name is required"),
          role: Yup.string()
            .required("Role is required")
            .matches(/^\S.*\S$/, "Role cannot start or end with spaces"),
        })
      )
      .min(1, "At least one member is required"),
    social: Yup.object().shape({
      facebookId: Yup.string()
        .nullable()
        .matches(/^\S.*\S$/, {
          message: "Facebook ID cannot start or end with spaces",
          excludeEmptyString: true,
        }),
      youtubeChannelId: Yup.string()
        .nullable()
        .matches(/^\S.*\S$/, {
          message: "YouTube Channel ID cannot start or end with spaces",
          excludeEmptyString: true,
        }),
      discordId: Yup.string()
        .nullable()
        .matches(/^\S.*\S$/, {
          message: "Discord ID cannot start or end with spaces",
          excludeEmptyString: true,
        }),
      twitchId: Yup.string()
        .nullable()
        .matches(/^\S.*\S$/, {
          message: "Twitch ID cannot start or end with spaces",
          excludeEmptyString: true,
        }),
      twitterId: Yup.string()
        .nullable()
        .matches(/^\S.*\S$/, {
          message: "Twitter ID cannot start or end with spaces",
          excludeEmptyString: true,
        }),
    }),
    logoImage: Yup.string()
      .nullable()
      .matches(/^\S.*\S$/, {
        message: "Logo image path cannot start or end with spaces",
        excludeEmptyString: true,
      }),
    backgroundImage: Yup.string()
      .nullable()
      .matches(/^\S.*\S$/, {
        message: "Background image path cannot start or end with spaces",
        excludeEmptyString: true,
      }),
  });

  const initialValues = selectedTeam?._id
    ? {
        teamName: selectedTeam.teamName || "",
        teamShortName: selectedTeam.teamShortName || "",
        region: selectedTeam.region || "Saudi Arabia",
        members: selectedTeam.members?.map((member: any) => ({
          user: {
            value: member.user._id || "",
            label: member.user.username || "",
          },
          role: member.role || "",
        })) || [{ user: { value: "", label: "" }, role: "" }],
        social: {
          facebookId: selectedTeam.social?.facebookId || "",
          youtubeChannelId: selectedTeam.social?.youtubeChannelId || "",
          discordId: selectedTeam.social?.discordId || "",
          twitchId: selectedTeam.social?.twitchId || "",
          twitterId: selectedTeam.social?.twitterId || "",
        },
        logoImage: selectedTeam.logoImage || "",
        backgroundImage: selectedTeam.backgroundImage || "",
      }
    : {
        teamName: "",
        teamShortName: "",
        region: "Saudi Arabia",
        members: [{ user: { value: "", label: "" }, role: "" }],
        social: {
          facebookId: "",
          youtubeChannelId: "",
          discordId: "",
          twitchId: "",
          twitterId: "",
        },
        logoImage: "",
        backgroundImage: "",
      };

  const handleFileUpload =
    (
      field: string,
      setFile: (url: string | undefined) => void,
      setFieldValue: (field: string, value: any) => void
    ) =>
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

  const loadUsersOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(
      fetchUsers({ page, perPage, searchTerm: search })
    );
    const data = response.payload;
    const options: any[] = data?.data.result.map((user: any) => ({
      value: user._id,
      label: user.username,
    }));

    return {
      options,
      hasMore: page * perPage < data.data.totalItem,
      additional: { page: page + 1 },
    };
  };

  const loadCountryOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 20;
    const filteredCountries = countryData
      .filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice((page - 1) * perPage, page * perPage);

    const options = filteredCountries.map((country) => ({
      value: country.name,
      label: country.name,
    }));

    return {
      options,
      hasMore: page * perPage < countryData.length,
      additional: { page: page + 1 },
    };
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const teamData = {
        teamName: values.teamName,
        teamShortName: values.teamShortName,
        region: values.region,
        members: values.members.map((member) => ({
          user: member?.user?.value,
          role: member.role,
        })),
        social: values.social,
        logoImage: values.logoImage || undefined,
        backgroundImage: values.backgroundImage || undefined,
      };

      if (selectedTeam) {
        const result = await dispatch(
          updateTeam({ id: selectedTeam._id, team: teamData })
        );

        if (updateTeam.fulfilled.match(result)) {
          resetForm();
          setLogoImageUrl(undefined);
          setBackgroundImageUrl(undefined);
          onClose();
          dispatch(fetchTeams({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        const result = await dispatch(addTeam(teamData));

        if (addTeam.fulfilled.match(result)) {
          resetForm();
          setLogoImageUrl(undefined);
          setBackgroundImageUrl(undefined);
          onClose();
          dispatch(fetchTeams({ page: 1, perPage: 10, searchTerm: "" }));
        }
      }
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A2332] rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 border border-gray-700/50">
        <div className="px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {selectedTeam ? "Update Team" : "Add New Team"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-gray-700/50 rounded-lg"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>

        <div
          className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
              touched,
              errors,
            }) => (
              <Form>
                <div className="space-y-2">
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Team Name
                  </label>
                  <Field
                    type="text"
                    name="teamName"
                    className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter team name"
                  />
                  <ErrorMessage
                    name="teamName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="teamShortName"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Team Short Name
                  </label>
                  <Field
                    type="text"
                    name="teamShortName"
                    className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter short name (e.g., AW)"
                  />
                  <ErrorMessage
                    name="teamShortName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Region
                  </label>
                  <AsyncPaginate
                    id="region"
                    name="region"
                    value={{ value: values.region, label: values.region }}
                    loadOptions={loadCountryOptions}
                    onChange={(selected: any) =>
                      setFieldValue("region", selected ? selected.value : "")
                    }
                    onBlur={() => setFieldTouched("region", true)}
                    additional={{ page: 1 }}
                    placeholder="Select a region"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#212739",
                        border:
                          touched.region && errors.region
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
                  <ErrorMessage
                    name="region"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="members"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Members
                  </label>
                  <FieldArray name="members">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.members.map((_, index) => (
                          <div key={index} className="flex space-x-3">
                            <div className="flex-1">
                              <AsyncPaginate
                                id={`members[${index}].user`}
                                name={`members[${index}].user`}
                                value={values.members[index].user}
                                loadOptions={loadUsersOptions}
                                onChange={(selected: any) =>
                                  setFieldValue(
                                    `members[${index}].user`,
                                    selected
                                  )
                                }
                                onBlur={() =>
                                  setFieldTouched(
                                    `members[${index}].user`,
                                    true
                                  )
                                }
                                additional={{ page: 1 }}
                                placeholder="Select a user"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    backgroundColor: "#212739",
                                    border:
                                      touched.members?.[index]?.user &&
                                      errors.members?.[index]?.user
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
                                  option: (
                                    base,
                                    { isFocused, isSelected }
                                  ) => ({
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
                                      style={{
                                        width: "16px",
                                        marginRight: "10px",
                                      }}
                                    />
                                  ),
                                }}
                              />
                              <ErrorMessage
                                name={`members[${index}].user`}
                                component="div"
                                className="text-red-500 text-[0.7rem] mt-1"
                              />
                            </div>
                            <div className="flex-1">
                              <Field
                                as="select"
                                name={`members[${index}].role`}
                                className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                              >
                                <option value="Player">Player</option>
                                <option value="Coach">Coach</option>
                                <option value="Manager">Manager</option>
                                <option value="President">President</option>
                              </Field>
                              <ErrorMessage
                                name={`members[${index}].role`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-400 p-2"
                              >
                                <svg
                                  className="w-5 h-5"
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
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ user: "", role: "" })}
                          className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          + Add Member
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="space-y-2 mt-4">
                  <label
                    htmlFor="social"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Social Media
                  </label>
                  <div className="space-y-3">
                    <Field
                      type="text"
                      name="social.facebookId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Facebook ID"
                    />
                    <ErrorMessage
                      name="social.facebookId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <Field
                      type="text"
                      name="social.youtubeChannelId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="YouTube Channel ID"
                    />
                    <ErrorMessage
                      name="social.youtubeChannelId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <Field
                      type="text"
                      name="social.discordId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Discord ID"
                    />
                    <ErrorMessage
                      name="social.discordId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <Field
                      type="text"
                      name="social.twitchId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Twitch ID"
                    />
                    <ErrorMessage
                      name="social.twitchId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <Field
                      type="text"
                      name="social.twitterId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Twitter ID"
                    />
                    <ErrorMessage
                      name="social.twitterId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <FileUpload
                    previewUrl={logoImageUrl || ""}
                    label="Logo Image (Suggested: 200*200px)"
                    id="logoImage"
                    onChange={handleFileUpload(
                      "logoImage",
                      setLogoImageUrl,
                      setFieldValue
                    )}
                    accept="image/*"
                  />
                  {touched.logoImage && errors.logoImage && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.logoImage}
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <FileUpload
                    previewUrl={backgroundImageUrl || ""}
                    label="Background Image (Suggested: 600*400px)"
                    id="backgroundImage"
                    onChange={handleFileUpload(
                      "backgroundImage",
                      setBackgroundImageUrl,
                      setFieldValue
                    )}
                    accept="image/*"
                  />
                  {touched.backgroundImage && errors.backgroundImage && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.backgroundImage}
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 bg-[#242B3C]/30 rounded-b-2xl border-t border-gray-700/50 mt-6">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? selectedTeam
                          ? "Updating..."
                          : "Adding..."
                        : selectedTeam
                        ? "Update Team"
                        : "Add Team"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;
