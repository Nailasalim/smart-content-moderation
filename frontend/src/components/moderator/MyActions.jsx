import { useState, useEffect } from "react";
import { getMyActions } from "../../api/moderation.api";

const MyActions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchMyActions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filterParam = activeFilter === "All" ? null : activeFilter;
        console.log("Fetching my actions with filter:", filterParam);
        const response = await getMyActions(filterParam);
        console.log("My actions response:", response);
        setActions(response.data || []);
      } catch (err) {
        console.error("Failed to fetch my actions:", err);
        console.error("Error details:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load your moderation actions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyActions();
  }, [activeFilter]);

  const getActionColor = (action) => {
    switch (action) {
      case "APPROVED": return "#00c851"; // Green
      case "REMOVED": return "#ed4956"; // Red
      case "WARNED": return "#ffa500"; // Orange
      default: return "#8e8e8e"; // Gray
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "APPROVED": return "✅";
      case "REMOVED": return "🗑️";
      case "WARNED": return "⚠️";
      default: return "📋";
    }
  };

  const filters = ["All", "APPROVED", "REMOVED", "WARNED"];

  if (loading) {
    return (
      <div style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        color: "white",
        padding: "2rem"
      }}>
        <div style={{
          maxWidth: "975px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Loading your actions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        color: "white",
        padding: "2rem"
      }}>
        <div style={{
          maxWidth: "975px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#ed4956" }}>Error</div>
          <div style={{ fontSize: "1rem", color: "#8e8e8e" }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "#000000",
      minHeight: "100vh",
      color: "white",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: "975px",
        margin: "0 auto"
      }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          fontFamily: "Arial, sans-serif"
        }}>
          Your Actions
        </h1>

        {/* Filter Tabs */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "1px solid #262626",
          paddingBottom: "1rem"
        }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                backgroundColor: activeFilter === filter ? "#0095f6" : "transparent",
                color: activeFilter === filter ? "white" : "#8e8e8e",
                border: activeFilter === filter ? "none" : "1px solid #363636",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                if (activeFilter !== filter) {
                  e.target.style.backgroundColor = "#363636";
                  e.target.style.color = "white";
                }
              }}
              onMouseOut={(e) => {
                if (activeFilter !== filter) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#8e8e8e";
                }
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Actions List */}
        {actions.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "3rem 0",
            color: "#8e8e8e"
          }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>No actions found</div>
            <div>You haven't performed any moderation actions yet.</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem"
          }}>
            {actions.map((action) => (
              <div
                key={action.id}
                style={{
                  backgroundColor: "#262626",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #363636"
                }}
              >
                {/* Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <span style={{
                      fontSize: "1.5rem",
                    }}>
                      {getActionIcon(action.action)}
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: getActionColor(action.action)
                    }}>
                      {action.action}
                    </span>
                  </div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#8e8e8e"
                  }}>
                    {new Date(action.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Content Preview */}
                <div style={{
                  backgroundColor: "#363636",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#8e8e8e",
                    marginBottom: "0.5rem",
                    fontWeight: "600"
                  }}>
                    Content:
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "white",
                    lineHeight: "1.4",
                    maxHeight: "100px",
                    overflowY: "auto"
                  }}>
                    {action.content.text}
                  </div>
                </div>

                {/* Content Status */}
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}>
                  <span style={{
                    fontSize: "0.8rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    backgroundColor: getActionColor(action.content.status),
                    color: "white",
                    fontWeight: "600"
                  }}>
                    Status: {action.content.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActions;
