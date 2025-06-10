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
    <div id="admin_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full ">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.userName}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.role}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.email}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.phoneNumber}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
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
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {tdetail.map((tdetail, index) => (
            <tr key={tdetail.key} className="border-b border-light-border">
              <td className="text-[1.0625rem] py-3">{tdetail.key}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.userName}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.role}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.email}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.phoneNumber}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.isActive}</td>
              {/* <td className="text-[1.0625rem] py-3">{tdetail.ipAddress}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.deviceType}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.adminAccess}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.lastLoginDate}</td> */}
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
               {tdetail.role != "Superadmin" &&  <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  onClick={() => onEditClick(data[index])}
                >
                  {tdetail.actions.edit}
                </button>}
                <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  onClick={() => onDeleteClick(tdetail.id)}
                >
                  {tdetail.actions.delete}
                </button>
                <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  onClick={() => handleViewClick(tdetail.adminAccess)}
                >
                  {tdetail.actions.view}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
