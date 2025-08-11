import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Edit2, Plus, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEligiblePlayers,
  updateEligiblePlayers,
} from "../../app/features/eligiblePlayers/eligiblePlayersSlice";
import { RootState } from "../../app/store";
import { Layout } from "../../components/layout";
import toast from "react-hot-toast";
import HandLogoLoader from "../../components/Loader/Loader";
import { baseURL } from "../../axios";
import { fetchDraftingPhase } from "../../app/features/draftingPhase/draftingPhaseSlice";

interface EligiblePlayer {
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
    profilePicture: string;
    fullName: string;
  };
  rank: number;
}

interface PlayerDetails {
  id: string;
  name: string;
  shortName: string;
  profilePicture: string;
}

const fetchPlayerDetails = (players: EligiblePlayer[]): PlayerDetails[] => {
  return players.map((player) => ({
    id: player.userId._id,
    name: player.userId.username,
    shortName: player.userId.fullName,
    profilePicture: player.userId.profilePicture,
  }));
};

// Utility function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array: any) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const SeedDetail: FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eligiblePlayers, loading, error } = useSelector(
    (state: RootState) => state.eligiblePlayers
  );
  const [isSeedingListInitialized, setIsSeedingListInitialized] =
    useState(false);
  const { data } = useSelector((state: RootState) => state.draftingPhase);

  const { state } = useLocation();
  const did = window.location.pathname.split("/")[5];

  // State for UI and data
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [seedingList, setSeedingList] = useState<
    { seed: number; player: PlayerDetails | null }[]
  >([]);
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails[]>([]);

  // Fetch eligible players
  useEffect(() => {
    dispatch(fetchDraftingPhase({ id: did }));
  }, [dispatch, did]);

  useEffect(() => {
    dispatch(
      fetchEligiblePlayers({
        id: did,
        page: 1,
        perPage: 10,
        searchTerm: "",
      })
    );
  }, [dispatch, did]);

  // Initialize seeding list and player details
  useEffect(() => {
    if (eligiblePlayers.length > 0 && !isSeedingListInitialized) {
      const details = fetchPlayerDetails(eligiblePlayers);
      setPlayerDetails(details);

      setSeedingList(
        Array.from({ length: state?.draftPlayer || 0 }, (_, index) => ({
          seed: index + 1,
          player: data?.eligiblePlayers[index]
            ? {
                id: data?.eligiblePlayers[index]._id,
                name: data?.eligiblePlayers[index].username,
                shortName: data?.eligiblePlayers[index].fullName,
                profilePicture: data?.eligiblePlayers[index].profilePicture,
              }
            : null,
        }))
      );
      setIsSeedingListInitialized(true);
    }
  }, [
    eligiblePlayers,
    data?.eligiblePlayers,
    state?.draftPlayer,
    isSeedingListInitialized,
  ]);

  // Filter players, excluding those already in the seeding list
  const filteredPlayers = playerDetails.filter(
    (player) =>
      player.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
      !seedingList.some((item) => item.player?.id === player.id)
  );

  // Handle adding a single player to a seed
  const handleAddPlayer = (seed: number) => {
    setCurrentSeed(seed);
    setShowAddModal(true);
  };

  // Handle selecting a player for a seed
  const handleSelectPlayer = (player: PlayerDetails) => {
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
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Handle bulk addition of players to empty seeds with randomization
  const handleBulkAdd = () => {
    const emptySeeds = seedingList
      .filter((item) => !item.player)
      .map((item) => item.seed);

    const playersToAdd = selectedPlayers
      .map((id) => playerDetails.find((p) => p.id === id))
      .filter((player) => player !== undefined); // Filter out any undefined players

    if (playersToAdd.length > emptySeeds.length) {
      toast.error(
        `Cannot add ${playersToAdd.length} players. Only ${emptySeeds.length} empty seeds available.`
      );
      return;
    }

    setSeedingList((prev) => {
      const newList = [...prev];
      let playerIndex = 0;

      for (const seed of emptySeeds) {
        if (playerIndex < playersToAdd.length) {
          const player = playersToAdd[playerIndex];
          const index = newList.findIndex((item) => item.seed === seed);
          newList[index].player = player;
          playerIndex++;
        }
      }

      return newList;
    });

    setSelectedPlayers([]);
    setShowBulkModal(false);
    // toast.success(`${playersToAdd.length} players added to seeds randomly.`);
  };

  // Handle removing a player from a seed
  const handleRemovePlayer = (seed: number) => {
    setSeedingList((prev) =>
      prev.map((item) =>
        item.seed === seed ? { ...item, player: null } : item
      )
    );
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    const seedIds = seedingList
      .filter((item) => item.player)
      .map((item) => item.player!.id);

    if (seedIds?.length !== state?.draftPlayer) {
      toast.error(`You must select at least ${state?.draftPlayer} players.`);
      return;
    }

    try {
      const resultAction = await dispatch(
        updateEligiblePlayers({ id: did, playerIds: seedIds })
      );
      if (updateEligiblePlayers.fulfilled.match(resultAction)) {
        dispatch(fetchDraftingPhase({ id: did }));
        // toast.success("Seeding saved successfully!");
      }
    } catch (error) {
      console.log("error", error);
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
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetSeed: number
  ) => {
    e.preventDefault();
    const sourceSeed = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (sourceSeed === targetSeed) return;

    setSeedingList((prev) => {
      const newList = [...prev];
      const sourceIndex = newList.findIndex((item) => item.seed === sourceSeed);
      const targetIndex = newList.findIndex((item) => item.seed === targetSeed);

      if (sourceIndex === -1 || targetIndex === -1) {
        console.error("Invalid source or target seed:", sourceSeed, targetSeed);
        return prev;
      }

      const temp = newList[sourceIndex].player;
      newList[sourceIndex].player = newList[targetIndex].player;
      newList[targetIndex].player = temp;

      return newList;
    });
  };

  return (
    <Layout>
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
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : (
        <div className="flex gap-3 min-h-screen bg-gray-900 text-white p-4">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">Drafting</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                    disabled={filteredPlayers.length === 0}
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Seeding Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">NAME</div>
                  <div className="col-span-3">STATS</div>
                  <div className="col-span-3 text-right">ACTION</div>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {seedingList.map((item) => (
                  <div
                    key={item.seed}
                    className="border-b border-gray-700 last:border-b-0"
                    draggable={!!item.player}
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
                        <div className="col-span-5">
                          {item.player ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={`${baseURL}/api/v1/${item.player.profilePicture}`}
                                alt={item.player.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {item.player.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {item.player.shortName}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">- - -</span>
                          )}
                        </div>
                        <div className="col-span-3">
                          {item.player ? (
                            <div className="text-xs">
                              {eligiblePlayers.find(
                                (p) => p.userId._id === item.player!.id
                              ) && (
                                <>
                                  <div>
                                    W/L:{" "}
                                    {
                                      eligiblePlayers.find(
                                        (p) => p.userId._id === item.player!.id
                                      )!.totalWins
                                    }
                                    /
                                    {
                                      eligiblePlayers.find(
                                        (p) => p.userId._id === item.player!.id
                                      )!.totalLosses
                                    }
                                  </div>
                                  <div>
                                    Win%:{" "}
                                    {eligiblePlayers
                                      .find(
                                        (p) => p.userId._id === item.player!.id
                                      )!
                                      .winPercentage.toFixed(2)}
                                    %
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </div>
                        <div className="col-span-3 flex justify-end">
                          {item.player ? (
                            <>
                              <button
                                onClick={() => handleAddPlayer(item.seed)}
                                className="p-2 text-blue-400 hover:bg-blue-700 disabled:text-gray-600 rounded-lg transition-colors"
                                disabled={filteredPlayers.length === 0}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleRemovePlayer(item.seed)}
                                className="p-2 text-red-400 hover:bg-red-900/20 disabled:text-gray-600 rounded-lg transition-colors"
                                disabled={filteredPlayers.length === 0}
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleAddPlayer(item.seed)}
                              className="p-2 text-gray-400 hover:bg-gray-700  disabled:text-gray-600 rounded-lg transition-colors"
                              disabled={filteredPlayers.length === 0}
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
            <div className="mt-6 text-center">
              <button
                onClick={handleSaveChanges}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                disabled={
                  data?.captain?.length > 0 || data?.otherPlayers?.length > 0
                    ? true
                    : false
                }
              >
                Save Changes
              </button>
            </div>
          </div>

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
                    {filteredPlayers.length === 0 ? (
                      <div className="text-center text-gray-400">
                        No available players
                      </div>
                    ) : (
                      filteredPlayers.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => handleSelectPlayer(player)}
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`${baseURL}/api/v1/${player.profilePicture}`}
                              alt={player.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-sm">
                                {player.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {player.shortName}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
                        //   selectedPlayers.length === filteredPlayers.length &&
                        //   filteredPlayers.length > 0
                        // }
                        checked={
                          selectedPlayers.length ===
                            Math.min(
                              filteredPlayers.length,
                              state?.draftPlayer
                            ) && filteredPlayers.length > 0
                        }
                        // onChange={(e) => {
                        //   if (e.target.checked) {
                        //     setSelectedPlayers(
                        //       filteredPlayers.map((p) => p.id)
                        //     );
                        //   } else {
                        //     setSelectedPlayers([]);
                        //   }
                        // }}

                        onChange={(e) => {
                          if (e.target.checked) {
                            const draftLimit = state?.draftPlayer; // Default to 25 if undefined
                            setSelectedPlayers(
                              filteredPlayers
                                .slice(0, draftLimit)
                                .map((p) => p.id)
                            );
                          } else {
                            setSelectedPlayers([]);
                          }
                        }}
                        className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                      />
                      <span className="text-sm font-medium text-white">
                        {`Select Top ${state?.draftPlayer} Players`}
                      </span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    {filteredPlayers.length === 0 ? (
                      <div className="text-center text-gray-400">
                        No available players
                      </div>
                    ) : (
                      filteredPlayers.map((player) => (
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
                            <img
                              src={`${baseURL}/api/v1/${player.profilePicture}`}
                              alt={player.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-white">
                                {player.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {player.shortName}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="p-5 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {selectedPlayers.length} selected / {filteredPlayers.length}{" "}
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
    </Layout>
  );
};
