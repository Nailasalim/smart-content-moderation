import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const YourReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get("/report/user-reports");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#ffa500";
      case "REVIEWED": return "#0095f6";
      case "APPROVED": return "#00c851";
      case "REMOVED": return "#ed4956";
      case "FLAGGED": return "#ffa500";
      default: return "#8e8e8e";
    }
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
              {reports.filter(r => r.content?.status === "REMOVED").length}
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
            <div>You haven't reported any content yet. Browse the community content and report anything that violates our guidelines.</div>
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
                      Report ID: #{report.id}
                    </div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#8e8e8e",
                      marginBottom: "0.25rem"
                    }}>
                      Reported on: {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#8e8e8e"
                    }}>
                      Content by: <span style={{ color: "#0095f6", fontWeight: "600" }}>
                        {report.content?.user?.name || report.content?.user?.email}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}>
                    <span style={{
                      fontSize: "0.8rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      backgroundColor: getStatusColor(report.status),
                      color: "white",
                      fontWeight: "600"
                    }}>
                      {report.status}
                    </span>
                    {report.content?.status && (
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor: getStatusColor(report.content.status),
                        color: "white",
                        fontWeight: "600"
                      }}>
                        Content: {report.content.status}
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
                    Your Report Reason:
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    color: "white",
                    fontStyle: "italic",
                    lineHeight: "1.4"
                  }}>
                    "{report.reason}"
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
                    fontSize: "0.8rem",
                    color: "#8e8e8e",
                    marginBottom: "0.5rem",
                    fontWeight: "600"
                  }}>
                    Reported Content:
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    color: "white",
                    lineHeight: "1.4",
                    maxHeight: "150px",
                    overflowY: "auto"
                  }}>
                    {report.content?.text}
                  </div>
                </div>

                {/* Status Message */}
                <div style={{
                  fontSize: "0.9rem",
                  color: "#8e8e8e",
                  fontStyle: "italic"
                }}>
                  {report.status === "PENDING" && "Your report is currently pending review by moderators."}
                  {report.status === "REVIEWED" && "Your report has been reviewed by moderators."}
                  {report.content?.status === "REMOVED" && "The reported content has been removed."}
                  {report.content?.status === "APPROVED" && "The reported content was approved and remains visible."}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourReports;
