// src/components/CommonModal.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // Ensure lucide-react is installed
import { updateParticipants } from "../../app/features/league/leagueSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

interface Participant {
  _id: string;
  discordId: string;
  gameId: string;
  otherFields: any[];
}

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParticipants: Participant | null;
  fetchParticipants: () => void;
  setIsEditModalOpen: (open: boolean) => void; // ✅
}

const ParticipantsEditModel: React.FC<CommonModalProps> = ({
  isOpen,
  onClose,
  selectedParticipants,
  fetchParticipants,
  setIsEditModalOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [discordId, setDiscordId] = useState("");
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    if (selectedParticipants) {
      setDiscordId(selectedParticipants.otherFields?.[0]?.value || "");
      setGameId(selectedParticipants.gameId || "");
    }
  }, [selectedParticipants]);

  if (!isOpen) return null;

  const handleEdit = async () => {
    if (selectedParticipants) {
      const updatedOtherFields = [...selectedParticipants.otherFields];

      if (updatedOtherFields.length > 0) {
        // Update the first item
        updatedOtherFields[0] = {
          ...updatedOtherFields[0],
          value: discordId,
        };
      } else {
        // Add a new object if empty
        updatedOtherFields.push({
          key: "discord",
          value: discordId,
        });
      }

      const resultAction = await dispatch(
        updateParticipants({
          id: selectedParticipants._id,
          data: {
            gameId,
            otherFields: updatedOtherFields,
          },
        })
      );
      if (resultAction.payload.success) {
        setIsEditModalOpen(false);
        fetchParticipants();
      }
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#1E2235] rounded-xl max-w-[90vw] w-full sm:max-w-96 flex flex-col shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-4 border-b border-[#2A2E3F]">
          <h3 className="text-white text-xl sm:text-2xl font-bold">Edit Participants</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-4 max-h-[60vh] sm:max-h-[70vh]">
          <div className="text-gray-200 text-sm sm:text-base flex flex-col gap-2">
            <div>
              <label
                htmlFor="phone"
                className="absolute translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Discord ID
              </label>
              <input
                type="text"
                id="discordId"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder=" "
                className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="absolute translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Game ID
              </label>
              <input
                type="text"
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder=" "
                className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
              />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-4 border-t border-[#2A2E3F] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-[#2A2E3F] text-white py-2 px-4 rounded-lg hover:bg-[#3A3F5A] transition-colors duration-200 text-sm sm:text-base"
          >
            Close
          </button>
          <button
            onClick={() => handleEdit()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsEditModel;
