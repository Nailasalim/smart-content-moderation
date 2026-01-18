import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ContentList from "../../components/ContentList";

const UserDashboard = () => {
  const { user, isModerator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [contentSubmitted, setContentSubmitted] = useState(false);
  const [contentFlagged, setContentFlagged] = useState(false);

  // Redirect moderators to moderator dashboard
  useEffect(() => {
    if (isModerator) {
      navigate("/moderator", { replace: true });
    }
  }, [isModerator, navigate]);

  // Check for URL parameters indicating submission result
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    if (urlParams.get('submitted') === 'true') {
      setContentSubmitted(true);
      // Clean up URL
      navigate(location.pathname, { replace: true });
      // Hide success message after 3 seconds
      setTimeout(() => setContentSubmitted(false), 3000);
    }
    
    if (urlParams.get('flagged') === 'true') {
      setContentFlagged(true);
      // Clean up URL
      navigate(location.pathname, { replace: true });
      // Hide flagged message after 5 seconds
      setTimeout(() => setContentFlagged(false), 5000);
    }
  }, [location, navigate]);

  return (
    <div style={{
      backgroundColor: "#000000",
      minHeight: "100vh",
      color: "white",
      padding: "2rem 0"
    }}>
      <div style={{
        maxWidth: "975px",
        margin: "0 auto",
        padding: "0 1rem"
      }}>
        {/* Success Message */}
        {contentSubmitted && (
          <div style={{
            backgroundColor: "#0095f6",
            color: "white",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "600"
          }}>
            Content submitted successfully! 🎉
          </div>
        )}

        {/* Flagged Message */}
        {contentFlagged && (
          <div style={{
            backgroundColor: "#ed4956",
            color: "white",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "600"
          }}>
            Content flagged for moderator review. ⚠️
          </div>
        )}

        {/* Header Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #262626",
          paddingBottom: "1rem"
        }}>
          <div>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              fontFamily: "Arial, sans-serif"
            }}>
              User Dashboard
            </h1>
            <p style={{
              color: "#8e8e8e",
              fontSize: "0.9rem"
            }}>
              Welcome back, {user?.name || user?.email}
            </p>
          </div>
          
          <Link
            to="/submit"
            style={{
              backgroundColor: "#0095f6",
              color: "white",
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#1877f2";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#0095f6";
            }}
          >
            Submit Content
          </Link>
        </div>
        
        {/* Content List */}
        <ContentList />
      </div>
    </div>
  );
};

export default UserDashboard;