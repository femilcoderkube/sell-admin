import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import leagueUser from "../../assets/images/league_use.png";

export const NafesLeagueTable: React.FC = () => {
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
    league: "LEAGUE NAME",
    public: "PUBLIC",
    device: "DEVICE",
    game: "GAME",
    setting: "SETTING",
    players: "PLAYERS",
    status: "STATUS",
    date: "Ending Date",
    image: "Image",
    actions: "Actions",
  };

  //   const titles1 = [titles];

  const tdetail = [
    {
      id: 0,
      league: "MWII S&D | دوري نافس الرمضاني",
      public: "Yes",
      device: "PlayStation 5",
      game: "Call of Duty",
      setting: "Team",
      players: "12",
      status: "Not finished",
      date: "2023-02-07 11:59:00",
      image: leagueUser,
      actions: {
        edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
        delete: (
          <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
        ),
        view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
      },
    },
    {
      id: 1,
      league: "Rocket League A",
      public: "No",
      device: "Xbox One",
      game: "Rocket League",
      setting: "Team",
      players: "7",
      status: "Not finished",
      date: "2023-02-07 11:59:00",
      image: leagueUser,
      actions: {
        edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
        delete: (
          <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
        ),
        view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
      },
    },
    {
      id: 2,
      league: "Rocket League B",
      public: "Yes",
      device: "Cross",
      game: "Call of Duty",
      setting: "Team",
      players: "8",
      status: "Not finished",
      date: "2023-02-07 11:59:00",
      image: leagueUser,
      actions: {
        edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
        delete: (
          <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
        ),
        view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
      },
    },
    {
      id: 3,
      league: "Rocket League",
      public: "No",
      device: "PC",
      game: "Cross",
      setting: "Team",
      players: "5",
      status: "Not finished",
      date: "2023-02-07 11:59:00",
      image: leagueUser,
      actions: {
        edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
        delete: (
          <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
        ),
        view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
      },
    },
    {
      id: 4,
      league: "Rocket League",
      public: "Yes",
      device: "Mobile",
      game: "Call of Duty",
      setting: "Team",
      players: "6",
      status: "Not finished",
      date: "2023-02-07 11:59:00",
      image: leagueUser,
      actions: {
        edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
        delete: (
          <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
        ),
        view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
      },
    },
    {
      id: 5,
      league: "Rocket League",
      public: "No",
      device: "Mobile",
      game: "Rocket League",
      setting: "Team",
      players: "8",
      status: "Not finished",
      date: "2023-02-07 11:59:00",
      image: leagueUser,
      actions: {
        edit: <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />,
        delete: (
          <img src={deleteIcon} alt="Delete" style={{ width: "1.26rem" }} />
        ),
        view: <img src={viewIcon} alt="View" style={{ width: "1.26rem" }} />,
      },
    },
  ];

  return (
    <div id="league_table" className="pt-3 overflow-y-auto">
      <table className="table-auto text-white w-[1180px] lg:w-full ">
        <thead>
          <tr className="border-b border-light-border">
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.league}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.public}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.device}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.game}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.setting}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.players}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.status}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.date}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.image}
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
            <tr key={tdetail.id} className="border-b border-light-border">
              <td className="text-[1.0625rem] py-3">{tdetail.id}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.league}</td>
              <td
                className={`text-[1.0625rem] py-3 ${
                  tdetail.public === "Yes" ? "yes_active" : "no_active"
                }`}
              >
                <span className="py-[0.35rem] px-[0.55rem] rounded-[0.54rem] inline-block">
                  {tdetail.public}
                </span>
              </td>
              <td className="text-[1.0625rem] py-3">{tdetail.device}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.game}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.setting}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.players}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.status}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.date}</td>
              <td className="text-[1.0625rem] py-3">
                <span className="inline-block bg-input-color p-[0.4rem] rounded-[0.42rem]">
                  <img src={tdetail.image} alt="" />
                </span>
              </td>
              <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                <a
                  href="#"
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  {tdetail.actions.edit}
                </a>
                <a
                  href="#"
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  {tdetail.actions.delete}
                </a>
                <a
                  href="#"
                  style={{
                    background:
                      "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                  }}
                  className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                >
                  {tdetail.actions.view}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
