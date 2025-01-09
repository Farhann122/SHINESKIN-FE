import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, isAdmin, children }) => {
  if (!isAuthenticated) {
    // Redirect ke halaman login jika tidak login
    return <Navigate to="/" />;
  }

  if (isAdmin === false) {
    // Redirect ke halaman dashboard jika bukan admin
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
