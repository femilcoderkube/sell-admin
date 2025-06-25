import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { updateUser } from "../../app/features/users/usersSlice";
import { User } from "../../app/types";

interface BannedUsersTableProps {
  users: any[];
  loading: boolean;
  error: string | null;
  onEditClick: (user: User) => void;
}

export const BannedUsersTable: React.FC<BannedUsersTableProps> = ({
  users,
  loading,
  error,
  onEditClick,
}) => {
  console.log("users", users);

  const [updatingUsers, setUpdatingUsers] = useState<string[]>([]);

  const handleUnbanUser = async (user: User) => {
    try {
      // Add user ID to updatingUsers before making the API call
      setUpdatingUsers((prev) => [...prev, user._id]);

      // Set isBanned to false to unban the user
      const updatedUser = { ...user, isBanned: false };

      // Call the onEditClick function with the updated user
      onEditClick(updatedUser);
    } catch (err) {
      console.error("Failed to update user ban status:", err);
    } finally {
      // Remove user ID from updatingUsers after the API call completes
      setUpdatingUsers((prev) => prev.filter((id) => id !== user._id));
    }
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
    status: "Action", // Changed from "Ban Status" to "Action"
  };

  return (
    <div id="league_table" className="pt-3 overflow-y-auto">
      {loading && <div className="text-white mb-4">Loading users...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="table-auto text-white w-[1180px] lg:w-full ">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.username}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.email}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.role}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.lastLoginDate}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.mobile}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.ip_address}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
              {thead.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, idx) => (
              <tr key={user._id} className="border-b border-light-border">
                <td className="text-[1.0625rem] py-3">{idx + 1}</td>
                <td className="text-[1.0625rem] py-3">{user.username}</td>
                <td className="text-[1.0625rem] py-3">{user.email}</td>
                <td className="text-[1.0625rem] py-3">{user.role}</td>
                <td className="text-[1.0625rem] py-3">
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleString()
                    : "-"}
                </td>
                <td className="text-[1.0625rem] py-3">{user.phone || "-"}</td>
                <td className="text-[1.0625rem] py-3">
                  {user.ipAddress || "-"}
                </td>
                <td className="text-[1.0625rem] py-3 text-center">
                  <button
                    className={`bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md ${
                      updatingUsers.includes(user._id)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={updatingUsers.includes(user._id)}
                    onClick={() => handleUnbanUser(user)}
                  >
                    {updatingUsers.includes(user._id)
                      ? "Processing..."
                      : "Unban"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-white py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
