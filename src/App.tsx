import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";
import { useEffect, useMemo, useState } from "react";
import { RoutesProps } from "./utils";
import { generateRoutes } from "./routes/menuItems";
import { useSelector } from "react-redux";

export const App = () => {
  const booleanValue = useSelector((state) => state.boolean.value);
  console.log("booleanValue", booleanValue);

  // Use state to store admin data from localStorage
  const [adminData, setAdminData] = useState(() => {
    const adminSidebar = localStorage.getItem("admin");
    return adminSidebar ? JSON.parse(adminSidebar) : null;
  });

  // Listen for changes to localStorage (e.g., login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const adminSidebar = localStorage.getItem("admin");
      setAdminData(adminSidebar ? JSON.parse(adminSidebar) : null);
    };

    // Listen for storage events (cross-tab changes)
    window.addEventListener("storage", handleStorageChange);

    // Optionally, you can also check for changes in the same tab
    // This is useful if localStorage is updated programmatically in the same session
    const interval = setInterval(() => {
      const adminSidebar = localStorage.getItem("admin");
      setAdminData((prev) => {
        const newData = adminSidebar ? JSON.parse(adminSidebar) : null;
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    }, 1000); // Poll every 1 second (adjust as needed)

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Memoize routes based on adminData
  const routes: RoutesProps[] = useMemo(() => {
    const adminside = adminData?.adminAccess?.modules || [];
    return generateRoutes(adminside, adminData);
  }, [adminData]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {routes?.map((item, key) => {
          if (item.submenu && item.submenu.length > 0) {
            return item.submenu.map((subItem, subKey) => (
              <Route
                key={`route${key}_${subKey}`}
                path={subItem.path}
                element={
                  subItem.auth ? (
                    <PrivateRoute>{subItem.component}</PrivateRoute>
                  ) : (
                    subItem.component
                  )
                }
              />
            ));
          }
          return (
            <Route
              key={`route${key}`}
              path={item.path}
              element={
                item.auth ? (
                  <PrivateRoute>{item.component}</PrivateRoute>
                ) : (
                  <AuthRoute>{item.component}</AuthRoute>
                )
              }
            />
          );
        })}
      </Routes>
    </>
  );
};
