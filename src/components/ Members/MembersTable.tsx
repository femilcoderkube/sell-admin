import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import viewIcon from "../../assets/images/user_icon.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import editIcon from "../../assets/images/Edit.svg";

import { baseURL } from "../../axios";

interface TeamTableProps {
  currentPage: number;
  members: any[];
  onleaveTeam: () => void;
}

export const MembersTable: React.FC<TeamTableProps> = ({
  currentPage,
  members,
  onleaveTeam,
}) => {
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
    username: "USERNAME",
    role: "ROLE",
    email: "EMAIL",
    logo: "LOGO",
    actions: "ACTIONS",
  };

  return (
    <div id="team_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.username}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.email}
            </th>
            <th className="text-center py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.role}
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
          {members?.map((team, index) => (
            <tr
              key={team._id || index}
              className="border-b border-light-border"
            >
              <td className="text-[1.0625rem] py-3">
                {(currentPage - 1) * 10 + index + 1}
              </td>
              <td className="text-[1.0625rem] py-3">{team?.user?.username}</td>

              <td className="text-center text-[1.0625rem] py-3">
                {team?.user?.email}
              </td>
              <td className="text-center text-[1.0625rem] py-3">
                {team?.user?.role}
              </td>
              <td className="text-[1.0625rem] py-3">
                <span className="inline-block bg-input-color p-[0.4rem] rounded-[0.42rem]">
                  <img
                    src={`${baseURL}/api/v1/${team?.user?.profilePicture}`}
                    alt={team.teamName}
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </span>
              </td>
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <button
                  onClick={() => {
                    onleaveTeam(team?.user);
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  <img src={editIcon} alt="View" style={{ width: "1.26rem" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
