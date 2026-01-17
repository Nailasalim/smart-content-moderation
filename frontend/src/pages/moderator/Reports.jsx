import { useEffect, useState } from "react";
import api from "../../api/axios";
import { takeModerationAction, getContentHistory } from "../../api/moderation.api";
import { getReports } from "../../api/report.api";

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});

  useEffect(() => {
    const fetchUserReports = async () => {
      setLoading(true);
      try {
        const res = await getReports();
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Failed to fetch user reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, []);

  const handleAction = async (contentId, action) => {
    setActionLoading(prev => ({ ...prev, [contentId]: action }));
    
    try {
      await takeModerationAction(contentId, action);
      
      // Remove item from list after successful action
      setReports(prev => prev.filter(report => report.content.id !== contentId));
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
        <p>Loading user reports...</p>
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
            User Reports
          </h1>
          <p style={{
            color: "#8e8e8e",
            fontSize: "0.9rem"
          }}>
            Content reported by users
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
            <p>No user reports found</p>
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
                      Report ID: #{report.id}
                    </div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#8e8e8e"
                    }}>
                      Reported by: {report.user.email}
                    </div>
                  </div>
                  <div style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    backgroundColor: report.status === "PENDING" ? "#8e8e8e" : 
                                     report.status === "REVIEWED" ? "#0095f6" : "#ed4956",
                    color: "white"
                  }}>
                    {report.status}
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
                    Reported Content:
                  </div>
                  <div style={{
                    backgroundColor: "#000000",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #363636",
                    color: "white",
                    lineHeight: "1.5"
                  }}>
                    {report.content.text}
                  </div>
                </div>

                {/* Report Details */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#8e8e8e",
                      marginBottom: "0.5rem"
                    }}>
                      Report Reason:
                    </div>
                    <div style={{
                      backgroundColor: "#000000",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #363636",
                      color: "white"
                    }}>
                      {report.reason}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#8e8e8e",
                      marginBottom: "0.5rem"
                    }}>
                      Content Author:
                    </div>
                    <div style={{
                      backgroundColor: "#000000",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #363636",
                      color: "white"
                    }}>
                      {report.content.user.email}
                    </div>
                  </div>
                </div>

                {/* Action History */}
                <div style={{
                  marginTop: "1rem"
                }}>
                  <button
                    onClick={() => toggleHistory(report.content.id)}
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
                    {expandedHistory[report.content.id] ? "Hide Action History" : "Show Action History"}
                  </button>
                  
                  {expandedHistory[report.content.id] && (
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
                      
                      {expandedHistory[report.content.id].length === 0 ? (
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
                          {expandedHistory[report.content.id].map((action, index) => (
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
                    onClick={() => handleAction(report.content.id, "APPROVE")}
                    disabled={actionLoading[report.content.id] === "APPROVE"}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: actionLoading[report.content.id] === "APPROVE" ? "#8e8e8e" : "#0095f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading[report.content.id] === "APPROVE" ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      opacity: actionLoading[report.content.id] === "APPROVE" ? 0.7 : 1
                    }}
                  >
                    {actionLoading[report.content.id] === "APPROVE" ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(report.content.id, "REMOVE")}
                    disabled={actionLoading[report.content.id] === "REMOVE"}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: actionLoading[report.content.id] === "REMOVE" ? "#8e8e8e" : "#ed4956",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading[report.content.id] === "REMOVE" ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      opacity: actionLoading[report.content.id] === "REMOVE" ? 0.7 : 1
                    }}
                  >
                    {actionLoading[report.content.id] === "REMOVE" ? "Removing..." : "Remove"}
                  </button>
                  <button
                    onClick={() => handleAction(report.content.id, "WARN")}
                    disabled={actionLoading[report.content.id] === "WARN"}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: actionLoading[report.content.id] === "WARN" ? "#8e8e8e" : "#ffa500",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading[report.content.id] === "WARN" ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      opacity: actionLoading[report.content.id] === "WARN" ? 0.7 : 1
                    }}
                  >
                    {actionLoading[report.content.id] === "WARN" ? "Warning..." : "Warn"}
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

export default UserReports;
