import React, { FC, useEffect } from "react";
import { Layout } from "../../components/layout";
import { Link, useLocation, useNavigate } from "react-router";
import { Check } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  clearStageData,
  createTournamentStage,
  setSelectedStage,
  setStep,
  updateTournamentStage,
} from "../../app/features/tournament/tournamentStageSlice";

// Interface for stage settings
interface StageSettings {
  numberOfGroups?: number;
  numberOfRounds?: number;
  numberOfQualifiers?: number;
  isDoubleRoundRobin?: boolean;
  isThirdPlaceMatch?: boolean;
  lossesToBeEliminated?: number;
  killPoints?: number;
  placePoints?: number;
  tieBreaker?: string;
  htmlFile?: string;
  cssFile?: string;
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
  placePoints?: string;
  tieBreaker?: string;
  htmlFile?: string;
  cssFile?: string;
  numberOfRounds?: string;
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

  // Validation schema
  const validationSchema = Yup.object().shape({
    stageName: Yup.string().required("Please enter stage name."),
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
      numberOfRounds: Yup.string().required("Please enter number of rounds."),
      killPoints: Yup.string().required("Please enter kill points."),
      placePoints: Yup.string().required("Please enter place points."),
      tieBreaker: Yup.string().required("Please select a tie breaker."),
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
        placePoints: stage.settings?.placePoints?.toString() || "",
        tieBreaker: stage.settings?.tieBreaker || "",
        htmlFile: stage.settings?.htmlFile || "",
        cssFile: stage.settings?.cssFile || "",
        numberOfRounds: stage.settings?.numberOfRounds?.toString() || "",
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
        placePoints: "",
        tieBreaker: "",
        htmlFile: "",
        cssFile: "",
      };

  // Set selected stage for editing
  useEffect(() => {
    if (isEditing && stage.stageType) {
      dispatch(setSelectedStage(stage.stageType));
      dispatch(setStep("form"));
    }
  }, [dispatch, isEditing, stage]);

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
      settings.numberOfQualifiers = parseInt(values.numberOfQualifiers || "0");
      settings.numberOfRounds = parseInt(values.numberOfRounds || "0");
      settings.killPoints = parseInt(values.killPoints || "0");
      settings.placePoints = parseInt(values.placePoints || "0");
      settings.tieBreaker = values.tieBreaker;
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
      <div className="nf_leg_steps-block">
        <div className="nf_step_head-con flex items-center pb-4 border-b border-light-border">
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
              {({ errors, touched, setFieldValue }) => (
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

                      <div className="form-group">
                        <Field
                          type="number"
                          name="placePoints"
                          id="placePoints"
                          className={`form-control w-full p-3 rounded-lg bg-slate-800 text-white border ${
                            errors.placePoints && touched.placePoints
                              ? "border-red-500"
                              : "border-slate-600"
                          } focus:border-blue-500 focus:outline-none`}
                        />
                        <label
                          htmlFor="placePoints"
                          className="text-sm text-slate-400 mt-1"
                        >
                          Place Points
                        </label>
                        <ErrorMessage
                          name="placePoints"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
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
