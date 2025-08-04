import React, { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLeague,
  fetchLeagueById,
  fetchLeagues,
  setPage,
  toogleleague,
  updateLeague,
} from "../../app/features/league/leagueSlice";

import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

import dotIcon from "../../assets/images/dots.svg";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/eye_icon.svg";
import leagueUser from "../../assets/images/league_use.png";
import { League } from "../../app/types";
import { baseURL } from "../../axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

interface LeagueTableProps {
  currentPage: any;
  leagues: League[];
  onDeleteClick: any;
}

export const LeagueTable: React.FC<LeagueTableProps> = ({
  currentPage,
  leagues,
  onDeleteClick,
}) => {
  const [open, setOpen] = useState(null);
  const [isHidden, setIsHidden] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const role = localStorage.getItem("admin");
  const jsonValue = JSON.parse(role as any);

  const partnerId = window.location.pathname.split("/")[1];
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
    league: "LEAGUE NAME",
    public: "PLAYERS PER TEAM",
    platform: "PLATFORM",
    game: "GAME",
    format: "FORMAT",
    players: "REGISTRATIONS",
    status: "STATUS",
    date: "Ending Date",
    image: "Logo",
    actions: "Actions",
  };

  // Handle delete action
  const handleDelete = (id: string) => {
    // if (window.confirm("Are you sure you want to delete this league?")) {
    // dispatch(deleteLeague(id));
    // dispatch(fetchLeagues({ partnerId: partnerId, page: 1 }));
    // dispatch(setPage(1));
    // }
    onDeleteClick(id);
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
      id="league_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(null);
      }}
    >
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[120px]">
              {thead.league}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.public}
              {/* {thead.public} */}
            </th>
            {/* <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.platform}
            </th> */}
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell">
              {thead.game}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden lg:table-cell">
              {thead.format}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.players}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell">
              {thead.status}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden lg:table-cell">
              {thead.date}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.image}
            </th>
            <th className="py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide text-center min-w-[100px]">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {leagues.map((league, index) => (
            <tr
              key={league._id || index}
              className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
            >
              <td className="text-sm py-4 px-3 font-medium text-gray-100">
                {(currentPage - 1) * 10 + index + 1}
              </td>
              <td className="text-sm py-4 px-3 font-medium text-white min-w-[120px]">
                {league.title}
              </td>
              {/* <td
                className={`text-[1.0625rem] py-3 ${
                  league.isActive ? "yes_active" : "no_active"
                }`}
              >
                <span className="py-[0.35rem] px-[0.55rem] rounded-[0.54rem] inline-block">
                  {league.isActive ? "Yes" : "No"}
                </span>
              </td> */}
              <td className="text-center text-sm py-4 px-3 text-gray-200 hidden sm:table-cell">{`${league.playersPerTeam} vs ${league.playersPerTeam}`}</td>
              <td className="text-center text-sm py-4 px-3 text-gray-200 hidden md:table-cell">
                {league?.game?.name}
              </td>
              <td className="text-center text-sm py-4 px-3 text-gray-200 hidden lg:table-cell">
                {league.format}
              </td>
              <td className="text-center text-sm py-4 px-3 font-semibold text-blue-400 hidden sm:table-cell">
                {league.totalRegistrations}
              </td>
              <td className="text-center text-sm py-4 px-3 hidden md:table-cell">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    new Date(league.endDate) > new Date()
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {new Date(league.endDate) > new Date()
                    ? "Not finished"
                    : "Finished"}
                </span>
              </td>
              <td className="text-center text-xs py-4 px-3 text-gray-400 hidden lg:table-cell">
                {new Date(league.endDate).toLocaleString()}
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell">
                <span className="inline-block bg-gray-600/50 p-2 rounded-lg shadow-sm">
                  <img
                    src={`${baseURL}/api/v1/${league.logo}`}
                    alt={league.title}
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </span>
              </td>
              <td className="text-sm py-4 px-3 relative">
                <div className="flex space-x-2 justify-center items-center">
                  {jsonValue?.role !== "Operator" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(open === league._id ? null : league._id);
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <img
                        src={dotIcon}
                        alt="Menu"
                        style={{ width: "1.26rem" }}
                      />
                    </button>
                  )}
                  {open === league?._id && (
                    <div
                      className="absolute right-0 z-50 mt-10 w-52 origin-top-right rounded-xl shadow-2xl ring-1 ring-gray-600 transform transition-all duration-300 ease-out backdrop-blur-sm"
                      style={{
                        background:
                          "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                      }}
                    >
                      <div className="p-2 space-y-0.5">
                        {/* Edit Button */}

                        <button
                          onClick={() =>
                            navigate(
                              `/${partnerId}/leagues/edit/${league._id}`,
                              {
                                state: { league },
                              }
                            )
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
                        >
                          <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                          <span>Edit League</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(league._id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-red-800/30 rounded-lg transition-colors duration-200 group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                          <span>Delete League</span>
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-gray-600/50 my-1.5"></div>

                        {/* Hide Toggle */}
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2">
                            {!league?.isHidden ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs font-medium text-gray-100">
                              Publish League
                            </span>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={league?.isHidden}
                              onChange={async () => {
                                await dispatch(
                                  toogleleague({
                                    id: league._id,
                                    isHidden: !league?.isHidden,
                                  })
                                );
                                dispatch(
                                  fetchLeagues({
                                    partnerId: partnerId,
                                    page: 1,
                                    perPage: 0,
                                    searchTerm: "",
                                  })
                                );
                              }}
                            />
                            <div className="relative w-10 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400/50 rounded-full peer peer-checked:after:translate-x-[18px] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-200 after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-blue-400"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  <Link
                    to={`/${partnerId}/leagues/${league._id}`}
                    state={league}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <img
                      src={viewIcon}
                      alt="Delete"
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
