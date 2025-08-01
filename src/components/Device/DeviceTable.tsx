import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { DeviceType } from "../../app/types";
import { baseURL } from "../../axios";
import { TableHashIcon } from "../ui";

interface IDevicesProps {
  data: DeviceType[];
  currentPage: number;
  onEditClick: (selectedDevice: DeviceType) => void;
  onDeleteClick: (deviceId: string) => void;
}

export const DeviceTable: React.FC<IDevicesProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    name: "Name",

    picture: "Picture",

    actions: "Actions",
  };

  //   const titles1 = [titles];

  const tdetail = data.map((device, key) => ({
    id: device._id,
    key: (currentPage - 1) * 10 + key + 1,
    name: device.name,
    picture: device.logo,
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: (
        <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
      ),
    },
  }));

  return (
    <div
      id="league_table"
      className="pt-3 overflow-x-auto overflow-y-auto rounded-lg shadow-lg"
    >
      <table className="min-w-full table-auto text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide">
              {thead.id}
            </th>
            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[150px]">
              {thead.name}
            </th>

            <th className="text-left py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide hidden sm:table-cell">
              {thead.picture}
            </th>

            <th className="text-center py-4 px-3 text-gray-300 uppercase text-sm font-semibold tracking-wide min-w-[100px]">
              {thead.actions}
            </th>
            {/* {Object.values(thead).map((title, index) => (
                            <th key={index} className='text-left py-3 text-custom-gray uppercase text-[1.0625rem]'>{title}</th>
                        ))} */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {tdetail.map((tdetail) => (
            <tr
              key={tdetail.key}
              className="hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/50"
            >
              <td className="text-sm py-4 px-3 font-medium text-gray-100">
                {tdetail.key}
              </td>
              <td className="text-sm py-4 px-3 font-medium text-white min-w-[150px]">
                <div className="flex items-center gap-3">
                  <div className="sm:hidden inline-block bg-gray-600/50 p-1 rounded-md shadow-sm">
                    <img
                      src={baseURL + "/api/v1/" + tdetail.picture}
                      alt="device"
                      className="w-8 h-8 object-cover rounded-sm"
                    />
                  </div>
                  <span>{tdetail.name}</span>
                </div>
              </td>

              <td className="text-sm py-4 px-3 hidden sm:table-cell">
                <div className="inline-block bg-gray-600/50 p-3 rounded-lg shadow-sm ring-2 ring-gray-500/20 hover:ring-gray-400/30 transition-all duration-200">
                  <img
                    src={baseURL + "/api/v1/" + tdetail.picture}
                    alt="device"
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </div>
              </td>

              <td className="text-sm py-4 px-3">
                <div className="flex space-x-2 justify-center items-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() =>
                      onEditClick({
                        _id: tdetail.id,
                        name: tdetail.name,
                        logo: tdetail.picture,
                      })
                    }
                    title="Edit device/platform"
                  >
                    {tdetail.actions.edit}
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={() => onDeleteClick(tdetail.id)}
                    title="Delete device/platform"
                  >
                    {tdetail.actions.delete}
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
