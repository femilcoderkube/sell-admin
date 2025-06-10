import React, { useEffect, useState } from "react";
import { UsersTable } from "./UsersTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import { setPage, setPerPage, setSearchTerm, fetchUsers, deleteUser, updateUser } from "../../app/features/users/usersSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { User as UserType } from "../../app/types";
import UsersModel from "./UsersModel";

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

const UserModal = ({ show, onClose, selectedUser, onSave }: any) => {
  const [form, setForm] = useState({
    firstName: selectedUser?.firstName || "",
    lastName: selectedUser?.lastName || "",
    dateOfBirth: selectedUser?.dateOfBirth || "",
    gender: selectedUser?.gender || "",
    phone: selectedUser?.phone || "",
    nationality: selectedUser?.nationality || "",
    role: selectedUser?.role || ROLES[0],
    profilePicture: undefined as File | undefined,
    favoriteGame: selectedUser?.favoriteGame || "",
    socialMediaHandles: selectedUser?.socialMediaHandles || {},
    isBanned: selectedUser?.isBanned || false,
  });
  useEffect(() => {
    setForm({
      firstName: selectedUser?.firstName || "",
      lastName: selectedUser?.lastName || "",
      dateOfBirth: selectedUser?.dateOfBirth || "",
      gender: selectedUser?.gender || "",
      phone: selectedUser?.phone || "",
      nationality: selectedUser?.nationality || "",
      role: selectedUser?.role || ROLES[0],
      profilePicture: undefined as File | undefined,
      favoriteGame: selectedUser?.favoriteGame || "",
      socialMediaHandles: selectedUser?.socialMediaHandles || {},
      isBanned: selectedUser?.isBanned || false,
    });
  }, [selectedUser]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-blue p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold text-white mb-4">Edit User</h3>
        <div className="space-y-2">
          <input
            className="w-full p-2 rounded"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            placeholder="First Name"
          />
          <input
            className="w-full p-2 rounded"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <input
            className="w-full p-2 rounded"
            type="date"
            value={form.dateOfBirth ? form.dateOfBirth.slice(0, 10) : ""}
            onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
            placeholder="Date of Birth"
          />
          <select
            className="w-full p-2 rounded"
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            className="w-full p-2 rounded"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
          />
          <input
            className="w-full p-2 rounded"
            value={form.nationality}
            onChange={e => setForm({ ...form, nationality: e.target.value })}
            placeholder="Nationality"
          />
          <select
            className="w-full p-2 rounded"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <input
            className="w-full p-2 rounded"
            type="file"
            accept="image/*"
            onChange={e => setForm({ ...form, profilePicture: e.target.files?.[0] || undefined })}
          />
          <input
            className="w-full p-2 rounded"
            value={form.favoriteGame}
            onChange={e => setForm({ ...form, favoriteGame: e.target.value })}
            placeholder="Favorite Game"
          />
          <input
            className="w-full p-2 rounded"
            value={form.socialMediaHandles?.twitter || ""}
            onChange={e => setForm({ ...form, socialMediaHandles: { ...form.socialMediaHandles, twitter: e.target.value } })}
            placeholder="Twitter Handle"
          />
          {/* Add more social fields as needed */}
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.isBanned}
              onChange={e => setForm({ ...form, isBanned: e.target.checked })}
            />
            Is Banned
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button className="bg-gray-gradient px-4 py-2 rounded text-white" onClick={onClose}>Cancel</button>
          <button className="bg-primary-gradient px-4 py-2 rounded text-white" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export const User: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, currentPage, perPage, totalPages, searchTerm } = useSelector((state: RootState) => state.users);
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
        dispatch(fetchUsers({ page: currentPage, perPage, searchTerm }));
      }
    }
  };

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (form: any) => {
    if (selectedUser) {
      const resultAction = await dispatch(updateUser({ id: selectedUser._id, user: form }));
      if (updateUser.fulfilled.match(resultAction)) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        dispatch(fetchUsers({ page: currentPage, perPage, searchTerm }));
      }
    }
  };

  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">
            All users <span className="text-custom-gray">({users.length})</span>
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
          <a
            className="bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
            href="#"
          >
            <span>
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
            </span>
            Add new user
          </a>
        </div>
      </div>
      <UsersTable users={users} loading={loading} error={error} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
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
      {totalPages > 1 && (
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
