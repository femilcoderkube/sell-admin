import { FC, useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeagueTickets,
  // setSearchTerm as setLeagueSearchTerm,
  setPerPage as setLeaguePerPage,
  setPage as setLeaguePage,
  setStatus as setLeagueStatus,
} from "../../app/features/tickets/leagueTicketsSlice";
import {
  fetchTournamentTickets,
  // setSearchTerm as setTournamentSearchTerm,
  setPerPage as setTournamentPerPage,
  setPage as setTournamentPage,
  setStatus as setTournamentStatus,
} from "../../app/features/tickets/tournamentTicketsSlice";
import { RootState } from "../../app/store";
import LeagueTickets from "../../components/Ticket/LeagueTickets";
import TournamentTickets from "../../components/Ticket/TournamentTickets";

const Tickets: FC<{ title?: string }> = ({ title }) => {
  const [activeTab, setActiveTab] = useState("league-tickets");
  // const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();

  const ticketOptions = ["all", "open", "closed"];
  // Selectors for league tickets
  const {
    tickets: leagueTickets,
    loading: leagueLoading,
    error: leagueError,
    currentPage: leaguePage,
    perPage: leaguePerPage,
    totalCount: leagueTotalCount,
    // searchTerm: leagueSearchTerm,
    status: leagueStatus,
  } = useSelector((state: RootState) => state.leagueTickets);

  // Selectors for tournament tickets
  const {
    tickets: tournamentTickets,
    loading: tournamentLoading,
    error: tournamentError,
    currentPage: tournamentPage,
    perPage: tournamentPerPage,
    totalCount: tournamentTotalCount,
    // searchTerm: tournamentSearchTerm,
    status: tournamentStatus,
  } = useSelector((state: RootState) => state.tournamentTickets);

  // Fetch tickets on mount and when page/perPage/searchTerm changes
  useEffect(() => {
    dispatch(
      fetchLeagueTickets({
        page: leaguePage,
        perPage: leaguePerPage,
        // searchTerm: leagueSearchTerm,
        status: leagueStatus !== "all" ? leagueStatus : "",
      })
    );
    dispatch(
      fetchTournamentTickets({
        page: tournamentPage,
        perPage: tournamentPerPage,
        // searchTerm: tournamentSearchTerm,
        status: tournamentStatus !== "all" ? tournamentStatus : "",
      })
    );
  }, [
    dispatch,
    leaguePage,
    leaguePerPage,
    // leagueSearchTerm,
    leagueStatus,
    tournamentPage,
    tournamentPerPage,
    // tournamentSearchTerm,
    tournamentStatus,
  ]);

  // Handle search input
  // const handleSearch = () => {
  //   if (activeTab === "league-tickets") {
  //     dispatch(setLeagueSearchTerm(searchInput));
  //   } else {
  //     dispatch(setTournamentSearchTerm(searchInput));
  //   }
  // };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (activeTab === "league-tickets") {
      dispatch(setLeaguePage(page));
    } else {
      dispatch(setTournamentPage(page));
    }
  };

  // Handle perPage change
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = parseInt(e.target.value);
    if (activeTab === "league-tickets") {
      dispatch(setLeaguePerPage(perPage));
    } else {
      dispatch(setTournamentPerPage(perPage));
    }
  };

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as "all" | "open" | "closed";
    if (activeTab === "league-tickets") {
      dispatch(setLeagueStatus(status));
    } else {
      dispatch(setTournamentStatus(status));
    }
  };

  return (
    <Layout>
      <div className="min-h-screen text-white p-6">
        <div className=" mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            {title || "Sports Event Dashboard"}
          </h1>
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "tournament-tickets"
                  ? "border-b-2 border-blue-600 text-blue-400"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("tournament-tickets")}
            >
              Tournament Tickets
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "league-tickets"
                  ? "border-b-2 border-blue-600 text-blue-400"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("league-tickets")}
            >
              League Tickets
            </button>
          </div>
          <div className="flex gap-4 mb-6">
            {/* <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tickets..."
              className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
            /> */}
            {/* <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Search
            </button> */}
            <select
              onChange={handlePerPageChange}
              className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
            <div className="relative">
              <select
                value={
                  activeTab === "league-tickets"
                    ? leagueStatus
                    : tournamentStatus
                }
                onChange={handleStatusChange}
                className="w-40 py-2 px-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
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
          <div>
            {activeTab === "tournament-tickets" && (
              <TournamentTickets
                tickets={tournamentTickets}
                loading={tournamentLoading}
                error={tournamentError}
                currentPage={tournamentPage}
                perPage={tournamentPerPage}
                totalCount={tournamentTotalCount}
                onPageChange={handlePageChange}
              />
            )}
            {activeTab === "league-tickets" && (
              <LeagueTickets
                tickets={leagueTickets}
                loading={leagueLoading}
                error={leagueError}
                currentPage={leaguePage}
                perPage={leaguePerPage}
                totalCount={leagueTotalCount}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tickets;
