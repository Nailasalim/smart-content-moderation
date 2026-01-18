import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { getContentById } from "../../api/content.api";

const YourReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewContentModal, setViewContentModal] = useState({ isOpen: false, content: null, loading: false });

  useEffect(() => {
    const fetchUserReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Always fetch fresh data from backend (no caching)
        const response = await api.get("/report/my-reports", {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        console.log("Reports response:", response.data);
        setReports(response.data || []);
      } catch (err) {
        console.error("Failed to fetch user reports:", err);
        setError(err.response?.data?.message || "Failed to fetch your reports");
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, []);

  const getStatusColor = (status, moderatorAction) => {
    // If reviewed, use color based on moderator action
    if (status === "REVIEWED") {
      if (moderatorAction === "APPROVED") return "#00c851"; // Green
      if (moderatorAction === "REMOVED") return "#ed4956"; // Red
      if (moderatorAction === "WARNED") return "#ffa500"; // Orange
      return "#0095f6"; // Blue (reviewed but no action yet)
    }
    // PENDING status
    if (status === "PENDING") return "#ffa500"; // Yellow/Orange
    return "#8e8e8e"; // Default gray
  };

  const handleViewContent = async (contentId) => {
    setViewContentModal({ isOpen: true, content: null, loading: true });
    
    try {
      const response = await getContentById(contentId);
      setViewContentModal({ isOpen: true, content: response.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch content:", err);
      setViewContentModal({ isOpen: true, content: null, loading: false });
      alert("Failed to load content details. Please try again.");
    }
  };

  const closeContentModal = () => {
    setViewContentModal({ isOpen: false, content: null, loading: false });
  };

  if (loading) {
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
          padding: "0 1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Loading your reports...</div>
            <div style={{ color: "#8e8e8e" }}>Please wait while we fetch your reported content</div>
          </div>
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
        padding: "2rem 0"
      }}>
        <div style={{
          maxWidth: "975px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}>
          <div style={{ textAlign: "center", color: "#ed4956" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Error</div>
            <div>{error}</div>
          </div>
        </div>
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
            Your Reports
          </h1>
          <p style={{
            color: "#8e8e8e",
            fontSize: "0.9rem"
          }}>
            Content you reported and their moderation status
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div style={{
            backgroundColor: "#262626",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0095f6" }}>
              {reports.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Total Reports</div>
          </div>
          <div style={{
            backgroundColor: "#262626",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ffa500" }}>
              {reports.filter(r => r.status === "PENDING").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Pending</div>
          </div>
          <div style={{
            backgroundColor: "#262626",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0095f6" }}>
              {reports.filter(r => r.status === "REVIEWED").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Reviewed</div>
          </div>
          <div style={{
            backgroundColor: "#262626",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ed4956" }}>
              {reports.filter(r => r.moderatorAction === "REMOVED").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Content Removed</div>
          </div>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div style={{
            backgroundColor: "#262626",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
            color: "#8e8e8e"
          }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>No reports found</div>
            <div>You haven't reported any content yet.</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem"
          }}>
            {reports.map((report) => {
              console.log("Rendering report:", report);
              return (
              <div
                key={report.reportId}
                style={{
                  backgroundColor: "#262626",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #363636"
                }}
              >
                {/* Report Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#8e8e8e",
                      marginBottom: "0.25rem"
                    }}>
                      Report ID: #{report.reportId}
                    </div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#8e8e8e",
                      marginBottom: "0.25rem"
                    }}>
                      Report Date: {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}>
                    {/* Status Badge */}
                    <span style={{
                      fontSize: "0.8rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      backgroundColor: getStatusColor(report.status, report.moderatorAction),
                      color: "white",
                      fontWeight: "600"
                    }}>
                      {report.status}
                    </span>
                    {/* Moderator Action Badge (only if reviewed) */}
                    {report.status === "REVIEWED" && report.moderatorAction && (
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "6px",
                        backgroundColor: getStatusColor("REVIEWED", report.moderatorAction),
                        color: "white",
                        fontWeight: "600"
                      }}>
                        {report.moderatorAction}
                      </span>
                    )}
                  </div>
                </div>

                {/* Report Reason */}
                <div style={{
                  backgroundColor: "#363636",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "#8e8e8e",
                    marginBottom: "0.5rem",
                    fontWeight: "600"
                  }}>
                    Report Reason:
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    color: "white",
                    lineHeight: "1.4"
                  }}>
                    {report.reason}
                  </div>
                </div>

                {/* Reported Content */}
                <div style={{
                  backgroundColor: "#363636",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    flexWrap: "wrap",
                    gap: "0.5rem"
                  }}>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#8e8e8e",
                      fontWeight: "600"
                    }}>
                      Content Preview:
                    </div>
                    <button
                      onClick={() => {
                        console.log("Button clicked, contentId:", report.contentId);
                        if (report.contentId) {
                          handleViewContent(report.contentId);
                        } else {
                          console.error("Content ID is missing:", report);
                          alert("Content ID is missing. Cannot view full content.");
                        }
                      }}
                      disabled={!report.contentId}
                      style={{
                        backgroundColor: report.contentId ? "#0095f6" : "#363636",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        cursor: report.contentId ? "pointer" : "not-allowed",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                        opacity: report.contentId ? 1 : 0.5,
                        minWidth: "140px"
                      }}
                      onMouseOver={(e) => {
                        if (report.contentId) {
                          e.target.style.backgroundColor = "#1877f2";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (report.contentId) {
                          e.target.style.backgroundColor = "#0095f6";
                        }
                      }}
                    >
                      View Full Content
                    </button>
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    color: "white",
                    lineHeight: "1.4",
                    maxHeight: "150px",
                    overflowY: "auto"
                  }}>
                    {report.contentText}
                  </div>
                </div>

                {/* Moderator Action (if reviewed) */}
                {report.status === "REVIEWED" && report.moderatorAction && (
                  <div style={{
                    backgroundColor: "#363636",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    borderLeft: `4px solid ${getStatusColor("REVIEWED", report.moderatorAction)}`
                  }}>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#8e8e8e",
                      marginBottom: "0.5rem",
                      fontWeight: "600"
                    }}>
                      Final Moderator Action:
                    </div>
                    <div style={{
                      fontSize: "1rem",
                      color: "white",
                      fontWeight: "600"
                    }}>
                      {report.moderatorAction}
                    </div>
                    {report.reviewedAt && (
                      <div style={{
                        fontSize: "0.75rem",
                        color: "#8e8e8e",
                        marginTop: "0.5rem"
                      }}>
                        Reviewed on: {new Date(report.reviewedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Content Modal */}
      {viewContentModal.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={closeContentModal}
        >
          <div
            style={{
              backgroundColor: "#262626",
              padding: "2rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "80vh",
              overflowY: "auto",
              border: "1px solid #363636",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeContentModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "transparent",
                border: "none",
                color: "#8e8e8e",
                fontSize: "1.5rem",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#363636";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#8e8e8e";
              }}
            >
              ×
            </button>

            {viewContentModal.loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#8e8e8e" }}>
                Loading content...
              </div>
            ) : viewContentModal.content ? (
              <>
                <h2 style={{
                  marginTop: 0,
                  marginBottom: "1.5rem",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  Full Content
                </h2>

                {/* User Info */}
                {viewContentModal.content.user && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #363636"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#0095f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      marginRight: "1rem"
                    }}>
                      {(viewContentModal.content.user.name || viewContentModal.content.user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{
                        fontWeight: "600",
                        fontSize: "1rem",
                        color: "white"
                      }}>
                        {viewContentModal.content.user.name || viewContentModal.content.user.email}
                      </div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#8e8e8e"
                      }}>
                        {new Date(viewContentModal.content.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Text */}
                <div style={{
                  backgroundColor: "#363636",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#8e8e8e",
                    marginBottom: "0.75rem",
                    fontWeight: "600"
                  }}>
                    Content:
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    color: "white",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                  }}>
                    {viewContentModal.content.text}
                  </div>
                </div>

                {/* Status */}
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}>
                  <span style={{
                    fontSize: "0.85rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    backgroundColor: getStatusColor(viewContentModal.content.status),
                    color: "white",
                    fontWeight: "600"
                  }}>
                    Status: {viewContentModal.content.status}
                  </span>
                  {viewContentModal.content.aiFlagged && (
                    <span style={{
                      fontSize: "0.85rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      backgroundColor: "#ffa500",
                      color: "white",
                      fontWeight: "600"
                    }}>
                      AI Flagged
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: "#8e8e8e" }}>
                Failed to load content
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YourReports;
