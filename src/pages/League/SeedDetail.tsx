import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Edit2,
  Plus,
  Search,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
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
import {
  draftActive,
  fetchDraftingPhase,
  upadateTeam,
  updateDraftpublish,
} from "../../app/features/draftingPhase/draftingPhaseSlice";
import moment from "moment-timezone";
import { socket } from "../../app/socket/socket";
import { SOCKET } from "../../utils/constant";
import DraftPlayerCard from "./DraftPlayerCard";
import StartDraftPlayerCard from "./StartDraftPlayerCard";
// import StartDraftPlayerCard from "./StartDraftPlayerCard";

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
  const currentDate = new Date();
  const [isSeedingListInitialized, setIsSeedingListInitialized] =
    useState(false);
  const { data } = useSelector((state: RootState) => state.draftingPhase);

  const { state } = useLocation();
  const did = window.location.pathname.split("/")[5];

  // State for UI and data
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [draftData, setDraftData] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDraftData, setstartDraftData] = useState();
  const [isDraftActive, setIsDraftActive] = useState(data?.status === "active");
  const [status, setStatus] = useState(null);

  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [seedingList, setSeedingList] = useState<
    { seed: number; player: PlayerDetails | null }[]
  >([]);
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails[]>([]);
  const [slotAssignments, setSlotAssignments] = useState<{
    [playerId: string]: number | null;
  }>({});

  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    let isInitialDataSet = false; // local flag

    socket.emit(SOCKET.GETDRAFTDATA, { draftId: did });

    const handleDraftUpdate = (data: any) => {
      if (data?.data?.currentInterval === -1) {
        if (!isInitialDataSet && draftData.length === 0) {
          setDraftData(data?.data?.teams || []);
          isInitialDataSet = true;
        }
      } else {
        setstartDraftData(data?.data);
        setStatus(data?.status);
        setDraftData([]);
        isInitialDataSet = false;
      }
    };

    socket.on(SOCKET.ONDRAFTDATAUPDATE, handleDraftUpdate);

    return () => {
      socket.off(SOCKET.ONDRAFTDATAUPDATE, handleDraftUpdate);
    };
  }, [did, draftData?.length]);

  // Fetch eligible players
  useEffect(() => {
    dispatch(fetchDraftingPhase({ id: did }));
  }, [dispatch, did]);

  useEffect(() => {
    setSeedingList([]);
    setPlayerDetails([]);
    setIsSeedingListInitialized(false);
    setSelectedPlayers([]);
    setSlotAssignments({});
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

  // Get available slots
  const getAvailableSlots = () => {
    return seedingList
      .filter((item) => !item.player)
      .map((item) => item.seed)
      .sort((a, b) => a - b);
  };

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
    toast.success(`Player ${player.name} added to slot ${currentSeed}.`);
    setShowAddModal(false);
    setCurrentSeed(null);
  };

  // Handle bulk selection of players
  const handleBulkSelect = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      // Deselect player
      setSelectedPlayers((prev) => prev.filter((id) => id !== playerId));
      setSlotAssignments((prev) => {
        const newAssignments = { ...prev };
        delete newAssignments[playerId];
        // Reassign slots for remaining selected players
        const emptySeeds = getAvailableSlots();
        const updatedAssignments: { [playerId: string]: number | null } = {};
        selectedPlayers
          .filter((id) => id !== playerId)
          .forEach((id, index) => {
            if (index < emptySeeds.length) {
              updatedAssignments[id] = emptySeeds[index];
            }
          });
        return updatedAssignments;
      });
    } else {
      const alreadyAdded = seedingList.some(
        (item) => item.player?.id === playerId
      );
      if (alreadyAdded) {
        toast.error("Player already added.");
        return;
      }
      const remainingSlots =
        (state?.draftPlayer || 0) -
        seedingList.filter((item) => item.player).length;
      if (selectedPlayers.length >= remainingSlots) {
        toast.error("No remaining slots available.");
        return;
      }
      setSelectedPlayers((prev) => [...prev, playerId]);
      setSlotAssignments((prev) => {
        const emptySeeds = getAvailableSlots();
        const newIndex = selectedPlayers.length; // Slot based on selection order
        return {
          ...prev,
          [playerId]: emptySeeds[newIndex] || null,
        };
      });
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const availableSlots = getAvailableSlots();
    if (selectedPlayers.length === filteredPlayers.length) {
      // Deselect all
      setSelectedPlayers([]);
      setSlotAssignments({});
    } else {
      // Select up to available slots and assign slot numbers
      const newSelectedPlayers = filteredPlayers
        .slice(0, availableSlots.length)
        .map((p) => p.id);
      setSelectedPlayers(newSelectedPlayers);

      // Assign slot numbers
      const newSlotAssignments: { [playerId: string]: number | null } = {};
      newSelectedPlayers.forEach((playerId, index) => {
        if (index < availableSlots.length) {
          newSlotAssignments[playerId] = availableSlots[index];
        }
      });
      setSlotAssignments(newSlotAssignments);
    }
  };

  // Handle bulk addition of players to empty seeds
  const handleBulkAdd = () => {
    if (selectedPlayers.length === 0) return;

    const playersToAdd = selectedPlayers
      .map((id) => playerDetails.find((p) => p.id === id))
      .filter((player): player is PlayerDetails => !!player);

    const emptySeeds = getAvailableSlots();
    if (playersToAdd.length > emptySeeds.length) {
      toast.error(
        `Cannot add ${playersToAdd.length} players. Only ${emptySeeds.length} empty seeds available.`
      );
      return;
    }

    setSeedingList((prev) => {
      const newList = [...prev];
      playersToAdd.forEach((player) => {
        const assignedSeed = slotAssignments[player.id];
        if (assignedSeed) {
          const seedIndex = newList.findIndex(
            (s) => s.seed === assignedSeed && !s.player
          );
          if (seedIndex !== -1) {
            newList[seedIndex].player = player;
          }
        }
      });
      return newList;
    });

    setSelectedPlayers([]);
    setSlotAssignments({});
    setShowBulkModal(false);
    toast.success(`${playersToAdd.length} players added to slots.`);
  };

  // Handle removing a player from a seed
  const handleRemovePlayer = (seed: number) => {
    const player = seedingList.find((item) => item.seed === seed)?.player;
    if (player) {
      setPlayerDetails((prev) => {
        const alreadyExists = prev.some((p) => p.id === player.id);
        if (!alreadyExists) {
          return [...prev, player];
        }
        return prev;
      });
    }

    setSeedingList((prev) =>
      prev.map((item) =>
        item.seed === seed ? { ...item, player: null } : item
      )
    );

    const remainingSlots =
      (state?.draftPlayer || 0) -
      seedingList.filter((item) => item.player).length +
      1; // +1 to account for the player just removed
    toast.success(
      `Player ${
        player?.name || ""
      } removed from slot ${seed}. ${remainingSlots} more players can be selected.`
    );

    // Update slot assignments for selected players
    setSlotAssignments((prev) => {
      const newAssignments = { ...prev };
      // Remove any assignments that are no longer valid
      Object.keys(newAssignments).forEach((playerId) => {
        if (newAssignments[playerId] === seed) {
          delete newAssignments[playerId];
        }
      });
      // Reassign slots based on current selection
      const emptySeeds = getAvailableSlots();
      selectedPlayers.forEach((playerId, index) => {
        if (index < emptySeeds.length) {
          newAssignments[playerId] = emptySeeds[index];
        }
      });
      return newAssignments;
    });
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    const seedIds = seedingList
      .filter((item) => item.player)
      .map((item) => item.player!.id);

    // if (seedIds?.length !== state?.draftPlayer) {
    //   toast.error(`You must select at least ${state?.draftPlayer} players.`);
    //   return;
    // }

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

  const handleChanges = async () => {
    try {
      const resultAction = await dispatch(updateDraftpublish({ id: did }));
      if (updateDraftpublish.fulfilled.match(resultAction)) {
        dispatch(fetchDraftingPhase({ id: did }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Navigate back
  const btnBack = () => {
    socket.disconnect();
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

  const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };
  const transformedDraftPlayers = draftData?.map((group, index) => ({
    groupNumber: index + 1,
    _id: group._id,
    captain: {
      totalWins: group.captains.totalWins,
      totalLosses: group.captains.totalLosses,
      totalMatches: group.captains.totalMatches,
      totalScore: group.captains.totalScore,
      totalLeaguesScore: group.captains.totalLeaguesScore,
      winPercentage: group.captains.winPercentage,
      wilsonScore: group.captains.wilsonScore,
      userId: {
        _id: group.captains.userId._id,
        username: group.captains.userId.username,
        profilePicture: group.captains.userId.profilePicture,
        fullName: group.captains.userId.fullName,
      },
      rank: group.captains.rank,
    },
    players: group.players.map((player: any) => ({
      index: player.index,
      username: player.username,
      fullName: player.fullName,
      id: player.id,
      rep: player.rep,
      profilePic: player.profilePic,
      rank: player.rank,
      score: player.score,
    })),
  }));

  const handleReplacePlayer = (
    groupNumber: number,
    slotIndex: number,
    newPlayer: any | null,
    sourceGroupNumber?: number,
    sourceSlotIndex?: number
  ) => {
    setDraftData((prevDraftPlayers) => {
      const newDraftPlayers = JSON.parse(JSON.stringify(prevDraftPlayers)); // Deep copy
      const targetGroupIndex = groupNumber - 1;

      if (newPlayer === null) {
        // Handle removal (not used in current UI, but included for completeness)
        newDraftPlayers[targetGroupIndex].players.splice(slotIndex, 1);
        newDraftPlayers[targetGroupIndex].updatedAt = new Date().toISOString();
        return newDraftPlayers;
      }

      if (sourceGroupNumber === undefined || sourceSlotIndex === undefined) {
        // Dropped from another source (not implemented in UI)
        newDraftPlayers[targetGroupIndex].players[slotIndex] = {
          index: slotIndex + 1,
          username: newPlayer.username,
          fullName: newPlayer.fullName,
          id: newPlayer.id,
          rep: newPlayer.rep,
          profilePic: newPlayer.profilePic,
          rank: newPlayer.rank,
          score: newPlayer.score,
        };
        newDraftPlayers[targetGroupIndex].updatedAt = new Date().toISOString();
        return newDraftPlayers;
      }

      const sourceGroupIndex = sourceGroupNumber - 1;

      if (sourceGroupIndex === targetGroupIndex) {
        // In-group swap
        const temp = newDraftPlayers[targetGroupIndex].players[slotIndex];
        newDraftPlayers[targetGroupIndex].players[slotIndex] =
          newDraftPlayers[targetGroupIndex].players[sourceSlotIndex];
        newDraftPlayers[targetGroupIndex].players[sourceSlotIndex] = temp;
      } else {
        // Cross-group swap
        const targetPlayer =
          newDraftPlayers[targetGroupIndex].players[slotIndex];
        const sourcePlayer =
          newDraftPlayers[sourceGroupIndex].players[sourceSlotIndex];

        newDraftPlayers[targetGroupIndex].players[slotIndex] = {
          index: slotIndex + 1,
          username: newPlayer.username,
          fullName: newPlayer.fullName,
          id: newPlayer.id,
          rep: newPlayer.rep,
          profilePic: newPlayer.profilePic,
          rank: newPlayer.rank,
          score: newPlayer.score,
        };

        newDraftPlayers[sourceGroupIndex].players[sourceSlotIndex] = {
          index: sourceSlotIndex + 1,
          username: targetPlayer.username,
          fullName: targetPlayer.fullName,
          id: targetPlayer.id,
          rep: targetPlayer.rep,
          profilePic: targetPlayer.profilePic,
          rank: targetPlayer.rank,
          score: targetPlayer.score,
        };
      }

      newDraftPlayers[targetGroupIndex].updatedAt = new Date().toISOString();
      if (sourceGroupIndex !== targetGroupIndex) {
        newDraftPlayers[sourceGroupIndex].updatedAt = new Date().toISOString();
      }

      dispatch(upadateTeam({ id: did, teams: newDraftPlayers }))
        .unwrap()
        .then(() => {
          dispatch(fetchDraftingPhase({ id: did }));
        })
        .catch(() => {
          setDraftData(prevDraftPlayers); // Revert state on error
        });

      return newDraftPlayers;
    });
  };

  const handleToggleActive = async () => {
    try {
      const resultAction = await dispatch(draftActive({ id: did }));
      if (draftActive.fulfilled.match(resultAction)) {
        dispatch(fetchDraftingPhase({ id: did }));
        toast.success(
          `Draft ${
            resultAction?.payload?.data.isDeactivate ? "Active" : "Deactive"
          } successfully!`
        );
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update draft status.");
    }
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
        <div className="flex gap-3 max-h-screen bg-gray-900 text-white p-4">
          {new Date(data?.startTime) > currentDate && (
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
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors text-sm"
                      disabled={data?.isPublished}
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
                              <span className="text-gray-500 text-sm">
                                - - -
                              </span>
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
                                          (p) =>
                                            p.userId._id === item.player!.id
                                        )!.totalWins
                                      }
                                      /
                                      {
                                        eligiblePlayers.find(
                                          (p) =>
                                            p.userId._id === item.player!.id
                                        )!.totalLosses
                                      }
                                    </div>
                                    <div>
                                      Win%:{" "}
                                      {eligiblePlayers
                                        .find(
                                          (p) =>
                                            p.userId._id === item.player!.id
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
                                  disabled={data?.isPublished}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleRemovePlayer(item.seed)}
                                  className="p-2 text-red-400 hover:bg-red-900/20 disabled:text-gray-600 rounded-lg transition-colors"
                                  disabled={data?.isPublished}
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleAddPlayer(item.seed)}
                                className="p-2 text-gray-400 hover:bg-gray-700 disabled:text-gray-600 rounded-lg transition-colors"
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

              {!data?.isPublished && (
                <div className="flex items-center justify-evenly">
                  {/* Save Button */}
                  <div className="mt-3 text-center">
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                      disabled={
                        new Date(data?.startTime) > currentDate ? false : true
                      }
                    >
                      Save Changes
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      onClick={handleChanges}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors btn-sm"
                      disabled={data?.isPublished}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 max-w-4xl w-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-400" size={20} />
              Draft Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-green-400" size={18} />
                  <span className="text-gray-400 text-sm font-medium">
                    Status
                  </span>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                    data?.status
                  )}`}
                >
                  {data?.status}
                </span>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-purple-400" size={18} />
                  <span className="text-gray-400 text-sm font-medium">
                    Players
                  </span>
                </div>
                <span className="text-xl font-bold text-white">
                  {data?.totalPlayers}
                </span>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="text-orange-400" size={18} />
                  <span className="text-gray-400 text-sm font-medium">
                    Teams
                  </span>
                </div>
                <span className="text-xl font-bold text-white">
                  {data?.totalTeams}
                </span>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-indigo-500/30 transition-colors col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-indigo-400" size={18} />
                  <span className="text-gray-400 text-sm font-medium">
                    Start Time
                  </span>
                </div>
                <span className="text-lg font-bold text-white">
                  {moment(data?.startTime)
                    .tz("Asia/Riyadh")
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </span>
              </div>
            </div>

            {/* <div className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Players per Team</span>
                <span className="text-white font-medium">
                  ~{Math.round(data?.totalPlayers / data?.totalTeams)}
                </span>
              </div>
            </div> */}

            <label className="relative inline-flex items-center cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={!data?.isDeactivate}
                onChange={handleToggleActive}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">
                {!data?.isDeactivate ? "Active" : "Inactive"}
              </span>
            </label>
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
                        checked={
                          selectedPlayers.length ===
                            Math.min(
                              filteredPlayers.length,
                              (state?.draftPlayer || 0) -
                                seedingList.filter((item) => item.player).length
                            ) && filteredPlayers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                      />
                      <span className="text-sm font-medium text-white">
                        {`Select Top ${
                          (state?.draftPlayer || 0) -
                          seedingList.filter((item) => item.player).length
                        } Players`}
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
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-white">
                                  {player.name}
                                </div>
                                {slotAssignments[player.id] && (
                                  <span className="text-sm text-gray-400">
                                    Slot {slotAssignments[player.id]}
                                  </span>
                                )}
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
      {transformedDraftPlayers?.length > 0 ? (
        <>
          <div className="min-h-screen bg-gray-800 text-white p-4 mb-4 shadow-lg overflow-x-auto">
            <h2 className="text-lg font-bold text-center text-white my-3">
              Draft Finished!
            </h2>
            <div className="flex gap-3">
              {transformedDraftPlayers.map((group) => (
                <DraftPlayerCard
                  key={group._id}
                  groupNumber={group.groupNumber}
                  captain={group.captain}
                  players={group.players}
                  onReplacePlayer={handleReplacePlayer}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {startDraftData && (
            <div className="flex gap-3 min-h-screen bg-gray-800 text-white p-4 mb-4 shadow-lg overflow-x-auto">
              <StartDraftPlayerCard
                startDraftData={startDraftData}
                status={status}
                did={did}
              />
            </div>
          )}
        </>
      )}
    </Layout>
  );
};
