import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchLeagueById } from "../../app/features/league/leagueSlice";
import { RootState } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";
import { baseURL } from "../../axios";

// Dummy data for registered users
const dummyUsers = [
  {
    id: "1",
    username: "PlayerOne",
    gameID: "PO12345",
    registrationDate: "2025-05-15T10:30:00Z",
  },
  {
    id: "2",
    username: "GamerX",
    gameID: "GX67890",
    registrationDate: "2025-05-16T14:45:00Z",
  },
  {
    id: "3",
    username: "ShadowStriker",
    gameID: "SS11223",
    registrationDate: "2025-05-17T09:00:00Z",
  },
];

const LeagueDetails: React.FC = () => {
  const { lid } = useParams<{ lid: string }>();
  const partnerId = window.location.pathname.split("/")[1];
  const dispatch = useDispatch();
  const { leagueDetail, loading, error } = useSelector(
    (state: RootState) => state.leagues
  );

  // Fetch league details when component mounts
  useEffect(() => {
    if (lid) {
      dispatch(fetchLeagueById(lid));
    }
  }, [dispatch, lid]);

  if (loading) {
    return <HandLogoLoader />;
  }

  if (error) {
    return (
      <div className="text-custom-gray flex items-center justify-center h-20">
        Error: {error}
      </div>
    );
  }

  if (!leagueDetail) {
    return (
      <div className="text-custom-gray flex items-center justify-center h-20">
        No league data found.
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con flex items-center gap-4">
          <img
            src={`${baseURL}/api/v1/${leagueDetail.logo}`}
            alt={leagueDetail.title}
            className="w-16 h-16 rounded-[0.42rem]"
          />
          <div>
            <h3 className="font-bold text-[1.5rem] text-white">
              {leagueDetail.title}
            </h3>
            <p className="text-custom-gray text-[1.0625rem]">
              {leagueDetail.game?.name} | {leagueDetail.format}
            </p>
          </div>
        </div>
        <div className="legue__head_right-con flex gap-3">
          <Link
            to={`/${partnerId}/leagues/edit/${leagueDetail._id}`}
            className="bg-primary-gradient font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] text-white text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
          >
            Edit League
          </Link>
          <Link
            to={`/${partnerId}/leagues`}
            className="bg-input-color font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 text-white text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
          >
            Back to Leagues
          </Link>
        </div>
      </div>

      {/* League Info Section */}
      <div className="mt-6 bg-input-color p-6 rounded-[0.52rem]">
        <h4 className="font-bold text-[1.25rem] text-white mb-4">
          League Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[1.0625rem] text-white">
          <div>
            <span className="text-custom-gray">Status: </span>
            {new Date(leagueDetail.endDate) > new Date()
              ? "Not finished"
              : "Finished"}
          </div>
          <div>
            <span className="text-custom-gray">Active: </span>
            <span
              className={`py-[0.35rem] px-[0.55rem] rounded-[0.54rem] inline-block ${
                leagueDetail.isActive ? "yes_active" : "no_active"
              }`}
            >
              {leagueDetail.isActive ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-custom-gray">End Date: </span>
            {new Date(leagueDetail.endDate).toLocaleString()}
          </div>
          <div>
            <span className="text-custom-gray">Registrations: </span>
            {leagueDetail.totalRegistrations}
          </div>
        </div>
      </div>

      {/* Tabs for Sections */}
      <div className="mt-6">
        <div className="flex border-b border-light-border">
          <button className="px-4 py-2 text-white font-medium text-[1.0625rem] border-b-2 border-[#46A2FF]">
            Registered Users
          </button>
          <button className="px-4 py-2 text-custom-gray font-medium text-[1.0625rem]">
            Matches
          </button>
          <button className="px-4 py-2 text-custom-gray font-medium text-[1.0625rem]">
            Points Table
          </button>
        </div>

        {/* Registered Users Section */}
        <div className="mt-4 bg-input-color p-6 rounded-[0.52rem]">
          <h4 className="font-bold text-[1.25rem] text-white mb-4">
            Registered Users
          </h4>
          <div id="users_table" className="pt-3 overflow-y-auto">
            <table className="table-auto text-white w-[1180px] lg:w-full">
              <thead>
                <tr className="border-b border-light-border">
                  <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
                    ID
                  </th>
                  <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
                    Username
                  </th>
                  <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
                    Game ID
                  </th>
                  <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem]">
                    Registration Date
                  </th>
                  <th className="text-left py-3 text-custom-gray uppercase text-[1.0625rem] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dummyUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-light-border"
                  >
                    <td className="text-[1.0625rem] py-3">{index + 1}</td>
                    <td className="text-[1.0625rem] py-3">{user.username}</td>
                    <td className="text-[1.0625rem] py-3">{user.gameID}</td>
                    <td className="text-[1.0625rem] py-3">
                      {new Date(user.registrationDate).toLocaleString()}
                    </td>
                    <td className="text-[1.0625rem] py-3 flex space-x-3 justify-center">
                      <button
                        style={{
                          background:
                            "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                        }}
                        className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                      >
                        <svg
                          width="1.26rem"
                          height="1.26rem"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4.5C7.5 4.5 3.737 7.252 2 12c1.737 4.748 5.5 7.5 10 7.5s8.263-2.752 10-7.5c-1.737-4.748-5.5-7.5-10-7.5zm0 12c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matches Section (Placeholder) */}
        <div className="mt-4 bg-input-color p-6 rounded-[0.52rem] hidden">
          <h4 className="font-bold text-[1.25rem] text-white mb-4">Matches</h4>
          <p className="text-custom-gray text-[1.0625rem]">
            No matches data available yet. This section will display the list of
            matches for the league.
          </p>
        </div>

       
        <div className="mt-4 bg-input-color p-6 rounded-[0.52rem] hidden">
          <h4 className="font-bold text-[1.25rem] text-white mb-4">
            Points Table
          </h4>
          <p className="text-custom-gray text-[1.0625rem]">
            No points table data available yet. This section will display the
            points table for the league.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetails;