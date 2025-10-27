import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard2 } from "../../app/features/admins/adminSlice";
import { AppDispatch, RootState } from "../../app/store";
import { Layout } from "../../components/layout";
import HandLogoLoader from "../../components/Loader/Loader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard2, loading, error } = useSelector(
    (state: RootState) => state.admins
  );

  const id = window.location.pathname.split("/")[1];
  useEffect(() => {
    dispatch(fetchDashboard2(id));
  }, [dispatch]);

  if (loading) {
    return <HandLogoLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-red-500 bg-opacity-20 p-8 rounded-xl border border-red-500">
          <p className="text-red-400 text-lg font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        color: "#ffffff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  // Chart data configurations
  const totalLeaguesChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total Leagues",
          data: dashboard2?.metrics?.totalLeagues || [],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total Leagues Over Time",
        },
      },
    },
  };

  const totalUsersChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total Users",
          data: dashboard2?.metrics?.totalUsers || [],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total Users Over Time",
        },
      },
    },
  };

  const totalLeaguesParticipantsChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total League Participants",
          data: dashboard2?.metrics?.totalLeaguesParticipants || [],
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total League Participants Over Time",
        },
      },
    },
  };

  const totalMatchesChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total Matches",
          data: dashboard2?.metrics?.totalMatches || [],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total Matches Over Time",
        },
      },
    },
  };

  const totalTournamentsChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total Tournaments",
          data: dashboard2?.metrics?.totalTournaments || [],
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total Tournaments Over Time",
        },
      },
    },
  };

  const totalTournamentParticipantsChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total Tournament Participants",
          data: dashboard2?.metrics?.totalTournamentParticipants || [],
          borderColor: "#ec4899",
          backgroundColor: "rgba(236, 72, 153, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total Tournament Participants Over Time",
        },
      },
    },
  };

  const totalTournamentMatchesChart = {
    type: "line",
    data: {
      labels: dashboard2?.labels || [],
      datasets: [
        {
          label: "Total Tournament Matches",
          data: dashboard2?.metrics?.totalTournamentMatches || [],
          borderColor: "#14b8a6",
          backgroundColor: "rgba(20, 184, 166, 0.5)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "Total Tournament Matches Over Time",
        },
      },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
          </div>

          {/* Totals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(dashboard2?.totals || {}).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <h2 className="text-lg font-semibold text-gray-300 capitalize">
                  {key
                    .replace(/total/gi, "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </h2>
                <p className="text-3xl font-bold text-blue-400">{value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalLeaguesChart.data}
                options={totalLeaguesChart.options}
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalUsersChart.data}
                options={totalUsersChart.options}
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalLeaguesParticipantsChart.data}
                options={totalLeaguesParticipantsChart.options}
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalMatchesChart.data}
                options={totalMatchesChart.options}
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalTournamentsChart.data}
                options={totalTournamentsChart.options}
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalTournamentParticipantsChart.data}
                options={totalTournamentParticipantsChart.options}
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
              <Line
                data={totalTournamentMatchesChart.data}
                options={totalTournamentMatchesChart.options}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
