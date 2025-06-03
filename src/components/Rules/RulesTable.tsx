import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";

import { TableHashIcon } from "../ui";

interface IPartnersProps {
  data: any;
  currentPage: number;
  onEditClick: (selectedPartner: any) => void;
  onDeleteClick: (partnerId: string) => void;
}

export const PartnersTable: React.FC<IPartnersProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    partnerName: "Title",

    actions: "Actions",
  };

  //   const titles1 = [titles];

  const tdetail = data.map((partner, key) => ({
    id: partner._id,
    key: (currentPage - 1) * 10 + key + 1,
    partnerName: partner.titleEn,
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: (
        <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
      ),
      view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
    },
  }));

  return (
    <div id="league_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full ">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.partnerName}
            </th>

            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
              {thead.actions}
            </th>
            {/* {Object.values(thead).map((title, index) => (
                            <th key={index} className='text-left py-3 text-custom-gray uppercase text-[1.0625rem]'>{title}</th>
                        ))} */}
          </tr>
        </thead>
        <tbody>
          {tdetail.map((tdetail, index) => (
            <tr key={tdetail.key} className="border-b border-light-border">
              <td className="text-[1.0625rem] py-3">{tdetail.key}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.partnerName}</td>

              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  onClick={() => onEditClick(data[index])}
                >
                  {tdetail.actions.edit}
                </button>
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
                {/* <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  {tdetail.actions.view}
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
