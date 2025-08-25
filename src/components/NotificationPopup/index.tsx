import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { PlusIcon, SearchIcon } from "../ui";

import PopupModal, { Popup } from "./PopupModal";
import HandLogoLoader from "../Loader/Loader";
import { PopupsTable } from "./PopupsTable";
import { deletePopup, fetchPopups } from "../../app/features/popup/popupsSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

export const NotificationPopup: React.FC = ({ title }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const {
    popups,
    loading,
    currentPage,
    perPage,

    searchTerm,
  } = useSelector((state: RootState) => state.popup);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null);

  useEffect(() => {
    dispatch(fetchPopups({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  useEffect(() => {
    if (deleteId) {
      setIsDeleteModalOpen(true);
    }
  }, [deleteId]);

  const handleDeletePopup = async () => {
    const resultAction = await dispatch(deletePopup(deleteId));
    if (deletePopup.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(
        fetchPopups({ page: 1, perPage: perPage, searchTerm: searchTerm })
      );
    }
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
                  ({popups.length})
                </span>
              </h3>
            </div>
          </div>

          <div className="hidden lg:block">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              onClick={() => {
                setSelectedPopup(null);
                setShowPopupModal(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : popups.length > 0 ? (
        <PopupsTable
          data={popups}
          currentPage={currentPage}
          onEditClick={(popup) => {
            setSelectedPopup(popup);
            setShowPopupModal(true);
          }}
          onDeleteClick={(popupId) => setDeleteId(popupId)}
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
        onDelete={handleDeletePopup}
      />

      <PopupModal
        show={showPopupModal}
        onClose={() => setShowPopupModal(false)}
        selectedPopup={selectedPopup}
      />
    </>
  );
};
