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

  const { stagesList, loading, error, currentPage, perPage, totalCount } =
    useSelector((state: RootState) => state.tournamentStage);
  const { matches, matchesLoading } = useSelector(
    (state: RootState) => state.tournamentMatches
  );

  const [showQuickScoreModal, setShowQuickScoreModal] = useState(false);
  const [showChangeTimeModal, setShowChangeTimeModal] = useState(false);
  const [showRoundTimeChangeModal, setShowRoundTimeChangeModal] =
    useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedRound, setSelectedRound] = useState<string>("");

  const [selectedStage, setSelectedStage] = useState();

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

  const handleDelete = async (stageId: string) => {
    const resultAction = await dispatch(deleteTournamentStage(stageId));
    if (deleteTournamentStage.fulfilled.match(resultAction)) {
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
      dispatch(updateStageRound({ stageId: selectedStage }));
    }
  };

  const rounds = Array.from(
    new Map(
      matches?.map((match) => [
        match.stageRoundId._id,
        {
          id: match.stageRoundId._id,
          name: match.stageRoundId.roundName,
        },
      ])
    ).values()
  );

  const handleCheckboxChange = (name: string) => {
    // If the clicked checkbox is already selected, uncheck it
    setSelectedStatus(selectedStatus === name ? null : name);
  };
  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
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

        <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <Link
            to={`/${partnerId}/tournament/${tournamentId}/stage/add`}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon />
            <span>Add New Stage</span>
          </Link>
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
                            handleDelete(stage._id);

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
          )}
          <div className="w-full lg:w-[1px] h-[1px] lg:h-auto bg-slate-600 "></div>
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
                      {rounds.map((round) => (
                        <option key={round.id} value={round.id}>
                          {round.name}
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
                            onChange={() => handleCheckboxChange(option.name)}
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

            <div className="grid grid-cols-1 xl:grid-cols-3 items-center mt-5 gap-3 mb-3">
              {matchesLoading ? (
                <HandLogoLoader />
              ) : (
                <>
                  {stagesList?.length &&
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
                                    src={`${baseURL}/api/v1/${val?.opponent1?.team?.logoImage}`}
                                  />
                                </div>
                                <h3>{val?.opponent1?.team?.teamShortName}</h3>
                              </div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="nf_stage-content text-center">
                                <div className="flex content-center justify-center">
                                  <h5 className="">
                                    {activeScores[0]?.opponent1Score
                                      ? activeScores[0]?.opponent1Score
                                      : 0}
                                  </h5>
                                  <h5 className="">
                                    {activeScores[0]?.opponent2Score
                                      ? activeScores[0]?.opponent2Score
                                      : 0}
                                  </h5>
                                </div>
                                <p>
                                  {val?.status
                                    ?.replace("_", " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
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
                                    src={`${baseURL}/api/v1/${val?.opponent2?.team?.logoImage}`}
                                  />
                                </div>
                                <h3>{val?.opponent2?.team?.teamShortName}</h3>
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
          </div>
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
        show={showRoundTimeChangeModal}
        onClose={() => setShowRoundTimeChangeModal(false)}
        matches={matches}
        onSubmit={handleRoundTimeSubmit}
      />
    </>
  );
};

export default StageLists;
