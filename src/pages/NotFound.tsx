// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p>{message || "The requested page does not exist."}</p>
      <Link to="/" className="text-blue-500 underline">
        Go to Dashboard
      </Link>
    </div>
  );
};
