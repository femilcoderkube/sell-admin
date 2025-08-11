import React, { FC, useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Link, useLocation, useNavigate } from "react-router";
import { Check } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import deleteIcon from "../../assets/images/trash_can.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  clearStageData,
  createTournamentStage,
  setSelectedStage,
  setStep,
  updateTournamentStage,
} from "../../app/features/tournament/tournamentStageSlice";
import { baseURL } from "../../axios";
import { uploadFile } from "../../app/features/fileupload/fileUploadSlice";

// Interface for stage settings
interface StageSettings {
  numberOfGroups?: number;
  numberOfRounds?: number;
  numberOfQualifiers?: number;
  isDoubleRoundRobin?: boolean;
  isThirdPlaceMatch?: boolean;
  lossesToBeEliminated?: number;
  killPoints?: number;
  placePoints?: Array<{ place: number; points: number }>; // Updated to array
  tieBreaker?: string;
  htmlFile?: string;
  cssFile?: string;
  maps?: Array<{ name: string; photo: string }>;
}

// Interface for stage data
interface Stage {
  id: string;
  nameEn: string;
  nameAr: string;
  description: string;
}

// Form values interface
interface FormValues {
  stageName: string;
  stageNameAr?: string;
  numberOfParticipants: string;
  numberOfGroups?: string;
  numberOfQualifiers?: string;
  isDoubleRoundRobin?: boolean;
  isThirdPlaceMatch?: boolean;
  lossesToBeEliminated?: string;
  killPoints?: string;
  placePoints?: Array<{ place: number; points: number }>; // Updated to array
  tieBreaker?: string;
  htmlFile?: string;
  cssFile?: string;
  numberOfRounds?: string;
  maps?: Array<{ name: string; photo: any }>;
}

// Main Component
export const AddStage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { stage } = location?.state || {};

  const { stages, selectedStage, step, loading, error } = useSelector(
    (state: RootState) => state.tournamentStage
  );
  const id = window.location.pathname.split("/")[3];

  // Determine if editing
  const isEditing = !!stage?._id;
  const [previews, setPreviews] = useState<{ [key: number]: string | null }>(
    {}
  );
  const [uploadErrors, setUploadErrors] = useState<{
    [key: number]: string | null;
  }>({});
  // Validation schema
  const validationSchema = Yup.object().shape({
    stageName: Yup.string()
      .required("Please enter stage name.")
      .test(
        "no-leading-trailing-space",
        "Stage name (AR) cannot start or end with spaces",
        (value) => {
          if (!value) return true; // skip if empty
          return value === value.trim(); // fail if starts/ends with spaces
        }
      ),
    stageNameAr: Yup.string().test(
      "no-leading-trailing-space",
      "Stage name (AR) cannot start or end with spaces",
      (value) => {
        if (!value) return true; // skip if empty
        return value === value.trim(); // fail if starts/ends with spaces
      }
    ),
    numberOfParticipants: Yup.string().required(
      "Please enter number of participants."
    ),
    ...(selectedStage === "RoundRobin" && {
      numberOfGroups: Yup.string().required("Please enter number of groups."),
      numberOfQualifiers: Yup.string().required(
        "Please enter number of qualifiers."
      ),
      isDoubleRoundRobin: Yup.boolean(),
    }),
    ...(selectedStage === "Swiss" && {
      numberOfQualifiers: Yup.string().required(
        "Please enter number of qualifiers."
      ),
      lossesToBeEliminated: Yup.string().required(
        "Please enter number of losses to be eliminated."
      ),
    }),
    ...(selectedStage === "BattleRoyal" && {
      numberOfQualifiers: Yup.string().required(
        "Please enter number of qualifiers."
      ),
      numberOfGroups: Yup.string().required("Please enter number of groups."),
      numberOfRounds: Yup.string().required("Please enter number of rounds."),
      killPoints: Yup.string().required("Please enter kill points."),
      placePoints: Yup.array()
        .of(
          Yup.object().shape({
            position: Yup.string()
              .required("Position is required")
              .matches(
                /^\d+(-\d+)?$/,
                "Position must be a number or a range like '1' or '1-2'"
              ),
            // .min(1, "position must be at least 1"),
            point: Yup.number()
              .required("Point are required")
              .min(0, "Point must be non-negative"),
          })
        )
        .min(1, "At least one Position point entry is required")
        .required("Position points are required"),
      tieBreaker: Yup.string().required("Please select a tie breaker."),
      maps: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Map name is required"),
            photo: Yup.mixed().test(
              "file-or-url",
              "Map photo is required",
              (value) => {
                if (!value) return false;
                // accept either a URL string (edit mode) or a File object
                return typeof value === "string"
                  ? value.trim().length > 0
                  : !!(value && (value.name || value.size));
              }
            ),
          })
        )
        .test(
          "maps-length",
          "Number of maps must equal number of rounds",
          function (value) {
            const rounds = parseInt(this.parent.numberOfRounds || "0", 10);
            return Array.isArray(value) && value.length === rounds;
          }
        )
        .required("Maps are required"),
    }),
    ...(selectedStage === "Custom" && {
      htmlFile: Yup.string().required("Please enter HTML file path."),
      cssFile: Yup.string().required("Please enter CSS file path."),
    }),
    ...(selectedStage === "SingleElimination" && {
      isThirdPlaceMatch: Yup.boolean(),
    }),
    ...(selectedStage === "DoubleElimination" && {
      isThirdPlaceMatch: Yup.boolean(),
    }),
  });

  // Initial form values
  const initialValues: FormValues = isEditing
    ? {
        stageName: stage.stageName || "",
        stageNameAr: stage.stageNameAr || "",
        numberOfParticipants: stage.numberOfParticipants?.toString() || "",
        numberOfGroups: stage.settings?.numberOfGroups?.toString() || "",
        numberOfQualifiers:
          stage.settings?.numberOfQualifiers?.toString() || "",
        isDoubleRoundRobin: stage.settings?.isDoubleRoundRobin || false,
        isThirdPlaceMatch: stage.settings?.isThirdPlaceMatch || false,
        lossesToBeEliminated:
          stage.settings?.lossesToBeEliminated?.toString() || "",
        killPoints: stage.settings?.killPoints?.toString() || "",
        placePoints:
          stage.settings?.placePoints?.length > 0
            ? stage.settings.placePoints.map((item: any) => ({
                position: item.position.toString(),
                point: item.point.toString(),
              }))
            : [{ position: "", point: "" }],
        tieBreaker: stage.settings?.tieBreaker || "",
        htmlFile: stage.settings?.htmlFile || "",
        cssFile: stage.settings?.cssFile || "",
        numberOfRounds: stage.settings?.numberOfRounds?.toString() || "",
        maps:
          stage?.settings?.maps?.length > 0
            ? stage.settings.maps.map((m: any) => ({
                name: m.name || "",
                photo: m.photo || "",
              }))
            : [],
      }
    : {
        stageName: "",
        stageNameAr: "",
        numberOfParticipants: "",
        numberOfGroups: "",
        numberOfQualifiers: "",
        isDoubleRoundRobin: false,
        isThirdPlaceMatch: false,
        lossesToBeEliminated: "",
        killPoints: "",
        placePoints: [{ position: "", point: "" }], // Default empty entry
        tieBreaker: "",
        htmlFile: "",
        cssFile: "",
        numberOfRounds: "",
        maps: [],
      };

  // Set selected stage for editing
  useEffect(() => {
    if (isEditing && stage.stageType) {
      dispatch(setSelectedStage(stage.stageType));
      dispatch(setStep("form"));
    }
  }, [dispatch, isEditing, stage]);

  useEffect(() => {
    return () => {
      // Cleanup blob URLs on unmount
      Object.entries(previews).forEach(([index, preview]) => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]); // Depend on previews to ensure cleanup only when necessary, but primarily for unmount

  useEffect(() => {
    if (!initialValues.maps || initialValues.maps.length === 0) return;

    setPreviews((prev) => {
      const newPreviews: { [key: number]: string | null } = {};
      initialValues.maps.forEach((map, index) => {
        if (map.photo && typeof map.photo === "string" && !prev[index]) {
          newPreviews[index] = map.photo.startsWith(baseURL)
            ? map.photo
            : `${baseURL}/api/v1/${map.photo}`;
        }
      });
      if (Object.keys(newPreviews).length === 0) {
        return prev; // No changes, return same reference to skip update
      }
      return { ...prev, ...newPreviews };
    });
  }, [initialValues.maps]);

  const btnBack = () => {
    if (step === "form") {
      dispatch(setStep("select"));
      dispatch(clearStageData());
      navigate(-1);
    } else {
      dispatch(clearStageData());
      navigate(-1);
    }
  };

  const handleStageToggle = (stageId: string) => {
    dispatch(setSelectedStage(stageId));
  };

  // Handle file change and upload to API
  const handleFileChange = async (
    index: number,
    file: File | null,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!file) {
      setFieldValue(`maps[${index}].photo`, null);
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
        setFieldValue(`maps[${index}].photo`, fileUrl);
        setPreviews((prev) => ({
          ...prev,
          [index]: `${baseURL}/api/v1/${fileUrl}`,
        })); // Update preview to server URL
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
      setFieldValue(`maps[${index}].photo`, null);
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
  // const handleRemoveFile = (
  //   index: number,
  //   setFieldValue: (field: string, value: any) => void
  // ) => {
  //   setFieldValue(`maps[${index}].photo`, null);
  //   setPreviews((prev) => {
  //     const newPreviews = { ...prev };
  //     if (newPreviews[index]?.startsWith("blob:")) {
  //       URL.revokeObjectURL(newPreviews[index]!);
  //     }
  //     delete newPreviews[index];
  //     return newPreviews;
  //   });
  //   setUploadErrors((prev) => {
  //     const newErrors = { ...prev };
  //     delete newErrors[index];
  //     return newErrors;
  //   });
  // };

  const handleSubmit = (values: FormValues) => {
    const settings: StageSettings = {};
    if (selectedStage === "RoundRobin") {
      settings.numberOfGroups = parseInt(values.numberOfGroups || "0");
      settings.numberOfQualifiers = parseInt(values.numberOfQualifiers || "0");
      settings.isDoubleRoundRobin = values.isDoubleRoundRobin;
    } else if (selectedStage === "Swiss") {
      settings.numberOfQualifiers = parseInt(values.numberOfQualifiers || "0");
      settings.lossesToBeEliminated = parseInt(
        values.lossesToBeEliminated || "0"
      );
    } else if (selectedStage === "BattleRoyal") {
      settings.numberOfGroups = parseInt(values.numberOfGroups || "0");
      settings.numberOfQualifiers = parseInt(values.numberOfQualifiers || "0");
      settings.numberOfRounds = parseInt(values.numberOfRounds || "0");
      settings.killPoints = parseInt(values.killPoints || "0");
      settings.placePoints = values.placePoints
        .filter((item) => item.position && item.point) // Filter out empty entries
        .map((item) => ({
          position: item.position,
          point: parseInt(item.point),
        }));
      settings.tieBreaker = values.tieBreaker;
      settings.maps = values.maps
        .filter((map) => map.name && map.photo) // Filter out incomplete maps
        .map((map, index) => ({
          index: index + 1,
          name: map.name,
          photo: map.photo, // Server URL from uploadFile
        }));
    } else if (selectedStage === "Custom") {
      settings.htmlFile = values.htmlFile;
      settings.cssFile = values.cssFile;
    } else if (
      selectedStage === "SingleElimination" ||
      selectedStage === "DoubleElimination"
    ) {
      settings.isThirdPlaceMatch = values.isThirdPlaceMatch;
    }

    const stageData = {
      tournament: id,
      stageType: selectedStage!,
      stageName: values.stageName,
      stageNameAr: values.stageNameAr,
      numberOfParticipants: parseInt(values.numberOfParticipants),
      settings,
      // ...(selectedStage === "BattleRoyal" ? { maps: values.maps } : {}),
    };

    if (isEditing) {
      dispatch(
        updateTournamentStage({
          stageId: stage._id,
          ...stageData,
        })
      ).then((result) => {
        if (updateTournamentStage.fulfilled.match(result)) {
          navigate(-1);
        }
      });
    } else {
      dispatch(createTournamentStage(stageData)).then((result) => {
        if (createTournamentStage.fulfilled.match(result)) {
          navigate(-1);
        }
      });
    }
  };

  return (
    <Layout>
      <div className="nf_legue_head--con bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl p-6 mb-6">
        <div className="flex items-center pb-4">
          <Link
            to={""}
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
          </Link>
          <h3 className="flex-1 text-white text-center font-bold text-[1.25rem]">
            {isEditing ? "Edit Stage" : "Add New Stage"}
          </h3>
        </div>
      </div>

      {step === "select" && (
        <div className="leg_steps--con flex items-center justify-center my-[1.67rem] gap-[0.35rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {stages?.map((stage) => (
              <div
                key={stage.id}
                onClick={() => handleStageToggle(stage.id)}
                className={`
                  relative cursor-pointer rounded-xl p-4 sm:p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl
                  ${
                    selectedStage === stage.id
                      ? "border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/25"
                      : "border-slate-600/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50"
                  }
                `}
              >
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <div
                    className={`
                    w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${
                      selectedStage === stage.id
                        ? "border-blue-400 bg-blue-500 shadow-lg shadow-blue-500/50"
                        : "border-slate-400 bg-transparent"
                    }
                  `}
                  >
                    {selectedStage === stage.id && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="pr-8 sm:pr-10">
                  <h3
                    className={`
                    font-bold text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 transition-colors duration-200
                    ${
                      selectedStage === stage.id
                        ? "text-white"
                        : "text-slate-200"
                    }
                  `}
                  >
                    {stage.nameEn}
                  </h3>
                  <p
                    className={`
                    text-xs sm:text-sm lg:text-base leading-relaxed transition-colors duration-200
                    ${
                      selectedStage === stage.id
                        ? "text-slate-200"
                        : "text-slate-400"
                    }
                  `}
                  >
                    {stage.description}
                  </p>
                </div>
                <div
                  className={`
                  absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                  ${
                    selectedStage === stage.id
                      ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                      : "bg-gradient-to-br from-white/0 to-white/0 hover:from-white/5 hover:to-white/5"
                  }
                `}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "form" && selectedStage && (
        <div className="leg_steps--con flex items-center justify-center my-[1.67rem] gap-[0.35rem]">
          <div className="w-full max-w-lg">
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Common Fields */}
                  <div className="form-group">
                    <Field
                      type="text"
                      name="stageName"
                      id="stageName"
                      className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                        errors.stageName && touched.stageName
                          ? "border-red-500"
                          : "border-slate-600"
                      } focus:border-blue-500 focus:outline-none`}
                    />
                    <label
                      htmlFor="stageName"
                      className="text-sm text-slate-400 mt-1"
                    >
                      Stage Name
                    </label>
                    <ErrorMessage
                      name="stageName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="form-group">
                    <Field
                      type="text"
                      name="stageNameAr"
                      id="stageNameAr"
                      className="form-control w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                    <label
                      htmlFor="stageNameAr"
                      className="text-sm text-slate-400 mt-1"
                    >
                      Stage Name (Arabic)
                    </label>
                    <ErrorMessage
                      name="stageNameAr"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="form-group">
                    <Field
                      type="number"
                      name="numberOfParticipants"
                      id="numberOfParticipants"
                      className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                        errors.numberOfParticipants &&
                        touched.numberOfParticipants
                          ? "border-red-500"
                          : "border-slate-600"
                      } focus:border-blue-500 focus:outline-none`}
                    />
                    <label
                      htmlFor="numberOfParticipants"
                      className="text-sm text-slate-400 mt-1"
                    >
                      Number of Participants
                    </label>
                    <ErrorMessage
                      name="numberOfParticipants"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Round Robin Specific Fields */}
                  {selectedStage === "RoundRobin" && (
                    <>
                      <div className="form-group">
                        <Field
                          type="number"
                          name="numberOfGroups"
                          id="numberOfGroups"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.numberOfGroups && touched.numberOfGroups
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="numberOfGroups"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Number of Groups
                        </label>
                        <ErrorMessage
                          name="numberOfGroups"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <Field
                          type="number"
                          name="numberOfQualifiers"
                          id="numberOfQualifiers"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.numberOfQualifiers &&
                            touched.numberOfQualifiers
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="numberOfQualifiers"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Number of Qualifiers
                        </label>
                        <ErrorMessage
                          name="numberOfQualifiers"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <label className="flex items-center gap-2 text-sm text-slate-400">
                          <Field
                            type="checkbox"
                            name="isDoubleRoundRobin"
                            className="form-checkbox h-5 w-5 text-blue-500"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setFieldValue(
                                "isDoubleRoundRobin",
                                e.target.checked
                              )
                            }
                          />
                          Double Round Robin
                        </label>
                      </div>
                    </>
                  )}

                  {/* Swiss Specific Fields */}
                  {selectedStage === "Swiss" && (
                    <>
                      <div className="form-group">
                        <Field
                          type="number"
                          name="numberOfQualifiers"
                          id="numberOfQualifiers"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.numberOfQualifiers &&
                            touched.numberOfQualifiers
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="numberOfQualifiers"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Number of Qualifiers
                        </label>
                        <ErrorMessage
                          name="numberOfQualifiers"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <Field
                          type="number"
                          name="lossesToBeEliminated"
                          id="lossesToBeEliminated"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.lossesToBeEliminated &&
                            touched.lossesToBeEliminated
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="lossesToBeEliminated"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Losses to be Eliminated
                        </label>
                        <ErrorMessage
                          name="lossesToBeEliminated"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </>
                  )}

                  {/* Battle Royal Specific Fields */}
                  {selectedStage === "BattleRoyal" && (
                    <>
                      {/* Other BattleRoyal fields */}
                      <div className="form-group">
                        <Field
                          type="number"
                          name="numberOfGroups"
                          id="numberOfGroups"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.numberOfGroups && touched.numberOfGroups
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="numberOfGroups"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Number of Groups
                        </label>
                        <ErrorMessage
                          name="numberOfGroups"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="number"
                          name="numberOfQualifiers"
                          id="numberOfQualifiers"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.numberOfQualifiers &&
                            touched.numberOfQualifiers
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="numberOfQualifiers"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Number of Qualifiers
                        </label>
                        <ErrorMessage
                          name="numberOfQualifiers"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <Field
                          type="number"
                          name="numberOfRounds"
                          id="numberOfRounds"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.numberOfRounds && touched.numberOfRounds
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const val = e.target.value;
                            const rounds = Math.max(
                              0,
                              parseInt(val || "0", 10)
                            );
                            setFieldValue("numberOfRounds", val);

                            const currentMaps = values.maps || [];
                            if (rounds > currentMaps.length) {
                              // add empty entries to match rounds
                              const toAdd = rounds - currentMaps.length;
                              const newMaps = [...currentMaps];
                              for (let i = 0; i < toAdd; i++)
                                newMaps.push({ name: "", photo: "" });
                              setFieldValue("maps", newMaps);
                            } else if (rounds < currentMaps.length) {
                              // trim excess maps
                              setFieldValue(
                                "maps",
                                currentMaps.slice(0, rounds)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="numberOfRounds"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Number of Rounds
                        </label>
                        <ErrorMessage
                          name="numberOfRounds"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <label className="text-sm text-slate-400 mb-2">
                          Maps
                        </label>
                        <FieldArray name="maps">
                          {({ form }) => {
                            const { values, errors, touched } = form;
                            return (
                              <>
                                {values?.maps &&
                                  values?.maps.map(
                                    (map: any, index: number) => (
                                      <div
                                        key={index}
                                        className="mb-4 bg-slate-800 p-4 rounded-lg border border-slate-600"
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <h6 className="text-white text-sm font-medium">
                                            Map #{index + 1}
                                          </h6>
                                          {/* <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveFile(
                                                index,
                                                setFieldValue
                                              )
                                            }
                                            className="bg-gray-600 hover:bg-gray-700 p-2 rounded-lg duration-300"
                                          >
                                            <img
                                              src={deleteIcon}
                                              alt="Delete"
                                              style={{ width: "1.25rem" }}
                                            />
                                          </button> */}
                                        </div>
                                        <div className="mb-2">
                                          <Field
                                            name={`maps[${index}].name`}
                                            placeholder={`Map Name #${
                                              index + 1
                                            }`}
                                            className={`form-control w-full p-3 rounded-lg bg-slate-900 text-white border ${
                                              errors.maps?.[index]?.name &&
                                              touched.maps?.[index]?.name
                                                ? "border-red-500"
                                                : "border-slate-600"
                                            } focus:border-blue-500 focus:outline-none`}
                                          />
                                          <ErrorMessage
                                            name={`maps[${index}].name`}
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                          />
                                        </div>

                                        <div className="relative">
                                          <input
                                            id={`maps-${index}-photo`}
                                            name={`maps[${index}].photo`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(
                                              e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                              const file =
                                                e.currentTarget.files &&
                                                e.currentTarget.files[0];
                                              handleFileChange(
                                                index,
                                                file || null,
                                                setFieldValue
                                              );
                                            }}
                                            className="block w-full text-[0.78125rem] text-white bg-slate-900 rounded-[0.52rem] px-3 py-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2792FF] file:text-white hover:file:bg-[#1c74d1]"
                                          />
                                          {/* {previews[index] && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveFile(
                                                  index,
                                                  setFieldValue
                                                )
                                              }
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
                                              <span className="sr-only">
                                                Remove Image
                                              </span>
                                            </button>
                                          )} */}
                                          <ErrorMessage
                                            name={`maps[${index}].photo`}
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                          />
                                          {uploadErrors[index] && (
                                            <div className="text-red-500 text-xs mt-1">
                                              {uploadErrors[index]}
                                            </div>
                                          )}
                                          {previews[index] && (
                                            <div className="mt-2">
                                              <img
                                                src={previews[index]}
                                                alt={`Map ${index + 1} Preview`}
                                                className="max-w-full h-auto rounded-[0.52rem]"
                                                style={{ maxHeight: "100px" }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                              </>
                            );
                          }}
                        </FieldArray>
                        {touched.maps &&
                          errors.maps &&
                          typeof errors.maps === "string" && (
                            <div className="text-red-500 text-xs mt-1">
                              {errors.maps}
                            </div>
                          )}
                      </div>

                      <div className="form-group">
                        <Field
                          type="number"
                          name="killPoints"
                          id="killPoints"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.killPoints && touched.killPoints
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="killPoints"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Kill Points
                        </label>
                        <ErrorMessage
                          name="killPoints"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Place Points as Array */}
                      <div className="form-group">
                        <label className="text-sm text-slate-400 mb-2">
                          Place Points
                        </label>
                        <FieldArray name="placePoints">
                          {({ push, remove, form }) => {
                            const { values, errors, touched } = form;

                            return (
                              <>
                                {values.placePoints.map((placePoint, index) => (
                                  <div
                                    key={index}
                                    className="mb-4 bg-slate-800 p-4 rounded-lg border border-slate-600"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h6 className="text-white text-sm font-medium">
                                        Place Point #{index + 1}
                                      </h6>
                                      {index !== 0 && (
                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                          className="bg-gray-600 hover:bg-gray-700 p-2 rounded-lg duration-300"
                                        >
                                          <img
                                            src={deleteIcon}
                                            alt="Delete"
                                            style={{ width: "1.25rem" }}
                                          />
                                        </button>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="form-group">
                                        <Field
                                          type="text"
                                          name={`placePoints[${index}].position`}
                                          id={`placePoints[${index}].position`}
                                          className={`form-control w-full p-3 rounded-lg bg-slate-900 text-white border ${
                                            errors.placePoints?.[index]
                                              ?.position &&
                                            touched.placePoints?.[index]
                                              ?.position
                                              ? "border-red-500"
                                              : "border-slate-600"
                                          } focus:border-blue-500 focus:outline-none`}
                                        />
                                        <label
                                          htmlFor={`placePoints[${index}].position`}
                                          className="text-sm text-slate-400 mt-1"
                                        >
                                          Position
                                        </label>
                                        <ErrorMessage
                                          name={`placePoints[${index}].position`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <Field
                                          type="number"
                                          name={`placePoints[${index}].point`}
                                          id={`placePoints[${index}].point`}
                                          className={`form-control w-full p-3 rounded-lg bg-slate-900 text-white border ${
                                            errors.placePoints?.[index]
                                              ?.point &&
                                            touched.placePoints?.[index]?.point
                                              ? "border-red-500"
                                              : "border-slate-600"
                                          } focus:border-blue-500 focus:outline-none`}
                                        />
                                        <label
                                          htmlFor={`placePoints[${index}].point`}
                                          className="text-sm text-slate-400 mt-1"
                                        >
                                          Point
                                        </label>
                                        <ErrorMessage
                                          name={`placePoints[${index}].point`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({ position: "", point: "" })
                                  }
                                  className="w-full py-2 border bg-slate-800 bg-opacity-40 rounded-lg border-dashed border-slate-400 text-slate-400 text-sm font-medium"
                                >
                                  + Add Place Point
                                </button>
                                {touched.placePoints &&
                                  errors.placePoints &&
                                  typeof errors.placePoints === "string" && (
                                    <div className="text-red-500 text-xs mt-1">
                                      {errors.placePoints}
                                    </div>
                                  )}
                              </>
                            );
                          }}
                        </FieldArray>
                      </div>

                      <div className="form-group">
                        <Field
                          as="select"
                          name="tieBreaker"
                          id="tieBreaker"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.tieBreaker && touched.tieBreaker
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        >
                          <option value="" disabled>
                            Select Tie Breaker
                          </option>
                          <option value="KillPoint">Kill Point</option>
                          <option value="PlacePoint">Place Point</option>
                        </Field>
                        <label
                          htmlFor="tieBreaker"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Tie Breaker
                        </label>
                        <ErrorMessage
                          name="tieBreaker"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </>
                  )}

                  {/* Custom Stage Specific Fields */}
                  {selectedStage === "Custom" && (
                    <>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="htmlFile"
                          id="htmlFile"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.htmlFile && touched.htmlFile
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="htmlFile"
                          className="text-sm text-slate-400 mt-1"
                        >
                          HTML File Path
                        </label>
                        <ErrorMessage
                          name="htmlFile"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <Field
                          type="text"
                          name="cssFile"
                          id="cssFile"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.cssFile && touched.cssFile
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="cssFile"
                          className="text-sm text-slate-400 mt-1"
                        >
                          CSS File Path
                        </label>
                        <ErrorMessage
                          name="cssFile"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </>
                  )}

                  {/* Single Elimination and Double Elimination Specific Fields */}
                  {selectedStage === "SingleElimination" && (
                    <div className="form-group">
                      <label className="flex items-center gap-2 text-sm text-slate-400">
                        <Field
                          type="checkbox"
                          name="isThirdPlaceMatch"
                          className="form-checkbox h-5 w-5 text-blue-500"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFieldValue("isThirdPlaceMatch", e.target.checked)
                          }
                        />
                        Third Place Match
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 rounded-lg text-white transition-all duration-300 ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {loading
                      ? "Submitting..."
                      : isEditing
                      ? "Update"
                      : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </Layout>
  );
};
