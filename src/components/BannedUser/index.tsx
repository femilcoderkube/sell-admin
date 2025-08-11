import React, { useEffect, useState } from "react";
import { BannedUsersTable } from "./BannedUsersTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HandLogoLoader from "../Loader/Loader";
import { PlusIcon } from "lucide-react";
import BanModal from "./BanModal";
import {
  deleteBannedUser,
  fetchBannedUsers,
  setPage,
  setPerPage,
  setSearchTerm,
} from "../../app/features/bannedusers/bannedUsersSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

export const BannedUser: React.FC = ({ title }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    bannedUsers,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.bannedUsers);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"bannedUsers" | "history">(
    "bannedUsers"
  );

  useEffect(() => {
    if (activeTab === "bannedUsers") {
      dispatch(fetchBannedUsers({ page: currentPage, perPage, searchTerm }));
    } else {
      dispatch(
        fetchBannedUsers({
          page: currentPage,
          perPage,
          searchTerm,
          status: status,
        })
      );
    }
  }, [dispatch, currentPage, perPage, searchTerm, activeTab, status]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPerPage(Number(e.target.value)));
  };

  const handleBanSubmit = (values: any, { setSubmitting }: any) => {
    setSubmitting(false);
    setIsBanModalOpen(false);
    // Add actual ban logic here when developed
  };

  const handleDeleteUser = async () => {
    try {
      const resultAction = await dispatch(deleteBannedUser(deleteId));
      if (deleteBannedUser.fulfilled.match(resultAction)) {
        setDeleteId("");
        setIsDeleteModalOpen(false);
        dispatch(setPage(1));
        dispatch(fetchBannedUsers({ page: currentPage, perPage, searchTerm }));
      }
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  const totalPages = Math.ceil(totalCount / perPage);

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
            <div
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
              onClick={() => {
                setIsBanModalOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Ban User</span>
              </div>
            </div>
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
                name="selectedFruit"
                className="bg-slate-700/80 border border-slate-600/50 text-white font-semibold py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-slate-600/80"
                value={perPage}
                onChange={handlePerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <form action="" className="flex-1 max-w-md">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <input
                  className="relative w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg hover:bg-slate-700/50"
                  placeholder="Search Users,Email or IP"
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
            <div
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              onClick={() => {
                setIsBanModalOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Ban User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b border-slate-700/50">
          <button
            className={`px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              activeTab === "bannedUsers"
                ? "border-b-2 border-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => {
              setActiveTab("bannedUsers");
              setStatus("");
              dispatch(setPage(1));
              dispatch(setSearchTerm(""));
              dispatch(setPerPage(10));
            }}
          >
            Banned Users
          </button>
          <button
            className={`px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              activeTab === "history"
                ? "border-b-2 border-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => {
              setActiveTab("history");
              setStatus("history");
              dispatch(setPage(1));
              dispatch(setSearchTerm(""));
              dispatch(setPerPage(10));
            }}
          >
            History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "bannedUsers" ? (
        <>
          {loading ? (
            <HandLogoLoader />
          ) : bannedUsers.length > 0 ? (
            <BannedUsersTable
              activeTab={activeTab}
              users={bannedUsers}
              currentPage={currentPage}
              loading={loading}
              error={error}
              handleUnbanUser={async (user) => {
                setDeleteId(user?._id);
                setIsDeleteModalOpen(true);
              }}
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
              onPageChange={handlePageChange}
              onPagePrevious={() => handlePageChange(currentPage - 1)}
              onPageNext={() => handlePageChange(currentPage + 1)}
            />
          )}
        </>
      ) : (
        <>
          {loading ? (
            <HandLogoLoader />
          ) : bannedUsers.length > 0 ? (
            <BannedUsersTable
              activeTab={activeTab}
              users={bannedUsers}
              currentPage={currentPage}
              loading={loading}
              error={error}
              handleUnbanUser={async (user) => {
                setDeleteId(user?._id);
                setIsDeleteModalOpen(true);
              }}
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
              onPageChange={handlePageChange}
              onPagePrevious={() => handlePageChange(currentPage - 1)}
              onPageNext={() => handlePageChange(currentPage + 1)}
            />
          )}
        </>
      )}

      <BanModal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onSubmit={handleBanSubmit}
      />
      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId("");
        }}
        onDelete={handleDeleteUser}
      />
    </>
  );
};
