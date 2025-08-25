import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { TableHashIcon } from "../ui";
import { Popup } from "./PopupModal";

interface IPopupsProps {
  data: Popup[];
  currentPage: number;
  onEditClick: (selectedPopup: Popup) => void;
  onDeleteClick: (popupId: string) => void;
}

export const PopupsTable: React.FC<IPopupsProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    title: "Title",
    description: "Description",
    expireDateTime: "Expiration Date",
    status: "Status",
    actions: "Actions",
  };

  const tdetail = data.map((popup, key) => ({
    id: popup._id,
    key: (currentPage - 1) * 10 + key + 1,
    title: popup.title,
    description: popup.description,
    expireDateTime: new Date(popup.expireDateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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
                <span>{tdetail.title}</span>
              </td>
              <td className="text-sm py-4 px-3 text-gray-200 hidden md:table-cell min-w-[200px]">
                <div className="max-w-xs">
                  <p className="line-clamp-2 text-gray-300 leading-relaxed">
                    {tdetail.description}
                  </p>
                </div>
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell min-w-[150px]">
                <span>{tdetail.expireDateTime}</span>
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell min-w-[100px]">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    tdetail.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {tdetail.status.charAt(0).toUpperCase() +
                    tdetail.status.slice(1)}
                </span>
              </td>
              <td className="text-sm py-4 px-3">
                <div className="flex space-x-2 justify-center items-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => onEditClick(data[index])}
                    title="Edit popup"
                  >
                    {tdetail.actions.edit}
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => onDeleteClick(tdetail.id)}
                    title="Delete popup"
                  >
                    {tdetail.actions.delete}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
