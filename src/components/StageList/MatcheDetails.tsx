import React, { useEffect, useRef, useState } from "react";
import {
  adoptLeagueMatchScore,
  fetchLeagueMatchesByID,
  updateLeagueMatchesByID,
} from "../../app/features/league/leagueSlice";
import viewIcon from "../../assets/images/eye_icon.svg";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { baseURL } from "../../axios";
import HandLogoLoader from "../Loader/Loader";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { socket } from "../../app/socket/socket";
import { getWinnerTeamName, SOCKET } from "../../utils/constant";
import AttachmentModal from "./AttachmentModal";
import {
  acceptScore,
  addScore,
  fetchTournamentMatchById,
} from "../../app/features/tournament/tournamentMatchesSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

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

const MatchStatusSwitch = ({ singleMatch }: { singleMatch: MatchDetails }) => {
  const [status, setStatus] = useState(singleMatch?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const dispatch = useDispatch();

  const statusOptions = [
    "in_progress",
    "pending",
    "completed",
    "cancelled",
    "in_dispute",
  ];
  const statusColors = {
    in_progress: "bg-gradient-to-r from-yellow-500 to-orange-500",
    pending: "bg-gradient-to-r from-red-500 to-orange-500",
    completed: "bg-gradient-to-r from-green-500 to-emerald-500",
    cancelled: "bg-gradient-to-r from-red-500 to-rose-500",
    in_dispute: "bg-gradient-to-r from-purple-500 to-violet-500",
  };
  const statusTextColors = {
    in_progress: "text-white",
    pending: "text-white",
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
          matcheId: singleMatch?._id,
          status: pendingStatus,
        })
      );
      if (updateLeagueMatchesByID.fulfilled.match(result)) {
        setStatus(pendingStatus);
        dispatch(fetchLeagueMatchesByID({ matcheId: singleMatch?._id }));
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
            className={`px-4 py-3 font-medium capitalize transition-all duration-200 ${
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
  const [messageData, setMessageData] = useState([]);
  const [sendMessage, setSendMessage] = useState<undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const { singleMatch, matchesLoading, matchesError } = useSelector(
    (state: RootState) => state.tournamentMatches
  ) as {
    singleMatch: null;
    matchesLoading: boolean;
    matchesError: string | null;
  };

  const scrollRef = useRef<HTMLDivElement>(null);

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
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        addScore({
          matchId: mid,
          opponent1Score: values?.team1,
          opponent2Score: values?.team2,
          description: "",
          attachment: "",
          submittedBy: "admin",
        })
      );
      if (addScore.fulfilled.match(resultAction)) {
        dispatch(fetchTournamentMatchById({ id: mid }));
      }
      // Example: send values to backend here
      setAddingScore(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    if (mid) {
      socket.emit(SOCKET.ONADMINMESSAGESTART, { matchId: mid });
      socket.on(SOCKET.MATCHUPDATE, (data: any) => {
        if (!data?.isMatchUpdate) {
          setMessageData(data?.data);
        }
      });
    }
  }, [mid]);

  useEffect(() => {
    if (mid) {
      dispatch(fetchTournamentMatchById({ id: mid }));
    }
  }, [dispatch, mid]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageData]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSendMessage = () => {
    socket.emit(SOCKET.ONADMINMESSAGE, {
      isAdmin: true,
      msg: sendMessage,
      roomId: mid,
    });

    socket.on(SOCKET.MATCHUPDATE, (data: any) => {
      if (!data?.isMatchUpdate) {
        setSendMessage("");
        setMessageData(data?.data);
      }
    });
  };

  const openModal = (attachment: any) => {
    setSelectedAttachment(attachment);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAttachment(null);
  };

  if (matchesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white animate-pulse">
          <HandLogoLoader />
        </div>
      </div>
    );
  }

  if (matchesError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-xl font-semibold bg-gray-800/50 p-6 rounded-2xl border border-red-400/20">
            Error: {matchesError}
          </div>
        </div>
      </div>
    );
  }

  if (!singleMatch) {
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

  const handleDeleteUser = async () => {
    try {
      const resultAction = await dispatch(
        acceptScore({ matchId: mid, scoreId: deleteId })
      );
      if (acceptScore.fulfilled.match(resultAction)) {
        dispatch(fetchTournamentMatchById({ id: mid }));
        setDeleteId();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to adopt score:", err);
    }
  };

  const teamName = getWinnerTeamName(singleMatch);

  const team1Name = singleMatch?.opponent1?.team?.teamName; // "Clash of Can2"
  const team2Name = singleMatch?.opponent2?.team?.teamName;

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
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="relative">
                    <img
                      src={`${baseURL}/api/v1/${
                        singleMatch?.opponent1?.team
                          ? singleMatch?.opponent1?.team?.logoImage
                          : singleMatch?.opponent1?.user?.profilePicture
                      }`}
                      alt={
                        singleMatch?.opponent1?.team
                          ? singleMatch?.opponent1?.team?.teamName
                          : singleMatch?.opponent1?.user?.username
                      }
                      className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600 shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-white ">
                      {singleMatch?.opponent1?.team
                        ? singleMatch?.opponent1?.team?.teamName
                        : singleMatch?.opponent1?.user?.username}
                    </h1>
                  </div>
                </div>
                <span className="font-bold text-xl text-white">V/s</span>
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="relative">
                    <img
                      src={`${baseURL}/api/v1/${
                        singleMatch?.opponent2?.team
                          ? singleMatch?.opponent2?.team?.logoImage
                          : singleMatch?.opponent2?.user?.profilePicture
                      }`}
                      alt={
                        singleMatch?.opponent2?.team
                          ? singleMatch?.opponent2?.team?.teamName
                          : singleMatch?.opponent2?.user?.username
                      }
                      className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600 shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-white">
                      {singleMatch?.opponent2?.team
                        ? singleMatch?.opponent2?.team?.teamName
                        : singleMatch?.opponent2?.user?.username}
                    </h1>
                  </div>
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
              <MatchStatusSwitch singleMatch={singleMatch} />
            </div>
            {singleMatch?.isScoreVerified && (
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
                  {
                    <button
                      className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                      title="Add Score"
                      onClick={handleAddScore}
                    >
                      Add Score
                    </button>
                  }
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-900/50">
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Team
                        </th>

                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          {team1Name}
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          {team2Name}
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Notes
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Submitted Time
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Proof
                        </th>
                        <th className="p-4 text-gray-300 font-semibold border-b border-gray-700/50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleMatch?.matchScores?.map((score, index) => {
                        return (
                          <tr key={score._id} className="bg-gray-700/30">
                            <td className="p-4 border-b border-gray-700/50">
                              {score?.submittedBy === "team1"
                                ? "Team 1"
                                : score?.submittedBy === "team2"
                                ? "Team 2"
                                : "Admin"}
                            </td>

                            <td className="p-4 border-b border-gray-700/50">
                              <p className="font-semibold text-[#46A2FF] text-lg">
                                {score?.submittedBy === "team1"
                                  ? score?.opponent1Score.toFixed(0)
                                  : score?.submittedBy === "admin"
                                  ? score?.opponent1Score.toFixed(0)
                                  : score?.opponent2Score.toFixed(0)}
                              </p>
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              <p className="font-semibold text-orange-500 text-lg">
                                {score?.submittedBy === "team1"
                                  ? score?.opponent2Score.toFixed(0)
                                  : score?.submittedBy === "admin"
                                  ? score?.opponent2Score.toFixed(0)
                                  : score?.opponent1Score.toFixed(0)}
                              </p>
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              {score?.description ? score?.description : "-"}
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              {new Date(score?.submittedAt)?.toLocaleString()}
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              {score?.submittedBy !== "admin" ? (
                                <button
                                  className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                                  onClick={() => openModal(score?.attachment)}
                                >
                                  <img
                                    src={viewIcon}
                                    alt="View"
                                    className="w-5 h-5"
                                  />
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-4 border-b border-gray-700/50">
                              {score?.isActive === false ? (
                                <button
                                  className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                                  title="Adopt"
                                  onClick={() => {
                                    setDeleteId(score?._id);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  Accept
                                </button>
                              ) : (
                                <span className="text-gray-400">Accepted</span>
                              )}
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
                          <td className="p-4 border-b border-gray-700/50">-</td>
                          <td className="p-4 border-b border-gray-700/50">-</td>
                          <td className="p-4 border-b border-gray-700/50">-</td>

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
                                onClick={(e) => {
                                  e.preventDefault();

                                  formik.resetForm();
                                  setAddingScore(false);
                                }}
                                className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                                // disabled={
                                //   !formik.isValid || formik.isSubmitting
                                // }
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

                <div
                  className="h-64 overflow-y-auto bg-gray-900/50 p-4 rounded-lg"
                  style={{ scrollbarWidth: "thin" }}
                  ref={scrollRef}
                >
                  {messageData?.length > 0 ? (
                    [...messageData]?.reverse().map((message: any) => {
                      return (
                        <div
                          key={message._id}
                          className={`p-1 flex ${
                            message?.isAdmin
                              ? "text-blue-200 justify-end"
                              : "text-gray-200 justify-start"
                          }`}
                        >
                          {message.isSystemMsg ? (
                            <div className="text-gray-200 justify-start">
                              <div className="inline-block rounded-lg bg-gray-700/30">
                                <div className="flex items-start space-x-2 px-3 py-2 rounded-lg">
                                  <div className="text-sm break-words">
                                    {message.messages?.length > 0 && (
                                      <div>
                                        {message.messages.map(
                                          (msg: string, index: number) => (
                                            <div className="flex gap-1">
                                              <span className="font-semibold">
                                                System:
                                              </span>
                                              <p
                                                key={index}
                                                dangerouslySetInnerHTML={{
                                                  __html: msg,
                                                }}
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}

                                    {message.randomMessages?.length > 0 && (
                                      <div>
                                        {message.randomMessages.map(
                                          (randomMsg: any, index: number) => (
                                            <div className="flex gap-1">
                                              <span className="font-semibold">
                                                System:
                                              </span>
                                              <div className="flex">
                                                <p
                                                  key={randomMsg._id}
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      randomMsg.randomText,
                                                  }}
                                                />
                                                <span>: {randomMsg.tags}</span>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400 self-end">
                                    {new Date(
                                      message.dateTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`p-1 flex ${
                                message?.isAdmin
                                  ? "text-blue-200 justify-end"
                                  : "text-gray-200 justify-start"
                              }`}
                            >
                              <div
                                className={`inline-block rounded-lg ${
                                  message?.isAdmin
                                    ? "bg-blue-600/30"
                                    : "bg-gray-700/30"
                                }`}
                              >
                                <div className="flex items-start space-x-2 px-3 py-2 rounded-lg">
                                  <p className="text-sm break-words">
                                    <span className="font-semibold">
                                      {message?.isAdmin
                                        ? "Admin"
                                        : message?.senderId?.username}
                                    </span>
                                    : {message?.msg}
                                  </p>
                                  <span className="text-xs text-gray-400 self-end">
                                    {new Date(
                                      message?.dateTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-300">No messages yet.</p>
                  )}
                </div>

                {/* <div
                  className="h-64 overflow-y-auto bg-gray-900/50 p-4 rounded-lg"
                  style={{ scrollbarWidth: "thin" }}
                  ref={scrollRef}
                >
                  {messageData?.length > 0 ? (
                    [...messageData]?.reverse().map((message: any) => {
                      return (
                        <>
                          {!message?.isSystemMsg && (
                            <div
                              key={message._id}
                              className={`p-1 flex  ${
                                message.isAdmin
                                  ? "text-blue-200 justify-end"
                                  : "text-gray-200 justify-start"
                              }`}
                            >
                              <div
                                className={`inline-block rounded-lg ${
                                  message.isAdmin
                                    ? "bg-blue-600/30"
                                    : "bg-gray-700/30"
                                }`}
                              >
                                <div className="flex items-start space-x-2 px-3 py-2 rounded-lg">
                                  <p className="text-sm break-words">
                                    <span className="font-semibold">
                                      {message.isAdmin
                                        ? "Admin"
                                        : message?.senderId?.username}
                                    </span>
                                    : {message.msg}
                                  </p>
                                  <span className="text-xs text-gray-400 self-end">
                                    {new Date(
                                      message.dateTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })
                  ) : (
                    <p className="text-gray-300">No messages yet.</p>
                  )}
                </div> */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={sendMessage}
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46A2FF]"
                    onChange={(e) => {
                      e.preventDefault();
                      setSendMessage(e.target.value);
                    }}
                  />
                  <button
                    className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                    onClick={() => {
                      handleSendMessage();
                    }}
                  >
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
                {new Date(singleMatch?.startTime).toLocaleString()}
              </p>
            </div>

            {singleMatch.winner && (
              <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400 text-lg">🏆</span>
                  <span className="text-gray-400 font-medium">Winner</span>
                </div>
                <p className="text-green-400 font-bold text-lg capitalize">
                  {teamName}
                </p>
              </div>
            )}

            <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#46A2FF] text-lg">📊</span>
                <span className="text-gray-400 font-medium">Match Status</span>
              </div>
              <p className="text-white font-semibold text-lg capitalize">
                {singleMatch?.status?.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
        {isModalOpen && selectedAttachment && (
          <AttachmentModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            attachments={selectedAttachment?.filter((val: any) => val != null)}
          />
        )}
      </div>
      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        title="Are you sure accept score?"
        buttonTitle="Confirm"
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId();
        }}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default MatchDetails;
