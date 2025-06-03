import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import leagueUser from "../../assets/images/league_use.png";
import { GameType } from "../../app/types";
import { baseURL } from "../../axios";
import { TableHashIcon } from "../ui";

interface IGamesProps {
  data: GameType[];
  currentPage: number;
  onEditClick: (selectedGame: GameType) => void;
  onDeleteClick: (gameId: string) => void;
}
export const GamesTable: React.FC<IGamesProps> = ({
  data,
  currentPage,
  onEditClick,
  onDeleteClick,
}) => {
  const thead = {
    id: <TableHashIcon />,
    game: "Game",
    shortName: "Short name ",
    picture: "Picture",
    idField: "Id Field",

    actions: "Actions",
  };

  //   const titles1 = [titles];

  const tdetail = data.map((game, key) => ({
    id: game._id,
    key: (currentPage - 1) * 10 + key + 1,
    game: game.name,
    shortName: game.shortName,
    picture: game.logo,
    idField: game.gameId,
    actions: {
      edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
      delete: (
        <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
      ),
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
              {thead.game}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.shortName}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.picture}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.idField}
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
          {tdetail.map((tdetail) => (
            <tr key={tdetail.key} className="border-b border-light-border">
              <td className="text-[1.0625rem] py-3">{tdetail.key}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.game}</td>

              <td className="text-[1.0625rem] py-3">{tdetail.shortName}</td>
              <td className="text-[1.0625rem] py-3">
                <img
                  src={baseURL + "/api/v1/" + tdetail.picture}
                  alt="game-logo"
                  className="w-12 h-12 object-cover"
                />
              </td>
              <td className="text-[1.0625rem] py-3">{tdetail.idField}</td>

              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  onClick={() => {
                    onEditClick({
                      _id: tdetail.id,
                      name: tdetail.game,
                      shortName: tdetail.shortName,
                      logo: tdetail.picture,
                      gameId: tdetail.idField,
                    });
                  }}
                >
                  {tdetail.actions.edit}
                </button>
                <button
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                  onClick={() => {
                    onDeleteClick(tdetail.id);
                  }}
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
