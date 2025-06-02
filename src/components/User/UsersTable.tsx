import React from "react";
import edit from "../../assets/images/Edit.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import viewIcon from "../../assets/images/setting_icon.svg";
import leagueUser from "../../assets/images/league_use.png";

export const UsersTable: React.FC = () => {
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
    playstation_id: "Playstation ID",
    activision_id: "Activision ID",
    mobile: "Mobile",
    ip_address: "IP Address",
    actions: "Actions",
  };

  //   const titles1 = [titles];

  const tdetail = [
    {
      id: 1,
      username: "SultanCafar",
      email: "llsmm@ejkcloud.com",
      playstation_id: "-",
      activision_id: "whitexoid",
      mobile: "+906-586007240",
      ip_address: "49.16.81.174",
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
      username: "Mordock",
      email: "hgoon@gmail.com",
      playstation_id: "driplayer",
      activision_id: "-",
      mobile: "-",
      ip_address: "-",
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
              {thead.username}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.email}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.playstation_id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.activision_id}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.mobile}
            </th>
            <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
              {thead.ip_address}
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
              <td className="text-[1.0625rem] py-3">{tdetail.username}</td>

              <td className="text-[1.0625rem] py-3">{tdetail.email}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.playstation_id}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.activision_id}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.mobile}</td>
              <td className="text-[1.0625rem] py-3">{tdetail.ip_address}</td>

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
