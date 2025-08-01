import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import { TableHashIcon } from "../ui";
import { TrophieType } from "../../app/types";

interface ITrophiesProps {
  data: TrophieType[];
  currentPage: number;
  onEditClick: (selectedTrophie: TrophieType) => void;
  onDeleteClick: (trophieId: string) => void;
}

export const TrophiesTable: React.FC<ITrophiesProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    badgeID: "Badge",
    position: "Position",
    points: "Points",
    prize: "Prize",
    actions: "Actions",
  };

  console.log("data", data);

  const tdetail = data.map((trophie, key) => ({
    id: trophie?._id,
    key: (currentPage - 1) * 10 + key + 1,
    badgeID: trophie?.badge?.name,
    position: trophie?.position,
    points: trophie?.points,
    prize: trophie?.prize,
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: (
        <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
      ),
      view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
    },
  }));

  return (
    <div
      id="trophies_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[100px]">
              {thead.badgeID}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.position}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell">
              {thead.points}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden lg:table-cell">
              {thead.prize}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[100px]">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {tdetail.map((tdetail, index) => {
            return (
              <tr
                key={tdetail.key}
                className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
              >
                <td className="text-sm py-4 px-3 font-medium text-gray-100">
                  {tdetail.key}
                </td>
                <td className="text-sm py-4 px-3 font-medium text-white min-w-[100px]">
                  <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                    {tdetail.badgeID}
                  </span>
                </td>
                <td className="text-sm py-4 px-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        tdetail.position === "1st" || tdetail.position === 1
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : tdetail.position === "2nd" || tdetail.position === 2
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          : tdetail.position === "3rd" || tdetail.position === 3
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {typeof tdetail.position === "string"
                        ? tdetail.position.charAt(0)
                        : tdetail.position}
                    </span>
                    <span className="font-medium">{tdetail.position}</span>
                  </div>
                </td>
                <td className="text-sm py-4 px-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="font-semibold text-green-400">
                      {tdetail.points}
                    </span>
                    <span className="text-xs text-gray-400">pts</span>
                  </div>
                </td>
                <td className="text-sm py-4 px-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="font-semibold text-yellow-400">
                      {tdetail.prize}
                    </span>
                  </div>
                </td>
                <td className="text-sm py-4 px-3">
                  <div className="flex space-x-2 justify-center items-center">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                      onClick={() => onEditClick(data[index])}
                      title="Edit trophy"
                    >
                      {tdetail.actions.edit}
                    </button>
                    <button
                      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                      onClick={() => onDeleteClick(tdetail.id)}
                      title="Delete trophy"
                    >
                      {tdetail.actions.delete}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
