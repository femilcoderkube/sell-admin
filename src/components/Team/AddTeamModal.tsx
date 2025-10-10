import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { AsyncPaginate } from "react-select-async-paginate";
import { AppDispatch } from "../../app/store";
import {
  addTeam,
  fetchTeams,
  setPerPage,
  updateTeam,
  fetchGames,
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

  const memberSchema = Yup.object().shape({
    user: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string().required("User Name is required"),
      })
      .required("User Name is required"),
    role: Yup.string()
      .required("Role is required")
      .matches(/^\S.*\S$/, "Role cannot start or end with spaces"),
    playerGames: Yup.array()
      .of(
        Yup.object().shape({
          game: Yup.object()
            .nullable()
            .shape({ value: Yup.string().required(), label: Yup.string().required() })
            .required("Game is required"),
          gameId: Yup.string().nullable(),
          gameRole: Yup.string().oneOf(["Player", "Coach", "Manager", "President"]).nullable(),
        })
      )
      .nullable(),
  });

  const validationSchema = Yup.object().shape({
    teamName: Yup.string()
      .required("Team name is required")
      .max(50, "Team name must be 50 characters or less"),
    teamShortName: Yup.string()
      .required("Team short name is required")
      .max(10, "Team short name must be 10 characters or less"),
    region: Yup.string()
      .required("Region is required")
      .matches(/^\S.*\S$/, "Region cannot start or end with spaces"),
    members: Yup.array()
      .of(memberSchema)
      .min(1, "At least one member is required")
      .test(
        "president-games-consistency",
        "All player games for a President must be 'President'; others must not have any 'President' game roles.",
        (members: any[] | undefined) =>
          (members || []).every(
            (m: any) =>
              (m?.role === "President"
                ? (m?.playerGames || []).every((pg: any) => pg?.gameRole === "President")
                : (m?.playerGames || []).every((pg: any) => pg?.gameRole !== "President"))
          )
      )
      .test(
        "exactly-one-president",
        "You must select exactly one President.",
        (members: any[] | undefined) => {
          const count = (members || []).reduce(
            (acc, m) => (m?.role === "President" ? acc + 1 : acc),
            0
          );
          return count === 1;
        }
      ),
    social: Yup.object().shape({
      twitterId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "Twitter Link cannot start or end with spaces", excludeEmptyString: true }),
      instagramId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "Instagram Link cannot start or end with spaces", excludeEmptyString: true }),
      twitchId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "Twitch Link cannot start or end with spaces", excludeEmptyString: true }),
      kickId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "Kick Link cannot start or end with spaces", excludeEmptyString: true }),
      discordId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "Discord Link cannot start or end with spaces", excludeEmptyString: true }),
      facebookId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "Facebook Link cannot start or end with spaces", excludeEmptyString: true }),
      tiktokId: Yup.string().nullable().matches(/^\S.*\S$/, { message: "TikTok Link cannot start or end with spaces", excludeEmptyString: true }),
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
          playerGames:
            member.playerGames?.map((pg: any) => ({
              game: pg?.game
                ? { value: pg.game?._id || pg.game, label: pg.game?.name || pg.gameId || "" }
                : null,
              gameId: pg?.gameId || "",
              gameRole: pg?.gameRole || "Player",
            })) || [],
        })) || [{ user: { value: "", label: "" }, role: "", playerGames: [] }],
        social: {
          twitterId: selectedTeam.social?.twitterId || "",
          instagramId: selectedTeam.social?.instagramId || "",
          twitchId: selectedTeam.social?.twitchId || "",
          kickId: selectedTeam.social?.kickId || "",
          discordId: selectedTeam.social?.discordId || "",
          facebookId: selectedTeam.social?.facebookId || "",
          tiktokId: selectedTeam.social?.tiktokId || "",
        },
        logoImage: selectedTeam.logoImage || "",
        backgroundImage: selectedTeam.backgroundImage || "",
      }
    : {
        teamName: "",
        teamShortName: "",
        region: "Saudi Arabia",
        members: [{ user: { value: "", label: "" }, role: "Player", playerGames: [] }],
        social: {
          twitterId: "",
          instagramId: "",
          twitchId: "",
          kickId: "",
          discordId: "",
          facebookId: "",
          tiktokId: "",
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
    _loadedOptions: any,
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

  const loadGamesOptions = async (
    search: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(fetchGames(search));
    const payload = response?.payload;
    const data = payload?.data ?? payload;
    const list = Array.isArray(data?.result) ? data.result : Array.isArray(data) ? data : [];
    const total = data?.totalItem ?? list.length;
    const options = list.map((game: any) => ({ value: game._id, label: game.name }));
    return {
      options,
      hasMore: page * perPage < total,
      additional: { page: page + 1 },
    };
  };

  const loadCountryOptions = async (
    search: string,
    _loadedOptions: any,
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
        members: values.members.map((member: any) => ({
          user: member?.user?.value,
          role: member.role,
          playerGames: (member.playerGames || [])
            .filter((pg: any) => pg && pg.game && pg.game.value)
            .map((pg: any) => ({
              game: pg.game.value,
              gameId: pg.gameId || "",
              gameRole: pg.gameRole || member.role,
            })),
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
          dispatch(setPerPage(10));
          dispatch(fetchTeams({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        const result = await dispatch(addTeam(teamData));

        if (addTeam.fulfilled.match(result)) {
          resetForm();
          setLogoImageUrl(undefined);
          setBackgroundImageUrl(undefined);
          onClose();
          dispatch(setPerPage(10));
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
                  {typeof (errors as any).members === "string" && (touched as any).members && (
                    <div className="text-red-500 text-xs mt-1">{(errors as any).members}</div>
                  )}
                  <FieldArray name="members">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.members.map((_: any, index: number) => (
                          <div key={index} className="space-y-3">
                            <div className="flex space-x-3">
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
                                      (touched as any).members?.[index]?.user &&
                                      (errors as any).members?.[index]?.user
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
                                name={`members[${index}]?.user`}
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
                                {/* <option value="Coach">Coach</option>
                                <option value="Manager">Manager</option> */}
                                <option value="President">President</option>
                              </Field>
                              <ErrorMessage
                                name={`members[${index}].role`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            </div>
                            <div className="bg-[#1f2738] rounded-xl p-3 border border-gray-700/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 text-sm font-medium">Player Games</span>
                              </div>
                              <FieldArray name={`members[${index}].playerGames`}>
                                {({ push: pushPG, remove: removePG }) => (
                                  <div className="space-y-2">
                                    {(values.members[index] as any).playerGames?.map((_: any, pgIdx: number) => (
                                      <div key={pgIdx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                        <div>
                                          <AsyncPaginate
                                            id={`members[${index}].playerGames[${pgIdx}].game`}
                                            name={`members[${index}].playerGames[${pgIdx}].game`}
                                            value={(values.members[index] as any).playerGames?.[pgIdx]?.game || null}
                                            loadOptions={loadGamesOptions}
                                            onChange={(selected: any) =>
                                              setFieldValue(
                                                `members[${index}].playerGames[${pgIdx}].game`,
                                                selected
                                              )
                                            }
                                            onBlur={() =>
                                              setFieldTouched(
                                                `members[${index}].playerGames[${pgIdx}].game`,
                                                true
                                              )
                                            }
                                            additional={{ page: 1 }}
                                            placeholder="Select a game"
                                            styles={{
                                              control: (base) => ({
                                                ...base,
                                                backgroundColor: "#212739",
                                                border: "none",
                                                borderRadius: "0.52rem",
                                                paddingLeft: "0.75rem",
                                                color: "#fff",
                                                boxShadow: "none",
                                              }),
                                              input: (base) => ({ ...base, color: "#fff", fontSize: "0.78125rem" }),
                                              singleValue: (base) => ({ ...base, color: "#fff", fontSize: "0.78125rem" }),
                                              placeholder: (base) => ({ ...base, color: "#6B7280", fontSize: "0.78125rem" }),
                                              menu: (base) => ({ ...base, backgroundColor: "#212739", borderRadius: "0.52rem" }),
                                              option: (base, { isFocused, isSelected }) => ({
                                                ...base,
                                                backgroundColor: isSelected ? "#007EFF" : isFocused ? "#2B3245" : "#212739",
                                                color: "#fff",
                                                fontSize: "0.78125rem",
                                                padding: "0.5rem 0.75rem",
                                              }),
                                              dropdownIndicator: (base) => ({ ...base, color: "#6B7280", "&:hover": { color: "#fff" } }),
                                            }}
                                            components={{
                                              DropdownIndicator: () => (
                                                <img src={downarr} alt="dropdown" style={{ width: "16px", marginRight: "10px" }} />
                                              ),
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Field
                                            type="text"
                                            name={`members[${index}].playerGames[${pgIdx}].gameId`}
                                            className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                                            placeholder="Game ID"
                                          />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Field
                                            as="select"
                                            name={`members[${index}].playerGames[${pgIdx}].gameRole`}
                                            className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                                          >
                                            <option value="Player">Player</option>
                                            <option value="Coach">Coach</option>
                                            <option value="Manager">Manager</option>
                                            <option value="President">President</option>
                                          </Field>
                                          <button
                                            type="button"
                                            onClick={() => removePG(pgIdx)}
                                            className="text-red-500 hover:text-red-400 p-2"
                                          >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        pushPG({ game: null, gameId: "", gameRole: (values.members[index] as any).role || "Player" })
                                      }
                                      className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                                    >
                                      + Add Player Game
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                            <div className="flex justify-end">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-400 p-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ user: { value: "", label: "" }, role: "Player", playerGames: [] })}
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
                      name="social.twitterId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Twitter Link"
                    />
                    <ErrorMessage name="social.twitterId" component="div" className="text-red-500 text-xs mt-1" />

                    <Field
                      type="text"
                      name="social.instagramId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Instagram Link"
                    />
                    <ErrorMessage name="social.instagramId" component="div" className="text-red-500 text-xs mt-1" />

                    <Field
                      type="text"
                      name="social.twitchId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Twitch Link"
                    />
                    <ErrorMessage name="social.twitchId" component="div" className="text-red-500 text-xs mt-1" />

                    <Field
                      type="text"
                      name="social.kickId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Kick Link"
                    />
                    <ErrorMessage name="social.kickId" component="div" className="text-red-500 text-xs mt-1" />

                    <Field
                      type="text"
                      name="social.discordId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Discord Link"
                    />
                    <ErrorMessage name="social.discordId" component="div" className="text-red-500 text-xs mt-1" />

                    <Field
                      type="text"
                      name="social.facebookId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="Facebook Link"
                    />
                    <ErrorMessage name="social.facebookId" component="div" className="text-red-500 text-xs mt-1" />

                    <Field
                      type="text"
                      name="social.tiktokId"
                      className="w-full px-4 py-3 bg-[#242B3C] text-white rounded-xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                      placeholder="TikTok Link"
                    />
                    <ErrorMessage name="social.tiktokId" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <FileUpload
                    ismandatory={false}
                    ispdf={false}
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
                  <ErrorMessage
                    name="logoImage"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <FileUpload
                    ismandatory={false}
                    ispdf={false}
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
                  <ErrorMessage
                    name="backgroundImage"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
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
