import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLeague,
  fetchLeagueById,
} from "../../app/features/league/leagueSlice";

import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import leagueUser from "../../assets/images/league_use.png";
import { League } from "../../app/types";

interface LeagueTableProps {
  leagues: League[];
}

export const LeagueTable: React.FC<LeagueTableProps> = ({ leagues }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    public: "PUBLIC",
    device: "DEVICE",
    game: "GAME",
    setting: "SETTING",
    players: "PLAYERS",
    status: "STATUS",
    date: "Ending Date",
    image: "Image",
    actions: "Actions",
  };

  // Handle delete action
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this league?")) {
      dispatch(deleteLeague(id));
    }
  };

  // Handle view action
  const handleView = (id: string) => {
    dispatch(fetchLeagueById(id)).then((result) => {
      if (fetchLeagueById.fulfilled.match(result)) {
        navigate(`/leagues/${id}`);
      }
    });
  };

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
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.public}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.device}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.game}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.setting}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.players}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.status}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.date}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.image}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
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
              <td className="text-[1.0625rem] py-3">{league.name}</td>
              <td
                className={`text-[1.0625rem] py-3 ${
                  league.isFeatured ? "yes_active" : "no_active"
                }`}
              >
                <span className="py-[0.35rem] px-[0.55rem] rounded-[0.54rem] inline-block">
                  {league.isFeatured ? "Yes" : "No"}
                </span>
              </td>
              <td className="text-[1.0625rem] py-3">{league.device}</td>
              <td className="text-[1.0625rem] py-3">{league.game}</td>
              <td className="text-[1.0625rem] py-3">
                {league.isSolo ? "Solo" : "Team"}
              </td>
              <td className="text-[1.0625rem] py-3">{league.totalPlayers}</td>
              <td className="text-[1.0625rem] py-3">
                {new Date(league.endDate) > new Date()
                  ? "Not finished"
                  : "Finished"}
              </td>
              <td className="text-[1.0625rem] py-3">
                {new Date(league.endDate).toLocaleString()}
              </td>
              <td className="text-[1.0625rem] py-3">
                <span className="inline-block bg-input-color p-[0.4rem] rounded-[0.42rem]">
                  <img
                    src={league.bannerImage || leagueUser}
                    alt={league.name}
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </span>
              </td>
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <Link
                  to={`/leagues/edit/${league._id}`}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />
                </Link>
                <button
                  onClick={() => handleDelete(league._id!)}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    style={{ width: "1.26rem" }}
                  />
                </button>
                <button
                  onClick={() => handleView(league._id!)}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
