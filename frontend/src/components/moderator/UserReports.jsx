import { useState, useEffect } from "react";
import { getUserReports } from "../../api/userReports.api";

const UserReports = ({ userId }) => {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getUserReports(userId);
        setUser(data.user);
        setReports(data.reports);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user reports");
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, [userId]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        color: "#8e8e8e"
      }}>
        Loading user reports...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        color: "#ed4956"
      }}>
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        color: "#8e8e8e"
      }}>
        User not found
      </div>
    );
  }

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

  return (
    <div style={{
      backgroundColor: "#000000",
      color: "white",
      padding: "2rem"
    }}>
      {/* User Header */}
      <div style={{
        backgroundColor: "#262626",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem"
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "white"
        }}>
          Your Reports - {user.name || user.email}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem"
        }}>
          <div style={{
            backgroundColor: "#363636",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0095f6" }}>
              {reports.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Total Reports</div>
          </div>
          <div style={{
            backgroundColor: "#363636",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ffa500" }}>
              {reports.filter(r => r.status === "PENDING").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Pending</div>
          </div>
          <div style={{
            backgroundColor: "#363636",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0095f6" }}>
              {reports.filter(r => r.status === "REVIEWED").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Reviewed</div>
          </div>
          <div style={{
            backgroundColor: "#363636",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ed4956" }}>
              {reports.filter(r => r.content?.status === "REMOVED").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8e8e8e" }}>Content Removed</div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div style={{
        backgroundColor: "#262626",
        borderRadius: "12px",
        padding: "1.5rem"
      }}>
        <h3 style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "white"
        }}>
          All Reports ({reports.length})
        </h3>
        
        {reports.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#8e8e8e"
          }}>
            No reports found for this user
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem",
            maxHeight: "600px",
            overflowY: "auto"
          }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  backgroundColor: "#363636",
                  borderRadius: "8px",
                  padding: "1rem",
                  border: "1px solid #444"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#8e8e8e",
                      marginBottom: "0.25rem"
                    }}>
                      Report ID: #{report.id}
                    </div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#8e8e8e",
                      marginBottom: "0.25rem"
                    }}>
                      Reported: {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center"
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
                
                <div style={{
                  fontSize: "0.9rem",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontStyle: "italic"
                }}>
                  "{report.reason}"
                </div>
                
                <div style={{
                  fontSize: "0.8rem",
                  color: "#8e8e8e",
                  marginBottom: "0.5rem"
                }}>
                  Content: {report.content?.text?.substring(0, 150)}...
                </div>
                
                {report.moderationStatus && (
                  <div style={{
                    fontSize: "0.8rem",
                    color: "#8e8e8e",
                    padding: "0.5rem",
                    backgroundColor: "#262626",
                    borderRadius: "4px"
                  }}>
                    <strong>Moderated by:</strong> {report.moderationStatus.moderator?.name || report.moderationStatus.moderator?.email} 
                    <span style={{ marginLeft: "0.5rem" }}>
                      ({new Date(report.moderationStatus.createdAt).toLocaleDateString()})
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReports;
