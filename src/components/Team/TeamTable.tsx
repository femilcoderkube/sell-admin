import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Edit, Trash2 } from "lucide-react";
import dotIcon from "../../assets/images/dots.svg";

import viewIcon from "../../assets/images/eye_icon.svg";
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
    <div id="team_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.teamName}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.shortName}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.region}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.members}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.logo}
            </th>
            <th className="py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr
              key={team._id || index}
              className="border-b border-light-border"
            >
              <td className="text-[1.0625rem] py-3">
                {(currentPage - 1) * 10 + index + 1}
              </td>
              <td className="text-[1.0625rem] py-3">{team.teamName}</td>
              <td className="text-center text-[1.0625rem] py-3">
                {team.teamShortName}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {team.region}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {team.members.length}
              </td>
              <td className="text-[1.0625rem] py-3">
                <span className="inline-block bg-input-color p-[0.4rem] rounded-[0.42rem]">
                  <img
                    src={`${baseURL}/api/v1/${team.logoImage}`}
                    alt={team.teamName}
                    style={{ width: "2rem", height: "2rem" }}
                    onError={(e) => {
                      e.currentTarget.src = "/path/to/fallback-image.png"; // Fallback image
                    }}
                  />
                </span>
              </td>
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onEditClick(team);
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img src={editIcon} alt="View" style={{ width: "1.26rem" }} />
                </button>
                <button
                  onClick={() => onDeleteClick(team._id)}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img
                    src={deleteIcon}
                    alt="View"
                    style={{ width: "1.26rem" }}
                  />
                </button>
                <button
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
