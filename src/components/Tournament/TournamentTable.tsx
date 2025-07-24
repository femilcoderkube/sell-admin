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

interface TournamentCardProps {
  currentPage: number;
  tournaments: Tournament[];
  onDeleteClick: (id: string) => void;
}

export const TournamentTable: React.FC<TournamentCardProps> = ({
  currentPage,
  tournaments,
  onDeleteClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const role = localStorage.getItem("admin");
  const jsonValue = JSON.parse(role as string);
  const partnerId = window.location.pathname.split("/")[1];

  const handleDelete = (id: string) => {
    onDeleteClick(id);
  };

  return (
    <div id="tournament_cards" className="pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tournaments.map((tournament, index) => (
          <div
            key={tournament._id || index}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-xl hover:shadow-2xl border border-slate-600/30 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-blue-400/40"
          >
            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  new Date(tournament.endDate) > new Date()
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {new Date(tournament.endDate) > new Date() ? "ACTIVE" : "ENDED"}
              </span>
            </div>

            <div className="relative p-6 text-white flex flex-col gap-3">
              {/* Card Header: Logo and Title */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={`${baseURL}/api/v1/${tournament.logo}`}
                    alt={tournament.title}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-600/50 shadow-lg group-hover:border-blue-400/50 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-blue-300 transition-colors duration-300">
                    {tournament.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    Tournament #{(currentPage - 1) * 10 + index + 1}
                  </p>
                </div>
              </div>

              {/* Card Body: Tournament Details */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                      Prizepool
                    </div>
                    <div className="text-sm font-bold text-white">
                      {tournament?.prizepool}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                      Registrations
                    </div>
                    <div className="text-sm font-bold text-white">
                      {tournament?.totalRegistrations || 0}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                      Game
                    </div>
                    <div className="text-sm font-bold text-white">
                      {tournament?.game?.name}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                      Type
                    </div>
                    <div className="text-sm font-bold text-white">
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          tournament?.tournamentType === "Team"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {tournament?.tournamentType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                      Device
                    </div>
                    <div className="text-sm font-bold text-white">
                      {tournament?.platform?.name}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                      Partner
                    </div>
                    <div className="text-sm font-bold text-white">
                      {tournament?.nameEn}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        navigate(
                          `/${partnerId}/tournament/edit/${tournament._id}`,
                          {
                            state: { tournament },
                          }
                        )
                      }
                      className="w-full flex items-center  px-4 py-3 text-sm font-medium text-gray-100 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-xl transition-all duration-200 group/menu border border-transparent hover:border-blue-500/30"
                    >
                      <Edit className="w-4 h-4 text-gray-400 group-hover/menu:text-blue-400 transition-colors" />
                    </button>

                    <button
                      onClick={() => handleDelete(tournament._id)}
                      className="w-full flex items-center  px-4 py-3 text-sm font-medium text-gray-100 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 rounded-xl transition-all duration-200 group/menu border border-transparent hover:border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover/menu:text-red-400 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Tournament ID Badge */}
                {/* <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-mono">
                    {tournament._id?.slice(-6).toUpperCase()}
                  </span>
                </div> */}
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/30 rounded-xl border border-slate-600/20">
                <div className="flex items-center gap-3">
                  {!tournament?.isHidden ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-sm font-medium text-gray-200">
                    Publish
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
                  <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400/50 rounded-full peer peer-checked:after:translate-x-[22px] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-400"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
