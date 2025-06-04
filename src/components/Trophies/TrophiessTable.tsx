import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import { TableHashIcon } from "../ui";
import { TrophieType } from "../../app/types";

interface ITrophiesProps {
  data: TrophieType[];
  currentPage: number;
  onEditClick: (selectedTrophie: TrophieType) => void;
  onDeleteClick: (trophieId: string) => void;
}

export const TrophiesTable: React.FC<ITrophiesProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    badgeID: "BadgeID",
    position: "Position",
    points: "Points",
    prize: "Prize",
    actions: "Actions",
  };

  const tdetail = data.map((trophie, key) => ({
    id: trophie._id,
    key: (currentPage - 1) * 10 + key + 1,
    badgeID: trophie.BadgeID.valueOf,
    position: trophie.position,
    points: trophie.points,
    prize: trophie.prize,
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />,
      view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
    },
  }));

  return (
    <div id="trophies_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full ">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.badgeID}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.position}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.points}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.prize}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
              {thead.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {tdetail.map((tdetail, index) => (
            <tr key={tdetail.key} className="border-b border-light-border">
              <td className="text-[1.0625rem] py-3">{tdetail.key}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.badgeID.name.toString()}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.position}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.points}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.prize}</td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
