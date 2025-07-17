import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { debounce } from "lodash";
import {
  fetchLeagueById,
  fetchLeagueMatches,
  fetchLeagueParticipants,
  setParticipantsPage,
  setMatchesPage,
  fetchLeagueMatchesByID,
  fetchLeagueTickets,
  setTicketsPage,
  generateExcelFile,
  setParticipantsPerPage,
  setMatchesperPage,
  setTicketsPerPage,
} from "../../app/features/league/leagueSlice";
import { RootState, AppDispatch } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";
import viewIcon from "../../assets/images/eye_icon.svg";
import { baseURL } from "../../axios";
import edit from "../../assets/images/Edit.svg";
import CommonModal from "./CommonModal";
import ParticipantsEditModel from "./ParticipantsEditModel";

const LeagueDetails: React.FC = () => {
  const statusOptions = [
    "all",
    "in_progress",
    "completed",
    "cancelled",
    "in_dispute",
  ];

  const ticketOptions = [
    "all",
    "open",
    "closed",
  ];
  const { lid } = useParams<{ lid: string }>();
  const partnerId = window.location.pathname.split("/")[1];
  const dispatch = useDispatch<AppDispatch>();
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
    tickets,
    ticketsLoading,
    ticketsError,
    ticketsTotalCount,
    ticketsCurrentPage,
    ticketsPerPage,
    perPage,
  } = useSelector((state: RootState) => state.leagues);

  const debouncedSetSearchKey = useCallback(
    debounce((value) => {
      setSearchKey(value);
    }, 300), // 300ms debounce delay
    [] // Empty dependency array to ensure debounce is created only once
  );

  const [selectedParticipants, setSelectedParticipants] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("all");
  const [ticketStatus, setTicketStatus] = useState("all");
  // State for active tab
  const [activeTab, setActiveTab] = React.useState("Matches");

  const handlePerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (activeTab === "Participants") {
        dispatch(setParticipantsPerPage(Number(e.target.value)))
      } else if (activeTab === "Matches") {
        dispatch(setMatchesperPage(Number(e.target.value)))
      } else if (activeTab === "Tickets") {
        dispatch(setTicketsPerPage(Number(e.target.value)))
      }
    },
    [dispatch, activeTab]
  );

  // Fetch league details and paginated data when component mounts or page changes
  useEffect(() => {
    if (lid) {
      dispatch(fetchLeagueById(lid));
    }
  }, [dispatch, lid]);

  const fetchParticipants = useCallback(() => {
    if (lid) {
      dispatch(
        fetchLeagueParticipants({
          leagueId: lid,
          page: participantsCurrentPage,
          participantsPerPage: participantsPerPage,
        })
      );
    }
  }, [dispatch, lid, participantsCurrentPage, participantsPerPage]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  useEffect(() => {
    if (lid) {
      dispatch(
        fetchLeagueMatches({
          leagueId: lid,
          page: matchesCurrentPage,
          matchesPerPage: matchesPerPage, // FIXED: was perPage
          searchKey: searchKey ? searchKey : "",
          status: status === "all" ? "" : status,
        })
      );
    }
  }, [dispatch, lid, matchesCurrentPage, matchesPerPage, searchKey, status]);

  useEffect(() => {
    if (lid) {
      dispatch(
        fetchLeagueTickets({
          leagueId: lid,
          page: ticketsCurrentPage,
          ticketsPerPage: ticketsPerPage, // FIXED: was perPage
          status: ticketStatus === "all" ? "" : ticketStatus,
        })
      );
    }
  }, [dispatch, lid, ticketsCurrentPage, ticketsPerPage, ticketStatus]);

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

  const tabs = ["Participants", "Matches", "Tickets"];

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

  const handleTicketsPageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(ticketsTotalCount / ticketsPerPage)) {
      dispatch(setTicketsPage(page));
    }
  };

  const handleExportParticipants = async () => {
    if (lid) {
      await dispatch(generateExcelFile({ lid }));
    }
  };

  const handleEdit = (data: any) => {
    setSelectedParticipants(data);
    setIsEditModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="nf_legue_head--con gap-6 flex-col lg:flex-row flex-wrap flex justify-between items-center">
            <div className="legue__head_left-con flex items-center gap-6">
              <div className="relative">
                <img
                  src={`${baseURL}/api/v1/${leagueDetail?.logo}`}
                  alt={leagueDetail?.title}
                  className="w-20 h-20 rounded-2xl shadow-lg border-2 border-gray-600/50"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-3xl text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {leagueDetail?.title}
                </h3>
                <p className="text-gray-300 text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {leagueDetail?.game?.name} | {leagueDetail?.format}
                </p>
              </div>
            </div>
            <div className="legue__head_right-con flex gap-3">
              <Link
                to={`/${partnerId}/leagues`}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 font-medium flex items-center gap-2 text-white text-lg py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border border-gray-600/50"
              >
                ← Back to Leagues
              </Link>
            </div>
          </div>
        </div>
        {/* League Info Section */}
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
          <h4 className="font-bold text-2xl text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">ℹ️</span>
            </div>
            League Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm">Status</span>
                  <span className="text-white font-semibold">
                    {new Date(leagueDetail?.endDate) > new Date()
                      ? "Not finished"
                      : "Finished"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm">Active</span>
                  <span
                    className={`py-1 px-3 rounded-lg text-sm font-medium ${leagueDetail?.isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                  >
                    {leagueDetail?.isActive ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm">
                    Start Date
                  </span>
                  <span className="text-white font-semibold">
                    {new Date(leagueDetail?.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm">End Date</span>
                  <span className="text-white font-semibold">
                    {new Date(leagueDetail?.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm">
                    Registrations
                  </span>
                  <span className="text-white font-semibold">
                    {leagueDetail?.totalRegistrations}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm">
                    Prize Pool
                  </span>
                  <span className="text-white font-semibold">
                    ${leagueDetail?.prizepool.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs Navigation */}
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl  overflow-hidden shadow-xl">
          <div className="flex border-b border-gray-700/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-300 relative ${activeTab === tab
                  ? "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "Participants" && (
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-2xl text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                    Participants
                  </h4>
                  <div>
                    <button
                      className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm"
                      onClick={handleExportParticipants}
                    >
                      Export
                    </button>
                  </div>
                </div>
                {participantsLoading ? (
                  <HandLogoLoader />
                ) : participantsError ? (
                  <div className="text-custom-gray bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    Error: {participantsError}
                  </div>
                ) : participants?.length > 0 ? (
                  <>
                    <div className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/30 shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full text-lg text-white border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-300">
                              <th className="py-4 px-6 text-left font-semibold">
                                #
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                User Name
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Discord ID
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Game ID
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Team Join
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Registration Date
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants?.map(
                              (participant: any, index: number) => (
                                <tr
                                  key={participant?._id}
                                  className={`border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-200 ${index % 2 === 0
                                    ? "bg-gray-800/20"
                                    : "bg-gray-800/10"
                                    }`}
                                >
                                  <td className="py-4 px-6 text-gray-300">
                                    {(participantsCurrentPage - 1) * 5 +
                                      index +
                                      1}
                                  </td>
                                  <td className="py-4 px-6 font-medium">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                                        {participant?.userId?.username?.charAt(
                                          0
                                        )}
                                      </div>
                                      {participant?.userId?.username}
                                    </div>
                                  </td>
                                  <td className="py-4 px-6 text-gray-300">
                                    {participant?.otherFields?.[0]?.value || "—"}
                                  </td>
                                  <td className="py-4 px-6 text-gray-300">
                                    {participant?.gameId}
                                  </td>
                                  <td className="py-4 px-6">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${participant?.isTeamJoin
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                        }`}
                                    >
                                      {participant?.isTeamJoin ? "Yes" : "No"}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6 text-gray-300">
                                    {new Date(
                                      participant?.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => handleEdit(participant)}
                                      style={{
                                        background:
                                          "radial-gradient(circle, #39415C 0%, #555F83 100%)",
                                      }}
                                      className="hover:opacity-80 p-[0.4rem] rounded-[0.42rem] duration-300"
                                    >
                                      <img src={edit} alt="Edit" style={{ width: "1.26rem" }} />
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Participants Pagination */}
                    <div className="flex justify-between items-center mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-gray-300 font-medium">
                        Showing {participants.length} of{" "}
                        {participantsTotalCount} participants
                      </div>
                      <div className="nf_max-al bg-input-color gap-2 flex items-center pl-2 pr-1 rounded-[0.625rem]">
                        <span className="text-[1.0625rem] text-custom-gray whitespace-nowrap ">
                          Show max:
                        </span>
                        <select
                          name="selectedFruit"
                          className=" font-medium focus:outline-0 bg-[#242B3C] text-white py-[0.4rem] px-2 rounded-[0.52rem] text-[1.0625rem]"
                          value={participantsPerPage}
                          onChange={handlePerPageChange}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleParticipantsPageChange(
                              participantsCurrentPage - 1
                            )
                          }
                          disabled={participantsCurrentPage === 1}
                          className="py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Previous
                        </button>
                        <span className="py-2 px-4 text-white bg-gray-800/50 rounded-lg border border-gray-600/30 font-medium">
                          Page {participantsCurrentPage} of{" "}
                          {Math.ceil(
                            participantsTotalCount / participantsPerPage
                          )}
                        </span>
                        <button
                          onClick={() =>
                            handleParticipantsPageChange(
                              participantsCurrentPage + 1
                            )
                          }
                          disabled={
                            participantsCurrentPage >=
                            Math.ceil(
                              participantsTotalCount / participantsPerPage
                            )
                          }
                          className="py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-600/30">
                    <div className="text-gray-400 text-lg">
                      No participants found.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Matches" && (
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-2xl text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                    Matches
                  </h4>

                  <div className="relative">
                    <select
                      className="w-40 py-2 px-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                    >
                      {statusOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-gray-800 text-white"
                        >
                          {option
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      onChange={(e) => debouncedSetSearchKey(e.target.value)}
                      className="w-full py-2 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* <div>
                    <button className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium text-sm">
                      Export
                    </button>
                  </div> */}
                </div>
                {matchesLoading ? (
                  <HandLogoLoader />
                ) : matchesError ? (
                  <div className="text-custom-gray bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    Error: {matchesError}
                  </div>
                ) : matches?.length > 0 ? (
                  <>
                    <div className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/30 shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full text-lg text-white border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-300">
                              <th className="py-4 px-6 text-left font-semibold">
                                #
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Team 1
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Team 2
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Status
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Start Time
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Winner
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {matches?.map((match: any, index: number) => (
                              <tr
                                key={match?._id}
                                className={`border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 transition-all duration-200 ${index % 2 === 0
                                  ? "bg-gray-800/20"
                                  : "bg-gray-800/10"
                                  }`}
                              >
                                <td className="py-4 px-6 font-medium text-blue-300">
                                  {(matchesCurrentPage - 1) * 5 + index + 1}
                                </td>
                                <td className="py-4 px-6 font-medium text-blue-300">
                                  {match?.team1
                                    ?.map(
                                      (p: any) =>
                                        p.participant?.userId?.username
                                    )
                                    .join(", ")}
                                </td>
                                <td className="py-4 px-6 font-medium text-purple-300">
                                  {match?.team2
                                    ?.map(
                                      (p: any) =>
                                        p.participant?.userId?.username
                                    )
                                    .join(", ")}
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${match?.status === "completed"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : match?.status === "cancelled"
                                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                        : match?.status === "in_progress"
                                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                      }`}
                                  >
                                    {match?.status
                                      ?.replace("_", " ")
                                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-gray-300">
                                  {new Date(match?.startTime).toLocaleString()}
                                </td>
                                <td className="py-4 px-6">
                                  {match?.winner ? (
                                    <span className="text-yellow-400 font-medium flex items-center gap-2">
                                      🏆 {match.winner}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">---</span>
                                  )}
                                </td>
                                <td className="py-4 px-6">
                                  <Link
                                    to={`/${partnerId}/leagues/${lid}/${match?._id}`}
                                    className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                                  >
                                    <img
                                      src={viewIcon}
                                      alt="View"
                                      className="w-5 h-5"
                                    />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Matches Pagination */}
                    <div className="flex justify-between items-center mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-gray-300 font-medium">
                        Showing {matches.length} of {matchesTotalCount} matches
                      </div>
                      <div className="nf_max-al bg-input-color gap-2 flex items-center pl-2 pr-1 rounded-[0.625rem]">
                        <span className="text-[1.0625rem] text-custom-gray whitespace-nowrap ">
                          Show max:
                        </span>
                        <select
                          name="selectedFruit"
                          className=" font-medium focus:outline-0 bg-[#242B3C] text-white py-[0.4rem] px-2 rounded-[0.52rem] text-[1.0625rem]"
                          value={matchesPerPage}
                          onChange={handlePerPageChange}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleMatchesPageChange(matchesCurrentPage - 1)
                          }
                          disabled={matchesCurrentPage === 1}
                          className="py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Previous
                        </button>
                        <span className="py-2 px-4 text-white bg-gray-800/50 rounded-lg border border-gray-600/30 font-medium">
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
                          className="py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-600/30">
                    <div className="text-gray-400 text-lg">
                      No matches found.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Tickets" && (
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-2xl text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🎟️</span>
                    </div>
                    Tickets
                  </h4>
                  <div className="relative">
                    <select
                      className="w-40 py-2 px-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      onChange={(e) => {
                        setTicketStatus(e.target.value);
                      }}
                    >
                      {ticketOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-gray-800 text-white"
                        >
                          {option
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {ticketsLoading ? (
                  <HandLogoLoader />
                ) : ticketsError ? (
                  <div className="text-custom-gray bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    Error: {ticketsError}
                  </div>
                ) : tickets?.length > 0 ? (
                  <>
                    <div className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/30 shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full text-lg text-white border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-300">
                              <th className="py-4 px-6 text-left font-semibold">
                                #
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Team
                              </th>

                              <th className="py-4 px-6 text-left font-semibold">
                                Status
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Date
                              </th>
                              <th className="py-4 px-6 text-left font-semibold">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets?.map((ticket: any, index: number) => (
                              <tr
                                key={ticket?._id}
                                className={`border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 transition-all duration-200 ${index % 2 === 0
                                  ? "bg-gray-800/20"
                                  : "bg-gray-800/10"
                                  }`}
                              >
                                <td className="py-4 px-6 font-medium text-blue-300">
                                  {(ticketsCurrentPage - 1) * 5 + index + 1}
                                </td>
                                <td className="py-4 px-6 font-medium text-blue-300">
                                  {/* {ticket?.raiserID?.username} */}
                                  {ticket?.raiser}
                                </td>

                                <td className="py-4 px-6">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${ticket?.status === "open"
                                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                                      }`}
                                  >
                                    {ticket?.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-gray-300">
                                  {new Date(
                                    ticket?.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6">
                                  <Link
                                    to={`/${partnerId}/leagues/${lid}/${ticket?.matchId}`}
                                    className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                                  >
                                    <img
                                      src={viewIcon}
                                      alt="View"
                                      className="w-5 h-5"
                                    />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-gray-300 font-medium">
                        Showing {tickets.length} of {ticketsTotalCount} tickets
                      </div>
                      <div className="nf_max-al bg-input-color gap-2 flex items-center pl-2 pr-1 rounded-[0.625rem]">
                        <span className="text-[1.0625rem] text-custom-gray whitespace-nowrap ">
                          Show max:
                        </span>
                        <select
                          name="selectedFruit"
                          className=" font-medium focus:outline-0 bg-[#242B3C] text-white py-[0.4rem] px-2 rounded-[0.52rem] text-[1.0625rem]"
                          value={ticketsPerPage}
                          onChange={handlePerPageChange}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleTicketsPageChange(ticketsCurrentPage - 1)
                          }
                          disabled={ticketsCurrentPage === 1}
                          className="py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Previous
                        </button>
                        <span className="py-2 px-4 text-white bg-gray-800/50 rounded-lg border border-gray-600/30 font-medium">
                          Page {ticketsCurrentPage} of{" "}
                          {Math.ceil(ticketsTotalCount / ticketsPerPage)}
                        </span>
                        <button
                          onClick={() =>
                            handleTicketsPageChange(ticketsCurrentPage + 1)
                          }
                          disabled={
                            ticketsCurrentPage >=
                            Math.ceil(ticketsTotalCount / ticketsPerPage)
                          }
                          className="py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-600/30">
                    <div className="text-gray-400 text-lg">
                      No tickets found.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ParticipantsEditModel
        isOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedParticipants={selectedParticipants}
        fetchParticipants={fetchParticipants}
      />

    </div>
  );
};

export default LeagueDetails;
