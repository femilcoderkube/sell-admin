import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";
import { useMemo } from "react";
import { RoutesProps } from "./utils";
import { generateRoutes } from "./routes/menuItems";

export const App = () => {
  const adminSidebar = localStorage.getItem("admin");
  const jsonValue = adminSidebar ? JSON.parse(adminSidebar) : null;
  const routes: RoutesProps[] = useMemo(() => {
    const adminside = jsonValue?.adminAccess?.modules || [];
    return generateRoutes(adminside, jsonValue);
  }, [jsonValue, localStorage]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {routes?.map((item, key) => {
          if (item.submenu && item.submenu.length > 0) {
            return item.submenu.map((subItem, subKey) => {
              return (
                <Route
                  key={"route" + key + "_" + subKey}
                  path={subItem.path}
                  element={
                    subItem.auth ? (
                      <PrivateRoute>{subItem.component}</PrivateRoute>
                    ) : (
                      subItem.component
                    )
                  }
                />
              );
            });
          }
          return (
            <Route
              key={"route" + key}
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
