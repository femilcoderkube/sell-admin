import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { fetchRole } from "../../app/features/admins/adminSlice";
import { logout } from "../../app/features/auth/authSlice";
import {
  deleteTournament,
  fetchTournaments,
  fetchTournamentsCounts,
  setPage,
  setPerPage,
} from "../../app/features/tournament/tournamentSlice";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { Pagination } from "../ui/Pagination";
import HandLogoLoader from "../Loader/Loader";
import {
  ArrowLeft,
  Search,
  Plus,
  Trophy,
  Users,
  Megaphone,
  Star,
  Calendar,
  FileText,
  TrendingUp,
  Settings,
  Eye,
  ChevronRight,
} from "lucide-react";
import { PlusIcon } from "../ui";

export const Stages: React.FC = ({ title }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentId = window.location.pathname.split("/")[3];

  const { role } = useSelector((state: RootState) => state.admins);
  const { totalCounts } = useSelector((state: RootState) => state.tournaments);

  const roles = localStorage.getItem("admin");
  const jsonValue = JSON.parse(roles as any);

  const partnerId = window.location.pathname.split("/")[1];
  const id = window.location.pathname.split("/")[3];

  const [searchTerm, setSearchTerm] = useState("");
  const [maxItems, setMaxItems] = useState(10);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchTournamentsCounts({ id: tournamentId }));
    }
  }, [dispatch]);

  const btnBack = () => {
    navigate(-1);
  };

  const statsCards = [
    {
      id: 1,
      title: "Stages & Matches",
      icon: Trophy,
      bgGradient: "from-blue-500 to-blue-600",
      stats: [
        {
          label: "Total matches",
          value: totalCounts?.totalMatches,
          color: "text-blue-100",
        },
        // { label: "Ongoing Matches", value: "0", color: "text-blue-100" },
        {
          label: "Total Stages",
          value: totalCounts?.totalStages,
          color: "text-blue-100",
        },
      ],
      link: `/${partnerId}/tournament/${id}/stage/list`,
      fullWidth: true,
    },
    {
      id: 2,
      title: "Participants",
      icon: Users,
      bgGradient: "from-green-500 to-green-600",
      stats: [
        // { label: "Players", value: "0", color: "text-green-100" },
        {
          label: "Teams",
          value: totalCounts?.totalParticipants,
          color: "text-green-100",
        },
      ],
      link: `/${partnerId}/tournament/${id}/stage/participants`,
    },
    {
      id: 3,
      title: "Bulk Registration",
      icon: Megaphone,
      bgGradient: "from-purple-500 to-purple-600",
      description: "You can add participants manually to this league.",
      link: `/${partnerId}/tournament/${id}/stage/bulkregistration`,
    },
    {
      id: 4,
      title: "Admins",
      icon: Star,
      bgGradient: "from-orange-500 to-orange-600",
      stats: [
        { label: "Number of admins", value: "0", color: "text-orange-100" },
      ],
      description: "You can add admins to manage this tournament.",
      link: ``,
      fullWidth: true,
    },
    {
      id: 5,
      title: "Timeline",
      icon: Calendar,
      bgGradient: "from-indigo-500 to-indigo-600",
      description: "You can show this tournament timeline for all users.",
      link: ``,
    },
    {
      id: 6,
      title: "Championship Logs",
      icon: FileText,
      bgGradient: "from-red-500 to-red-600",
      description: "You can view all the logs of this tournament.",
      link: ``,
    },
  ];

  const themeClasses = {
    dark: {
      bg: "bg-gray-900",
      cardBg: "bg-gray-800",
      text: "text-white",
      textSecondary: "text-gray-300",
      border: "border-gray-700",
      input: "bg-gray-700 text-white placeholder-gray-400",
      button: "bg-gray-700 hover:bg-gray-600",
    },
    light: {
      bg: "bg-gray-50",
      cardBg: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      input: "bg-white text-gray-900 placeholder-gray-500",
      button: "bg-gray-100 hover:bg-gray-200",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      {/* Header */}
      <div
        className={`${currentTheme.cardBg} shadow-lg border-b ${currentTheme.border}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center py-6">
            {/* Back Button & Title */}
            <div className="flex items-center gap-6">
              <button
                onClick={btnBack}
                className={`flex items-center gap-2 ${currentTheme.text} hover:opacity-75 transition-opacity duration-200 px-3 py-2 rounded-lg ${currentTheme.button}`}
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1
                  className={`text-2xl lg:text-3xl font-bold ${currentTheme.text}`}
                >
                  {title}
                </h1>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                to={`/${partnerId}/tournament/${id}/stage/add`}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
              >
                <PlusIcon />
                <span>Add New Stage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {statsCards.map((card) => {
            const IconComponent = card.icon;
            const isFullWidth = card.fullWidth;

            return (
              <Link
                key={card.id}
                to={card.link}
                state={{
                  type: location?.state?.tournament?.tournamentType,
                }}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isFullWidth ? "md:col-span-2 xl:col-span-1" : ""
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-90 pointer-events-none`}
                ></div>

                {/* Card Content */}
                <div className="relative p-6 text-white">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                    </div>
                    <Link
                      to={card.link}
                      state={{
                        type: location?.state?.tournament?.tournamentType,
                      }}
                    >
                      <ChevronRight
                        size={20}
                        className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                      />
                    </Link>
                  </div>

                  {/* Stats */}
                  {/* {card.stats && (
                    <div className="space-y-3 mb-4">
                      {card.stats.map((stat, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-white/80 text-sm">
                            {stat.label}:
                          </span>
                          <span className="text-xl font-bold">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )} */}

                  {/* Description */}
                  {card.description && (
                    <p className="text-white/90 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stages;
