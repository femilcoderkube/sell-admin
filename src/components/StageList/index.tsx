import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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

  const partnerId = window.location.pathname.split("/")[1];
  const tournamentId = window.location.pathname.split("/")[3];

  const { stagesList, loading, error, currentPage, perPage, totalCount } =
    useSelector((state: RootState) => state.tournamentStage);

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
        {!loading && stagesList.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
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
                          style={{ width: "1.26rem" }}
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
                          style={{ width: "1.26rem" }}
                        />
                      </button>
                      <Link
                        to={`/${partnerId}/tournament/${tournamentId}/stage/list/seed/${stage._id}`}
                        style={{
                          background:
                            "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                        }}
                        className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                      >
                        <img
                          src={rightIcon}
                          alt="View"
                          style={{ width: "1.26rem" }}
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
