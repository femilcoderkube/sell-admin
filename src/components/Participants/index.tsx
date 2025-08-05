import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ParticipantsTable } from "./ParticipantsTable";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParticipant,
  fetchParticipants,
  setPage,
  setSearchTerm,
} from "../../app/features/tournament/participantsSlice";
import { RootState } from "../../app/store";
import { leaveTeam } from "../../app/features/team/teamSlice";
import HandLogoLoader from "../Loader/Loader";
import { Pagination } from "../ui/Pagination";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

export const Participants: React.FC<any> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, searchTerm, currentPage, participants, totalCount } =
    useSelector((state: RootState) => state.participants);

  const tournamentId = window.location.pathname.split("/")[3];

  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  useEffect(() => {
    dispatch(
      fetchParticipants({
        tournamentId: tournamentId,
        page: currentPage,
        searchTerm: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handleDeleteDevice = async () => {
    try {
      const resultAction = await dispatch(deleteParticipant(deleteId));
      if (deleteParticipant.fulfilled.match(resultAction)) {
        dispatch(setPage(1));
        setIsDeleteModalOpen(false);
        setDeleteId("");
        dispatch(
          fetchParticipants({
            tournamentId: tournamentId,
            page: 1,
            searchTerm: "",
          })
        );
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const btnBack = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <>
      <div className="nf_legue_head--con bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <Link
              to={""}
              className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-white font-semibold text-sm lg:text-base"
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
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                <h3 className="font-bold text-2xl lg:text-3xl text-white tracking-tight">
                  {title}
                  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                    {totalCount}
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="legue__head_right-con flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative group w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <input
                className="relative w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg hover:bg-slate-700/50"
                placeholder="Search Participant"
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                type="button"
                name="searchbtn"
                id="basic-addon2"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {loading ? (
        <HandLogoLoader />
      ) : participants?.length > 0 ? (
        <ParticipantsTable
          participants={participants}
          currentPage={currentPage}
          onleaveTeam={(participant) => {
            setDeleteId(participant);
            setIsDeleteModalOpen(true);
          }}
        />
      ) : (
        <div className="text-custom-gray flex items-center justify-center h-20">
          No members found.
        </div>
      )}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrevious={() => handlePageChange(teamCurrentPage - 1)}
          onPageNext={() => handlePageChange(teamCurrentPage + 1)}
        />
      )}
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
