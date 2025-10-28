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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const METRICS = [
  {
    key: "totalLeagues",
    label: "Total Leagues",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.2)",
    icon: "🏆",
  },
  {
    key: "totalUsers",
    label: "Total Users",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.2)",
    icon: "👥",
  },
  {
    key: "totalLeaguesParticipants",
    label: "Total League Participants",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.2)",
    icon: "⚡",
  },
  {
    key: "totalMatches",
    label: "Total Matches",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.2)",
    icon: "⚔️",
  },
  {
    key: "totalTournaments",
    label: "Total Tournaments",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.2)",
    icon: "🎮",
  },
  {
    key: "totalTournamentParticipants",
    label: "Total Tournament Participants",
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.2)",
    icon: "🌟",
  },
  {
    key: "totalTournamentMatches",
    label: "Total Tournament Matches",
    color: "#14b8a6",
    bg: "rgba(20, 184, 166, 0.2)",
    icon: "🎯",
  },
] as const;

export const Dashboard: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard2, loading, error } = useSelector(
    (state: RootState) => state.admins
  );
  const id = window.location.pathname.split("/")[1];

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboard2(id));
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);
  }, [dispatch, id]);

  // Enhanced chart options with animations
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeInOutQuart" as const,
        delay: (context: any) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default") {
            delay = context.dataIndex * 50;
          }
          return delay;
        },
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "#ffffff",
            font: { size: 13, weight: "500" },
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: {
          display: true,
          text: selectedMetric
            ? `${
                METRICS.find((m) => m.key === selectedMetric)?.label
              } Over Time`
            : "All Metrics Over Time",
          color: "#ffffff",
          font: { size: 18, weight: "bold" },
          padding: { top: 10, bottom: 20 },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#d1d5db",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString();
              }
              return label;
            },
          },
        },
      },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            color: "#9ca3af",
            font: { size: 11 },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawTicks: false,
          },
        },
        y: {
          ticks: {
            color: "#9ca3af",
            font: { size: 11 },
            callback: function (value: any) {
              return value.toLocaleString();
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawTicks: false,
          },
          beginAtZero: true,
        },
      },
    }),
    [selectedMetric]
  );

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
      fill: selectedMetric ? true : false,
      tension: 0.4,
      borderWidth: selectedMetric ? 3 : 2,
      pointRadius: selectedMetric ? 5 : 3,
      pointHoverRadius: selectedMetric ? 8 : 6,
      pointBackgroundColor: metric.color,
      pointBorderColor: "#1f2937",
      pointBorderWidth: 2,
      pointHoverBorderWidth: 3,
    }));

    return { labels, datasets };
  }, [dashboard2, selectedMetric]);

  if (loading) return <HandLogoLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-red-500 bg-opacity-20 p-8 rounded-xl border border-red-500 backdrop-blur-sm animate-pulse">
          <p className="text-red-400 text-lg font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with fade-in animation */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time performance metrics and insights
            </p>
          </div>

          {/* Totals Summary with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(dashboard2?.totals || {}).map(
              ([key, value], index) => {
                const metric = METRICS.find((m) => m.key === key);
                return (
                  <div
                    key={key}
                    className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      backgroundImage: `linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {metric?.icon || "📊"}
                      </span>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor:
                            metric?.bg || "rgba(59, 130, 246, 0.2)",
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: metric?.color || "#3b82f6",
                          }}
                        ></div>
                      </div>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-400 capitalize mb-2 tracking-wide">
                      {key
                        .replace(/total/gi, "")
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </h2>
                    <p
                      className="text-4xl font-bold transition-colors duration-300"
                      style={{ color: metric?.color || "#3b82f6" }}
                    >
                      {(value as number).toLocaleString()}
                    </p>
                  </div>
                );
              }
            )}
          </div>

          {/* Chart + Filter with fade-in */}
          <div
            className={`bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-white font-semibold text-lg flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Filter Metrics:
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={selectedMetric || ""}
                  onChange={(e) => setSelectedMetric(e.target.value || null)}
                  className="bg-gray-700 text-white px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600 transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <option value="">All Metrics</option>
                  {METRICS.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.icon} {m.label}
                    </option>
                  ))}
                </select>
                {selectedMetric && (
                  <button
                    onClick={() => setSelectedMetric(null)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 hover:scale-105 font-medium border border-red-500/30"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>

            <div className="h-96 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none rounded-lg"></div>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </Layout>
  );
};
