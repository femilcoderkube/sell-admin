import React, { useEffect, useState } from "react";
import { BannedUsersTable } from "./BannedUsersTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import { setPage, setPerPage, setSearchTerm, deleteUser, updateUser, fetchBannedUsers } from "../../app/features/users/usersSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { User, User as UserType } from "../../app/types";

import HandLogoLoader from "../Loader/Loader";

export * from "./BannedUsersTable";

export const BannedUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bannedUsers, loading, error, currentPage, perPage, totalPages, searchTerm } = useSelector((state: RootState) => state.users);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    dispatch(fetchBannedUsers({ page: currentPage, perPage, searchTerm }));
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
        dispatch(fetchBannedUsers({ page: currentPage, perPage, searchTerm }));
      }
    }
  };

  // const handleEditClick = (user: UserType) => {
  //   setSelectedUser(user);
  //   setIsEditModalOpen(true);
  // };

  const handleEditSave = async (user: User) => {
    if (user) {
      const resultAction = await dispatch(updateUser({ id: user._id, user: user }));
      if (updateUser.fulfilled.match(resultAction)) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        dispatch(fetchBannedUsers({ page: currentPage, perPage, searchTerm }));
      }
    }
  };

  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">
            All Banned users <span className="text-custom-gray">({bannedUsers.length})</span>
          </h3>
        </div>
        <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <div className="nf_max-al bg-input-color gap-2 flex items-center pl-2 pr-1 rounded-[0.625rem]">
            <span className="text-[1.0625rem] text-custom-gray whitespace-nowrap ">
              Show max:
            </span>
            <select
              name="selectedFruit"
              className=" font-medium focus:outline-0 bg-[#242B3C] text-white py-[0.4rem] px-2 rounded-[0.52rem] text-[1.0625rem]"
              value={perPage}
              onChange={handlePerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
          <form action="" className=" w-full sm:w-[20.8rem]">
            <div className="relative">
              <input
                className="text-white font-medium block  bg-input-color w-full sm:w-[20.8rem] text-gray-700 border rounded-[0.625rem] py-[0.6rem] pl-[2.5rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
                placeholder="Search Users,Email or IP"
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                className="absolute left-[0.52rem] top-[0.6rem]"
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
                    fill="white"
                    fillOpacity="0.3"
                  />
                </svg>
              </button>
            </div>
          </form>
  
        </div>
      </div>
      {loading ? (       
          <HandLogoLoader />
      ) : bannedUsers.length > 0 ? (
        <BannedUsersTable 
          users={bannedUsers} 
          loading={loading} 
          error={error} 
          onEditClick={handleEditSave}
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
