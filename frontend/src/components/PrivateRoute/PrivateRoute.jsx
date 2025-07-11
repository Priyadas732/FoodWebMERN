import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); // ✅ use correct key
  console.log("PrivateRoute authToken:", localStorage.getItem("authToken"));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
  
};

export default PrivateRoute;
