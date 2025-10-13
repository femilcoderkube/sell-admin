import React from "react";
import deleteIcon from "../../assets/images/trash_can.svg";
import { baseURL } from "../../axios";

interface TeamTableProps {
  currentPage: number;
  participants: any[];
  onleaveTeam: () => void;
  activeTab: any;
}

export const ParticipantsTable: React.FC<TeamTableProps> = ({
  currentPage,
  participants,
  onleaveTeam,
  activeTab,
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
    teamName: "Name",
    teamShortName: "Short Name",
    logo: "LOGO",
    actions: "ACTIONS",
  };

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
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[120px]">
              {thead.teamName}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell min-w-[180px]">
              {thead.teamShortName}
            </th>

            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.logo}
            </th>
            {activeTab !== "incomplete" && (
              <th className="py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide text-center min-w-[100px]">
                {thead.actions}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {participants?.map((team, index) => {
            return (
              <tr
                key={team._id || index}
                className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
              >
                <td className="text-sm py-4 px-3 font-medium text-gray-100">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td className="text-sm py-4 px-3 font-medium text-white min-w-[120px]">
                  {team?.team?.teamName}
                </td>

                <td className="text-center text-sm py-4 px-3 text-gray-200 hidden md:table-cell min-w-[180px] truncate">
                  {team?.team?.teamShortName}
                </td>

                <td className="text-sm py-4 px-3 hidden sm:table-cell">
                  <span className="inline-block bg-gray-600/50 p-2 rounded-lg shadow-sm ring-2 ring-gray-500/20">
                    <img
                      src={`${baseURL}/api/v1/${team?.team?.logoImage}`}
                      alt={team.teamName}
                      style={{ width: "2rem", height: "2rem" }}
                      className="rounded-full object-cover"
                    />
                  </span>
                </td>
                {activeTab !== "incomplete" && (
                  <td className="text-sm py-4 px-3">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => {
                          onleaveTeam(team?._id);
                        }}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                        title="Remove from team"
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{ width: "1.26rem" }}
                        />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
