import React from "react";
import { X } from "lucide-react";
import { baseURL } from "../../axios";

interface Participant {
  id: string;
  name: string;
  shortName: string;
  region?: string;
  logoImage: string;
  backgroundImage: string;
  participantId: string
}

interface GroupCardProps {
  groupNumber: number;
  participants: (Participant | null)[];
  availableParticipants: Participant[];
  onReplaceParticipant: (
    groupNumber: number,
    slotIndex: number,
    newParticipant: Participant | null,
    sourceGroupNumber?: number,
    sourceSlotIndex?: number
  ) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  groupNumber,
  participants,
  availableParticipants,
  onReplaceParticipant,
}) => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    participant: Participant,
    sourceGroupNumber?: number,
    sourceSlotIndex?: number
  ) => {
    const dragData = {
      participant,
      sourceGroupNumber,
      sourceSlotIndex,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    console.log("Drag started:", dragData);
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
        participant: Participant;
        sourceGroupNumber?: number;
        sourceSlotIndex?: number;
      };
      const { participant, sourceGroupNumber, sourceSlotIndex } = dragData;
      console.log("Dropped:", {
        participant,
        sourceGroupNumber,
        sourceSlotIndex,
      });

      if (
        sourceGroupNumber === groupNumber &&
        sourceSlotIndex === targetSlotIndex
      ) {
        return;
      }

      onReplaceParticipant(
        groupNumber,
        targetSlotIndex,
        participant,
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
      // style={{
      //   backgroundImage: participants[0]?.backgroundImage
      //     ? `url(${baseURL}/api/v1/${participants[0].backgroundImage})`
      //     : "none",
      // }}
    >
      <h2 className="text-lg font-bold text-white mb-3 bg-gray-900 bg-opacity-75 p-2 rounded">
        Group {groupNumber}
      </h2>
      <div className="space-y-3">
        {participants.map((participant, index) => (
          <div
            key={participant?.id || `empty-${index}`}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              participant
                ? "bg-gray-700 bg-opacity-75 hover:bg-gray-600 cursor-grab"
                : "bg-gray-800 border-2 border-dashed border-gray-600"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            draggable={!!participant}
            onDragStart={
              participant
                ? (e) => handleDragStart(e, participant, groupNumber, index)
                : undefined
            }
            role="region"
            aria-label={`Team slot ${index + 1} in Group ${groupNumber}`}
          >
            {participant ? (
              <div className="flex items-center gap-3">
                <img
                  src={`${baseURL}/api/v1/${participant?.logoImage}`}
                  alt={`${participant?.name} logo`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="group relative">
                  <div className="font-medium text-white text-sm">
                    {participant?.name}
                  </div>
                  <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 mt-1 z-10">
                    {participant?.name}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Drop team here</span>
            )}
          </div>
        ))}
      </div>
      {availableParticipants?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-white mb-2 bg-gray-900 bg-opacity-75 p-2 rounded">
            Available Teams
          </h3>
          <div
            className="max-h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            style={{ scrollbarWidth: "thin" }}
          >
            {availableParticipants?.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p)}
                className="p-3 bg-gray-900 bg-opacity-75 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                role="button"
                aria-label={`Drag ${p.name} to a group`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p?.logoImage}
                    alt={`${p?.name} logo`}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="group relative">
                    <div className="text-sm text-white">{p?.shortName}</div>
                    <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 mt-1 z-10">
                      {p?.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCard;
