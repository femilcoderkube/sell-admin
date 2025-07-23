import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import dotIcon from "../../assets/images/dots.svg";
import viewIcon from "../../assets/images/eye_icon.svg";
import { Tournament } from "../../app/types";
import { baseURL } from "../../axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  fetchTournaments,
  toggleTournament,
} from "../../app/features/tournament/tournamentSlice";

interface TournamentTableProps {
  currentPage: number;
  tournaments: Tournament[];
  onDeleteClick: (id: string) => void;
}

export const TournamentTable: React.FC<TournamentTableProps> = ({
  currentPage,
  tournaments,
  onDeleteClick,
}) => {
  const [open, setOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const role = localStorage.getItem("admin");
  const jsonValue = JSON.parse(role as string);

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
    tournament: "TOURNAMENT NAME",
    players: "PLAYERS PER TEAM",
    game: "GAME",
    type: "TYPE",
    registrations: "REGISTRATIONS",
    status: "STATUS",
    date: "ENDING DATE",
    image: "LOGO",
    actions: "ACTIONS",
  };

  const handleDelete = (id: string) => {
    onDeleteClick(id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div id="tournament_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.tournament}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.players}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.game}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.type}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.registrations}
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
          {tournaments.map((tournament, index) => (
            <tr
              key={tournament._id || index}
              className="border-b border-light-border"
            >
              <td className="text-[1.0625rem] py-3">
                {(currentPage - 1) * 10 + index + 1}
              </td>
              <td className="text-[1.0625rem] py-3">{tournament.title}</td>
              <td className="text-center text-[1.0625rem] py-3">
                {tournament.tournamentType === "Team"
                  ? `${tournament.minPlayersPerTeam} - ${tournament.maxPlayersPerTeam}`
                  : "1"}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {tournament?.game?.name}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {tournament.tournamentType}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {tournament.totalRegistrations || 0}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {new Date(tournament.endDate) > new Date()
                  ? "Not finished"
                  : "Finished"}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {new Date(tournament.endDate).toLocaleString()}
              </td>
              <td className="text-[1.0625rem] py-3">
                <span className="inline-block bg-input-color p-[0.4rem] rounded-[0.42rem]">
                  <img
                    src={`${baseURL}/api/v1/${tournament.logo}`}
                    alt={tournament.title}
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </span>
              </td>
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                {jsonValue?.role !== "Operator" && (
                  <button
                    onClick={() =>
                      setOpen(open === tournament._id ? null : tournament._id)
                    }
                    style={{
                      background:
                        "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                    }}
                    className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  >
                    <img
                      src={dotIcon}
                      alt="Menu"
                      style={{ width: "1.26rem" }}
                    />
                  </button>
                )}
                {open === tournament?._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 z-50 mt-10 w-52 origin-top-right rounded-xl shadow-2xl ring-1 ring-gray-700 transform transition-all duration-300 ease-out"
                    style={{
                      background:
                        "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                    }}
                  >
                    <div className="p-2 space-y-0.5">
                      <button
                        onClick={() =>
                          navigate(
                            `/${partnerId}/tournament/edit/${tournament._id}`,
                            {
                              state: { tournament },
                            }
                          )
                        }
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
                      >
                        <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        <span>Edit Tournament</span>
                      </button>
                      <button
                        onClick={() => handleDelete(tournament._id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-red-800/30 rounded-lg transition-colors duration-200 group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                        <span>Delete Tournament</span>
                      </button>
                      <div className="h-px bg-gray-600/50 my-1.5"></div>
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2">
                          {!tournament?.isHidden ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs font-medium text-gray-100">
                            Publish Tournament
                          </span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={tournament?.isHidden}
                            onChange={async () => {
                              await dispatch(
                                toggleTournament({
                                  id: tournament._id,
                                  isHidden: !tournament?.isHidden,
                                })
                              );
                              dispatch(
                                fetchTournaments({
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
                  to={`/${partnerId}/tournaments/${tournament._id}`}
                  state={tournament}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
