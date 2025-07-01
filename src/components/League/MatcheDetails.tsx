import React, { useEffect, useState } from "react";
import {
  fetchLeagueMatchesByID,
  updateLeagueMatchesByID,
} from "../../app/features/league/leagueSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { baseURL } from "../../axios";
import HandLogoLoader from "../Loader/Loader";
import toast from "react-hot-toast";

interface TeamScoreDetails {
  yourScore: number;
  opponentScore: number;
  description: string;
  attachment: string;
  submittedAt: string;
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
  team1ScoreDetails: TeamScoreDetails;
  team2ScoreDetails: TeamScoreDetails;
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
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return; // Prevent re-selecting the same status
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
          team1ScoreDetails: matcheDetail?.team1ScoreDetails || {},
          team2ScoreDetails: matcheDetail?.team2ScoreDetails || {},
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
        className={`inline-flex items-center rounded-full text-sm font-semibold transition-all duration-300 transform hover:shadow-lg ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer shadow-md"
        }`}
      >
        {statusOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleStatusChange(option)}
            disabled={isLoading}
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { matcheDetail, loading, error } = useSelector(
    (state: RootState) => state.leagues
  ) as {
    matcheDetail: MatchDetails | null;
    loading: boolean;
    error: string | null;
  };

  const [editingTeam1, setEditingTeam1] = useState(false);
  const [editingTeam2, setEditingTeam2] = useState(false);
  const [team1Scores, setTeam1Scores] = useState<Partial<TeamScoreDetails>>({
    yourScore: 0,
    opponentScore: 0,
    description: "",
    attachment: "",
    submittedAt: "",
  });
  const [team2Scores, setTeam2Scores] = useState<Partial<TeamScoreDetails>>({
    yourScore: 0,
    opponentScore: 0,
    description: "",
    attachment: "",
    submittedAt: "",
  });

  useEffect(() => {
    if (mid) {
      dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
    }
  }, [dispatch, mid]);

  useEffect(() => {
    if (matcheDetail) {
      setTeam1Scores({
        yourScore: matcheDetail?.team1ScoreDetails?.yourScore,
        opponentScore: matcheDetail?.team1ScoreDetails?.opponentScore,
        description: matcheDetail?.team1ScoreDetails?.description,
        attachment: matcheDetail?.team1ScoreDetails?.attachment,
        submittedAt: matcheDetail?.team1ScoreDetails?.submittedAt,
      });
      setTeam2Scores({
        yourScore: matcheDetail?.team2ScoreDetails?.yourScore,
        opponentScore: matcheDetail?.team2ScoreDetails?.opponentScore,
        description: matcheDetail?.team2ScoreDetails?.description,
        attachment: matcheDetail?.team2ScoreDetails?.attachment,
        submittedAt: matcheDetail?.team2ScoreDetails?.submittedAt,
      });
    }
  }, [matcheDetail]);

  const handleSaveTeam1 = () => {
    if (mid) {
      dispatch(
        updateLeagueMatchesByID({
          matcheId: mid,
          team1ScoreDetails: {
            ...team1Scores,
            submittedAt: new Date().toISOString(),
          } as TeamScoreDetails,
          // team1ScoreDetails: {
          //   ...team1Scores,
          //   submittedAt: team1Scores?.submittedAt || new Date().toISOString(),
          // } as TeamScoreDetails,
          team2ScoreDetails:
            matcheDetail?.team2ScoreDetails || ({} as TeamScoreDetails),
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          setEditingTeam1(false);
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        }
      });
    }
  };

  const handleSaveTeam2 = () => {
    if (mid) {
      dispatch(
        updateLeagueMatchesByID({
          matcheId: mid,
          team1ScoreDetails:
            matcheDetail?.team1ScoreDetails || ({} as TeamScoreDetails),
          // team2ScoreDetails: {
          //   ...team2Scores,
          //   submittedAt: team2Scores?.submittedAt || new Date().toISOString(),
          // } as TeamScoreDetails,
          team2ScoreDetails: {
            ...team2Scores,
            submittedAt: new Date().toISOString(),
          } as TeamScoreDetails,
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          setEditingTeam2(false);
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        }
      });
    }
  };

  const handleAdoptScores = (team: any) => {
    if (team) {
      dispatch(
        updateLeagueMatchesByID({
          winner: team,
          matcheId: mid,
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        }
      });
    }
  };

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
          <div className="text-red-400 text-xl font-semibold bg-gray-800/50  p-6 rounded-2xl border border-red-400/20">
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
          <div className="text-gray-400 text-xl font-medium bg-gray-800/50  p-6 rounded-2xl border border-gray-700/50">
            No match data found.
          </div>
        </div>
      </div>
    );
  }

  // Determine if Adopt button should be shown
  const showAdoptButtonTeam1 =
    matcheDetail.winner &&
    (matcheDetail.winner !== "team1" ||
      (matcheDetail.team1ScoreDetails.yourScore ===
        matcheDetail.team2ScoreDetails.yourScore &&
        matcheDetail.team1ScoreDetails.opponentScore ===
          matcheDetail.team2ScoreDetails.opponentScore));

  const showAdoptButtonTeam2 =
    matcheDetail.winner &&
    (matcheDetail.winner !== "team2" ||
      (matcheDetail.team1ScoreDetails.yourScore ===
        matcheDetail.team2ScoreDetails.yourScore &&
        matcheDetail.team1ScoreDetails.opponentScore ===
          matcheDetail.team2ScoreDetails.opponentScore));

  // const deleteScore = (team: any) => {
  //   if (mid) {
  //     if (team === "team1") {
  //       dispatch(
  //         updateLeagueMatchesByID({
  //           matcheId: mid,
  //           status: "in_progress",
  //           team1ScoreDetails: {
  //             opponentScore: null,
  //             yourScore: null,
  //             submittedAt: null,
  //           },
  //           winner: null,
  //         })
  //       ).then((result) => {
  //         if (updateLeagueMatchesByID.fulfilled.match(result)) {
  //           dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
  //         }
  //       });
  //     } else {
  //       dispatch(
  //         updateLeagueMatchesByID({
  //           matcheId: mid,
  //           status: "in_progress",
  //           team2ScoreDetails: {
  //             opponentScore: null,
  //             yourScore: null,
  //             submittedAt: null,
  //           },
  //           winner: null,
  //         })
  //       ).then((result) => {
  //         if (updateLeagueMatchesByID.fulfilled.match(result)) {
  //           dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
  //         }
  //       });
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-gray-800/50  border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl">
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
        <div className="bg-gray-800/50  border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl">
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

        {/* Teams Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Team 1 */}
          <div className="bg-gray-800/50  border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-[#46A2FF]/10 to-transparent p-6 border-b border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#46A2FF] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    1
                  </span>
                  Team 1
                </h3>
                <div className="flex gap-2">
                  {matcheDetail?.status === "in_dispute" &&
                    showAdoptButtonTeam1 &&
                    !editingTeam1 && (
                      <button
                        onClick={() => handleAdoptScores("team1")}
                        className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Adopt Team 2's Scores"
                      >
                        Adopt
                      </button>
                    )}
                  {editingTeam1 ? (
                    <>
                      <button
                        onClick={handleSaveTeam1}
                        className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Save Team 1 Scores"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTeam1(false)}
                        className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Cancel Editing"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {matcheDetail?.status === "in_dispute" && (
                        <button
                          onClick={() => setEditingTeam1(true)}
                          className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                          title="Edit Team 1 Scores"
                        >
                          Edit
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Players */}
              <div className="space-y-3">
                {matcheDetail.team1.map((player, index) => (
                  <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-xl">
                    <div
                      key={player?._id}
                      className="flex items-center space-x-3 "
                    >
                      <div className="relative">
                        <img
                          src={`${baseURL}/api/v1/${player?.participant?.userId?.profilePicture}`}
                          alt={player?.participant?.userId?.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#46A2FF] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-base">
                          {player?.participant?.userId?.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                          ID: {player?.participant?.gameId}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-base">
                        {player?.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scores */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-[#46A2FF] text-lg">🏆</span>
                  Scores
                </h4>
                {/* <button
                  onClick={() => deleteScore("team1")}
                  className="py-2 px-4 bg-gradient-to-r from-[#f43f5e] to-[#F05252] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                  title="Edit Team 1 Scores"
                >
                  Delete Score
                </button> */}
              </div>
              {editingTeam1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block font-medium">
                        Your Score
                      </label>
                      <input
                        type="number"
                        value={team1Scores?.yourScore}
                        onChange={(e) =>
                          setTeam1Scores({
                            ...team1Scores,
                            yourScore: Number(e.target.value),
                          })
                        }
                        className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 font-medium text-center text-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block font-medium">
                        Opponent Score
                      </label>
                      <input
                        type="number"
                        value={team1Scores?.opponentScore}
                        onChange={(e) =>
                          setTeam1Scores({
                            ...team1Scores,
                            opponentScore: Number(e.target.value),
                          })
                        }
                        className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 font-medium text-center text-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#46A2FF] mb-1">
                        {team1Scores?.yourScore || 0}
                      </div>
                      <div className="text-sm text-gray-400">Your Score</div>
                    </div>
                    <div className="text-gray-500 text-2xl font-bold">VS</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#46A2FF] mb-1">
                        {team1Scores?.opponentScore || 0}
                      </div>
                      <div className="text-sm text-gray-400">Opponent</div>
                    </div>
                  </div>
                  {team1Scores?.description && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        <span className="font-semibold text-[#46A2FF]">
                          Note:
                        </span>{" "}
                        {team1Scores?.description}
                      </p>
                    </div>
                  )}
                  {team1Scores?.attachment && (
                    <div className="mt-3">
                      <img
                        src={`${baseURL}/api/v1/${team1Scores?.attachment}`}
                        alt="Team 1 Score Proof"
                        className="w-full max-w-xs mx-auto rounded-lg shadow-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-gray-800/50  border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-6 border-b border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    2
                  </span>
                  Team 2
                </h3>
                <div className="flex gap-2 z-0">
                  {matcheDetail?.status === "in_dispute" &&
                    showAdoptButtonTeam2 &&
                    !editingTeam2 && (
                      <button
                        onClick={() => handleAdoptScores("team2")}
                        className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Adopt Team 1's Scores"
                      >
                        Adopt
                      </button>
                    )}
                  {editingTeam2 ? (
                    <>
                      <button
                        onClick={handleSaveTeam2}
                        className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Save Team 2 Scores"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTeam2(false)}
                        className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Cancel Editing"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {matcheDetail?.status === "in_dispute" && (
                        <button
                          onClick={() => setEditingTeam2(true)}
                          className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                          title="Edit Team 2 Scores"
                        >
                          Edit
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Players */}
              <div className="space-y-3">
                {matcheDetail?.team2?.map((player, index) => (
                  <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-xl">
                    <div
                      key={player?._id}
                      className="flex items-center space-x-3"
                    >
                      <div className="relative">
                        <img
                          src={`${baseURL}/api/v1/${player?.participant?.userId?.profilePicture}`}
                          alt={player?.participant?.userId?.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-base">
                          {player?.participant?.userId?.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                          ID: {player?.participant?.gameId}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-base">
                        {player?.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scores */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-orange-500 text-lg">🏆</span>
                  Scores
                </h4>{" "}
                {/* <button
                  onClick={() => deleteScore("team2")}
                  className="py-2 px-4 bg-gradient-to-r from-[#f43f5e] to-[#F05252] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                  title="Edit Team 1 Scores"
                >
                  Delete Score
                </button> */}
              </div>

              {editingTeam2 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block font-medium">
                        Your Score
                      </label>
                      <input
                        type="number"
                        value={team2Scores?.yourScore}
                        onChange={(e) =>
                          setTeam2Scores({
                            ...team2Scores,
                            yourScore: Number(e.target.value),
                          })
                        }
                        className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 font-medium text-center text-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block font-medium">
                        Opponent Score
                      </label>
                      <input
                        type="number"
                        value={team2Scores?.opponentScore}
                        onChange={(e) =>
                          setTeam2Scores({
                            ...team2Scores,
                            opponentScore: Number(e.target.value),
                          })
                        }
                        className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 font-medium text-center text-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500 mb-1">
                        {team2Scores?.yourScore || 0}
                      </div>
                      <div className="text-sm text-gray-400">Your Score</div>
                    </div>
                    <div className="text-gray-500 text-2xl font-bold">VS</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500 mb-1">
                        {team2Scores?.opponentScore || 0}
                      </div>
                      <div className="text-sm text-gray-400">Opponent</div>
                    </div>
                  </div>
                  {team2Scores?.description && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        <span className="font-semibold text-orange-500">
                          Note:
                        </span>{" "}
                        {team2Scores?.description}
                      </p>
                    </div>
                  )}
                  {team2Scores?.attachment && (
                    <div className="mt-3">
                      <img
                        src={`${baseURL}/api/v1/${team2Scores?.attachment}`}
                        alt="Team 2 Score Proof"
                        className="w-full max-w-xs mx-auto rounded-lg shadow-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Information */}
        <div className="bg-gray-800/50  border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#46A2FF]/10 rounded-xl flex items-center justify-center">
              <span className="text-[#46A2FF] text-xl">ℹ️</span>
            </div>
            <h3 className="font-bold text-xl text-white">Match Information</h3>
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
