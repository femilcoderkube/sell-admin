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
    <div id="league_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.league}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.public}
              {/* {thead.public} */}
            </th>
            {/* <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.platform}
            </th> */}
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.game}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.format}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.players}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.status}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.date}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.image}
            </th>
            <th className="py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {leagues.map((league, index) => (
            <tr
              key={league._id || index}
              className="border-b border-light-border"
            >
              <td className="text-[1.0625rem] py-3">{index + 1}</td>
              <td className="text-[1.0625rem] py-3">{league.title}</td>
              {/* <td
                className={`text-[1.0625rem] py-3 ${
                  league.isActive ? "yes_active" : "no_active"
                }`}
              >
                <span className="py-[0.35rem] px-[0.55rem] rounded-[0.54rem] inline-block">
                  {league.isActive ? "Yes" : "No"}
                </span>
              </td> */}
              <td className="text-center text-[1.0625rem] py-3">{`${league.playersPerTeam} vs ${league.playersPerTeam}`}</td>
              <td className="text-center text-[1.0625rem] py-3">
                {league?.game?.name}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {league.format}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {league.totalRegistrations}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {new Date(league.endDate) > new Date()
                  ? "Not finished"
                  : "Finished"}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {new Date(league.endDate).toLocaleString()}
              </td>
              <td className="text-[1.0625rem] py-3">
                <span className="inline-block bg-input-color p-[0.4rem] rounded-[0.42rem]">
                  <img
                    src={`${baseURL}/api/v1/${league.logo}`}
                    alt={league.title}
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </span>
              </td>
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <button
                  onClick={() =>
                    setOpen(open === league._id ? null : league._id)
                  }
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img src={dotIcon} alt="Menu" style={{ width: "1.26rem" }} />
                </button>
                {open === league?._id && (
                  <div
                    className="absolute right-0 z-50 mt-10 w-52 origin-top-right rounded-xl shadow-2xl ring-1 ring-gray-700 transform transition-all duration-300 ease-out"
                    style={{
                      background:
                        "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                    }}
                  >
                    <div className="p-2 space-y-0.5">
                      {/* Edit Button */}
                      <button
                        onClick={() =>
                          navigate(`/${partnerId}/leagues/edit/${league._id}`, {
                            state: { league },
                          })
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
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img
                    src={viewIcon}
                    alt="Delete"
                    style={{ width: "1.26rem" }}
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
