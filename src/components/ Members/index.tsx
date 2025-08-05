import { Link, useNavigate, useParams } from "react-router-dom";
import { PlusIcon, SearchIcon } from "../ui";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AsyncPaginate } from "react-select-async-paginate";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { fetchUsers } from "../../app/features/users/usersSlice";
import {
  fetchTeamMembers,
  joinTeam,
  leaveTeam,
  resetJoinTeamSuccess,
  setMembersPage,
  setMembersSearchTerm,
  updateTeamMemberRole, // New action for updating role
} from "../../app/features/team/teamSlice";
import { Pagination } from "../ui/Pagination";
import HandLogoLoader from "../Loader/Loader";
import { MembersTable } from "./MembersTable";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

// Define props interface
interface MembersProps {
  title: string;
  teamId: string;
}

export const Members: React.FC<MembersProps> = ({ title }) => {
  const { id } = useParams();
  const { currentPage, perPage, searchTerm } = useSelector(
    (state: RootState) => state.users
  );
  const {
    loading,
    error,
    joinTeamSuccess,
    teamMembers,
    totalItem,
    membersSearchTerm,
    membersCurrentPage,
    membersPerPage,
  } = useSelector((state: RootState) => state.teams);
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>();
  const [editMode, setEditMode] = useState<boolean>(false); // New state for edit mode
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  useEffect(() => {
    dispatch(
      fetchTeamMembers({
        teamId: id,
        page: membersCurrentPage,
        perPage: membersPerPage,
        searchTerm: membersSearchTerm,
      })
    );
  }, [dispatch, membersCurrentPage, membersPerPage, membersSearchTerm, id]);

  useEffect(() => {
    if (joinTeamSuccess) {
      setIsModalOpen(false);
      formik.resetForm();
      dispatch(resetJoinTeamSuccess());
    }
  }, [joinTeamSuccess]);

  useEffect(() => {
    if (selectedItem) {
      setEditMode(true);
      setIsModalOpen(true);
      // Pre-fill form with selected member data
      formik.setValues({
        member_name: {
          value: selectedItem._id,
          label: selectedItem.user.username,
        },
        type:
          Object.keys(typeToRoleMap).find(
            (key) => typeToRoleMap[key] === selectedItem.role
          ) || "",
        game_id: "",
      });
    } else {
      setEditMode(false);
    }
  }, [selectedItem]);

  const btnBack = () => {
    navigate(-1);
  };

  const openModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setIsModalOpen(true);
    formik.resetForm();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    formik.resetForm();
  };

  const loadedOptions = async (
    search: string,
    loadedOptions: any,
    { page }: any
  ) => {
    const perPage = 10;
    const response: any = await dispatch(
      fetchUsers({ page, perPage, searchTerm: search })
    );
    const data = response.payload;
    const options: any[] = data?.data.result.map((user: any) => ({
      value: user._id,
      label: user.username,
    }));

    return {
      options,
      hasMore: page * perPage < data.data.totalItem,
      additional: { page: page + 1 },
    };
  };

  // Map type values to roles
  const typeToRoleMap: { [key: string]: string } = {
    "1": "President", // Leader
    "2": "Manager",
    "3": "Player",
    "4": "Coach",
  };

  const formik = useFormik({
    initialValues: {
      member_name: null,
      type: "",
      game_id: "",
    },
    validationSchema: Yup.object({
      member_name: Yup.object()
        .shape({
          value: Yup.string().required("Member name is required"),
          label: Yup.string().required(),
        })
        .nullable()
        .required("Member name is required"),
      type: Yup.string().required("Type is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (editMode) {
          // Update role

          const payload = {
            teamId: id,
            userId: values.member_name?.value,
            role: typeToRoleMap[values.type],
          };
          const resultAction = await dispatch(updateTeamMemberRole(payload));
          if (updateTeamMemberRole.fulfilled.match(resultAction)) {
            dispatch(setMembersPage(1));
            dispatch(
              fetchTeamMembers({
                teamId: id,
                page: 1,
                perPage,
                searchTerm: "",
              })
            );
            setIsModalOpen(false);
            setSelectedItem(null);
            formik.resetForm();
          }
        } else {
          // Add new member
          const payload = {
            teamId: id,
            userId: values.member_name?.value,
            role: typeToRoleMap[values.type],
          };
          const resultAction = await dispatch(joinTeam(payload));
          if (joinTeam.fulfilled.match(resultAction)) {
            dispatch(setMembersPage(1));
            dispatch(
              fetchTeamMembers({
                teamId: id,
                page: 1,
                perPage,
                searchTerm: "",
              })
            );
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  const totalPages = Math.ceil(totalItem / membersPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMembersSearchTerm(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setMembersPage(page));
  };

  const onleaveTeam = async (value: any) => {
    try {
      const payload = {
        teamId: id,
        userId: value._id,
        role: typeToRoleMap[value.type],
      };
      const resultAction = await dispatch(leaveTeam(payload));
      if (leaveTeam.fulfilled.match(resultAction)) {
        dispatch(setMembersPage(1));
        setIsDeleteModalOpen(false);
        setDeleteId(null);
        dispatch(
          fetchTeamMembers({
            teamId: id,
            page: 1,
            perPage,
            searchTerm: "",
          })
        );
      }
    } catch (error) {
      console.log("err", error);
    }
  };

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
                    ({totalItem})
                  </span>
                </h3>
              </div>
            </div>
          </div>
          <div className="lg:hidden">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
              onClick={openModal}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add new member</span>
              </div>
            </button>
          </div>
        </div>
        <div className="legue__head_right-con flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative group w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <input
                className="relative w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg hover:bg-slate-700/50"
                placeholder="Search Member"
                type="text"
                name="search"
                value={membersSearchTerm}
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
          <div className="hidden lg:block">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              onClick={openModal}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add new member</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <HandLogoLoader />
      ) : teamMembers.length > 0 ? (
        <MembersTable
          currentPage={membersCurrentPage}
          members={teamMembers}
          onEditClick={(item) => setSelectedItem(item)}
          onleaveTeam={(member: any) => {
            setDeleteId(member);
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
          currentPage={membersCurrentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrevious={() => handlePageChange(membersCurrentPage - 1)}
          onPageNext={() => handlePageChange(membersCurrentPage + 1)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#242B3C] rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h3 className="text-xl font-semibold text-white">
                {editMode ? "Edit team member" : "Add team member"}
              </h3>
              <button
                className="text-white hover:opacity-75"
                onClick={closeModal}
                aria-label="Close"
              >
                <img
                  className="w-6 h-6"
                  src="https://staging.saudieleagues.com/public/admin/icons/Close.svg"
                  alt="Close"
                />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label className="block text-white mb-1">Member name</label>
                  <AsyncPaginate
                    name="member_name"
                    className="w-full text-white"
                    classNamePrefix="react-select"
                    loadOptions={loadedOptions}
                    additional={{ page: 1 }}
                    placeholder="Search for a member"
                    value={formik.values.member_name}
                    onChange={(option) =>
                      formik.setFieldValue("member_name", option)
                    }
                    onBlur={() => formik.setFieldTouched("member_name", true)}
                    isDisabled={editMode} // Disable member selection in edit mode
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#1A202D",
                        borderColor:
                          formik.touched.member_name &&
                          formik.errors.member_name
                            ? "#EF4444"
                            : "#4B5563",
                        borderRadius: "0.375rem",
                        padding: "0.5rem",
                        color: "white",
                        "&:hover": {
                          borderColor:
                            formik.touched.member_name &&
                            formik.errors.member_name
                              ? "#EF4444"
                              : "#4B5563",
                        },
                      }),
                      input: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#1A202D",
                        color: "white",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#46A2FF"
                          : "#1A202D",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#2D3748",
                        },
                      }),
                    }}
                  />
                  {formik.touched.member_name && formik.errors.member_name && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.member_name}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-white mb-1">Type</label>
                  <select
                    name="type"
                    className={`w-full bg-[#1A202D] text-white border ${
                      formik.touched.type && formik.errors.type
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="1">Leader</option>
                    <option value="2">Manager</option>
                    <option value="4">Coach</option>
                    <option value="3">Player</option>
                  </select>
                  {formik.touched.type && formik.errors.type && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.type}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 p-4 border-t border-gray-600">
                  <button
                    type="button"
                    className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#46A2FF] text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading
                      ? editMode
                        ? "Updating..."
                        : "Adding..."
                      : editMode
                      ? "Update member"
                      : "Add member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        title="Are you sure you want to remove the team member?"
        buttonTitle="Remove"
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        onDelete={() => onleaveTeam(deleteId)}
      />
    </>
  );
};
