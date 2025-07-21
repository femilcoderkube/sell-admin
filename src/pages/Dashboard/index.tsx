import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../app/features/admins/adminSlice";
import { AppDispatch, RootState } from "../../app/store";
import { Layout } from "../../components/layout";
import HandLogoLoader from "../../components/Loader/Loader";
import { Link } from "react-router";

// Utility function to format object keys (e.g., totalLeagues -> Total Leagues)
const formatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
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

const DashboardCard = ({ title, value, delay = 0, color = "emerald" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const adminSidebar = localStorage.getItem("admin");
  const jsonValue = JSON.parse(adminSidebar as any);
  let partnerId = jsonValue?.adminAccess?.modules?.find(
    (val: any) => val?.isPartner === true
  )?.partnerId;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      // to={
      //   title === "Total Leagues"
      //     ? `/${partnerId}/leagues`
      //     : title === "Total Users"
      //     ? "/user-controll/all-user"
      //     : ""
      // }
      className={`bg-gradient-to-br rounded-xl p-6 shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${
        title === "Total Leagues" || title === "Total Users"
          ? "cursor-pointer"
          : "cursor-default"
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
  ); // Adjust to match slice name

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
        </div>
      </div>
    </Layout>
  );
};
