import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { TeamTable } from "./TeamTable";
import { RootState, AppDispatch } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import HandLogoLoader from "../Loader/Loader";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

import {
  deleteTeam,
  fetchTeams,
  setPage,
  setPerPage,
  setSearchTerm,
} from "../../app/features/team/teamSlice";
import AddTeamModal from "./AddTeamModal";

export * from "./TeamTable";

interface TeamProps {
  title: string;
}

export const Team: React.FC<TeamProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    teams,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.teams); // Adjusted to use teams state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  useEffect(() => {
    if (deleteId) {
      setIsDeleteModalOpen(true);
    }
  }, [deleteId]);

  useEffect(() => {
    if (selectedTeam) {
      setIsAddModalOpen(true);
    }
  }, [selectedTeam]);

  useEffect(() => {
    dispatch(
      fetchTeams({
        page: currentPage,
        perPage,
        searchTerm,
      })
    );
  }, [dispatch, currentPage, perPage, searchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    },
    [dispatch]
  );

  const handlePerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPerPage(Number(e.target.value)));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= Math.ceil(totalCount / perPage)) {
        dispatch(setPage(page));
      }
    },
    [dispatch, totalCount, perPage]
  );

  const totalPages = Math.ceil(totalCount / perPage);

  console.log("totalPages", totalPages);

  const handleDeleteTeam = async () => {
    await dispatch(deleteTeam(deleteId));
    dispatch(fetchTeams({ page: 1, perPage, searchTerm }));
    dispatch(setPage(1));
    setIsDeleteModalOpen(false);
    setDeleteId("");
  };

  return (
    <>
      <div className="nf_legue_head--con bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="legue__head_left-con">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <h3 className="font-bold text-2xl lg:text-3xl text-white tracking-tight">
                {title}
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                  ({totalCount})
                </span>
              </h3>
            </div>
          </div>
          <div className="lg:hidden">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
              onClick={(e) => {
                setSelectedTeam(null);
                setIsAddModalOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <svg
                    width="1.041rem"
                    height="1.041rem"
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
                <span>Add New Team</span>
              </div>
            </button>
          </div>
        </div>
        <div className="legue__head_right-con flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 min-w-fit shadow-lg">
              <span className="text-slate-300 font-medium text-sm whitespace-nowrap flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 12H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Show max:
              </span>
              <select
                name="perPage"
                className="bg-slate-700/80 border border-slate-600/50 text-white font-semibold py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-slate-600/80"
                value={perPage}
                onChange={handlePerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <form
              className="flex-1 max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <input
                  className="relative w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg hover:bg-slate-700/50"
                  placeholder="Search team name"
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
                  <svg
                    width="1.46rem"
                    height="1.46rem"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.6667 3.5C7.15634 3.5 3.5 7.15634 3.5 11.6667C3.5 16.177 7.15634 19.8333 11.6667 19.8333C13.5011 19.8333 15.1942 19.2285 16.5575 18.2074L22.5084 24.1583C22.964 24.6139 23.7027 24.6139 24.1583 24.1583C24.6139 23.7027 24.6139 22.964 24.1583 22.5084L18.2074 16.5575C19.2285 15.1942 19.8333 13.5011 19.8333 11.6667C19.8333 7.15634 16.177 3.5 11.6667 3.5ZM5.83333 11.6667C5.83333 8.445 8.445 5.83333 11.6667 5.83333C14.8883 5.83333 17.5 8.445 17.5 11.6667C17.5 14.8883 14.8883 17.5 11.6667 17.5C8.445 17.5 5.83333 14.8883 5.83333 11.6667Z"
                      fill="currentColor"
                      fillOpacity="1"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <div className="hidden lg:block">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              onClick={(e) => {
                setSelectedTeam(null);
                setIsAddModalOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <svg
                    width="1.041rem"
                    height="1.041rem"
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
                <span>Add New Team</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : teams.length > 0 ? (
        <TeamTable
          currentPage={currentPage}
          teams={teams}
          onEditClick={(team: any) => {
            setSelectedTeam(team);
          }}
          onDeleteClick={(teamId) => setDeleteId(teamId)}
        />
      ) : (
        <div className="text-custom-gray flex items-center justify-center h-20">
          No data found.
        </div>
      )}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrevious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}
      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId("");
        }}
        onDelete={handleDeleteTeam}
      />
      <AddTeamModal
        isOpen={isAddModalOpen}
        selectedTeam={selectedTeam}
        onClose={() => {
          setSelectedTeam(null);
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
};
