import React, { useEffect, useState } from "react";
import {
  addLeagueMatchScore,
  adoptLeagueMatchScore,
  fetchLeagueMatchesByID,
  updateLeagueMatchesByID,
} from "../../app/features/league/leagueSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { baseURL } from "../../axios";
import HandLogoLoader from "../Loader/Loader";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { socket } from "../../app/socket/socket";
import { SOCKET } from "../../utils/constant";

interface MatchScore {
  yourScore: number;
  opponentScore: number;
  description: string;
  attachment: string;
  submittedBy: string;
  submittedAt: string;
  winner: string | null;
  isActive: boolean;
  _id: string;
}

interface Participant {
  _id: string;
  userId: { _id: string; username: string; profilePicture: string };
  gameId: string;
}

interface Team {
  participant: Participant;
  score: number;
  _id: string;
}

interface MatchDetails {
  _id: string;
  league: {
    title: string;
    format: string;
    startDate: string;
    logo: string;
  };
  team1: Team[];
  team2: Team[];
  winner: string | null;
  isScoreVerified: boolean;
  status: string;
  startTime: string;
  matchScores: MatchScore[];
}

const MatchStatusSwitch = ({
  matcheDetail,
}: {
  matcheDetail: MatchDetails;
}) => {
  const [status, setStatus] = useState(matcheDetail?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const dispatch = useDispatch();

  const statusOptions = ["in_progress", "completed", "cancelled", "in_dispute"];
  const statusColors = {
    in_progress: "bg-gradient-to-r from-yellow-500 to-orange-500",
    completed: "bg-gradient-to-r from-green-500 to-emerald-500",
    cancelled: "bg-gradient-to-r from-red-500 to-rose-500",
    in_dispute: "bg-gradient-to-r from-purple-500 to-violet-500",
  };
  const statusTextColors = {
    in_progress: "text-white",
    completed: "text-white",
    cancelled: "text-white",
    in_dispute: "text-white",
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return;
    setPendingStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    setIsLoading(true);
    setShowModal(false);

    try {
      const result = await dispatch(
        updateLeagueMatchesByID({
          matcheId: matcheDetail?._id,
          status: pendingStatus,
        })
      );
      if (updateLeagueMatchesByID.fulfilled.match(result)) {
        setStatus(pendingStatus);
        dispatch(fetchLeagueMatchesByID({ matcheId: matcheDetail?._id }));
      }
    } catch (error) {
      console.log("Error updating status:", error);
    } finally {
      setIsLoading(false);
      setPendingStatus(null);
    }
  };

  const cancelStatusChange = () => {
    setShowModal(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div
        className={`inline-flex items-center rounded-full text-sm font-semibold transition-all duration-300 transform 
          hover:shadow-lg 
          ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer shadow-md"
          }`}
      >
        {statusOptions.map((option) => (
          <button
            key={option}
            // onClick={() => handleStatusChange(option)}
            disabled={true}
            className={`px-6 py-3 font-medium capitalize transition-all duration-200 ${
              status === option
                ? `${statusColors[option]} ${statusTextColors[option]}`
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } ${
              option === statusOptions[0]
                ? "rounded-l-full"
                : option === statusOptions[statusOptions.length - 1]
                ? "rounded-r-full"
                : ""
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#46A2FF] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {option.replace("_", " ")}
            {isLoading && pendingStatus === option && (
              <span className="ml-2 inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-10">
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-[#46A2FF]/10 rounded-full flex items-center justify-center">
                <span className="text-[#46A2FF] text-xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Status Change
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Are you sure you want to change the match status to{" "}
                <span className="font-semibold text-[#46A2FF] px-2 py-1 bg-[#46A2FF]/10 rounded-md">
                  {pendingStatus?.replace("_", " ").toUpperCase()}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelStatusChange}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MatchDetails = () => {
  const { mid } = useParams<{ mid: string }>();
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addingScore, setAddingScore] = useState(false);
  const { matcheDetail, loading, error } = useSelector(
    (state: RootState) => state.leagues
  ) as {
    matcheDetail: MatchDetails | null;
    loading: boolean;
    error: string | null;
  };

  // Formik setup with Yup validation
  const formik = useFormik({
    initialValues: {
      team1: "",
      team2: "",
    },
    validationSchema: Yup.object({
      team1: Yup.string()
        .required("Team 1 score is required")
        .matches(/^\s*\d*\.?\d+\s*$/, "Must be a valid number")
        .trim(),
      team2: Yup.string()
        .required("Team 2 score is required")
        .matches(/^\s*\d*\.?\d+\s*$/, "Must be a valid number")
        .trim(),
    }),
    onSubmit: (values) => {
      console.log("Saving score:", values?.team1, values?.team2);
      dispatch(
        addLeagueMatchScore({
          matcheId: mid,
          yourScore: values?.team1,
          opponentScore: values?.team2,
        })
      );
      // Example: send values to backend here
      setAddingScore(false);
      formik.resetForm();
    },
  });

  // useEffect(() => {
  //   if (mid) {
  //     socket.on(SOCKET.MATCHUPDATE, (data: any) => {
  //       console.log("Received matchUpdate:", data);
  //     });
  //     socket.emit(SOCKET.ONADMINMESSAGESTART, { matchId: mid });

  //     socket.emit("onAdminMessage", {
  //       isAdmin: true,
  //       msg: "Asdasdsa",
  //       roomId: mid,
  //     });
  //   }
  // }, [mid]);

  useEffect(() => {
    if (mid) {
      dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
    }
  }, [dispatch, mid]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white animate-pulse">
          <HandLogoLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-xl font-semibold bg-gray-800/50 p-6 rounded-2xl border border-red-400/20">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!matcheDetail) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <div className="text-gray-400 text-xl font-medium bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
            No match data found.
          </div>
        </div>
      </div>
    );
  }

  const handleAddScore = () => {
    setAddingScore(true);
  };

  const handleAccept = async (index: any) => {
    try {
      await dispatch(adoptLeagueMatchScore({ matcheId: mid, index })).unwrap();
      dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
    } catch (err) {
      console.error("Failed to adopt score:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 py-3 px-5 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                title="Return to previous page"
              >
                <span className="text-lg">←</span>
                <span>Back</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={`${baseURL}/api/v1/${matcheDetail?.league?.logo}`}
                    alt={matcheDetail?.league?.title}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div>
                  <h1 className="font-bold text-2xl lg:text-3xl text-white mb-1">
                    {matcheDetail?.league?.title}
                  </h1>
                  <p className="text-gray-400 text-base font-medium">
                    {matcheDetail?.league?.format}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Status Section */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-300 mb-2">
                Match Status
              </h2>
              <MatchStatusSwitch matcheDetail={matcheDetail} />
            </div>
            {matcheDetail?.isScoreVerified && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
                <span className="text-green-400 text-xl">✓</span>
                <span className="text-green-400 font-semibold">
                  Score Verified
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Tab Navigation */}

        <div className="relative flex border-b border-gray-700/50 mb-6">
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-[#46A2FF] to-[#6B73FF] transition-all duration-300 ease-out"
            style={{
              left: activeTab === "details" ? "0%" : "50%",
              width: "50%",
            }}
          />

          <button
            className={`relative py-3 px-6 font-semibold text-sm transition-all duration-200 ease-out flex-1 group ${
              activeTab === "details"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <span className="relative z-10">Match Details</span>
            {activeTab === "details" && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#46A2FF]/10 to-transparent rounded-t-lg" />
            )}
            <div className="absolute inset-0 bg-gray-700/0 group-hover:bg-gray-700/20 rounded-t-lg transition-all duration-200" />
          </button>

          <button
            className={`relative py-3 px-6 font-semibold text-sm transition-all duration-200 ease-out flex-1 group ${
              activeTab === "chat"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            <span className="relative z-10">Chat</span>
            {activeTab === "chat" && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#46A2FF]/10 to-transparent rounded-t-lg" />
            )}
            <div className="absolute inset-0 bg-gray-700/0 group-hover:bg-gray-700/20 rounded-t-lg transition-all duration-200" />
          </button>
        </div>

        <>
          {activeTab === "details" ? (
            <>
              {/* Teams Section */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    <span className="text-[#46A2FF] text-lg">👥</span>
                    Teams
                  </h3>
                  {matcheDetail?.status === "in_dispute" && (
                    <button
                      className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                      title="Add Score"
                      onClick={handleAddScore}
                    >
                      Add Score
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-900/50">
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Team
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Team 1
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Team 2
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {matcheDetail?.matchScores?.map((score, index) => {
                        return (
                          <tr key={score._id} className="bg-gray-700/30">
                            <td className="p-4 border-b border-gray-700/50">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                    score?.submittedBy === "team1"
                                      ? "bg-[#46A2FF]"
                                      : score?.submittedBy === "team2"
                                      ? "bg-orange-500"
                                      : "bg-green-500"
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                <span className="font-bold text-white">
                                  {score?.submittedBy === "team1"
                                    ? "Team 1"
                                    : score?.submittedBy === "team2"
                                    ? "Team 2"
                                    : "Admin"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              <p className="font-semibold text-[#46A2FF] text-lg">
                                {score?.submittedBy === "team1"
                                  ? score?.yourScore.toFixed(0)
                                  : score?.submittedBy === "admin"
                                  ? score?.yourScore.toFixed(0)
                                  : score?.opponentScore.toFixed(0)}
                              </p>
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              <p className="font-semibold text-orange-500 text-lg">
                                {score?.submittedBy === "team1"
                                  ? score?.opponentScore.toFixed(0)
                                  : score?.submittedBy === "admin"
                                  ? score?.opponentScore.toFixed(0)
                                  : score?.yourScore.toFixed(0)}
                              </p>
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              {matcheDetail?.status === "in_dispute" ? (
                                score?.isActive === false ? (
                                  <button
                                    className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                                    title="Adopt"
                                    onClick={() => handleAccept(index)}
                                  >
                                    Accept
                                  </button>
                                ) : (
                                  <span className="text-gray-400">
                                    Accepted
                                  </span>
                                )
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                      {/* New Row for Adding Score */}
                      {addingScore && (
                        <tr className="bg-gray-600/40">
                          <td className="p-4 border-b border-gray-700/50 font-bold text-white">
                            Admin
                          </td>
                          <td className="p-4 border-b border-gray-700/50">
                            <input
                              type="text"
                              name="team1"
                              className={`w-20 bg-gray-800 text-white px-2 py-1 rounded ${
                                formik.touched.team1 && formik.errors.team1
                                  ? "border-red-500 border"
                                  : ""
                              }`}
                              value={formik.values.team1}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.team1 && formik.errors.team1 && (
                              <p className="text-red-500 text-sm mt-1">
                                {formik.errors.team1}
                              </p>
                            )}
                          </td>
                          <td className="p-4 border-b border-gray-700/50">
                            <input
                              type="text"
                              name="team2"
                              className={`w-20 bg-gray-800 text-white px-2 py-1 rounded ${
                                formik.touched.team2 && formik.errors.team2
                                  ? "border-red-500 border"
                                  : ""
                              }`}
                              value={formik.values.team2}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.team2 && formik.errors.team2 && (
                              <p className="text-red-500 text-sm mt-1">
                                {formik.errors.team2}
                              </p>
                            )}
                          </td>
                          <td className="p-4 border-b border-gray-700/50">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={formik.handleSubmit}
                                className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                                disabled={
                                  !formik.isValid || formik.isSubmitting
                                }
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setAddingScore(false)}
                                className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                                disabled={
                                  !formik.isValid || formik.isSubmitting
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl mb-6">
                <h3 className="font-bold text-xl text-white flex items-center gap-2 mb-4">
                  <span className="text-[#46A2FF] text-lg">💬</span>
                  Chat
                </h3>
                <div className="h-64 overflow-y-auto bg-gray-900/50 p-4 rounded-lg">
                  {/* Placeholder chat content */}
                  <p className="text-gray-300">No messages yet.</p>
                  {/* Add your chat implementation here, e.g., a list of messages */}
                  {/* Example structure:
            <div className="flex flex-col gap-2">
              <div className="bg-gray-700 p-2 rounded-lg text-white">
                <span className="font-bold">User1:</span> Hello, team!
              </div>
              <div className="bg-blue-500 p-2 rounded-lg text-white self-end">
                <span className="font-bold">You:</span> Hi there!
              </div>
            </div>
            */}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46A2FF]"
                  />
                  <button className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm">
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </>

        {/* Match Information */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#46A2FF]/10 rounded-xl flex items-center justify-center">
              <span className="text-[#46A2FF] text-xl">ℹ️</span>
            </div>
            <h3 className="font-bold hive-2xl text-white">Match Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#46A2FF] text-lg">⏰</span>
                <span className="text-gray-400 font-medium">Start Time</span>
              </div>
              <p className="text-white font-semibold text-lg">
                {new Date(matcheDetail?.startTime).toLocaleString()}
              </p>
            </div>

            {matcheDetail.winner && (
              <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400 text-lg">🏆</span>
                  <span className="text-gray-400 font-medium">Winner</span>
                </div>
                <p className="text-green-400 font-bold text-lg capitalize">
                  {matcheDetail?.winner}
                </p>
              </div>
            )}

            <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#46A2FF] text-lg">📊</span>
                <span className="text-gray-400 font-medium">Match Status</span>
              </div>
              <p className="text-white font-semibold text-lg capitalize">
                {matcheDetail?.status?.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
