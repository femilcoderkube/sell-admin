import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/images/trash_can.svg";
import editIcon from "../../assets/images/Edit.svg";
import viewIcon from "../../assets/images/eye_icon.svg";
import rightIcon from "../../assets/images/rightarrow.svg";
import { PlusIcon, SearchIcon } from "../ui"; // Adjust path to your HandLogoLoader component
import {
  getTournamentStages,
  deleteTournamentStage,
} from "../../app/features/tournament/tournamentStageSlice"; // Adjust path to your slice
import { RootState } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";
import { Pagination } from "../ui/Pagination";
import { fetchTournamentMatches } from "../../app/features/tournament/tournamentMatchesSlice";

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
  const { matches, matchesLoading, matchesError } = useSelector(
    (state: RootState) => state.tournamentMatches
  );

  console.log("matches", matches);

  useEffect(() => {
    if (tournamentId) {
      dispatch(getTournamentStages(tournamentId));
    }
  }, [dispatch, tournamentId]);

  const btnBack = () => {
    navigate(-1);
  };

  const handleDelete = async (stageId: string) => {
    const resultAction = await dispatch(deleteTournamentStage(stageId));
    if (deleteTournamentStage.fulfilled.match(resultAction)) {
      dispatch(getTournamentStages(tournamentId));
    }
  };

  const getMatches = (id: any) => {
    dispatch(fetchTournamentMatches({ stageId: id }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };
  const totalPages = Math.ceil(totalCount / perPage);
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
        <div className="flex gap-4 flex-wrap">
          {!loading && stagesList.length > 0 && (
            <div className="w-full lg:w-[350px]">
              {stagesList.map((stage: Stage) => (
                <div
                  key={stage._id}
                  className="nf_tournaments-card list-focus bg-[rgba(0,126,255,0.16)] border-[#007EFF] border text-white rounded-md w-full "
                  data-stage-id={stage._id}
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
                          onClick={() => handleDelete(stage._id)}
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
                        <Link
                          to={``}
                          onClick={() => {
                            getMatches(stage?._id);
                          }}
                          style={{
                            background:
                              "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                          }}
                          className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                        >
                          <img
                            src={viewIcon}
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
                      onchange="match_list()"
                    >
                      <option value={-1} selected="selected">
                        All rounds
                      </option>
                      <option value={8320}>الدور 1</option>
                      <option value={8321}>الدور 2</option>
                      <option value={8322}>الدور 3</option>
                      <option value={8323}>الدور 4</option>
                    </select>
                  </div>
                </div>
                <div
                  className="nf_top-filter nf_bg align-items-center"
                  style={{ maxWidth: "max-content", display: "none" }}
                  id="group_filter_option"
                >
                  <p className="color_gray">Filter by:</p>
                  <div className="nf_cust-select nf_simple-select focus-input">
                    <select
                      className="form-control color-white cust-arrow"
                      id="groups_dropdown"
                      onchange="match_list()"
                    />
                  </div>
                </div>
                <div id="checkbox_1" style={{}}>
                  <div className="nf_normal-checkbox">
                    <div className="checkbox">
                      <label className="checkbox-wrapper focus-input">
                        <input
                          type="checkbox"
                          name="unsolved_disputed"
                          defaultValue={0}
                          id="unsolved_disputed"
                          className="checkbox-input form-control"
                        />
                        <span className="checkbox-tile">
                          <h4>Unsolved Disputed</h4>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="nf_normal-checkbox">
                    <div className="checkbox">
                      <label className="checkbox-wrapper focus-input">
                        <input
                          type="checkbox"
                          name="disputed"
                          defaultValue={0}
                          id="disputed"
                          className="checkbox-input form-control"
                        />
                        <span className="checkbox-tile">
                          <h4>Disputed</h4>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="nf_normal-checkbox">
                    <div className="checkbox">
                      <label className="checkbox-wrapper focus-input">
                        <input
                          type="checkbox"
                          name="in_progress"
                          defaultValue={1}
                          id="in_progress"
                          className="checkbox-input form-control"
                        />
                        <span className="checkbox-tile">
                          <h4>In-progress</h4>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="nf_serchbar mt-0">
                  <div className="input-group md-form form-sm form-1 pl-0">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text purple lighten-3"
                        id="basic-text1"
                      >
                        <i
                          className="color_gray"
                          aria-hidden="true"
                          data-fa-i2svg=""
                        >
                          <svg
                            className="svg-inline--fa fa-magnifying-glass"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="magnifying-glass"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            data-fa-i2svg=""
                          >
                            <path
                              fill="currentColor"
                              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                            />
                          </svg>
                        </i>
                      </span>
                    </div>
                    <input
                      className="form-control my-0 py-1"
                      type="text"
                      id="search_user"
                      placeholder="Search team name"
                      aria-label="Search"
                      aria-controls="user_table"
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

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 items-center mt-5 gap-3 mb-3">
              {matches?.result?.map((val) => {
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
                              src="https://staging.saudieleagues.com/storage/teams/qsKhT5GxOb2UxWZILQuOrfZAfAtRficE4qVVMgtI.jpg"
                            />
                          </div>
                          <h3>SR27 Test</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="nf_stage-content text-center">
                          <div className="flex content-center justify-center">
                            <h5 className="">0</h5>
                            <h5 className="">0</h5>
                          </div>
                          <p>{val?.status}</p>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="nf_stage-content">
                          <div className="nf_stage-img">
                            <img
                              className=""
                              height=""
                              width=""
                              src="https://staging.saudieleagues.com/storage/teams/"
                            />
                          </div>
                          <h3>gkdgygygj</h3>
                        </div>
                      </div>
                    </div>
                    <div className="nf_stage-bottombar flex my-2">
                      <p>الدور 1</p>
                      <p>Jun 16 11:00 PM - Jul 29 12:43 PM</p>
                    </div>
                    <div className="nf_match-list my-3">
                      <div className="nf-cs-btn flex" style={{}}>
                        <div className="nf_cs-buttons flex items-center content-center">
                          <div className="nf_cs-btn-group ">
                            <button
                              className="btn btn-nf-gray timechange_data"
                              data-toggle="modal"
                              data-target="#changetime"
                              data-id={34042}
                            >
                              <img
                                className=""
                                width={14}
                                height={14}
                                src="https://staging.saudieleagues.com/public/admin/icons/change_time.svg"
                              />
                            </button>
                            <strong className="text-center">
                              {" "}
                              Change Time
                            </strong>
                          </div>
                          <div className="nf_cs-btn-group">
                            <a
                              href="https://staging.saudieleagues.com/admin/championship/team_match/result/34042"
                              className="btn btn-nf-gray"
                            >
                              <img
                                className=""
                                width={14}
                                height={14}
                                src="https://staging.saudieleagues.com/public/admin/icons/setting.svg"
                              />
                            </a>
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
                              >
                                <img
                                  className=""
                                  width={14}
                                  height={14}
                                  src="https://staging.saudieleagues.com/public/admin/icons/plus-black.svg"
                                />
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
    </>
  );
};

export default StageLists;
