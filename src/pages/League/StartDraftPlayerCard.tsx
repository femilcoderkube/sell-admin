import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { baseURL } from "../../axios";
import moment from "moment";

import GoldCrown from "../../assets/images/gold_crown.png";

import {
  FirstPosCard_gold,
  EvenPosCard,
  OddPosCard,
} from "../../components/DraftingDetailComponents/DraftTeamsCards";
import HandLogoLoader from "../../components/Loader/loader";

// Utility function to format countdown timer
const formatCountdown = (seconds: any) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// Utility function to calculate countdown based on pick time
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
}

const StartDraftPlayerCard: React.FC<StartDraftPlayerCardProps> = ({
  startDraftData,
}) => {
  const [countdown, setCountdown] = useState("00:00");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate fetching teams and players data (replace with actual API call if needed)
  const teams = startDraftData.teams || [];
  const otherPlayers = startDraftData.otherPlayers || [];
  const draftStarted = new Date(startDraftData?.startTime) < new Date();

  useEffect(() => {
    // Simulate data fetching completion
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

  if (isInitialLoading) {
    return <HandLogoLoader />;
  }

  return (
    <main className="flex-1 admin-draft-page-wrapper p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Draft Metadata */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold font_oswald mb-4">
            {startDraftData.leagueId.title} Draft
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>status:</strong> {startDraftData.status.toUpperCase()}
              </p>
              <p>
                <strong>startTime:</strong>{" "}
                {moment(startDraftData.startTime)
                  .local()
                  .format("DD/MM/YYYY hh:mm A")}
              </p>
              <p>
                <strong>totalTeams:</strong> {startDraftData.totalTeams}
              </p>
            </div>
            <div>
              <p>
                <strong>totalPlayers:</strong> {startDraftData.totalPlayers}
              </p>
              <p>
                <strong>currentInterval:</strong>{" "}
                {startDraftData.currentInterval + 1 || "N/A"}
              </p>
              <p>
                <strong>countdown:</strong>{" "}
                {draftStarted ? countdown : "Not Started"}
              </p>
            </div>
          </div>
          {/* Admin Controls */}
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={draftStarted}
              onClick={() => {
                // Implement start draft logic (e.g., API call)
                console.log("Start Draft");
              }}
            >
              startDraft
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              disabled={!draftStarted || startDraftData.status !== "active"}
              onClick={() => {
                // Implement pause draft logic
                console.log("Pause Draft");
              }}
            >
              pauseDraft
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => {
                // Implement reset draft logic
                console.log("Reset Draft");
              }}
            >
              resetDraft
            </button>
          </div>
        </div>

        {/* Draft Timer */}
        {draftStarted && otherPlayers.length > 0 && (
          <div className="text-center mb-6">
            <h2 className="text-6xl font-bold font_oswald text-gray-800">
              {countdown}
            </h2>
          </div>
        )}

        {/* Teams Grid */}
        <div className="drafting__final_teams-wrapper mb-8">
          <h2 className="text-3xl font-bold font_oswald text-center mb-4">
            teams
          </h2>
          {teams.length === 0 ? (
            <div className="text-center py-8 text-xl text-gray-500">
              noTeams
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
                    <h3 className="text-2xl font-medium font_oswald text-gray-800 mb-2">
                      teams {teamIdx + 1}
                    </h3>
                    <div className="drafting__teams-list-block bg-white rounded-lg shadow-md p-4">
                      <div
                        className={`relative ${
                          isCurrentCaptainTurn && draftStarted
                            ? "border-2 border-green-500"
                            : ""
                        }`}
                      >
                        <span className="absolute top-[-2.5rem] right-6">
                          <img
                            alt={"gold_crown"}
                            className="h-9"
                            src={GoldCrown}
                          />
                        </span>
                        <FirstPosCard_gold
                          props={{
                            index: teamIdx,
                            username: team?.captains?.userId?.username || "",
                            fullName: team?.captains?.userId?.fullName || "",
                            id: team?.captains?.userId?._id || "",
                            rep: team?.captains?.wilsonScore || 0,
                            profilePic: getServerURL(
                              team?.captains?.userId?.profilePicture || ""
                            ),
                            rank: team?.captains?.rank || "",
                            score: Math.round(
                              team?.captains?.totalLeaguesScore || 0
                            ),
                          }}
                        />
                      </div>
                      <ul className="drafting__teams-picked-list mt-4">
                        {team.players.map((p, slotIdx) => {
                          const isPicked = !!p.username;
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
                          const Card =
                            slotIdx % 2 === 0 ? EvenPosCard : OddPosCard;
                          return (
                            <li
                              key={data.id}
                              className={`list-none ${
                                isPicked ? "assign" : "empty"
                              }`}
                            >
                              <Card props={data} />
                            </li>
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
        <div className="draft-picks-wrapper">
          <h2 className="text-3xl font-bold font_oswald text-center mb-4">
            {otherPlayers.length > 0 ? "availablePlayers" : "no_draft_picks"}
          </h2>
          {!draftStarted ? (
            <div className="text-center py-8">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <p className="text-xl font-semibold">draft_not_started</p>
                <p>
                  draft_will_begin
                  {moment(startDraftData.startTime)
                    .local()
                    .format("DD/MM/YYYY hh:mm A")}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-8">
              {otherPlayers.length > 0 ? (
                otherPlayers.map((data, idx) => (
                  <div className="draft-picks-wrapper-item" key={data.id}>
                    {idx % 2 === 0 ? (
                      <OddPosCard props={data} />
                    ) : (
                      <EvenPosCard props={data} />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-xl text-gray-500">
                  no_draft_player
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default StartDraftPlayerCard;
