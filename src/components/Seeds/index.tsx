import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlusIcon } from "../ui";
import { useEffect, useState } from "react";
import { Edit2, Lock, Plus, Search, Shuffle, Unlock, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotInStageParticipants } from "../../app/features/tournament/notInStageSlice";
import { RootState } from "../../app/store";
import toast from "react-hot-toast";
import {
  getTournamentStages,
  updateTournamentStage,
} from "../../app/features/tournament/tournamentStageSlice";
import { createMatches } from "../../app/features/tournament/createMatchesSlice";
import HandLogoLoader from "../Loader/Loader";

// Mock function to fetch player details (replace with actual API call)
// const fetchPlayerDetails = async (ids) => {
//   console.log("ids", ids);
//   // Simulated API response (replace with actual API call)
//   return ids.map((id) => ({
//     id,
//     name: `Player ${id.slice(-4)}`, // Placeholder name
//     team: `Team ${id.slice(-4)}`, // Placeholder team
//   }));
// };

async function fetchTeamDetails(ids) {
  return ids.map((item) => ({
    id: item._id,
    name: item.team ? item.team.teamShortName : item.user.username,
    shortName: item.team
      ? item.team.teamName
      : item.user.firstName + " " + item.user.lastName,
    region: item.team ? item.team.region : item.user.nationality,
  }));
}

const shuffleArray = (array: any) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const Seeds: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { stagesList, loading } = useSelector(
    (state: RootState) => state.tournamentStage
  );

  const tournamentId = window.location.pathname.split("/")[3];
  const stageId = window.location.pathname.split("/")[7];

  // State for UI and data
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [seedingList, setSeedingList] = useState<
    {
      seed: number;
      player: {
        id: string;
        name: string;
        shortName: string;
        region: string;
      } | null;
      locked: boolean;
    }[]
  >([]);
  const [playerDetails, setPlayerDetails] = useState<
    { id: string; name: string; shortName: string; region: string }[]
  >([]);

  // Redux state
  const { error, notInStageParticipants } = useSelector(
    (state: RootState) => state.notInStage
  );
  const { updateTournamentStageloading } = useSelector(
    (state: RootState) => state.tournamentStage
  );
  const { createMatchesLoading } = useSelector(
    (state: RootState) => state.createMatches
  );

  // Fetch participant details and initialize seeding list
  useEffect(() => {
    // Fetch not-in-stage participants
    dispatch(
      fetchNotInStageParticipants({
        tournamentId,
        stageId,
      })
    );

    // Initialize seeding list (example: 8 seeds, adjust based on your needs)
    setSeedingList(
      Array.from({ length: stagesList?.numberOfParticipants }, (_, index) => ({
        seed: index + 1,
        player: stagesList?.seed[index]
          ? {
              id: stagesList?.seed[index]._id,
              name: stagesList?.seed[index].team
                ? stagesList?.seed[index].team?.teamName
                : stagesList?.seed[index].user?.username,
              shortName: stagesList?.seed[index].team
                ? stagesList?.seed[index].team?.teamShortName
                : stagesList?.seed[index].user?.firstName +
                  " " +
                  stagesList?.seed[index].user?.lastName,
              region: stagesList?.seed[index]?.team
                ? stagesList?.seed[index].team?.region
                : stagesList?.seed[index].user?.nationality,
            }
          : null,
        locked: false,
      }))
    );
  }, [dispatch, tournamentId, stageId, stagesList]);

  useEffect(() => {
    if (stageId) {
      dispatch(getTournamentStages({ id: stageId }));
    }
  }, [dispatch, stageId]);

  useEffect(() => {
    if (window.bracketsViewer && stagesList?.config) {
      // Clear the container to avoid stale content
      const container = document.querySelector("#first");
      if (container) {
        container.innerHTML = "";
      }

      window.bracketsViewer.render(
        {
          stages: stagesList.config.stage,
          matches: stagesList.config.match,
          matchGames: stagesList.config.match_game ?? [],
          participants: stagesList.config.participant,
        },
        {
          selector: "#first",
        }
      );
    }

    // Cleanup on unmount
    return () => {
      const container = document.querySelector("#first");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [stagesList?.config]);

  // Fetch player details when notInStageParticipants changes
  useEffect(() => {
    const loadPlayerDetails = async () => {
      const details = await fetchTeamDetails(notInStageParticipants);
      setPlayerDetails(details);
    };
    if (notInStageParticipants) {
      loadPlayerDetails();
    }
  }, [notInStageParticipants]);

  // Filter players based on search term
  const filteredPlayers = playerDetails.filter((player) =>
    player.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Handle adding a single player to a seed
  const handleAddPlayer = (seed: number) => {
    setCurrentSeed(seed);
    setShowAddModal(true);
  };

  // Handle selecting a player for a seed

  const handleSelectPlayer = (player: {
    id: string;
    name: string;
    shortName: string;
    region: string;
  }) => {
    // Double-check if player is already in seedingList (for safety)
    if (seedingList.some((item) => item.player?.id === player.id)) {
      toast.error(`${player.name} is already assigned to a seed.`);
      return;
    }

    setSeedingList((prev) =>
      prev.map((item) =>
        item.seed === currentSeed ? { ...item, player } : item
      )
    );
    setShowAddModal(false);
    setCurrentSeed(null);
  };

  // Handle bulk selection of players
  const handleBulkSelect = (playerId: string) => {
    // Double-check if player is already in seedingList (for safety)
    if (seedingList.some((item) => item.player?.id === playerId)) {
      toast.error(`Already assigned to a seed.`);
      return;
    }

    const maxParticipants = stagesList?.numberOfParticipants || 0;

    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        // If player is already selected, remove them
        return prev.filter((id) => id !== playerId);
      } else {
        // If adding a new player, check if it exceeds the limit
        if (prev.length >= maxParticipants) {
          toast.error(`You can only select up to ${maxParticipants} players.`);
          return prev; // Do not add the new player
        }
        return [...prev, playerId]; // Add the new player
      }
    });
  };

  // Handle bulk addition of players to empty seeds
  const handleBulkAdd = () => {
    const emptySeeds = seedingList.filter((item) => !item.player);

    // Create playersToAdd in the order of selectedPlayers
    const playersToAdd = selectedPlayers
      .map((id) => playerDetails.find((p) => p.id === id))
      .filter((player) => player !== undefined); // Filter out any undefined players

    setSeedingList((prev) =>
      prev.map((item) => {
        if (!item.player && playersToAdd.length > 0) {
          const player = playersToAdd.shift();
          return { ...item, player };
        }
        return item;
      })
    );

    setSelectedPlayers([]);
    setShowBulkModal(false);
  };

  const handleShuffle = () => {
    // Check if shuffling is allowed (e.g., not in the first round)
    if (stagesList?.settings?.isFirstRound) {
      toast.error("Cannot shuffle seeds after the first round has started.");
      return;
    }

    // Get the list of assigned players from seedingList
    const assignedPlayers = seedingList
      .filter((item) => item.player)
      .map((item) => item.player);

    // Check if there are enough players to shuffle
    if (assignedPlayers.length < 2) {
      toast.error("At least two players are required to shuffle seeds.");
      return;
    }

    // Shuffle the assigned players
    const shuffledPlayers = shuffleArray(assignedPlayers);

    // Update seedingList with shuffled players
    setSeedingList((prev) => {
      let playerIndex = 0;
      return prev.map((item) => {
        if (item.player && playerIndex < shuffledPlayers.length) {
          return { ...item, player: shuffledPlayers[playerIndex++] };
        }
        return item;
      });
    });

    toast.success("Seeds have been shuffled successfully.");
  };

  // Handle removing a player from a seed
  const handleRemovePlayer = (seed: number) => {
    setSeedingList((prev) =>
      prev.map((item) =>
        item.seed === seed ? { ...item, player: null } : item
      )
    );
  };

  // Handle saving changes to the server
  const handleSaveChanges = async () => {
    const seedIds = seedingList
      .filter((item) => item.player)
      .map((item) => item.player!.id);

    // const seedIds = seedingList.map((item) => (item.player ? item.player.id : null));

    if (seedIds?.length !== stagesList?.numberOfParticipants) {
      toast.error(
        `You must select at least ${stagesList?.numberOfParticipants} players.`
      );
      return;
    }

    try {
      const resultAction = await dispatch(
        updateTournamentStage({ stageId: stageId, seed: seedIds })
      );

      if (updateTournamentStage.fulfilled.match(resultAction)) {
        dispatch(getTournamentStages({ id: stageId }));
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleCreateMatches = async () => {
    const resultAction = await dispatch(createMatches({ stageId }));

    if (createMatches.fulfilled.match(resultAction)) {
      dispatch(getTournamentStages({ id: stageId }));
    }
  };

  // Navigate back
  const btnBack = () => {
    navigate(-1);
  };

  // Handle drag start
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    seed: number
  ) => {
    e.dataTransfer.setData("text/plain", seed.toString());
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow dropping
  };

  // Handle drop
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetSeed: number
  ) => {
    e.preventDefault();
    const sourceSeed = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (sourceSeed === targetSeed) return; // No change if dropped on itself

    setSeedingList((prev) => {
      const newList = [...prev];
      const sourceIndex = newList.findIndex((item) => item.seed === sourceSeed);
      const targetIndex = newList.findIndex((item) => item.seed === targetSeed);

      // Swap players between the source and target seeds
      const temp = newList[sourceIndex].player;
      newList[sourceIndex].player = newList[targetIndex].player;
      newList[targetIndex].player = temp;

      return newList;
    });
  };

  const handleToggleLock = (seed: number) => {
    setSeedingList((prev) =>
      prev.map((item) =>
        item.seed === seed ? { ...item, locked: !item.locked } : item
      )
    );
    toast.success(
      `Seed ${seed} ${
        seedingList.find((item) => item.seed === seed)?.locked
          ? "unlocked"
          : "locked"
      }.`
    );
  };

  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-start items-center pt-3 pb-[2rem] border-b border-light-border">
        <Link
          to=""
          className="flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
          onClick={btnBack}
        >
          <span>
            <svg
              width="1.26rem"
              height="1.26rem"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.125 3.75L6.875 10L13.125 16.25"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Back
        </Link>
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">{title}</h3>
        </div>
        {/* <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <Link
            to=""
            onClick={() => setShowBulkModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon />
            <span>Add</span>
          </Link>
        </div> */}
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : (
        <div className="flex gap-3 min-h-screen bg-gray-900 text-white p-4">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">Seeding</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={stagesList?.settings?.isFirstRound}
                    onClick={() => setShowBulkModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <PlusIcon />
                    <span>Add</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                    onClick={() => handleShuffle()}
                  >
                    <Shuffle size={16} />
                  </button>
                  {/*<button className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                  <Unlock size={16} />
                </button> */}
                </div>
              </div>
            </div>

            {/* Seeding Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                  <div className="col-span-1">#</div>
                  <div className="col-span-8">NAME</div>
                  <div className="col-span-3 text-right">ACTION</div>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {seedingList.map((item) => (
                  <div
                    key={item.seed}
                    className="border-b border-gray-700 last:border-b-0"
                    draggable={!!item.player} // Only draggable if a player is assigned
                    onDragStart={(e) => handleDragStart(e, item.seed)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.seed)}
                  >
                    <div className="p-3 hover:bg-gray-750 transition-colors cursor-move">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <span className="text-sm font-medium">
                            {item.seed}
                          </span>
                        </div>
                        <div className="col-span-8">
                          {item.player ? (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {item.player?.name?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {item.player.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {item.player.team}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">- - -</span>
                          )}
                        </div>
                        <div className="col-span-3 flex justify-end">
                          {item.player ? (
                            <>
                              <button
                                onClick={() => handleAddPlayer(item.seed)}
                                className="p-2 text-blue-400 hover:bg-blue-700 disabled:text-gray-600 rounded-lg transition-colors"
                                disabled={
                                  filteredPlayers.length === 0 || item.locked
                                }
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleRemovePlayer(item.seed)}
                                className="p-2 text-red-400 hover:bg-red-900/20 disabled:text-gray-600 rounded-lg transition-colors"
                                disabled={
                                  filteredPlayers.length === 0 || item.locked
                                }
                              >
                                <X size={16} />
                              </button>
                              <button
                                className="p-2 text-yellow-400 hover:bg-yellow-900/20 disabled:text-gray-600 rounded-lg transition-colors"
                                onClick={() => handleToggleLock(item.seed)}
                              >
                                {item.locked ? (
                                  <Lock size={16} />
                                ) : (
                                  <Unlock size={16} />
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleAddPlayer(item.seed)}
                              className="p-2 text-gray-400 hover:bg-gray-700 disabled:text-gray-600 rounded-lg transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-center gap-2">
              <div className="mt-6 text-center">
                <button
                  onClick={handleSaveChanges}
                  disabled={
                    stagesList?.settings?.isFirstRound ||
                    updateTournamentStageloading
                  }
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {updateTournamentStageloading ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <div className="mt-6 text-center" onClick={handleCreateMatches}>
                <button
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  disabled={
                    stagesList?.settings?.isFirstRound || createMatchesLoading
                  }
                >
                  {createMatchesLoading ? "Creating..." : "Create Match"}
                </button>
              </div>
            </div>
          </div>
          <div
            id="first"
            className="brackets-viewer bg-gray-800 rounded-lg text-white"
          />
          {/* Single Player Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Add Player to Seed {currentSeed}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="relative mb-4">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search Player Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        onClick={() => handleSelectPlayer(player)}
                        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {player.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {player.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {player.team}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {filteredPlayers.length} available
                  </span>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Add Modal */}
          {showBulkModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Add Players
                  </h2>
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <div className="relative mb-5">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search Player Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                    />
                  </div>
                  <div className="mb-5 p-4 bg-gray-800 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        // checked={
                        //   selectedPlayers.length === playerDetails.length
                        // }
                        checked={
                          selectedPlayers?.length ===
                          Math.min(
                            playerDetails?.length,
                            stagesList?.numberOfParticipants
                          )
                        }
                        // onChange={(e) => {
                        //   if (e.target.checked) {
                        //     setSelectedPlayers(playerDetails.map((p) => p.id));
                        //   } else {
                        //     setSelectedPlayers([]);
                        //   }
                        // }}
                        onChange={(e) => {
                          const limit = stagesList?.numberOfParticipants;
                          if (e.target.checked) {
                            setSelectedPlayers(
                              playerDetails.slice(0, limit).map((p) => p.id)
                            );
                          } else {
                            setSelectedPlayers([]);
                          }
                        }}
                        className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                      />
                      <span className="text-sm font-medium text-white">
                        {`Select Top ${stagesList?.numberOfParticipants} Players`}
                      </span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    {filteredPlayers
                      .filter(
                        (player) =>
                          !seedingList.some(
                            (item) => item.player?.id === player?.id
                          )
                      )
                      .map((player) => (
                        <div
                          key={player.id}
                          className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-all duration-200"
                          onClick={() => handleBulkSelect(player.id)}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={selectedPlayers.includes(player.id)}
                              onChange={() => handleBulkSelect(player.id)}
                              className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                            />
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {player.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {player.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {player.team}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {selectedPlayers.length} selected / {playerDetails.length}{" "}
                    available
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBulkModal(false)}
                      className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkAdd}
                      disabled={selectedPlayers.length === 0}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
