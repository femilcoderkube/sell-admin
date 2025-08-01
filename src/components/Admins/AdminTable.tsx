import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import { TableHashIcon } from "../ui";
import { AdminType } from "../../app/types";

interface IAdminProps {
  data: AdminType[];
  currentPage: number;
  onEditClick: (selectedAdmin: AdminType) => void;
  onDeleteClick: (adminId: string) => void;
  handleViewClick: (adminAccess: string) => void;
}

export const AdminTable: React.FC<IAdminProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
  handleViewClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    userName: "User Name",
    role: "Role",
    email: "Email",
    phoneNumber: "Phone Number",
    isActive: "Active",

    actions: "Actions",
  };

  const tdetail = data.map((admin, key) => ({
    id: admin._id,
    key: (currentPage - 1) * 10 + key + 1,
    userName: admin.userName,
    role: admin.role,
    email: admin.email,
    phoneNumber: admin.phoneNumber,
    adminAccess: admin.adminAccess,
    isActive: admin.isActive ? "Yes" : "No",
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: (
        <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
      ),
      view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
    },
  }));

  return (
    <div
      id="admin_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[120px]">
              {thead.userName}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.role}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden md:table-cell min-w-[180px]">
              {thead.email}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden lg:table-cell">
              {thead.phoneNumber}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.isActive}
            </th>
            {/* <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.ipAddress}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.deviceType}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.adminAccess}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.lastLoginDate}
            </th> */}
            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[140px]">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {tdetail.map((tdetail, index) => (
            <tr
              key={tdetail.key}
              className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
            >
              <td className="text-sm py-4 px-3 font-medium text-gray-100">
                {tdetail.key}
              </td>
              <td className="text-sm py-4 px-3 font-medium text-white min-w-[120px]">
                {tdetail.userName}
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    tdetail.role === "Superadmin"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : tdetail.role === "Admin"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {tdetail.role}
                </span>
              </td>
              <td className="text-sm py-4 px-3 text-gray-200 hidden md:table-cell min-w-[180px] truncate">
                {tdetail.email}
              </td>
              <td className="text-sm py-4 px-3 text-gray-200 hidden lg:table-cell">
                {tdetail.phoneNumber}
              </td>
              <td className="text-sm py-4 px-3 hidden sm:table-cell">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tdetail.isActive === "Active" || tdetail.isActive === true
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {typeof tdetail.isActive === "boolean"
                    ? tdetail.isActive
                      ? "Active"
                      : "Inactive"
                    : tdetail.isActive}
                </span>
              </td>
              {/* <td className="text-[1.0625rem] py-3">{tdetail.ipAddress}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.deviceType}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.adminAccess}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.lastLoginDate}</td> */}
              <td className="text-sm py-4 px-3">
                <div className="flex space-x-2 justify-center items-center">
                  {tdetail.role != "Superadmin" && (
                    <button
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                      onClick={() => onEditClick(data[index])}
                      title="Edit admin"
                    >
                      {tdetail.actions.edit}
                    </button>
                  )}
                  <button
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => onDeleteClick(tdetail.id)}
                    title="Delete admin"
                  >
                    {tdetail.actions.delete}
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => handleViewClick(tdetail.adminAccess)}
                    title="View admin details"
                  >
                    {tdetail.actions.view}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
