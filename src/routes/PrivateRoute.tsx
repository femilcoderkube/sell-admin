import React from "react";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default PrivateRoute;
