import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/images/trash_can.svg";
import editIcon from "../../assets/images/Edit.svg";
import { debounce } from "lodash";
import rightIcon from "../../assets/images/rightarrow.svg";
import { PlusIcon, SearchIcon } from "../ui"; // Adjust path to your HandLogoLoader component
import {
  getTournamentStages,
  deleteTournamentStage,
  setPage,
  resetStages,
  getTournamentStagesById,
} from "../../app/features/tournament/tournamentStageSlice"; // Adjust path to your slice
import { RootState } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";
import { Pagination } from "../ui/Pagination";
import {
  addScore,
  fetchTournamentMatches,
  resetMatches,
  updateStageRound,
  updateTournamentMatch,
} from "../../app/features/tournament/tournamentMatchesSlice";
import { baseURL } from "../../axios";
import QuickScoreModal from "./QuickScoreModal";
import { Match } from "../../app/types";
import ChangeTimeModal from "./ChangeTimeModal";
import RoundTimeChangeModal from "./RoundTimeChangeModal";
import { checkboxOptions, formatDate } from "../../utils/constant";
import { CirclePlus, CirclePlusIcon, Clock, Settings } from "lucide-react";
import { fetchStageRound } from "../../app/features/tournament/stageRoundSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import topArrow from "../../assets/images/nf_top-arrow.svg";
import downArrow from "../../assets/images/nf_bottom-arrow.svg";

interface Stage {
  _id: string;
  tournament: {
    _id: string;
    title: string;
    titleAr: string;
  };
  stageType: string;
  stageName: string;
  stageNameAr: string;
  numberOfParticipants: number;
  seed: any[];
  createdAt: string;
  updatedAt: string;
}

export const StageLists: React.FC<{ title: string }> = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const partnerId = window.location.pathname.split("/")[1];
  const tournamentId = window.location.pathname.split("/")[3];

  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const {
    stagesList,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    // stagesDetails,
  } = useSelector((state: RootState) => state.tournamentStage);
  const { matches, matchesLoading } = useSelector(
    (state: RootState) => state.tournamentMatches
  );

  const {
    stageRound,
    loading: stageRoundloading,
    error: stageRounderror,
  } = useSelector((state: RootState) => state.stageRound);

  const [showQuickScoreModal, setShowQuickScoreModal] = useState(false);
  const [showChangeTimeModal, setShowChangeTimeModal] = useState(false);
  const [showRoundTimeChangeModal, setShowRoundTimeChangeModal] =
    useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedRound, setSelectedRound] = useState<string>("");

  const [selectedStage, setSelectedStage] = useState();
  const [stageType, setStageType] = useState();

  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Default to in_progress
  const [search, setSearch] = useState<string>(""); // Default to in_progress

  useEffect(() => {
    if (tournamentId) {
      dispatch(resetStages());
      dispatch(resetMatches());
      dispatch(getTournamentStages({ tournamentId: tournamentId }));
    }
  }, [dispatch, tournamentId]);

  const btnBack = () => {
    navigate(-1);
  };

  const handleDeleteDevice = async () => {
    const resultAction = await dispatch(deleteTournamentStage(deleteId));
    if (deleteTournamentStage.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(getTournamentStages({ tournamentId: tournamentId }));
    }
  };

  useEffect(() => {
    if (stagesList?.length > 0) {
      setSelectedStage(stagesList[0]._id);
    }
  }, [stagesList, loading]);

  const debouncedDispatch = useCallback(
    debounce((payload) => dispatch(fetchTournamentMatches(payload)), 500),
    [dispatch]
  );

  useEffect(() => {
    if (selectedStage) {
      debouncedDispatch({
        stageId: selectedStage,
        roundId: selectedRound,
        status: selectedStatus,
        search: search,
      });
    }
  }, [selectedStage, selectedRound, selectedStatus, search, debouncedDispatch]);

  useEffect(() => {
    if (selectedStage) {
      dispatch(fetchStageRound(selectedStage));
    }
  }, [dispatch, selectedStage]);

  // useEffect(() => {
  //   if (selectedStage) {
  //     dispatch(getTournamentStagesById({ id: selectedStage }));
  //   }
  // }, [dispatch, selectedStage]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };
  const totalPages = Math.ceil(totalCount / perPage);

  const handleScoreSubmit = async (values: {
    team1Score: number;
    team2Score: number;
    matchId: string;
  }) => {
    // Placeholder for score submission logic

    const resultAction = await dispatch(
      addScore({
        matchId: values.matchId,
        opponent1Score: values.team1Score,
        opponent2Score: values.team2Score,
        description: "",
        attachment: "",
        submittedBy: "admin",
      })
    );
    if (addScore.fulfilled.match(resultAction)) {
      dispatch(fetchTournamentMatches({ stageId: selectedStage }));
    }
  };

  const handleTimeSubmit = async (values: {
    startDate: string;
    endDate: string;
    matchId: string;
  }) => {
    const resultAction = await dispatch(
      updateTournamentMatch({
        id: values.matchId,
        startTime: values.startDate,
        endTime: values.endDate,
      })
    );

    if (updateTournamentMatch.fulfilled.match(resultAction)) {
      dispatch(fetchTournamentMatches({ stageId: selectedStage }));
    }
  };

  const handleRoundTimeSubmit = async (values: {
    roundId: string;
    startDate: string;
    endDate: string;
  }) => {
    const resultAction = await dispatch(
      updateStageRound({
        roundId: values.roundId,
        startTime: values.startDate,
        endTime: values.endDate,
      })
    );

    if (updateStageRound.fulfilled.match(resultAction)) {
      dispatch(fetchTournamentMatches({ stageId: selectedStage }));
    }
  };

  const handleCheckboxChange = (name: string) => {
    // If the clicked checkbox is already selected, uncheck it
    setSelectedStatus(selectedStatus === name ? null : name);
  };

  return (
    <>
      <div className="nf_legue_head--con bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Link
            to={""}
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
            <h3 className="font-bold text-[1.25rem] text-white">
              {title}{" "}
              <span className="text-custom-gray">({stagesList.length})</span>
            </h3>
          </div>
          <div className="legue__head_right-con">
            <Link
              to={`/${partnerId}/tournament/${tournamentId}/stage/add`}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66797 10C1.66797 5.39763 5.39893 1.66667 10.0013 1.66667C14.6037 1.66667 18.3346 5.39763 18.3346 10C18.3346 14.6024 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6024 1.66797 10ZM10.8346 6.66667C10.8346 6.20643 10.4615 5.83333 10.0013 5.83333C9.54107 5.83333 9.16797 6.20643 9.16797 6.66667V9.16667H6.66797C6.20773 9.16667 5.83464 9.53976 5.83464 10C5.83464 10.4602 6.20773 10.8333 6.66797 10.8333H9.16797V13.3333C9.16797 13.7936 9.54107 14.1667 10.0013 14.1667C10.4615 14.1667 10.8346 13.7936 10.8346 13.3333V10.8333H13.3346C13.7949 10.8333 14.168 10.4602 14.168 10C14.168 9.53976 13.7949 9.16667 13.3346 9.16667H10.8346V6.66667Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span className="text-sm">Add New Stage</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center items-center">
            <HandLogoLoader />
          </div>
        )}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {!loading && !error && stagesList.length === 0 && (
          <div className="text-white text-center">No stages found.</div>
        )}
        <div className="block">
          {!loading && stagesList.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {stagesList.map((stage: Stage) => (
                  <div
                    key={stage._id}
                    className={`nf_tournaments-card  bg-[rgba(0,126,255,0.16)] text-white rounded-md w-full  cursor-pointer ${
                      selectedStage === stage?._id ? "list-focus" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setSelectedStage(stage?._id);
                      setStageType(stage?.stageType);
                    }}
                  >
                    <div className="nf_ts-topbar cust p-2">
                      <div className="flex items-center justify-between">
                        <div className="nf_tournaments-title flex items-center">
                          <img
                            className="px-2 py-2 bg-slate-500 rounded-sm p-2 mr-2"
                            height={32}
                            width={32}
                            src="https://staging.saudieleagues.com/public/admin/icons/Standings.svg"
                            alt="Stage Icon"
                          />
                          <h3>Stage: {stage.stageName}</h3>
                        </div>
                        <div className="nf_icon-group flex justify-end items-center gap-2">
                          <Link
                            to={`/${partnerId}/tournament/${tournamentId}/stage/edit/${stage?._id}`}
                            state={{ stage }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              background:
                                "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                            }}
                            className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                          >
                            <img
                              src={editIcon}
                              alt="Delete"
                              style={{ width: "1.06rem" }}
                            />
                          </Link>
                          <button
                            onClick={(e) => {
                              // handleDelete(stage._id);
                              setDeleteId(stage._id);
                              setIsDeleteModalOpen(true);
                              e.stopPropagation();
                            }}
                            style={{
                              background:
                                "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                            }}
                            className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                          >
                            <img
                              src={deleteIcon}
                              alt="Delete"
                              style={{ width: "1.06rem" }}
                            />
                          </button>
                          <Link
                            to={`/${partnerId}/tournament/${tournamentId}/stage/list/seed/${stage._id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            state={{
                              seed: stage?.seed,
                              type: location?.state?.type,
                              stage: stage,
                            }}
                            style={{
                              background:
                                "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                            }}
                            className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                          >
                            <img
                              src={rightIcon}
                              alt="View"
                              style={{ width: "1.06rem" }}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="nf_ts-center p-2">
                      <div className="nf_tournament-list">
                        <div className="nf_list-row cust grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div className="nf_list-col">
                            <div className="nf_list-block p-2 bg-[#242B3C] h-full">
                              <span>Participants:</span>
                              <h4>{stage.numberOfParticipants}</h4>
                            </div>
                          </div>
                          <div className="nf_list-col p-2 bg-[#242B3C] h-full">
                            <div className="nf_list-block">
                              <span>Format:</span>
                              <h4>{stage.stageType}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div
                  className="nf_stage-quick_scores nf_back-section nf_topbar nf_tournaments-topbar"
                  style={{}}
                >
                  <div className="nf_topbar-wrap flex items-center">
                    <div
                      className="nf_top-filter nf_bg flex items-center"
                      style={{ maxWidth: "max-content" }}
                    >
                      <p className="color_gray">Filter by:</p>
                      <div className="nf_cust-select nf_simple-select focus-input">
                        <select
                          className="form-control color-white cust-arrow"
                          id="round_dropdown"
                          value={selectedRound}
                          onChange={(e) => setSelectedRound(e.target.value)}
                        >
                          <option value="">All rounds</option>
                          {stageRound?.map((round) => (
                            <option key={round._id} value={round._id}>
                              {round.roundName}{" "}
                              {round.config
                                ? round.config.group_id == 0
                                  ? "(WB)"
                                  : round.config.group_id == 1
                                  ? "(LB)"
                                  : "(FB)"
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div id="checkbox_1">
                      {checkboxOptions.map((option) => (
                        <div key={option.id} className="nf_normal-checkbox">
                          <div className="checkbox">
                            <label className="checkbox-wrapper focus-input">
                              <input
                                type="checkbox"
                                name={option.name}
                                checked={selectedStatus === option.name}
                                id={option.id}
                                className="checkbox-input form-control"
                                onChange={() =>
                                  handleCheckboxChange(option.name)
                                }
                              />
                              <span className="checkbox-tile">
                                <h4>{option.label}</h4>
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="nf_serchbar mt-0">
                      <div className="input-group md-form form-sm form-1 pl-0">
                        <input
                          className="form-control my-0 py-1"
                          type="text"
                          id="search_user"
                          placeholder="Search team name"
                          aria-label="Search"
                          aria-controls="user_table"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="nf_topbar-btn mt-0">
                      <a
                        href="https://staging.saudieleagues.com/admin/championship/role/8321/active"
                        className="btn btn-nf-blue nf_btn-ic startNextRole"
                        style={{ display: "none" }}
                      >
                        Start Next Round
                      </a>
                      <button
                        name="submitButton"
                        id="submitButton"
                        className="btn btn-nf-blue nf_btn-ic"
                        style={{ display: "none" }}
                      >
                        Update Scores
                      </button>
                      <input
                        type="hidden"
                        name="stage_id"
                        id="stage_id"
                        defaultValue={1583}
                      />
                      <input
                        type="hidden"
                        name="stage_type"
                        id="stage_type"
                        defaultValue={2}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-nf-gray round_timechange_data mt-2"
                    data-toggle="modal"
                    data-target="#changetime_round"
                    onClick={() => setShowRoundTimeChangeModal(true)}
                  >
                    Round Time Change
                  </button>

                  <a
                    href="#"
                    className="btn btn-nf-blue nf_btn-ic complete_round"
                    style={{ display: "none" }}
                  >
                    Complete Round
                  </a>
                </div>

                {stageType === "DoubleElimination" && (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 items-center mt-5 gap-3 mb-3">
                    {matchesLoading ? (
                      <HandLogoLoader />
                    ) : (
                      <>
                        {stagesList?.length > 0 &&
                          matches?.map((val) => {
                            const activeScores = val?.matchScores?.filter(
                              (match: any) => match?.isActive
                            );

                            return (
                              <div className="nf_cs-content">
                                <div className="grid grid-cols-3">
                                  <div className="col-4">
                                    <div className="nf_stage-content">
                                      <div className="nf_stage-img">
                                        <img
                                          className=""
                                          height=""
                                          width=""
                                          src={`${baseURL}/api/v1/${
                                            val?.opponent1?.team
                                              ? val?.opponent1?.team?.logoImage
                                              : val?.opponent1?.user
                                                  ?.profilePicture
                                          }`}
                                        />
                                      </div>
                                      <h3>
                                        {val?.opponent1?.team
                                          ? val?.opponent1?.team?.teamName
                                          : val?.opponent1?.user?.username}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="nf_stage-content text-center">
                                      <div className="flex content-center justify-center">
                                        <h5
                                          className={
                                            val?.winner === "opponent1"
                                              ? "!bg-green-500/20 !text-green-300 border !border-green-500/30"
                                              : val?.winner === "opponent2"
                                              ? "!bg-red-500/20 !text-red-300 border !border-red-500/30"
                                              : "!bg-blue-500/20 !text-blue-300 border !border-blue-500/30"
                                          }
                                        >
                                          {activeScores[0]?.opponent1Score
                                            ? activeScores[0]?.opponent1Score
                                            : 0}
                                        </h5>
                                        <h5
                                          className={
                                            val?.winner === "opponent2"
                                              ? "!bg-green-500/20 !text-green-300 border !border-green-500/30"
                                              : val?.winner === "opponent1"
                                              ? "!bg-red-500/20 !text-red-300 border !border-red-500/30"
                                              : "!bg-blue-500/20 !text-blue-300 border !border-blue-500/30"
                                          }
                                        >
                                          {activeScores[0]?.opponent2Score
                                            ? activeScores[0]?.opponent2Score
                                            : 0}
                                        </h5>
                                      </div>
                                      <p
                                        className={`px-3 py-1 whitespace-nowrap rounded-full text-sm font-medium ${
                                          val?.status === "completed"
                                            ? "bg-green-500/20 !text-green-400 border border-green-500/30"
                                            : val?.status === "cancelled"
                                            ? "bg-red-500/20 !text-red-400 border border-red-500/30"
                                            : val?.status === "in_progress"
                                            ? "bg-yellow-500/20 !text-yellow-400 border border-yellow-500/30"
                                            : val?.status === "pending"
                                            ? "bg-yellow-500/20 !text-yellow-400 border border-yellow-500/30"
                                            : "bg-purple-500/20 !text-purple-400 border border-purple-500/30"
                                        }`}
                                      >
                                        {val?.status
                                          ?.replace("_", " ")
                                          .replace(/\b\w/g, (c: any) =>
                                            c.toUpperCase()
                                          )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    <div className="nf_stage-content">
                                      <div className="nf_stage-img">
                                        <img
                                          className=""
                                          height=""
                                          width=""
                                          src={`${baseURL}/api/v1/${
                                            val?.opponent2?.team
                                              ? val?.opponent2?.team?.logoImage
                                              : val?.opponent2?.user
                                                  ?.profilePicture
                                          }`}
                                        />
                                      </div>
                                      <h3>
                                        {val?.opponent2?.team
                                          ? val?.opponent2?.team?.teamName
                                          : val?.opponent2?.user?.username}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                                <div className="nf_stage-bottombar items-center justify-center flex my-2 gap-1">
                                  <p>{val?.stageRoundId?.roundName}</p>
                                  <p>
                                    {formatDate(val?.startTime)} -{" "}
                                    {formatDate(val?.endTime)}
                                  </p>
                                </div>
                                <div className="nf_match-list my-3">
                                  <div
                                    className="nf-cs-btn flex items-center justify-center"
                                    style={{}}
                                  >
                                    <div className="nf_cs-buttons flex items-center content-center">
                                      <div className="nf_cs-btn-group ">
                                        <button
                                          className="btn btn-nf-gray timechange_data"
                                          data-toggle="modal"
                                          data-target="#changetime"
                                          data-id={34042}
                                          onClick={() => {
                                            setSelectedMatch(val);
                                            setShowChangeTimeModal(true);
                                          }}
                                        >
                                          <Clock className="w-4 h-4 text-gray-400 group-hover/menu:text-blue-400 transition-colors" />
                                        </button>
                                        <strong className="text-center">
                                          {" "}
                                          Change Time
                                        </strong>
                                      </div>
                                      <div className="nf_cs-btn-group">
                                        <Link
                                          to={`/${partnerId}/tournament/${tournamentId}/stage/list/${val?._id}`}
                                          className="btn btn-nf-gray"
                                        >
                                          <Settings className="w-4 h-4 text-gray-400 group-hover/menu:text-blue-400 transition-colors" />
                                        </Link>
                                        <strong className="text-center">
                                          {" "}
                                          Manage Match
                                        </strong>
                                      </div>
                                      <div className="nf_cs-btn-group">
                                        <div className="nf_cs-btn-group">
                                          <button
                                            className="btn btn-nf-gray quickscore_data"
                                            data-toggle="modal"
                                            data-target="#quickscore"
                                            data-id={34042}
                                            onClick={() => {
                                              setSelectedMatch(val);
                                              setShowQuickScoreModal(true);
                                            }}
                                          >
                                            <CirclePlusIcon className="w-4 h-4 text-gray-400 group-hover/menu:text-blue-400 transition-colors" />
                                          </button>
                                          <strong className="text-center">
                                            Quick Scoring
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                )}
                {stageType === "BattleRoyal" && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1  items-center mt-5 gap-3 mb-3">
                    {matchesLoading ? (
                      <HandLogoLoader />
                    ) : (
                      <div className="nf_manage-wrap flex justify-between nf_battel-score nf_battel">
                        <div className="nf_manage-content">
                          <div className="nf_manage-num flex items-center">
                            <h4 className="player-number">1 </h4>
                            <h5 className="player-name">sr01</h5>
                            <input
                              type="hidden"
                              className="player-sortname"
                              defaultValue="sr01"
                            />
                            <input
                              type="hidden"
                              className="user-id"
                              defaultValue={1219}
                            />
                          </div>
                        </div>
                        <div className="nf_manage-cont flex">
                          <div className="nf-cont-title">
                            <div className="nf-cont-wrap flex tems-center">
                              <h6>Placement</h6>
                              <button
                                type="button"
                                className="btn btn-nf-gray tr_up_placement"
                              >
                                <img
                                  className=""
                                  height={10}
                                  width={10}
                                  src={topArrow}
                                />
                              </button>
                            </div>
                            <div className="nf-cont-wrap flex align-items-center">
                              <h6 className="placement">
                                <input
                                  type="number"
                                  className="form-control placement_point"
                                  defaultValue={1}
                                />
                              </h6>
                              <button
                                type="button"
                                className="btn btn-nf-gray tr_down_placement"
                              >
                                <img
                                  className=""
                                  height={10}
                                  width={10}
                                  src={downArrow}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="nf-cont-title">
                            <div className="nf-cont-wrap flex items-center">
                              <h6>Kills</h6>
                              <button
                                type="button"
                                className="btn btn-nf-gray tr_up_kills"
                              >
                                <img
                                  className=""
                                  height={10}
                                  width={10}
                                  src={topArrow}
                                />
                              </button>
                            </div>
                            <div className="nf-cont-wrap flex items-center">
                              <h6 className="kills">
                                <input
                                  className="form-control kill_point"
                                  type="number"
                                  defaultValue={10}
                                />
                              </h6>
                              <button
                                type="button"
                                className="btn btn-nf-gray tr_down_kills"
                              >
                                <img
                                  className=""
                                  height={10}
                                  width={10}
                                  src={downArrow}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="nf-cont-title">
                            <div className="nf-cont-wrap flex items-center">
                              <h6>Points</h6>
                            </div>
                            <div className="nf-cont-wrap flex items-center">
                              <h6 className="points">
                                <input
                                  type="number"
                                  className="form-control total_points"
                                  readOnly={true}
                                  defaultValue={115}
                                />
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          <div className="w-full lg:w-[1px] h-[1px] lg:h-auto bg-slate-600 "></div>
        </div>
      </div>
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrvious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}
      <QuickScoreModal
        show={showQuickScoreModal}
        onClose={() => setShowQuickScoreModal(false)}
        match={selectedMatch}
        onSubmit={handleScoreSubmit}
      />
      <ChangeTimeModal
        show={showChangeTimeModal}
        onClose={() => setShowChangeTimeModal(false)}
        match={selectedMatch}
        onSubmit={handleTimeSubmit}
      />
      <RoundTimeChangeModal
        stageRound={stageRound}
        show={showRoundTimeChangeModal}
        onClose={() => setShowRoundTimeChangeModal(false)}
        matches={matches}
        onSubmit={handleRoundTimeSubmit}
      />
      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId("");
        }}
        onDelete={handleDeleteDevice}
      />
    </>
  );
};

export default StageLists;
