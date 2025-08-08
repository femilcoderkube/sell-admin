import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Edit, Trash2 } from "lucide-react";
import dotIcon from "../../assets/images/dots.svg";

import viewIcon from "../../assets/images/user_icon.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import editIcon from "../../assets/images/Edit.svg";

import { baseURL } from "../../axios";
import { AppDispatch } from "../../app/store";

interface TeamTableProps {
  currentPage: number;
  teams: any[];
  onEditClick: (team: string) => void;
  onDeleteClick: (teamId: string) => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({
  currentPage,
  teams,
  onEditClick,
  onDeleteClick,
}) => {
  const [open, setOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const thead = {
    id: (
      <svg
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.45455 8.53846H20M4 15.4615H18.5455M16.8 3L13.0182 21M10.9818 3L7.2 21"
          stroke="#6B7897"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    teamName: "TEAM NAME",
    shortName: "SHORT NAME",
    region: "REGION",
    members: "MEMBERS",
    logo: "LOGO",
    actions: "ACTIONS",
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      id="team_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[150px]">
              {thead.teamName}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.shortName}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell">
              {thead.region}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.members}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell">
              {thead.logo}
            </th>
            <th className="py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide text-center min-w-[120px]">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {teams.map((team, index) => (
            <tr
              key={team._id || index}
              className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
            >
              <td className="text-sm py-4 px-3 font-medium text-gray-100">
                {(currentPage - 1) * 10 + index + 1}
              </td>
              <td className="text-sm py-4 px-3 font-medium text-white min-w-[150px]">
                {team.teamName}
              </td>
              <td className="text-center text-sm py-4 px-3 hidden sm:table-cell">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                  {team.teamShortName}
                </span>
              </td>
              <td className="text-center text-sm py-4 px-3 text-gray-200 hidden md:table-cell">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                  {team.region}
                </span>
              </td>
              <td className="text-center text-sm py-4 px-3 font-semibold text-purple-400 hidden sm:table-cell">
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold">
                  {team.members.length}
                </span>
              </td>
              <td className="text-sm py-4 px-3 hidden md:table-cell">
                <span className="inline-block bg-gray-600/50 p-2 rounded-lg shadow-sm ring-2 ring-gray-500/20">
                  {team.logoImage ? (
                    <img
                      src={`${baseURL}/api/v1/${team.logoImage}`}
                      alt={team.teamName}
                      style={{ width: "2rem", height: "2rem" }}
                      // onError={(e) => {
                      //   e.currentTarget.src = "/path/to/fallback-image.png"; // Fallback image
                      // }}
                    />
                  ) : (
                    <div
                      className=" bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ width: "2rem", height: "2rem" }}
                    >
                      {team.teamName.charAt(0)}
                    </div>
                  )}
                </span>
              </td>
              <td className="text-sm py-4 px-3">
                <div className="flex space-x-2 justify-center items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onEditClick(team);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <img
                      src={editIcon}
                      alt="View"
                      style={{ width: "1.26rem" }}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteClick(team?._id)}
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <img
                      src={deleteIcon}
                      alt="View"
                      style={{ width: "1.26rem" }}
                    />
                  </button>
                  <Link
                    to={`/user-controll/all-team/${team?._id}`}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <img
                      src={viewIcon}
                      alt="View"
                      style={{ width: "1.26rem" }}
                    />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
