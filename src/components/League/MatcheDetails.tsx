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
            submittedAt: team1Scores?.submittedAt || new Date().toISOString(),
          } as TeamScoreDetails,
          team2ScoreDetails:
            matcheDetail?.team2ScoreDetails || ({} as TeamScoreDetails),
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          setEditingTeam1(false);
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        } else if (updateLeagueMatchesByID.rejected.match(result)) {
          toast.error(result.payload as string);
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
          team2ScoreDetails: {
            ...team2Scores,
            submittedAt: team2Scores?.submittedAt || new Date().toISOString(),
          } as TeamScoreDetails,
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          setEditingTeam2(false);
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        } else if (updateLeagueMatchesByID.rejected.match(result)) {
          toast.error(result.payload as string);
        }
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white animate-pulse">
          <HandLogoLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-red-400 text-lg font-medium bg-gray-800 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!matcheDetail) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-gray-400 text-lg font-medium bg-gray-800 p-4 rounded-lg">
          No match data found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 py-6 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 py-2 px-4 bg-[#46A2FF] text-white rounded-lg hover:bg-[#3b8ce6] text-base transition duration-300"
            title="Return to previous page"
          >
            ← Back
          </button>
          <img
            src={`${baseURL}/api/v1/${matcheDetail?.league?.logo}`}
            alt={matcheDetail?.league?.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-bold text-2xl">
              {matcheDetail?.league?.title}
            </h3>
            <p className="text-gray-400 text-base">
              {matcheDetail?.league?.format}
            </p>
          </div>
        </div>
      </div>

      {/* Match Status */}
      <div className="py-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${
              matcheDetail?.status === "in_progress"
                ? "bg-yellow-600 text-yellow-100"
                : matcheDetail?.status === "completed"
                ? "bg-green-600 text-green-100"
                : "bg-red-600 text-red-100"
            }`}
          >
            {matcheDetail?.status?.replace("_", " ").toUpperCase()}
          </span>
          {matcheDetail?.isScoreVerified && (
            <span className="text-green-400 font-medium text-base flex items-center gap-1">
              ✓ Score Verified
            </span>
          )}
        </div>
      </div>

      {/* Teams and Scores */}
      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
        {/* Team 1 */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-xl">Team 1</h4>
            {editingTeam1 ? (
              <div className="space-x-2">
                <button
                  onClick={handleSaveTeam1}
                  className="py-2 px-4 bg-[#46A2FF] text-white rounded-lg hover:bg-[#3b8ce6] text-base transition duration-300 shadow-md"
                  title="Save Team 1 Scores"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTeam1(false)}
                  className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-base transition duration-300 shadow-md"
                  title="Cancel Editing"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingTeam1(true)}
                className="py-2 px-4 bg-[#46A2FF] text-white rounded-lg hover:bg-[#3b8ce6] text-base transition duration-300 shadow-md"
                title="Edit Team 1 Scores"
              >
                Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
            {matcheDetail.team1.map((player) => (
              <div key={player?._id} className="flex items-center space-x-3">
                <img
                  src={`${baseURL}/api/v1/${player?.participant?.userId?.profilePicture}`}
                  alt={player?.participant?.userId?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">
                    {player?.participant?.userId?.username}
                  </p>
                  <p className="text-gray-400 text-sm">
                    ID: {player?.participant?.gameId}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-gray-300 text-base font-semibold mb-2 flex items-center gap-2">
              <span className="text-[#46A2FF]">🏆</span> Scores
            </p>
            {editingTeam1 ? (
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-2">
                <div className="relative w-full sm:w-32">
                  <label className="text-sm text-gray-400 mb-1 block">
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
                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 shadow-inner hover:bg-gray-800 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
                <div className="relative w-full sm:w-32">
                  <label className="text-sm text-gray-400 mb-1 block">
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
                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 shadow-inner hover:bg-gray-800 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-2 bg-gray-900 p-4 rounded-lg shadow-inner">
                <p className="text-white text-base font-medium">
                  Your Score:{" "}
                  <span className="text-[#46A2FF]">
                    {team1Scores?.yourScore}
                  </span>{" "}
                  | Opponent Score:{" "}
                  <span className="text-[#46A2FF]">
                    {team1Scores?.opponentScore}
                  </span>
                </p>
                {team1Scores.description && (
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="font-semibold">Description:</span>{" "}
                    {team1Scores?.description}
                  </p>
                )}
                {team1Scores?.attachment && (
                  <img
                    src={`${baseURL}/api/v1/${team1Scores?.attachment}`}
                    alt="Team 1 Score Proof"
                    className="mt-2 max-w-xs rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Team 2 */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-xl">Team 2</h4>
            {editingTeam2 ? (
              <div className="space-x-2">
                <button
                  onClick={handleSaveTeam2}
                  className="py-2 px-4 bg-[#46A2FF] text-white rounded-lg hover:bg-[#3b8ce6] text-base transition duration-300 shadow-md"
                  title="Save Team 2 Scores"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTeam2(false)}
                  className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-base transition duration-300 shadow-md"
                  title="Cancel Editing"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingTeam2(true)}
                className="py-2 px-4 bg-[#46A2FF] text-white rounded-lg hover:bg-[#3b8ce6] text-base transition duration-300 shadow-md"
                title="Edit Team 2 Scores"
              >
                Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
            {matcheDetail?.team2?.map((player) => (
              <div key={player?._id} className="flex items-center space-x-3">
                <img
                  src={`${baseURL}/api/v1/${player?.participant?.userId?.profilePicture}`}
                  alt={player?.participant?.userId?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">
                    {player?.participant?.userId?.username}
                  </p>
                  <p className="text-gray-400 text-sm">
                    ID: {player?.participant?.gameId}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-gray-300 text-base font-semibold mb-2 flex items-center gap-2">
              <span className="text-[#46A2FF]">🏆</span> Scores
            </p>
            {editingTeam2 ? (
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-2">
                <div className="relative w-full sm:w-32">
                  <label className="text-sm text-gray-400 mb-1 block">
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
                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 shadow-inner hover:bg-gray-800 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
                <div className="relative w-full sm:w-32">
                  <label className="text-sm text-gray-400 mb-1 block">
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
                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 shadow-inner hover:bg-gray-800 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-2 bg-gray-900 p-4 rounded-lg shadow-inner">
                <p className="text-white text-base font-medium">
                  Your Score:{" "}
                  <span className="text-[#46A2FF]">
                    {team2Scores?.yourScore}
                  </span>{" "}
                  | Opponent Score:{" "}
                  <span className="text-[#46A2FF]">
                    {team2Scores?.opponentScore}
                  </span>
                </p>
                {team2Scores.description && (
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="font-semibold">Description:</span>{" "}
                    {team2Scores?.description}
                  </p>
                )}
                {team2Scores.attachment && (
                  <img
                    src={`${baseURL}/api/v1/${team2Scores?.attachment}`}
                    alt="Team 2 Score Proof"
                    className="mt-2 max-w-xs rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg">
        <h4 className="font-bold text-xl mb-4">Match Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-white">
          <div>
            <span className="text-gray-400">Start Time: </span>
            {new Date(matcheDetail?.startTime).toLocaleString()}
          </div>
          {matcheDetail.winner && (
            <div>
              <span className="text-gray-400">Winner: </span>
              <span className="text-green-400">
                {matcheDetail.team1?.find(
                  (t) => t?._id === matcheDetail?.winner
                )?.participant?.userId?.username ||
                  matcheDetail.team2?.find(
                    (t) => t?._id === matcheDetail?.winner
                  )?.participant?.userId?.username ||
                  "Unknown"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
