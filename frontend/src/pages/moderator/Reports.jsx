import { useEffect, useState } from "react";
import api from "../../api/axios";

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const res = await api.get("/report");
        setReports(res.data.reports);
      } catch (err) {
        console.error("Failed to fetch user reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, []);

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

                {/* Actions */}
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "1rem"
                }}>
                  <button
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#0095f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ed4956",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}
                  >
                    Remove
                  </button>
                  <button
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ffa500",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}
                  >
                    Warn
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
