import React, { useEffect, useState } from "react";
import { TrophiesTable } from "./TrophiessTable";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import { PlusIcon, SearchIcon } from "../ui";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import {
  deleteTrophie,
  fetchTrophies,
  setPage,
  setPerPage,
  setSearchTerm,
} from "../../app/features/trophies/trophiesSlice";
import TrophiesModal from "./TrophiesModal";
import { fetchBadges, fetchBadgeNames } from "../../app/features/badge/badgeSlice";
import { TrophieType } from "../../app/types";
import { BadgeNameType } from "../../app/types";
import HandLogoLoader from "../Loader/Loader";
export * from "./TrophiessTable";

export const Trophie: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const {
    trophies,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.trophy);
  const [showTrophieModal, setShowTrophieModal] = useState(false);
  const [selectedTrophie, setSelectedTrophie] = useState<TrophieType | null>(null);
  const { badgeNames } = useSelector((state: RootState) => state.badge);

  useEffect(() => {
    dispatch(fetchTrophies({ page: currentPage, perPage, searchTerm }));
    dispatch(fetchBadgeNames());

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

  const handleDeleteDevice = async () => {
    const resultAction = await dispatch(deleteTrophie(deleteId));
    if (deleteTrophie.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(fetchTrophies({ page: 1, perPage: 10, searchTerm: "" }));
    }
  };

  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">
            Trophies <span className="text-custom-gray">({trophies.length})</span>
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
                placeholder="Search rules"
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
                <SearchIcon />
              </button>
            </div>
          </form>
          <button
            className="bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
            onClick={() => {
              setSelectedTrophie(null);
              setShowTrophieModal(true);
            }}
          >
            <span>
              <PlusIcon />
            </span>
            Add new Trophy
          </button>
        </div>
      </div>
        { loading ? (
          <HandLogoLoader />
        ) : trophies.length > 0 ? (
       (
          <TrophiesTable
            data={trophies}
            currentPage={currentPage}
            onEditClick={(trophy) => {
              setSelectedTrophie(trophy);
              setShowTrophieModal(true);
            }}
            onDeleteClick={(trophyId) => setDeleteId(trophyId)}
          />
        )
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
        onDelete={handleDeleteDevice}
      />

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrvious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}

      <TrophiesModal
        show={showTrophieModal}
        onClose={() => setShowTrophieModal(false)}
        selectedTrophie={selectedTrophie}
        badges={badgeNames}
      />
    </>
  );
};
