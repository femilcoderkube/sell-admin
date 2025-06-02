import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import { routes } from "./routes";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";

export const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <h1 className="text-white">hello</h1>
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
