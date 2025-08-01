import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/eye_icon.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { deleteUser, updateUser } from "../../app/features/users/usersSlice";
import { Link } from "react-router";

interface UsersTableProps {
  users: any[];
  loading: boolean;
  error: string | null;
  onEditClick: (user: any) => void;
  onDeleteClick: (id: string) => void;
  currentPage: any;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
  onEditClick,
  onDeleteClick,
  currentPage,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (id: string) => {
    onDeleteClick(id);
  };

  const handleEdit = (user: any) => {
    onEditClick(user);
  };

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
    mobile: "Mobile",
    ip_address: "IP Address",
    actions: "Actions",
  };

  return (
    <div
      id="league_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      {/* {loading && <div className="text-white">Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>} */}
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
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell">
              {thead.mobile}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden xl:table-cell">
              {thead.ip_address}
            </th>
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[120px]">
              {thead.actions}
            </th>
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
                  {user.username}
                </td>
                <td className="text-sm py-4 px-3 text-gray-200 hidden md:table-cell min-w-[180px] truncate">
                  {user.email}
                </td>
                <td className="text-sm py-4 px-3 hidden sm:table-cell">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : user.role === "operator"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="text-xs py-4 px-3 text-gray-400 hidden lg:table-cell">
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleString()
                    : "-"}
                </td>
                <td className="text-sm py-4 px-3 text-gray-200 hidden md:table-cell">
                  {user.phone || "-"}
                </td>
                <td className="text-sm py-4 px-3 text-gray-400 font-mono hidden xl:table-cell">
                  {user.ipAddress || "-"}
                </td>
                <td className="text-sm py-4 px-3">
                  <div className="flex space-x-2 justify-center items-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        style={{ width: "1.26rem" }}
                      />
                    </button>
                    <Link
                      to={`/user-controll/all-user/${user._id}`}
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
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center text-gray-400 py-8 bg-gray-800/50"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-4xl">👤</div>
                  <div className="text-lg font-medium">No users found</div>
                  <div className="text-sm text-gray-500">
                    Try adjusting your search criteria
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
