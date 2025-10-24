import { Download, SearchIcon, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ParticipantsTable } from "./ParticipantsTable";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParticipant,
  fetchParticipants,
  generateExcelFile,
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

  console.log("participants", participants);

  const tournamentId = window.location.pathname.split("/")[3];
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"incomplete" | "complete">(
    "complete"
  );

  useEffect(() => {
    dispatch(
      fetchParticipants({
        tournamentId: tournamentId,
        page: currentPage,
        searchTerm: searchTerm,
        status: activeTab,
      })
    );
  }, [dispatch, currentPage, searchTerm, activeTab, tournamentId]);

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
            status: activeTab,
          })
        );
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const handleExport = () => {
    dispatch(generateExcelFile({ tournamentId }));
  };

  const btnBack = () => {
    navigate(-1);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleTabChange = (tab: "incomplete" | "complete") => {
    setActiveTab(tab);
    dispatch(setPage(1)); // Reset to page 1 when switching tabs
    dispatch(setSearchTerm("")); // Clear search term when switching tabs
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
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg"
          >
            <Upload size={20} />
            Export All
          </button>
        </div>
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "complete"
                ? "border-b-2 border-blue-600 text-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => handleTabChange("complete")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "incomplete"
                ? "border-b-2 border-blue-600 text-blue-400"
                : "text-gray-400"
            }`}
            onClick={() => handleTabChange("incomplete")}
          >
            Incomplete
          </button>
        </div>
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
          activeTab={activeTab}
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
        onDelete={handleDeleteDevice}
      />
    </>
  );
};
