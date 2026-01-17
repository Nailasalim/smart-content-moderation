import { useEffect, useState } from "react";
import api from "../../api/axios";
import { takeModerationAction, getContentHistory } from "../../api/moderation.api";

const AIReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});

  useEffect(() => {
    const fetchAIReports = async () => {
      setLoading(true);
      try {
        const res = await api.get("/content/flagged");
        setReports(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch AI reports", err);
        setReports([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAIReports();
  }, []);

  const handleAction = async (contentId, action) => {
    setActionLoading(prev => ({ ...prev, [contentId]: action }));
    
    try {
      await takeModerationAction(contentId, action);
      
      // Remove item from list after successful action
      setReports(prev => prev.filter(report => report.id !== contentId));
    } catch (err) {
      console.error("Failed to take action:", err);
      alert(`Failed to ${action.toLowerCase()} content. Please try again.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [contentId]: null }));
    }
  };

  const toggleHistory = async (contentId) => {
    if (expandedHistory[contentId]) {
      setExpandedHistory(prev => ({ ...prev, [contentId]: false }));
      return;
    }

    try {
      const res = await getContentHistory(contentId);
      setExpandedHistory(prev => ({ ...prev, [contentId]: res.data }));
    } catch (err) {
      console.error("Failed to fetch history:", err);
      alert("Failed to fetch action history.");
    }
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <p>Loading AI reports...</p>
      </div>
    );
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
            AI Reports
          </h1>
          <p style={{
            color: "#8e8e8e",
            fontSize: "0.9rem"
          }}>
            Content flagged by AI moderation
          </p>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div style={{
            backgroundColor: "#262626",
            borderRadius: "8px",
            padding: "3rem",
            textAlign: "center",
            color: "#8e8e8e"
          }}>
            <p>No AI-flagged content found</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem"
          }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  backgroundColor: "#262626",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  border: "1px solid #363636"
                }}
              >
                {/* Report Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #363636"
                }}>
                  <div>
                    <div style={{
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "white",
                      marginBottom: "0.25rem"
                    }}>
                      Content ID: #{report.id}
                    </div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#8e8e8e"
                    }}>
                      Submitted by: {report.user?.email || "Unknown"}
                    </div>
                  </div>
                  <div style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    backgroundColor: report.status === "FLAGGED" ? "#ed4956" : "#0095f6",
                    color: "white"
                  }}>
                    {report.status || "UNKNOWN"}
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#8e8e8e",
                    marginBottom: "0.5rem"
                  }}>
                    Flagged Content:
                  </div>
                  <div style={{
                    backgroundColor: "#000000",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #363636",
                    color: "white",
                    lineHeight: "1.5"
                  }}>
                    {report.text || "No content available"}
                  </div>
                </div>

                {/* AI Details */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#8e8e8e",
                      marginBottom: "0.5rem"
                    }}>
                      AI Attempts:
                    </div>
                    <div style={{
                      backgroundColor: "#000000",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #363636",
                      color: "white"
                    }}>
                      {report.aiAttempts || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#8e8e8e",
                      marginBottom: "0.5rem"
                    }}>
                      AI Completed:
                    </div>
                    <div style={{
                      backgroundColor: "#000000",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #363636",
                      color: "white"
                    }}>
                      {report.aiCompleted ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* AI Error */}
                {report.aiError && (
                  <div style={{
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#8e8e8e",
                      marginBottom: "0.5rem"
                    }}>
                      AI Error:
                    </div>
                    <div style={{
                      backgroundColor: "#000000",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #363636",
                      color: "#ed4956",
                      fontSize: "0.8rem"
                    }}>
                      {report.aiError}
                    </div>
                  </div>
                )}

                {/* Action History */}
                <div style={{
                  marginTop: "1rem"
                }}>
                  <button
                    onClick={() => toggleHistory(report.id)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#0095f6",
                      border: "1px solid #0095f6",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      width: "100%"
                    }}
                  >
                    {expandedHistory[report.id] ? "Hide Action History" : "Show Action History"}
                  </button>
                  
                  {expandedHistory[report.id] && (
                    <div style={{
                      marginTop: "1rem",
                      backgroundColor: "#1a1a1a",
                      borderRadius: "8px",
                      padding: "1rem",
                      border: "1px solid #363636"
                    }}>
                      <div style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "white",
                        marginBottom: "0.75rem"
                      }}>
                        Action History
                      </div>
                      
                      {expandedHistory[report.id].length === 0 ? (
                        <div style={{
                          color: "#8e8e8e",
                          fontSize: "0.85rem",
                          textAlign: "center",
                          padding: "1rem"
                        }}>
                          No actions taken yet
                        </div>
                      ) : (
                        <div style={{
                          display: "grid",
                          gap: "0.75rem"
                        }}>
                          {expandedHistory[report.id].map((action, index) => (
                            <div
                              key={action.id}
                              style={{
                                backgroundColor: "#262626",
                                borderRadius: "8px",
                                padding: "0.75rem",
                                border: "1px solid #363636"
                              }}
                            >
                              <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.5rem"
                              }}>
                                <div>
                                  <div style={{
                                    fontSize: "0.85rem",
                                    color: "white",
                                    fontWeight: "600"
                                  }}>
                                    {action.action}
                                  </div>
                                  <div style={{
                                    fontSize: "0.75rem",
                                    color: "#8e8e8e",
                                    marginTop: "0.25rem"
                                  }}>
                                    by {action.moderator.email}
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: "0.75rem",
                                  color: "#8e8e8e"
                                }}>
                                  {new Date(action.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "1rem"
                }}>
                  <button
                    onClick={() => handleAction(report.id, "APPROVE")}
                    disabled={actionLoading[report.id] === "APPROVE"}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: actionLoading[report.id] === "APPROVE" ? "#8e8e8e" : "#0095f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading[report.id] === "APPROVE" ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      opacity: actionLoading[report.id] === "APPROVE" ? 0.7 : 1
                    }}
                  >
                    {actionLoading[report.id] === "APPROVE" ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(report.id, "REMOVE")}
                    disabled={actionLoading[report.id] === "REMOVE"}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: actionLoading[report.id] === "REMOVE" ? "#8e8e8e" : "#ed4956",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading[report.id] === "REMOVE" ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      opacity: actionLoading[report.id] === "REMOVE" ? 0.7 : 1
                    }}
                  >
                    {actionLoading[report.id] === "REMOVE" ? "Removing..." : "Remove"}
                  </button>
                  <button
                    onClick={() => handleAction(report.id, "WARN")}
                    disabled={actionLoading[report.id] === "WARN"}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: actionLoading[report.id] === "WARN" ? "#8e8e8e" : "#ffa500",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading[report.id] === "WARN" ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      opacity: actionLoading[report.id] === "WARN" ? 0.7 : 1
                    }}
                  >
                    {actionLoading[report.id] === "WARN" ? "Warning..." : "Warn"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReports;
