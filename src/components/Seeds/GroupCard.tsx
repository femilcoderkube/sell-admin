import React, { useState } from "react";
import { X } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  shortName: string;
  region: string;
}

interface GroupCardProps {
  groupNumber: number;
  participants: (Participant | null)[];
  allParticipants: Participant[];
  onReplaceParticipant: (
    groupNumber: number,
    oldParticipantId: string,
    newParticipant: Participant
  ) => void;
  onRemoveParticipant: (groupNumber: number, participantId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  groupNumber,
  participants,
  allParticipants,
  onReplaceParticipant,
  onRemoveParticipant,
}) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Filter available participants (those not already in the current group)
  const availableParticipants = allParticipants.filter(
    (p) => !participants.some((participant) => participant?.id === p.id)
  );

  const handleReplace = (
    oldParticipantId: string,
    newParticipant: Participant
  ) => {
    onReplaceParticipant(groupNumber, oldParticipantId, newParticipant);
    setDropdownOpen(null);
    setSelectedParticipantId(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-lg font-bold text-white mb-3">Group {groupNumber}</h2>
      <div className="space-y-3">
        {participants.map((participant, index) => (
          <div
            key={participant?.id || `empty-${index}`}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {participant ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {participant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">
                      {participant.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {participant.shortName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setDropdownOpen(
                          dropdownOpen === participant.id
                            ? null
                            : participant.id
                        )
                      }
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Replace
                    </button>
                    {dropdownOpen === participant.id && (
                      <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                        {availableParticipants.length > 0 ? (
                          availableParticipants.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => handleReplace(participant.id, p)}
                              className="p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                  {p.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm text-white">
                                    {p.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {p.shortName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-gray-400 text-sm">
                            No available participants
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      onRemoveParticipant(groupNumber, participant.id)
                    }
                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </>
            ) : (
              <span className="text-gray-500 text-sm">- - -</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupCard;
