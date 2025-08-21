import React, { useEffect, useState } from "react";
import { baseURL } from "../../axios";
import moment from "moment";

import ConfirmationPopUp from "../../components/confirmationPopUp";
import { socket } from "../../app/socket/socket";
import { SOCKET } from "../../utils/constant";
import HandLogoLoader from "../../components/Loader/Loader";

const formatCountdown = (seconds: any) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const getIntervalCountdown = (
  currentIntervalTime: any,
  pickTimeSeconds: any
) => {
  if (!currentIntervalTime || !pickTimeSeconds) return "00:00";
  const endTime =
    new Date(currentIntervalTime).getTime() + pickTimeSeconds * 1000;
  const now = new Date().getTime();
  const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
  return formatCountdown(secondsLeft);
};

interface Player {
  index: number;
  username: string;
  fullName: string;
  id: string;
  rep: number;
  profilePic: string;
  rank: number;
  score: number;
}

interface Captain {
  totalWins: number;
  totalLosses: number;
  totalMatches: number;
  totalScore: number;
  totalLeaguesScore: number;
  winPercentage: number;
  wilsonScore: number;
  userId: {
    _id: string;
    username: string;
    profilePicture: string | null;
    fullName: string;
  };
  rank: number;
}

interface Team {
  captains: Captain;
  players: Player[];
}

interface DraftData {
  _id: string;
  leagueId: {
    _id: string;
    title: string;
    titleAr: string;
  };
  totalTeams: number;
  totalPlayers: number;
  startTime: string;
  pickTimeSeconds: number;
  status: string;
  eligiblePlayers: any[];
  otherPlayers: Player[];
  isPublished: boolean;
  isDeactivate: boolean;
  currentInterval: number;
  currentIntervalTime: string;
  totalIntervals: number;
  teams: Team[];
  createdAt: string;
  updatedAt: string;
}

interface StartDraftPlayerCardProps {
  startDraftData: DraftData;
  status: any;
  did?: any;
}

const StartDraftPlayerCard: React.FC<StartDraftPlayerCardProps> = ({
  startDraftData,
  status,
  did,
}) => {
  const [countdown, setCountdown] = useState("00:00");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [confirmationPopUp, setConfirmationPopUp] = useState(0);
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);

  const teams = startDraftData.teams || [];
  const otherPlayers = startDraftData.otherPlayers || [];

  const pickes =
    otherPlayers?.map((pick, idx) => ({
      index: idx,
      username: pick?.userId?.username || "",
      fullName: pick?.userId?.fullName || "",
      id: pick?.userId?._id || "",
      rep: pick?.wilsonScore || 0,
      profilePic: `${baseURL}/api/v1/${pick?.userId?.profilePicture}` || "",
      rank: pick?.rank || "",
      score: Math.round(pick?.totalLeaguesScore || 0),
    })) || [];

  const draftStarted = new Date(startDraftData?.startTime) < new Date();

  useEffect(() => {
    if (startDraftData) {
      setIsInitialLoading(false);
    }
  }, [startDraftData]);

  useEffect(() => {
    if (draftStarted && startDraftData?.currentIntervalTime) {
      const initialCountdown = getIntervalCountdown(
        startDraftData.currentIntervalTime,
        startDraftData.pickTimeSeconds
      );
      setCountdown(initialCountdown || "00:00");
    }
  }, [startDraftData, draftStarted]);

  useEffect(() => {
    if (countdown <= "00:00" || !draftStarted) return;

    const timer = setInterval(() => {
      const realTimeCountdown = getIntervalCountdown(
        startDraftData?.currentIntervalTime,
        startDraftData.pickTimeSeconds
      );
      setCountdown(realTimeCountdown || "00:00");
    }, 100);

    return () => clearInterval(timer);
  }, [countdown, startDraftData]);

  const getServerURL = (path: string) => {
    return path ? `${baseURL}/api/v1/${path}` : "";
  };

  const handlePlayerClick = (Playerdata: any) => {
    setSelectedPlayerData(Playerdata);
    setConfirmationPopUp(3);
  };

  if (isInitialLoading) {
    return <HandLogoLoader />;
  }

  return (
    <main className="flex-1 admin-draft-page-wrapper p-6 bg-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {draftStarted && otherPlayers.length > 0 && (
          <div className="text-center mb-6">
            <h2 className="text-6xl font-bold font_oswald text-white">
              {countdown}
            </h2>
          </div>
        )}

        <div className="drafting__final_teams-wrapper mb-8">
          {new Date(startDraftData?.startTime) > new Date() && (
            <p className="text-center mb-4">
              {" "}
              Draft Will Start At:{" "}
              {moment(startDraftData.startTime)
                .local()
                .format("DD/MM/YYYY hh:mm A")}
            </p>
          )}

          <h2 className="text-3xl font-bold font_oswald text-center mb-10">
            Teams
          </h2>

          {teams.length === 0 ? (
            <div className="text-center py-8 text-xl text-gray-500">
              No Teams Available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {teams.map((team, teamIdx) => {
                const isCurrentCaptainTurn = (() => {
                  if (!draftStarted || startDraftData.currentInterval === -1)
                    return false;
                  const totalTeams = startDraftData.totalTeams || teams.length;
                  const interval = startDraftData.currentInterval + 1;
                  const snakeOrder = [];
                  let direction = 1;
                  let currentRoundTeams = [];

                  for (let i = 1; i <= interval; i++) {
                    if (currentRoundTeams.length === 0) {
                      currentRoundTeams =
                        direction === 1
                          ? [...Array(totalTeams).keys()]
                          : [...Array(totalTeams).keys()].reverse();
                    }
                    snakeOrder.push(currentRoundTeams.shift());
                    if (currentRoundTeams.length === 0) {
                      direction *= -1;
                    }
                  }
                  return snakeOrder[interval - 1] === teamIdx;
                })();

                return (
                  <div className="drafting__teams-list" key={teamIdx}>
                    <h3 className="text-2xl font-medium font_oswald text-white mb-2">
                      Team {teamIdx + 1}
                    </h3>
                    <div className="drafting__teams-list-block">
                      <div
                        className={`relative ${
                          isCurrentCaptainTurn && draftStarted
                            ? "border-2 border-green-500 rounded-lg"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900 bg-opacity-75">
                          <img
                            src={
                              team.captains.userId.profilePicture
                                ? `${baseURL}/api/v1/${team.captains.userId.profilePicture}`
                                : "/default-profile.png"
                            }
                            alt={`${team.captains.userId.fullName} profile picture`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="group relative">
                            <span className="font-medium text-white text-sm">
                              {team.captains.userId.fullName}
                            </span>
                            <span className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 mt-1 z-10">
                              Rank: {team.captains.rank}, Score:{" "}
                              {team.captains.totalScore}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul className="drafting__teams-picked-list mt-4 flex flex-col gap-4">
                        {team.players.map((p, slotIdx) => {
                          const data = {
                            index: p.index,
                            username: p.username || "",
                            fullName: p.fullName || "",
                            id: p.id || `empty-${teamIdx}-${slotIdx}`,
                            rep: p.rep || 0,
                            profilePic: getServerURL(p.profilePic) || "",
                            rank: p.rank || "",
                            score: Math.round(p.score || 0),
                          };

                          return (
                            <div className="flex items-center gap-3 p-3 justify-between rounded-lg transition-colors bg-gray-700 bg-opacity-75 hover:bg-gray-600 cursor-grab">
                              <img
                                src={`${baseURL}/api/v1/${data.profilePic}`}
                                alt={`${data.fullName} profile picture`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="group relative">
                                <div className="font-medium text-white text-sm">
                                  {data.fullName}
                                </div>
                                <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 mt-1 z-10">
                                  {data.fullName} (Rank: {data.rank}, Score:{" "}
                                  {data.score})
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Players */}
        <div className="draft-picks-wrapper pt-10">
          <h2 className="text-3xl font-bold font_oswald text-center mb-4">
            {otherPlayers.length > 0
              ? "Available Draft Players"
              : "No Draft Picks"}
          </h2>
          {!draftStarted ? (
            <div className="text-center py-8">
              {/* Show grayed out players */}
              <div className="draft-picks-wrapper-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-8 opacity-50 pointer-events-none">
                {otherPlayers?.length > 0 &&
                  pickes?.map((data, rowIdx) => (
                    <div className="draft-row" key={rowIdx + "A"}>
                      <div
                        className="draft-picks-wrapper-item"
                        key={data.index}
                      >
                        {rowIdx % 2 === 0 ? (
                          <div
                            className="flex items-center gap-4 bg-gray-800 bg-opacity-90 hover:bg-gray-700 
      cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-3 
      shadow-md hover:shadow-lg active:scale-[0.98] select-none"
                            onClick={() => handlePlayerClick(data)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handlePlayerClick(data)
                            }
                            aria-label={`Select player ${data.fullName}`}
                          >
                            <img
                              src={`${baseURL}/api/v1/${data.profilePic}`}
                              alt={`${data.fullName}'s profile picture`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 
        group-hover:border-blue-500 transition-colors duration-200"
                            />
                            <div className="group relative flex-1">
                              <div className="font-semibold text-gray-100 text-sm truncate">
                                {data.fullName}
                              </div>
                              <div
                                className="absolute hidden group-hover:flex bg-gray-900 bg-opacity-95 
        text-gray-200 text-xs rounded-lg p-3 mt-2 z-20 shadow-xl 
        border border-gray-700 min-w-max"
                              >
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium">
                                    {data.fullName}
                                  </span>
                                  <span>Rank: {data.rank}</span>
                                  <span>Score: {data.score}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-4 bg-gray-800 bg-opacity-90 hover:bg-gray-700 
      cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-3 
      shadow-md hover:shadow-lg active:scale-[0.98] select-none"
                            onClick={() => handlePlayerClick(data)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handlePlayerClick(data)
                            }
                            aria-label={`Select player ${data.fullName}`}
                          >
                            <img
                              src={`${baseURL}/api/v1/${data.profilePic}`}
                              alt={`${data.fullName}'s profile picture`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 
        group-hover:border-blue-500 transition-colors duration-200"
                            />
                            <div className="group relative flex-1">
                              <div className="font-semibold text-gray-100 text-sm truncate">
                                {data.fullName}
                              </div>
                              <div
                                className="absolute hidden group-hover:flex bg-gray-900 bg-opacity-95 
        text-gray-200 text-xs rounded-lg p-3 mt-2 z-20 shadow-xl 
        border border-gray-700 min-w-max"
                              >
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium">
                                    {data.fullName}
                                  </span>
                                  <span>Rank: {data.rank}</span>
                                  <span>Score: {data.score}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-8">
              {otherPlayers?.length > 0 ? (
                pickes?.map((data, idx) => (
                  <div className="draft-picks-wrapper-item" key={data.id}>
                    {idx % 2 === 0 ? (
                      <div
                        className="flex items-center gap-4 bg-gray-800 bg-opacity-90 hover:bg-gray-700 
      cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-3 
      shadow-md hover:shadow-lg active:scale-[0.98] select-none"
                        onClick={() => handlePlayerClick(data)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handlePlayerClick(data)
                        }
                        aria-label={`Select player ${data.fullName}`}
                      >
                        <img
                          src={`${baseURL}/api/v1/${data.profilePic}`}
                          alt={`${data.fullName}'s profile picture`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 
        group-hover:border-blue-500 transition-colors duration-200"
                        />
                        <div className="group relative flex-1">
                          <div className="font-semibold text-gray-100 text-sm truncate">
                            {data.fullName}
                          </div>
                          <div
                            className="absolute hidden group-hover:flex bg-gray-900 bg-opacity-95 
        text-gray-200 text-xs rounded-lg p-3 mt-2 z-20 shadow-xl 
        border border-gray-700 min-w-max"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                {data.fullName}
                              </span>
                              <span>Rank: {data.rank}</span>
                              <span>Score: {data.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-4 bg-gray-800 bg-opacity-90 hover:bg-gray-700 
      cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-3 
      shadow-md hover:shadow-lg active:scale-[0.98] select-none"
                        onClick={() => handlePlayerClick(data)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handlePlayerClick(data)
                        }
                        aria-label={`Select player ${data.fullName}`}
                      >
                        <img
                          src={`${baseURL}/api/v1/${data.profilePic}`}
                          alt={`${data.fullName}'s profile picture`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 
        group-hover:border-blue-500 transition-colors duration-200"
                        />
                        <div className="group relative flex-1">
                          <div className="font-semibold text-gray-100 text-sm truncate">
                            {data.fullName}
                          </div>
                          <div
                            className="absolute hidden group-hover:flex bg-gray-900 bg-opacity-95 
        text-gray-200 text-xs rounded-lg p-3 mt-2 z-20 shadow-xl 
        border border-gray-700 min-w-max"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                {data.fullName}
                              </span>
                              <span>Rank: {data.rank}</span>
                              <span>Score: {data.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-xl text-gray-500">
                  No Draft Players Available
                </div>
              )}
            </div>
          )}

          <ConfirmationPopUp
            onPlayerSelect={({ did, Playerdata }) => {
              socket.emit(SOCKET.SETPICKEDDRAFTPLAYER, {
                draftId: did,
                Playerdata,
              });
            }}
            did={did}
            setConfirmationPopUp={setConfirmationPopUp}
            confirmationPopUp={confirmationPopUp}
            selectedPlayerData={selectedPlayerData}
          />
        </div>
      </div>
    </main>
  );
};

export default StartDraftPlayerCard;
