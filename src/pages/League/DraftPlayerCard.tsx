import React from "react";
import { X } from "lucide-react";
import { baseURL } from "../../axios";

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

interface DraftPlayerCardProps {
  groupNumber: number;
  captain: Captain;
  players: (Player | null)[];
  onReplacePlayer: (
    groupNumber: number,
    slotIndex: number,
    newPlayer: Player | null,
    sourceGroupNumber?: number,
    sourceSlotIndex?: number
  ) => void;
}

const DraftPlayerCard: React.FC<DraftPlayerCardProps> = ({
  groupNumber,
  captain,
  players,
  onReplacePlayer,
}) => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    player: Player,
    sourceGroupNumber?: number,
    sourceSlotIndex?: number
  ) => {
    const dragData = {
      player,
      sourceGroupNumber,
      sourceSlotIndex,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("border-blue-500");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-blue-500");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetSlotIndex: number
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500");
    try {
      const dragData = JSON.parse(
        e.dataTransfer.getData("application/json")
      ) as {
        player: Player;
        sourceGroupNumber?: number;
        sourceSlotIndex?: number;
      };
      const { player, sourceGroupNumber, sourceSlotIndex } = dragData;

      if (
        sourceGroupNumber === groupNumber &&
        sourceSlotIndex === targetSlotIndex
      ) {
        return;
      }

      onReplacePlayer(
        groupNumber,
        targetSlotIndex,
        player,
        sourceGroupNumber,
        sourceSlotIndex
      );
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  return (
    <div
      className="min-w-[250px] p-4 rounded-lg bg-cover bg-center"
      //   style={{
      //     backgroundImage: captain.userId.profilePicture
      //       ? `url(${baseURL}/api/v1/${captain.userId.profilePicture})`
      //       : "none",
      //   }}
    >
      {/* <h2 className="text-lg font-bold text-white mb-3 bg-gray-900 bg-opacity-75 p-2 rounded">
        Captain
      </h2> */}
      <div className="space-y-3">
        {/* Captain Display (Non-draggable) */}
        <div
          className="flex items-center justify-between p-3 rounded-lg bg-gray-900 bg-opacity-75"
          role="region"
          aria-label={`Captain for Group ${groupNumber}`}
        >
          <div className="flex items-center gap-3">
            <img
              src={
                captain.userId.profilePicture
                  ? `${baseURL}/api/v1/${captain.userId.profilePicture}`
                  : "/default-profile.png"
              }
              alt={`${captain.userId.fullName} profile picture`}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="group relative ">
              <div className="font-medium text-white text-sm">
                C. {captain.userId.fullName}
              </div>
              <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 mt-1 z-10">
                {captain.userId.fullName} (Rank: {captain.rank}, Score:{" "}
                {captain.totalScore})
              </div>
            </div>
          </div>
        </div>
        {/* Players Display (Draggable) */}
        {players.map((player, index) => (
          <div
            key={player?.id || `empty-${index}`}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              player
                ? "bg-gray-700 bg-opacity-75 hover:bg-gray-600 cursor-grab"
                : "bg-gray-800 border-2 border-dashed border-gray-600"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            draggable={!!player}
            onDragStart={
              player
                ? (e) => handleDragStart(e, player, groupNumber, index)
                : undefined
            }
            role="region"
            aria-label={`Player slot ${index + 1} in Group ${groupNumber}`}
          >
            {player ? (
              <div className="flex items-center gap-3">
                <img
                  src={`${baseURL}/api/v1/${player.profilePic}`}
                  alt={`${player.fullName} profile picture`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="group relative">
                  <div className="font-medium text-white text-sm">
                    {player.fullName}
                  </div>
                  <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 mt-1 z-10">
                    {player.fullName} (Rank: {player.rank}, Score:{" "}
                    {player.score})
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Drop player here</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftPlayerCard;
