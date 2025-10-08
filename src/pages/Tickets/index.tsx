import { FC, useState } from "react";
import { Layout } from "../../components/layout";

interface Ticket {
  event: string;
  date: string;
  venue: string;
  price: number;
}

const tournamentTicketsData: Ticket[] = [
  {
    event: "Championship Finals",
    date: "March 15, 2026",
    venue: "Central Arena",
    price: 99.99,
  },
  {
    event: "Semi-Finals",
    date: "March 10, 2026",
    venue: "West Stadium",
    price: 79.99,
  },
];

const leagueTicketsData: Ticket[] = [
  {
    event: "Premier League Match",
    date: "April 5, 2026",
    venue: "East Stadium",
    price: 49.99,
  },
  {
    event: "Regular Season Game",
    date: "April 12, 2026",
    venue: "North Arena",
    price: 39.99,
  },
];

const TournamentTickets: FC = () => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white mb-6">
          Tournament Tickets
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <select className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-200">
          <thead>
            <tr className="bg-gray-700/50">
              <th className="p-4 font-semibold">Event</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Venue</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {tournamentTicketsData.map((ticket, index) => (
              <tr key={index} className="border-b border-gray-700/50">
                <td className="p-4">{ticket.event}</td>
                <td className="p-4 text-gray-400">{ticket.date}</td>
                <td className="p-4 text-gray-400">{ticket.venue}</td>
                <td className="p-4 text-green-400">
                  ${ticket.price.toFixed(2)}
                </td>
                <td className="p-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Buy Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LeagueTickets: FC = () => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white mb-6">League Tickets</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <select className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-200">
          <thead>
            <tr className="bg-gray-700/50">
              <th className="p-4 font-semibold">Event</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Venue</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {leagueTicketsData.map((ticket, index) => (
              <tr key={index} className="border-b border-gray-700/50">
                <td className="p-4">{ticket.event}</td>
                <td className="p-4 text-gray-400">{ticket.date}</td>
                <td className="p-4 text-gray-400">{ticket.venue}</td>
                <td className="p-4 text-green-400">
                  ${ticket.price.toFixed(2)}
                </td>
                <td className="p-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Buy Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Tickets: FC<{ title?: string }> = ({ title }) => {
  const [activeTab, setActiveTab] = useState("league-tickets");

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-5xl mx-auto">
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
          <div>
            {activeTab === "tournament-tickets" && <TournamentTickets />}
            {activeTab === "league-tickets" && <LeagueTickets />}
          </div>
        </div>
      </div>
    </Layout>
  );
};
