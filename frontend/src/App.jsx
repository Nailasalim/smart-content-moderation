import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Public pages
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import SubmitContent from "./pages/user/SubmitContent";
import YourReports from "./pages/user/YourReports";

// Moderator pages
import AIReports from "./pages/moderator/AIReports";
import UserReports from "./pages/moderator/UserReports";
import MyActions from "./components/moderator/MyActions";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";

// Route protection
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitContent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/your-reports"
            element={
              <ProtectedRoute>
                <YourReports />
              </ProtectedRoute>
            }
          />

          {/* Moderator protected routes */}
          <Route
            path="/moderator"
            element={
              <ProtectedRoute requireModerator>
                <ModeratorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/moderator/ai-reports"
            element={
              <ProtectedRoute requireModerator>
                <AIReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/moderator/user-reports"
            element={
              <ProtectedRoute requireModerator>
                <UserReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/moderator/my-actions"
            element={
              <ProtectedRoute requireModerator>
                <MyActions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
