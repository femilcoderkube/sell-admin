import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchLeagueById,
  fetchLeagueMatches,
  fetchLeagueParticipants,
  setParticipantsPage,
  setMatchesPage,
  fetchLeagueMatchesByID,
} from "../../app/features/league/leagueSlice";
import { RootState } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";
import viewIcon from "../../assets/images/eye_icon.svg";
import { baseURL } from "../../axios";
import CommonModal from "./CommonModal";

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
    participantsCurrentPage,
    participantsPerPage,
    participantsTotalCount,
    matches,
    matchesLoading,
    matchesError,
    matchesCurrentPage,
    matchesPerPage,
    matchesTotalCount,
  } = useSelector((state: RootState) => state.leagues);
  console.log("error", error);
  // State for active tab
  const [activeTab, setActiveTab] = React.useState("Participants");

  // Fetch league details and paginated data when component mounts or page changes
  useEffect(() => {
    if (lid) {
      dispatch(fetchLeagueById(lid));
      dispatch(
        fetchLeagueParticipants({
          leagueId: lid,
          page: participantsCurrentPage,
          perPage: participantsPerPage,
        })
      );
      dispatch(
        fetchLeagueMatches({
          leagueId: lid,
          page: matchesCurrentPage,
          perPage: matchesPerPage,
        })
      );
    }
  }, [
    dispatch,
    lid,
    participantsCurrentPage,
    participantsPerPage,
    matchesCurrentPage,
    matchesPerPage,
  ]);

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

  const tabs = ["Participants", "Matches"];

  // Pagination handlers
  const handleParticipantsPageChange = (page: number) => {
    if (
      page >= 1 &&
      page <= Math.ceil(participantsTotalCount / participantsPerPage)
    ) {
      dispatch(setParticipantsPage(page));
    }
  };

  const handleMatchesPageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(matchesTotalCount / matchesPerPage)) {
      dispatch(setMatchesPage(page));
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con flex items-center gap-4">
          <img
            src={`${baseURL}/api/v1/${leagueDetail?.logo}`}
            alt={leagueDetail?.title}
            className="w-16 h-16 rounded-[0.42rem]"
          />
          <div>
            <h3 className="font-bold text-[1.5rem] text-white">
              {leagueDetail?.title}
            </h3>
            <p className="text-custom-gray text-[1.0625rem]">
              {leagueDetail?.game?.name} | {leagueDetail?.format}
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
            ) : participants?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-[1.0625rem] text-white border-collapse">
                    <thead>
                      <tr className="bg-[#2A2E3F] text-custom-gray">
                        <th className="py-3 px-4 text-left rounded-tl-[0.52rem]">
                          User Name
                        </th>
                        <th className="py-3 px-4 text-left">Game ID</th>
                        <th className="py-3 px-4 text-left">Team Join</th>
                        <th className="py-3 px-4 text-left rounded-tr-[0.52rem]">
                          Registration Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants?.map((participant: any) => (
                        <tr
                          key={participant?._id}
                          className="border-b border-light-border hover:bg-[#2A2E3F]"
                        >
                          <td className="py-3 px-4">
                            {participant?.userId?.username}
                          </td>
                          <td className="py-3 px-4">{participant?.gameId}</td>
                          <td className="py-3 px-4">
                            {participant?.isTeamJoin ? "Yes" : "No"}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(
                              participant?.createdAt
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Participants Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-custom-gray">
                    Showing {participants.length} of {participantsTotalCount}{" "}
                    participants
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleParticipantsPageChange(
                          participantsCurrentPage - 1
                        )
                      }
                      disabled={participantsCurrentPage === 1}
                      className="py-1 px-3 bg-[#2A2E3F] text-white rounded-[0.52rem] disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="py-1 px-3 text-white">
                      Page {participantsCurrentPage} of{" "}
                      {Math.ceil(participantsTotalCount / participantsPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        handleParticipantsPageChange(
                          participantsCurrentPage + 1
                        )
                      }
                      disabled={
                        participantsCurrentPage >=
                        Math.ceil(participantsTotalCount / participantsPerPage)
                      }
                      className="py-1 px-3 bg-[#2A2E3F] text-white rounded-[0.52rem] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-custom-gray">No participants found.</div>
            )}
          </div>
        )}

        {activeTab === "Matches" && (
          <div>
            <h4 className="font-bold text-[1.25rem] text-white mb-4">
              Matches
            </h4>
            {matchesLoading ? (
              <HandLogoLoader />
            ) : matchesError ? (
              <div className="text-custom-gray">Error: {matchesError}</div>
            ) : matches?.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-[1.0625rem] text-white border-collapse">
                    <thead>
                      <tr className="bg-[#2A2E3F] text-custom-gray">
                        <th className="py-3 px-4 text-left rounded-tl-[0.52rem]">
                          Team 1
                        </th>
                        <th className="py-3 px-4 text-left">Team 2</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Start Time</th>
                        <th className="py-3 px-4 text-left">Winner</th>
                        <th className="py-3 px-4 text-left rounded-tr-[0.52rem]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches?.map((match: any) => (
                        <tr
                          key={match?._id}
                          className="border-b border-light-border hover:bg-[#2A2E3F]"
                        >
                          <td className="py-3 px-4">
                            {match?.team1
                              ?.map((p: any) => p.participant?.userId?.username)
                              .join(", ")}
                          </td>
                          <td className="py-3 px-4">
                            {match?.team2
                              ?.map((p: any) => p.participant?.userId?.username)
                              .join(", ")}
                          </td>
                          <td className="py-3 px-4">{match?.status}</td>
                          <td className="py-3 px-4">
                            {new Date(match?.startTime).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            {match?.winner ? match.winner : "---"}
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/${partnerId}/leagues/${lid}/${match?._id}`}
                              style={{
                                background:
                                  "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                              }}
                              className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                            >
                              <img
                                src={viewIcon}
                                alt="View"
                                style={{ width: "1.26rem" }}
                              />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Matches Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-custom-gray">
                    Showing {matches.length} of {matchesTotalCount} matches
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleMatchesPageChange(matchesCurrentPage - 1)
                      }
                      disabled={matchesCurrentPage === 1}
                      className="py-1 px-3 bg-[#2A2E3F] text-white rounded-[0.52rem] disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="py-1 px-3 text-white">
                      Page {matchesCurrentPage} of{" "}
                      {Math.ceil(matchesTotalCount / matchesPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        handleMatchesPageChange(matchesCurrentPage + 1)
                      }
                      disabled={
                        matchesCurrentPage >=
                        Math.ceil(matchesTotalCount / matchesPerPage)
                      }
                      className="py-1 px-3 bg-[#2A2E3F] text-white rounded-[0.52rem] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-custom-gray">No matches found.</div>
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
            {new Date(leagueDetail?.endDate) > new Date()
              ? "Not finished"
              : "Finished"}
          </div>
          <div>
            <span className="text-custom-gray">Active: </span>
            <span
              className={`py-[0.35rem] px-[0.55rem] rounded-[0.54rem] inline-block ${
                leagueDetail?.isActive ? "yes_active" : "no_active"
              }`}
            >
              {leagueDetail?.isActive ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-custom-gray">Start Date: </span>
            {new Date(leagueDetail?.startDate).toLocaleDateString()}
          </div>
          <div>
            <span className="text-custom-gray">End Date: </span>
            {new Date(leagueDetail?.endDate).toLocaleDateString()}
          </div>
          <div>
            <span className="text-custom-gray">Registrations: </span>
            {leagueDetail?.totalRegistrations}
          </div>
          <div>
            <span className="text-custom-gray">Prize Pool: </span>
            {leagueDetail?.prizepool.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetails;
