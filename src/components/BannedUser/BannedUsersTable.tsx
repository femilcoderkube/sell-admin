import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { updateUser } from "../../app/features/users/usersSlice";
import { User } from "../../app/types";
import deleteIcon from "../../assets/images/trash_can.svg";

interface BannedUsersTableProps {
  activeTab: any;
  users: any[];
  currentPage: any;
  loading: boolean;
  error: string | null;
  handleUnbanUser: (user: User) => void;
}

export const BannedUsersTable: React.FC<BannedUsersTableProps> = ({
  activeTab,
  users,
  currentPage,
  loading,
  error,
  handleUnbanUser,
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
    username: "Username",
    email: "Email",
    role: "Role",
    lastLoginDate: "Last Login Date",
    // mobile: "Mobile",
    ip_address: "IP Address",
    status: "Action", // Changed from "Ban Status" to "Action"
  };

  return (
    <div
      id="league_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      {loading && (
        <div className="text-white mb-4 px-4 py-2 bg-blue-900/30 rounded-lg border border-blue-500/30">
          Loading users...
        </div>
      )}
      {error && (
        <div className="text-red-400 mb-4 px-4 py-2 bg-red-900/30 rounded-lg border border-red-500/30">
          {error}
        </div>
      )}
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[120px]">
              {thead.username}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell min-w-[180px]">
              {thead.email}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.role}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden lg:table-cell">
              {thead.lastLoginDate}
            </th>
            {/* <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.mobile}
            </th> */}
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden xl:table-cell">
              {thead.ip_address}
            </th>
            {activeTab === "bannedUsers" && (
              <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[100px]">
                {thead.status}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users && users.length > 0 ? (
            users.map((user, idx) => (
              <tr
                key={user._id}
                className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
              >
                <td className="text-sm py-4 px-3 font-medium text-gray-100">
                  {(currentPage - 1) * 10 + idx + 1}
                </td>
                <td className="text-sm py-4 px-3 font-medium text-white min-w-[120px]">
                  {user?.user?.username}
                </td>
                <td className="text-sm py-4 px-3 text-gray-200 hidden md:table-cell min-w-[180px] truncate">
                  {user?.user?.email}
                </td>
                <td className="text-sm py-4 px-3 hidden sm:table-cell">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      user?.user?.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : user?.user?.role === "operator"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {user?.user?.role}
                  </span>
                </td>
                <td className="text-xs py-4 px-3 text-gray-400 hidden lg:table-cell">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "-"}
                </td>
                {/* <td className="text-[1.0625rem] py-3">{user.phone || "-"}</td> */}
                <td className="text-sm py-4 px-3 text-gray-400 font-mono hidden xl:table-cell">
                  {user.ipAddress || "-"}
                </td>
                {activeTab === "bannedUsers" && (
                  <td className="text-sm py-4 px-3 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleUnbanUser(user)}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                        title="Unban user"
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
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="text-center text-gray-400 py-8 bg-gray-800/50"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-4xl">🚫</div>
                  <div className="text-lg font-medium">No users found</div>
                  <div className="text-sm text-gray-500">
                    No banned users or try adjusting your search criteria
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
