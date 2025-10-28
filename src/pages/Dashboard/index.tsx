import { FC, useEffect, useMemo, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const METRICS = [
  {
    key: "totalLeagues",
    label: "Total Leagues",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.2)",
  },
  {
    key: "totalUsers",
    label: "Total Users",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.2)",
  },
  {
    key: "totalLeaguesParticipants",
    label: "Total League Participants",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.2)",
  },
  {
    key: "totalMatches",
    label: "Total Matches",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.2)",
  },
  {
    key: "totalTournaments",
    label: "Total Tournaments",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.2)",
  },
  {
    key: "totalTournamentParticipants",
    label: "Total Tournament Participants",
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.2)",
  },
  {
    key: "totalTournamentMatches",
    label: "Total Tournament Matches",
    color: "#14b8a6",
    bg: "rgba(20, 184, 166, 0.2)",
  },
] as const;

export const Dashboard: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard2, loading, error } = useSelector(
    (state: RootState) => state.admins
  );
  const id = window.location.pathname.split("/")[1];

  // Hook: State for selected metric (null = show all)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDashboard2(id));
  }, [dispatch, id]);

  // Base chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: { color: "#ffffff", font: { size: 12 } },
        },
        title: {
          display: true,
          text: selectedMetric
            ? `${
                METRICS.find((m) => m.key === selectedMetric)?.label
              } Over Time`
            : "All Metrics Over Time",
          color: "#ffffff",
          font: { size: 16, weight: "bold" },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
      scales: {
        x: {
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        y: {
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          beginAtZero: true,
        },
      },
    }),
    [selectedMetric]
  );

  // Build datasets: either all or just the selected one
  const chartData = useMemo(() => {
    const labels = dashboard2?.labels ?? [];
    const metricsToShow = selectedMetric
      ? METRICS.filter((m) => m.key === selectedMetric)
      : METRICS;

    const datasets = metricsToShow.map((metric) => ({
      label: metric.label,
      data: (dashboard2?.metrics?.[metric.key] ?? []).map(
        (val: any) => val ?? 0
      ),
      borderColor: metric.color,
      backgroundColor: metric.bg,
      fill: selectedMetric ? true : false, // Fill only when single
      tension: 0.4,
      borderWidth: selectedMetric ? 3 : 2,
      pointRadius: selectedMetric ? 4 : 2,
      pointHoverRadius: selectedMetric ? 6 : 4,
    }));

    return { labels, datasets };
  }, [dashboard2, selectedMetric]);

  // Early returns AFTER hooks
  if (loading) return <HandLogoLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-red-500 bg-opacity-20 p-8 rounded-xl border border-red-500">
          <p className="text-red-400 text-lg font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

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
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
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

          {/* Chart + Filter */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-white font-medium">Filter:</span>
              <select
                value={selectedMetric || ""}
                onChange={(e) => setSelectedMetric(e.target.value || null)}
                className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Metrics</option>
                {METRICS.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
              {selectedMetric && (
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="text-sm text-gray-400 hover:text-white underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
