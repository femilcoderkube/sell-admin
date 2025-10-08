import { FC } from "react";
import { Link } from "react-router";
import viewIcon from "../../assets/images/eye_icon.svg";
import { Pagination } from "../ui/Pagination";
import HandLogoLoader from "../Loader/Loader";
interface Ticket {
  event: string;
  date: string;
  venue: string;
  price: number;
}

interface TournamentTicketsProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const TournamentTickets: FC<TournamentTicketsProps> = ({
  tickets,
  loading,
  error,
  currentPage,
  perPage,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / perPage);
  const partnerId = window.location.pathname.split("/")[1];
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Tournament Tickets</h2>
      {loading && <HandLogoLoader />}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && tickets.length === 0 && (
        <p className="text-gray-400">No tickets found.</p>
      )}
      {!loading && !error && tickets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="p-4 font-semibold">#</th>
                <th className="p-4 font-semibold">Raiser</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Comment</th>
                <th className="p-4 font-semibold">Created At</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((dispute: any, index: any) => (
                <tr key={dispute._id} className="border-b border-gray-700/50">
                  <td className="p-4"> {(currentPage - 1) * 10 + index + 1}</td>
                  <td className="p-4">{dispute.raiser}</td>
                  <td className="p-4 text-gray-400">{dispute.type}</td>
                  <td className="p-4 text-gray-400">{dispute.status}</td>
                  <td className="p-4 text-gray-400">{dispute.comment}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/${partnerId}/tournament/${dispute.tournamentId}/stage/list/${dispute?.matchId}`}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
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
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPagePrevious={() => currentPage - 1}
        onPageNext={() => currentPage + 1}
      />
    </div>
  );
};

export default TournamentTickets;
