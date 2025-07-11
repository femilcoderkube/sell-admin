import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../app/features/admins/adminSlice";
import { AppDispatch, RootState } from "../../app/store";
import { Layout } from "../../components/layout";
import HandLogoLoader from "../../components/Loader/Loader";

// Utility function to format object keys (e.g., totalLeagues -> Total Leagues)
const formatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Predefined Tailwind color palette for random selection
const colorPalette = [
  "blue-500",
  "purple-600",
  "indigo-700",
  "red-500",
  "green-600",
  "yellow-500",
  "pink-600",
  "teal-500",
  "cyan-600",
  "orange-500",
];

// Utility function to get a random Tailwind color class
const getRandomColorClass = (): string => {
  return colorPalette[Math.floor(Math.random() * colorPalette.length)];
};

// Utility function to generate a random gradient in Tailwind format
const getRandomGradient = (): string => {
  const color1 = getRandomColorClass();
  const color2 = getRandomColorClass();
  const color3 = getRandomColorClass();
  return `from-${color1} via-${color2} to-${color3}`;
};

const CountingAnimation = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(endTime - now, 0);
      const progress = Math.min((duration - remaining) / duration, 1);

      setCount(Math.floor(progress * end));

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const DashboardCard = ({ title, value, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  // Memoize the gradient to prevent re-generation on every render
  const gradient = useMemo(() => getRandomGradient(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <p className="text-white text-sm font-medium opacity-90">{title}</p>
          <div className="text-2xl font-bold text-white mt-1">
            {isVisible && <CountingAnimation end={value} duration={1500} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, loading, error } = useSelector(
    (state: RootState) => state.admins
  );

  useEffect(() => {
    dispatch(fetchDashboard());
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Real-time insights and performance metrics
            </p>
          </div>

          {/* Dashboard Cards Grid */}
          {Object.keys(dashboard).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {Object.entries(dashboard).map(([key, value], index) => {
                return (
                  <DashboardCard
                    key={key}
                    title={formatKey(key)}
                    value={value}
                    delay={index * 100}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-gray-300 text-lg">
                  No dashboard data available.
                </p>
              </div>
            </div>
          )}

          {/* Floating Elements */}

          <div className="fixed bottom-20 right-10 w-16 h-16 bg-purple-500 bg-opacity-20 rounded-full animate-bounce"></div>
          <div className="fixed top-1/2 right-20 w-12 h-12 bg-gray-500 bg-opacity-20 rounded-full animate-ping"></div>
        </div>
      </div>
    </Layout>
  );
};
