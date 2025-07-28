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
  joinTeam,
  resetJoinTeamSuccess,
} from "../../app/features/team/teamSlice";

// Define props interface
interface MembersProps {
  title: string;
  teamId: string; // Added teamId prop
}

export const Members: React.FC<MembersProps> = ({ title }) => {
  const { id } = useParams();

  const { currentPage, perPage, searchTerm } = useSelector(
    (state: RootState) => state.users
  );
  const { loading, error, joinTeamSuccess } = useSelector(
    (state: RootState) => state.teams
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  useEffect(() => {
    if (joinTeamSuccess) {
      setIsModalOpen(false); // Close modal on success
      formik.resetForm(); // Reset form
      dispatch(resetJoinTeamSuccess()); // Reset success state
    }
  }, [joinTeamSuccess]);

  const btnBack = () => {
    navigate(-1);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm(); // Reset form on close
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
        const payload = {
          teamId: id,
          userId: values.member_name?.value,
          role: typeToRoleMap[values.type],
        };
        await dispatch(joinTeam(payload)).unwrap();
      } catch (error) {
        console.log("error", error);
      }
    },
  });

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
            {title} <span className="text-custom-gray">()</span>
          </h3>
        </div>
        <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <div className="nf_max-al bg-input-color gap-2 flex items-center pl-2 pr-1 rounded-[0.625rem]">
            <span className="text-[1.0625rem] text-custom-gray whitespace-nowrap">
              Show max:
            </span>
            <select
              name="selectedFruit"
              className="font-medium focus:outline-0 bg-[#242B3C] text-white py-[0.4rem] px-2 rounded-[0.52rem] text-[1.0625rem]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="relative w-full sm:w-[20.8rem]">
            <input
              className="text-white font-medium block bg-input-color w-full sm:w-[20.8rem] text-gray-700 border rounded-[0.625rem] py-[0.6rem] pl-[2.5rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
              placeholder="Search Member"
              type="text"
              name="search"
            />
            <button
              className="absolute left-[0.52rem] top-[0.6rem]"
              type="button"
              name="searchbtn"
              id="basic-addon2"
            >
              <SearchIcon />
            </button>
          </div>
          <button
            className="bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
            onClick={openModal}
          >
            <span>
              <PlusIcon />
            </span>
            Add new member
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#242B3C] rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h3 className="text-xl font-semibold text-white">
                Add team member
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
                    {loading ? "Adding..." : "Add member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
