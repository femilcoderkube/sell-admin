import React, { useEffect, useState } from "react";
import { PartnersTable } from "./PartnersTable";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePartner,
  fetchPartners,
  setPage,
  setPerPage,
  setSearchTerm,
} from "../../app/features/partners/partnerSlice";
import { AppDispatch, RootState } from "../../app/store";
import { Pagination } from "../ui/Pagination";
import { PlusIcon, SearchIcon } from "../ui";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import PartnerModal from "./PartnerModal";
import { PartnerType } from "../../app/types";
import HandLogoLoader from "../Loader/Loader";
export * from "./PartnersTable";

export const Partner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const {
    partners,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.partner);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerType | null>(null);

  useEffect(() => {
    dispatch(fetchPartners({ page: currentPage, perPage, searchTerm }));
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

  const handleDeletePartner = async () => {
    const resultAction = await dispatch(deletePartner(deleteId));
    if (deletePartner.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(fetchPartners({ page: 1, perPage: perPage, searchTerm: "" }));
    }
  };

  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">
            Partners{" "}
            <span className="text-custom-gray">({partners.length})</span>
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
                placeholder="Search partner name"
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
              setSelectedPartner(null);
              setShowPartnerModal(true);
            }}
          >
            <span>
              <PlusIcon />
            </span>
            Add new Partner
          </button>
        </div>
      </div>
      { loading ? (
          <HandLogoLoader />
        ) : partners.length > 0 ? (
       (
          <PartnersTable
            data={partners}
            currentPage={currentPage}
            onEditClick={partner => {
              setSelectedPartner(partner);
              setShowPartnerModal(true);
            }}
            onDeleteClick={(partnerId) => setDeleteId(partnerId)}
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
        onDelete={handleDeletePartner}
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
      <PartnerModal
        show={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        selectedPartner={selectedPartner}
      />
    </>
  );
};
