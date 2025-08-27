import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { TableHashIcon } from "../ui";
import { Popup } from "./PopupModal";
import { useDispatch } from "react-redux";
import { fetchPopups, updatePopup } from "../../app/features/popup/popupsSlice";

interface IPopupsProps {
  data: Popup[];
  currentPage: number;
  onEditClick: () => void;
  // onDeleteClick: (popupId: string) => void;
}

export const PopupsTable: React.FC<IPopupsProps> = ({
  data,
  currentPage,
  onEditClick,
  // onDeleteClick,
}) => {
  const dispatch = useDispatch();

  const thead = {
    id: <TableHashIcon />,
    title: "Title",
    description: "Description",
    expireDateTime: "Expiration Date",
    status: "Status",
    actions: "Actions",
  };

  const handleStatusToggle = async (popup: Popup) => {
    const newStatus = popup.status === "active" ? "inactive" : "active";
    try {
      const popupData: Popup = {
        titleEn: popup.titleEn,
        titleAr: popup.titleAr,
        descriptionEn: popup.descriptionEn,
        descriptionAr: popup.descriptionAr,
        expireDateTime: popup.expireDateTime,
        status: newStatus,
      };
      const resultAction = await dispatch(
        updatePopup({ id: popup._id!, popup: popupData })
      );
      if (updatePopup.fulfilled.match(resultAction)) {
        dispatch(fetchPopups({ page: 1, perPage: "", searchTerm: "" }));
      }
    } catch (error) {
      console.error("Error updating popup status:", error);
      alert("Failed to update status");
    }
  };

  const tdetail = [data].map((popup, key) => ({
    id: popup._id,
    key: (currentPage - 1) * 10 + key + 1,
    titleEn: popup.titleEn,
    descriptionEn: popup.descriptionEn,
    expireDateTime: new Date(popup.expireDateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour12: true,
    }),
    status: popup.status,
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: (
        <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
      ),
    },
  }));

  return (
    <div
      id="popups_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[120px]">
              {thead.title}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell min-w-[200px]">
              {thead.description}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell min-w-[150px]">
              {thead.expireDateTime}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell min-w-[100px]">
              {thead.status}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[100px]">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {tdetail.map((tdetail, index) => (
            <tr
              key={tdetail.key}
              className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
            >
              <td className="text-sm py-4 px-3 font-medium text-gray-100">
                {tdetail.key}
              </td>
              <td className="text-sm py-4 px-3 font-medium text-white min-w-[120px]">
                <span>{tdetail.titleEn}</span>
              </td>
              <td className="text-sm py-4 px-3 text-gray-200 hidden md:table-cell min-w-[200px]">
                <div className="max-w-xs">
                  <p className="line-clamp-2 text-gray-300 leading-relaxed">
                    {tdetail.descriptionEn}
                  </p>
                </div>
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell min-w-[150px]">
                <span>{tdetail.expireDateTime}</span>
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell min-w-[100px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tdetail.status === "active"}
                    onChange={() => handleStatusToggle(data[index])}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ml-2 text-xs font-medium text-gray-300">
                    {/* {tdetail.status.charAt(0).toUpperCase() +
                      tdetail.status.slice(1)} */}
                    Publish
                  </span>
                </label>
              </td>
              <td className="text-sm py-4 px-3">
                <div className="flex space-x-2 justify-center items-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => onEditClick()}
                    title="Edit popup"
                  >
                    {tdetail.actions.edit}
                  </button>
                  {/* <button
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => onDeleteClick(tdetail.id)}
                    title="Delete popup"
                  >
                    {tdetail.actions.delete}
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
