import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MyActions from "../../components/moderator/MyActions";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  // Check if we're on the my-actions route
  const isMyActionsPage = location.pathname === "/moderator/my-actions";

  // If on my-actions page, show MyActions component
  if (isMyActionsPage) {
    return <MyActions />;
  }

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
        {/* Header */}
        <div style={{
          marginBottom: "2rem",
          borderBottom: "1px solid #262626",
          paddingBottom: "1rem"
        }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            fontFamily: "Arial, sans-serif"
          }}>
            Moderator Dashboard
          </h1>
          <p style={{
            color: "#8e8e8e",
            fontSize: "0.9rem"
          }}>
            Welcome back, {user?.name || user?.email}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div
            onClick={() => navigate("/moderator/ai-reports")}
            style={{
              backgroundColor: "#262626",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid #363636",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#363636";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#262626";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontSize: "2.5rem",
              marginBottom: "1rem"
            }}>
              🤖
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "white"
            }}>
              AI Reports
            </h3>
            <p style={{
              color: "#8e8e8e",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              Content flagged by AI moderation
            </p>
          </div>

          <div
            onClick={() => navigate("/moderator/user-reports")}
            style={{
              backgroundColor: "#262626",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid #363636",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#363636";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#262626";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontSize: "2.5rem",
              marginBottom: "1rem"
            }}>
              👥
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "white"
            }}>
              User Reports
            </h3>
            <p style={{
              color: "#8e8e8e",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              Content reported by users
            </p>
          </div>

          <div
            onClick={() => navigate("/moderator/my-actions")}
            style={{
              backgroundColor: "#262626",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid #363636",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#363636";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#262626";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontSize: "2.5rem",
              marginBottom: "1rem"
            }}>
              📝
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "white"
            }}>
              Your Actions
            </h3>
            <p style={{
              color: "#8e8e8e",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              Actions performed by you
            </p>
          </div>

        </div>

        {/* Stats Overview */}
        <div style={{
          backgroundColor: "#262626",
          borderRadius: "12px",
          padding: "2rem",
          border: "1px solid #363636"
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            color: "white"
          }}>
            Quick Overview
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              textAlign: "center",
              padding: "1rem"
            }}>
              <div style={{
                fontSize: "2rem",
                marginBottom: "0.5rem"
              }}>
                📊
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: "#8e8e8e"
              }}>
                Total Reports
              </div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "1rem"
            }}>
              <div style={{
                fontSize: "2rem",
                marginBottom: "0.5rem"
              }}>
                ⏱️
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: "#8e8e8e"
              }}>
                Pending Review
              </div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "1rem"
            }}>
              <div style={{
                fontSize: "2rem",
                marginBottom: "0.5rem"
              }}>
                ✅
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: "#8e8e8e"
              }}>
                Resolved Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
