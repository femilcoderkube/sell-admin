import React, { useEffect, useState } from "react";
import { UsersTable } from "./UsersTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import {
  setPage,
  setPerPage,
  setSearchTerm,
  fetchUsers,
  deleteUser,
  updateUser,
  addUser,
  generateExcelFile,
} from "../../app/features/users/usersSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { User as UserType } from "../../app/types";
import UsersModel from "./UsersModel";
import HandLogoLoader from "../Loader/Loader";

export * from "./UsersTable";

const ROLES = [
  "Player",
  "Referee",
  "Couch",
  "Team Manager",
  "Club admin",
  "Analyst",
  "Caster",
  "Host",
  "Media outlet",
  "Video Editor",
  "Grapich Disinger",
  "Streamer",
  "Frontend creator",
  "Game developer",
  "Tournament Organizer",
  "Club Owner",
];

export const User: React.FC = ({ title }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    loading,
    error,
    currentPage,
    perPage,
    totalPages,
    searchTerm,
    totalItem,
  } = useSelector((state: RootState) => state.users);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPerPage(Number(e.target.value)));
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (deleteId) {
      const resultAction = await dispatch(deleteUser(deleteId));
      if (deleteUser.fulfilled.match(resultAction)) {
        setDeleteId("");
        setIsDeleteModalOpen(false);
        dispatch(setPage(1));
        dispatch(fetchUsers({ page: 1, perPage, searchTerm }));
      }
    }
  };

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (form: any) => {
    if (selectedUser) {
      const resultAction = await dispatch(
        updateUser({ id: selectedUser._id, user: form })
      );
      if (updateUser.fulfilled.match(resultAction)) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        dispatch(setPage(1));
        dispatch(fetchUsers({ page: 1, perPage, searchTerm }));
      }
    } else {
      console.log("form", form);
      const resultAction = await dispatch(addUser(form));
      if (addUser.fulfilled.match(resultAction)) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        dispatch(setPage(1));
        dispatch(fetchUsers({ page: 1, perPage, searchTerm }));
      }
    }
  };

  const handleExport = async () => {
    await dispatch(generateExcelFile());
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
        <div className="nf_legue_head--con gap-6 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-6 pb-8 px-6 border-b border-gradient-to-r from-transparent via-slate-600/30 to-transparent">
          <div className="legue__head_left-con flex gap-4 items-center">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
              {title}{" "}
              <span className="text-slate-400 font-medium text-lg">
                ({totalItem})
              </span>
            </h3>
            <button
              className="group relative py-2.5 px-6 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-xl hover:shadow-emerald-500/25 hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 font-semibold text-sm border border-emerald-400/20 hover:border-emerald-300/40"
              onClick={handleExport}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                </svg>
                Export
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </div>

          <div className="legue__head_right-con flex-wrap flex gap-4 flex-1 justify-end items-center">
            <div className="nf_max-al bg-slate-800/60 backdrop-blur-sm gap-3 flex items-center pl-4 pr-2 py-2 rounded-xl border border-slate-600/30 shadow-lg hover:border-slate-500/50 transition-all duration-300">
              <span className="text-base text-slate-300 whitespace-nowrap font-medium">
                Show max:
              </span>
              <select
                name="selectedFruit"
                className="font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-700/80 text-white py-2.5 px-3 rounded-lg text-base border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200 cursor-pointer shadow-inner"
                value={perPage}
                onChange={handlePerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>25</option>
                <option value={30}>50</option>
              </select>
            </div>

            <form action="" className="w-full sm:w-80">
              <div className="relative group">
                <input
                  className="text-white font-medium block bg-slate-800/60 backdrop-blur-sm w-full text-base border border-slate-600/40 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/60 hover:border-slate-500/60 transition-all duration-300 placeholder-slate-400 shadow-lg"
                  placeholder="Search Users, Email or IP"
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200 group-focus-within:text-blue-400"
                  type="button"
                  name="searchbtn"
                  id="basic-addon2"
                >
                  <svg
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.6667 3.5C7.15634 3.5 3.5 7.15634 3.5 11.6667C3.5 16.177 7.15634 19.8333 11.6667 19.8333C13.5011 19.8333 15.1942 19.2285 16.5575 18.2074L22.5084 24.1583C22.964 24.6139 23.7027 24.6139 24.1583 24.1583C24.6139 23.7027 24.6139 22.964 24.1583 22.5084L18.2074 16.5575C19.2285 15.1942 19.8333 13.5011 19.8333 11.6667C19.8333 7.15634 16.177 3.5 11.6667 3.5ZM5.83333 11.6667C5.83333 8.445 8.445 5.83333 11.6667 5.83333C14.8883 5.83333 17.5 8.445 17.5 11.6667C17.5 14.8883 14.8883 17.5 11.6667 17.5C8.445 17.5 5.83333 14.8883 5.83333 11.6667Z"
                      fill="currentColor"
                      fillOpacity="0.8"
                    />
                  </svg>
                </button>
              </div>
            </form>

            <button
              onClick={() => {
                setIsEditModalOpen(true);
                setSelectedUser(null);
              }}
              className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 whitespace-nowrap sm:w-auto w-full font-semibold flex hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-[1.02] active:scale-95 duration-300 items-center gap-3 text-white text-base py-3.5 px-6 rounded-xl border border-blue-400/20 hover:border-blue-300/40 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  width="1.125rem"
                  height="1.125rem"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-sm"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.66797 10C1.66797 5.39763 5.39893 1.66667 10.0013 1.66667C14.6037 1.66667 18.3346 5.39763 18.3346 10C18.3346 14.6024 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6024 1.66797 10ZM10.8346 6.66667C10.8346 6.20643 10.4615 5.83333 10.0013 5.83333C9.54107 5.83333 9.16797 6.20643 9.16797 6.66667V9.16667H6.66797C6.20773 9.16667 5.83464 9.53976 5.83464 10C5.83464 10.4602 6.20773 10.8333 6.66797 10.8333H9.16797V13.3333C9.16797 13.7936 9.54107 14.1667 10.0013 14.1667C10.4615 14.1667 10.8346 13.7936 10.8346 13.3333V10.8333H13.3346C13.7949 10.8333 14.168 10.4602 14.168 10C14.168 9.53976 13.7949 9.16667 13.3346 9.16667H10.8346V6.66667Z"
                    fill="currentColor"
                  />
                </svg>
                Add New User
              </span>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : users.length > 0 ? (
        <UsersTable
          users={users}
          loading={loading}
          currentPage={currentPage}
          error={error}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="text-custom-gray flex items-center justify-center h-20">
          No data found.
        </div>
      )}
      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId("");
        }}
        onDelete={handleDeleteUser}
      />
      {isEditModalOpen && (
        <UsersModel
          show={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedUser={selectedUser}
          onSave={handleEditSave}
        />
      )}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPagePrvious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}
    </>
  );
};
