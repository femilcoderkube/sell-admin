import React, { useEffect, useState } from "react";
import { AdminTable } from "./AdminTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import { PlusIcon, SearchIcon } from "../ui";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import {
  deleteAdmin,
  fetchAdmin,
  setPage,
  setPerPage,
  setSearchTerm,
} from "../../app/features/admins/adminSlice";
import { fetchAdminAccess } from "../../app/features/admins/adminAccessSlice";
import { AdminAccessModal } from "./AdminAccessModal";
import CreateAdminModal from "./CreateAdminModal";
import HandLogoLoader from "../Loader/Loader";
import EditAdminModal from "./EditAdminModal";
import { AdminType } from "../../app/types";

export const Admins: React.FC = ({ title }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [adminAccessId, setAdminAccessId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const {
    admins,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.admins);

  useEffect(() => {
    dispatch(fetchAdmin({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  useEffect(() => {
    if (deleteId) {
      setIsDeleteModalOpen(true);
    }
  }, [deleteId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPerPage(Number(e.target.value)));
  };

  const totalPages = Math.ceil(totalCount / perPage);

  const handleDeleteAdmin = async () => {
    const resultAction = await dispatch(deleteAdmin(deleteId));
    if (deleteAdmin.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(setPage(1));
      dispatch(fetchAdmin({ page: 1, perPage, searchTerm }));
    }
  };

  const handleViewClick = (adminId: string) => {
    dispatch(fetchAdminAccess(adminId));
    setAdminAccessId(adminId);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Add this function to handle edit button click
  const handleEditClick = (admin: AdminType) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
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
              onClick={() => {
                // Add admin modal logic here if needed
                setIsOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add new Admin</span>
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
                  placeholder="Search admin"
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
            </form>
          </div>
          <div className="hidden lg:block">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              onClick={() => {
                // Add admin modal logic here if needed
                setIsOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add new Admin</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : admins.length > 0 ? (
        <AdminTable
          data={admins}
          currentPage={currentPage}
          onEditClick={handleEditClick} // Update this line
          onDeleteClick={(adminId) => setDeleteId(adminId)}
          handleViewClick={(adminAccess) => handleViewClick(adminAccess)}
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
        onDelete={handleDeleteAdmin}
      />

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrevious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}
      <CreateAdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AdminAccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        adminId={adminAccessId}
      />
      <EditAdminModal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedAdmin={selectedAdmin}
      />
    </>
  );
};
