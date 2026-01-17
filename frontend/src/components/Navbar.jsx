import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isModerator, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{
      backgroundColor: "#000000",
      borderBottom: "1px solid #262626",
      padding: "0 1rem",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: "975px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px"
      }}>
        {/* Logo/Brand */}
        <Link 
          to="/" 
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif"
          }}
        >
          SmartModerate
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          {isAuthenticated && isModerator ? (
            <>
              <Link
                to="/moderator/ai-reports"
                style={{
                  color: "#0095f6",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                AI Reports
              </Link>
              <Link
                to="/moderator/user-reports"
                style={{
                  color: "#0095f6",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                User Reports
              </Link>
            </>
          ) : isAuthenticated && !isModerator ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  color: "#0095f6",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/submit"
                style={{
                  color: "#0095f6",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Submit Content
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "#0095f6",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                style={{
                  color: "#0095f6",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginLeft: "1rem",
              paddingLeft: "1rem",
              borderLeft: "1px solid #262626"
            }}>
              <span style={{
                color: "#8e8e8e",
                fontSize: "0.8rem"
              }}>
                {user?.name || user?.email}
              </span>
              <Link
                to="/dashboard"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "400",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Dashboard
              </Link>
              
              <Link
                to="/submit"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "400",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Submit
              </Link>

              {/* Moderator Links */}
              {isModerator && (
                <>
                  <Link
                    to="/moderator"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: "400",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    Moderator
                  </Link>
                  <Link
                    to="/moderator/queue"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: "400",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    Queue
                  </Link>
                </>
              )}

              {/* User Menu */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginLeft: "1rem",
                paddingLeft: "1rem",
                borderLeft: "1px solid #262626"
              }}>
                <span style={{
                  color: "#8e8e8e",
                  fontSize: "0.8rem"
                }}>
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "transparent",
                    color: "#0095f6",
                    border: "none",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
