import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchLeagueById,
  fetchLeagueParticipants,
} from "../../app/features/league/leagueSlice";
import { RootState } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";
import { baseURL } from "../../axios";

const LeagueDetails: React.FC = () => {
  const { lid } = useParams<{ lid: string }>();
  const partnerId = window.location.pathname.split("/")[1];
  const dispatch = useDispatch();
  const {
    leagueDetail,
    loading,
    error,
    participants,
    participantsLoading,
    participantsError,
  } = useSelector((state: RootState) => state.leagues);

  // State for active tab
  const [activeTab, setActiveTab] = React.useState("Participants");

  // Fetch league details when component mounts
  useEffect(() => {
    if (lid) {
      dispatch(fetchLeagueById(lid));
      dispatch(fetchLeagueParticipants(lid));
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

  const tabs = ["Participants"];

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
            to={`/${partnerId}/leagues`}
            className="bg-input-color font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 text-white text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
          >
            Back to Leagues
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-6">
        <div className="flex border-b border-light-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-[1.0625rem] font-medium ${
                activeTab === tab
                  ? "text-white border-b-2 border-[#46A2FF]"
                  : "text-custom-gray hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 bg-input-color p-6 rounded-[0.52rem]">
        {activeTab === "Participants" && (
          <div>
            <h4 className="font-bold text-[1.25rem] text-white mb-4">
              Participants
            </h4>
            {participantsLoading ? (
              <HandLogoLoader />
            ) : participantsError ? (
              <div className="text-custom-gray">Error: {participantsError}</div>
            ) : participants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[1.0625rem] text-white border-collapse">
                  <thead>
                    <tr className="bg-[#2A2E3F] text-custom-gray">
                      <th className="py-3 px-4 text-left rounded-tl-[0.52rem]">
                        User ID
                      </th>
                      <th className="py-3 px-4 text-left">Game ID</th>
                      <th className="py-3 px-4 text-left">Team Join</th>
                      <th className="py-3 px-4 text-left rounded-tr-[0.52rem]">
                        Registration Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant: any) => (
                      <tr
                        key={participant._id}
                        className="border-b border-light-border hover:bg-[#2A2E3F]"
                      >
                        <td className="py-3 px-4">{participant.userId}</td>
                        <td className="py-3 px-4">{participant.gameId}</td>
                        <td className="py-3 px-4">
                          {participant.isTeamJoin ? "Yes" : "No"}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(participant.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-custom-gray">No participants found.</div>
            )}
          </div>
        )}
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
            <span className="text-custom-gray">Start Date: </span>
            {new Date(leagueDetail.startDate).toLocaleDateString()}
          </div>
          <div>
            <span className="text-custom-gray">End Date: </span>
            {new Date(leagueDetail.endDate).toLocaleDateString()}
          </div>
          <div>
            <span className="text-custom-gray">Registrations: </span>
            {leagueDetail.totalRegistrations}
          </div>
          <div>
            <span className="text-custom-gray">Prize Pool: </span>
            {leagueDetail.prizepool.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetails;
