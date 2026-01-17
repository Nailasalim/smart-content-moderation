import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireModerator = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT moderator
  if (requireModerator && user?.role !== "MODERATOR") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
