import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data, Link, useParams } from "react-router-dom";
import {
  fetchLeagues,
  setSearchTerm,
  setPerPage,
  setPage,
  deleteLeague,
} from "../../app/features/league/leagueSlice";
import { LeagueTable } from "./LeagueTable";
import { RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import HandLogoLoader from "../Loader/Loader";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { fetchRole } from "../../app/features/admins/adminSlice";
import { logout } from "../../app/features/auth/authSlice";

export * from "./LeagueTable";

// Define table headers (unchanged)
export const thead = ["Name", "Job", "Employed", ""];

export const League: React.FC = ({ title }: any) => {
  const dispatch = useDispatch();
  const {
    leagues,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.leagues);
  const partnerId = window.location.pathname.split("/")[1];
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const { role } = useSelector((state: RootState) => state.admins);
  const roles = localStorage.getItem("admin");
  const jsonValue = JSON.parse(roles as any);

  useEffect(() => {
    if (role?.role) {
      if (jsonValue.role !== role?.role) {
        console.log("lofg pade chhe");
        window.location.href = "/login";
        dispatch(logout());
      }
    }
  }, [role]);

  useEffect(() => {
    if (jsonValue.role !== "Superadmin") {
      dispatch(fetchRole());
    }
  }, []);

  useEffect(() => {
    if (deleteId) {
      setIsDeleteModalOpen(true);
    }
  }, [deleteId]);

  // Fetch leagues when component mounts or when pagination/search changes
  useEffect(() => {
    dispatch(
      fetchLeagues({
        partnerId: partnerId,
        page: currentPage,
        perPage,
        searchTerm,
      })
    );
  }, [dispatch, currentPage, perPage, searchTerm]);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    },
    [dispatch]
  );

  // Handle per-page selection change
  const handlePerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPerPage(Number(e.target.value)));
    },
    [dispatch]
  );

  // Handle pagination navigation
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= Math.ceil(totalCount / perPage)) {
        dispatch(setPage(page));
      }
    },
    [dispatch, totalCount, perPage]
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / perPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDeleteLeague = async () => {
    dispatch(deleteLeague(deleteId));
    dispatch(fetchLeagues({ partnerId: partnerId, page: 1 }));
    dispatch(setPage(1));
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.5rem] text-white">
            {title} <span className="text-custom-gray">({totalCount})</span>
          </h3>
        </div>
        <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <div className="nf_max-al bg-input-color gap-2 flex items-center pl-2 pr-1 rounded-2xl">
            <span className="text-[1.0625rem] text-custom-gray whitespace-nowrap">
              Show max:
            </span>
            <select
              name="perPage"
              className="font-medium focus:outline-0 bg-light-blue text-white py-[0.4rem] px-2 rounded-[0.52rem] text-[1.0625rem]"
              value={perPage}
              onChange={handlePerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <form
            className="w-full sm:w-[20.8rem]"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative">
              <input
                className="text-white font-medium block placeholder-custom-gray bg-input-color w-full sm:w-[20.8rem] text-gray-700 border rounded-2xl py-[0.6rem] pl-[2.5rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
                placeholder="Search league name, game name"
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
                    fill="#6B7897"
                    fillOpacity="1"
                  />
                </svg>
              </button>
            </div>
          </form>
          {jsonValue?.role !== "Operator" && (
            <Link
              className="bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
              to={`/${partnerId}/leagues/add`}
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
              Add New League
            </Link>
          )}
        </div>
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : leagues.length > 0 ? (
        <LeagueTable
          currentPage={currentPage}
          leagues={leagues}
          onDeleteClick={(leagueId) => setDeleteId(leagueId)}
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
          onPagePrvious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}
      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId("");
        }}
        onDelete={handleDeleteLeague}
      />
    </>
  );
};
