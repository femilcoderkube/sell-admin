import React, { useEffect, useState } from "react";
import { DeviceTable } from "./DeviceTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import DeviceModal from "./DeviceModal";
import {
  deleteDevice,
  fetchDevices,
  setPage,
  setSearchTerm,
} from "../../app/features/devices/deviceSlice";
import { PlusIcon, SearchIcon } from "../ui";
import { Pagination } from "../ui/Pagination";
import { DeviceType } from "../../app/types";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import HandLogoLoader from "../Loader/Loader";

export * from "./DeviceTable";

export const Device: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const [deleteId, setDeleteId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { devices, loading, currentPage, perPage, totalCount, searchTerm } =
    useSelector((state: RootState) => state.device);

  useEffect(() => {
    dispatch(fetchDevices({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  useEffect(() => {
    if (selectedDevice) {
      setIsModalOpen(true);
    }
  }, [selectedDevice]);

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

  const handleDeleteDevice = async () => {
    const resultAction = await dispatch(deleteDevice(deleteId));
    if (deleteDevice.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(fetchDevices({ page: 1, perPage: 10, searchTerm: "" }));
    }
  };

  const totalPages = Math.ceil(totalCount / perPage);
  return (
    <>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">
            Devices <span className="text-custom-gray">({devices.length})</span>
          </h3>
        </div>
        <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <form action="" className=" w-full sm:w-[20.8rem]">
            <div className="relative">
              <input
                className="text-white font-medium block  bg-input-color w-full sm:w-[20.8rem] text-gray-700 border rounded-[0.625rem] py-[0.6rem] pl-[2.5rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
                placeholder="Search devices"
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
          <div
            className="bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
            onClick={() => setIsModalOpen(true)}
          >
            <span>
              <PlusIcon />
            </span>
            Add a device
          </div>
        </div>
      </div>
      { loading ? (
          <HandLogoLoader />
        ) :devices.length > 0 ? (
        (
          <DeviceTable
            data={devices}
            currentPage={currentPage}
            onEditClick={(device) => setSelectedDevice(device)}
            onDeleteClick={(deviceId) => setDeleteId(deviceId)}
          />
        )
      ) : (
        <div className="text-custom-gray flex items-center justify-center h-20">
          No data found.
        </div>
      )}

      <DeviceModal
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        selectedDevice={selectedDevice}
      />

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
    </>
  );
};
