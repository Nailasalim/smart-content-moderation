import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { getContentByStatus } from "../../api/content.api";
import { getReportsByContentStatus } from "../../api/report.api";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [actionStatus, setActionStatus] = useState("ALL");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentByActionStatus = async () => {
      setLoading(true);
      try {
        if (actionStatus === "ALL") {
          // For ALL, just fetch flagged content and user reports
          try {
            const flaggedRes = await api.get("/content/flagged");
            const flaggedContent = flaggedRes.data.data || flaggedRes.data || [];
            
            try {
              const reportsRes = await api.get("/report");
              const reportedContent = reportsRes.data.reports || [];
              
              // Combine and deduplicate by content ID
              const allContent = [
                ...flaggedContent.map(item => ({ ...item, source: "AI" })),
                ...reportedContent.map(item => ({ ...item.content, source: "USER", reportReason: item.reason }))
              ].filter((item, index, self) => 
                self.findIndex(t => t.id === item.id) === index
              );
              
              setContent(allContent);
            } catch (reportsError) {
              console.error("Failed to fetch reports:", reportsError);
              // Just show flagged content if reports fail
              setContent(flaggedContent.map(item => ({ ...item, source: "AI" })));
            }
          } catch (flaggedError) {
            console.error("Failed to fetch flagged content:", flaggedError);
            setContent([]);
          }
        } else {
          // For specific statuses, try to fetch content by status
          try {
            const contentRes = await getContentByStatus(actionStatus);
            const moderatedContent = contentRes.data || [];
            
            try {
              const reportsRes = await getReportsByContentStatus(actionStatus);
              const reportedContent = reportsRes.data || [];
              
              // Combine and deduplicate by content ID
              const allContent = [
                ...moderatedContent.map(item => ({ ...item, source: "AI" })),
                ...reportedContent.map(item => ({ ...item.content, source: "USER", reportReason: item.reason }))
              ].filter((item, index, self) => 
                self.findIndex(t => t.id === item.id) === index
              );
              
              setContent(allContent);
            } catch (reportsError) {
              console.error("Failed to fetch reports by status:", reportsError);
              // Just show moderated content if reports fail
              setContent(moderatedContent.map(item => ({ ...item, source: "AI" })));
            }
          } catch (contentError) {
            console.error("Failed to fetch content by status:", contentError);
            setContent([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch content by action status:", err);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContentByActionStatus();
  }, [actionStatus]);

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
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
            onClick={() => setActionStatus("ALL")}
            style={{
              backgroundColor: actionStatus === "ALL" ? "#0095f6" : "#262626",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid #363636",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              if (actionStatus !== "ALL") {
                e.target.style.backgroundColor = "#363636";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (actionStatus !== "ALL") {
                e.target.style.backgroundColor = "#262626";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            <div style={{
              fontSize: "2.5rem",
              marginBottom: "1rem"
            }}>
              📋
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "white"
            }}>
              Action Status
            </h3>
            <p style={{
              color: "#8e8e8e",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              View all moderated content
            </p>
          </div>
        </div>

        {/* Action Status Filter */}
        <div style={{
          backgroundColor: "#262626",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
          border: "1px solid #363636"
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            color: "white"
          }}>
            Action Status Filter
          </h2>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              fontSize: "0.9rem",
              color: "#8e8e8e",
              fontWeight: "600"
            }}>
              Filter by action status:
            </div>
            <div style={{
              display: "flex",
              gap: "0.5rem"
            }}>
              {["ALL", "APPROVED", "REMOVED", "WARNED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setActionStatus(status)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: actionStatus === status ? "#0095f6" : "transparent",
                    color: actionStatus === status ? "white" : "#8e8e8e",
                    border: "1px solid #363636",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Content Display */}
          {loading ? (
            <div style={{
              textAlign: "center",
              padding: "2rem",
              color: "#8e8e8e"
            }}>
              Loading content...
            </div>
          ) : (
            <div style={{
              maxHeight: "400px",
              overflowY: "auto"
            }}>
              {content.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#8e8e8e"
                }}>
                  No content found for this action status
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gap: "1rem"
                }}>
                  {content.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: "8px",
                        padding: "1.5rem",
                        border: "1px solid #363636"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                      }}>
                        <div>
                          <div style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "white",
                            marginBottom: "0.25rem"
                          }}>
                            Content ID: #{item.id}
                          </div>
                          <div style={{
                            fontSize: "0.8rem",
                            color: "#8e8e8e"
                          }}>
                            Source: {item.source === "AI" ? "🤖 AI Flagged" : "👥 User Reported"}
                          </div>
                        </div>
                        <div style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor: item.status === "FLAGGED" ? "#ed4956" : 
                                         item.status === "APPROVED" ? "#0095f6" : 
                                         item.status === "REMOVED" ? "#ed4956" : "#ffa500",
                          color: "white"
                        }}>
                          {item.status || "UNKNOWN"}
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: "#000000",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid #363636",
                        color: "white",
                        lineHeight: "1.5",
                        marginBottom: "1rem"
                      }}>
                        {item.text || "No content available"}
                      </div>
                      {item.reportReason && (
                        <div style={{
                          fontSize: "0.85rem",
                          color: "#8e8e8e",
                          marginBottom: "0.5rem"
                        }}>
                          <strong>Report Reason:</strong> {item.reportReason}
                        </div>
                      )}
                      <div style={{
                        fontSize: "0.8rem",
                        color: "#8e8e8e"
                      }}>
                        Submitted by: {item.user?.email || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
