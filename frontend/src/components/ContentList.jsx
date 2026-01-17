import { useState, useEffect } from "react";
import { getApprovedContent } from "../api/content.api";
import { reportContent } from "../api/report.api";

const ContentList = ({ refreshTrigger }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState({ isOpen: false, contentId: null });
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await getApprovedContent();
      setContents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [refreshTrigger]);

  const handleReportClick = (contentId) => {
    setReportModal({ isOpen: true, contentId });
    setReportReason("");
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setReporting(true);
    try {
      await reportContent(reportModal.contentId, reportReason);
      setReportModal({ isOpen: false, contentId: null });
      setReportReason("");
      setReportSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to report content:", err);
      alert("Failed to report content. Please try again.");
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "3rem",
        color: "#8e8e8e"
      }}>
        Loading content...
      </div>
    );
  }

  return (
    <div>
      {/* Report Success Message */}
      {reportSuccess && (
        <div style={{
          backgroundColor: "#0095f6",
          color: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: "600"
        }}>
          Content reported successfully! 🎉
        </div>
      )}

      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        fontFamily: "Arial, sans-serif"
      }}>
        Community Content
      </h2>

      {contents.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          backgroundColor: "#262626",
          borderRadius: "8px",
          color: "#8e8e8e"
        }}>
          <p>No content available yet. Be the first to submit something!</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gap: "1rem"
        }}>
          {contents.map((content) => (
            <div
              key={content.id}
              style={{
                backgroundColor: "#262626",
                borderRadius: "8px",
                padding: "1rem",
                border: "1px solid #363636"
              }}
            >
              {/* User Info */}
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #363636"
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#0095f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  marginRight: "0.75rem"
                }}>
                  {(content.user.name || content.user.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "white"
                  }}>
                    {content.user.name || content.user.email}
                  </div>
                  <div style={{
                    fontSize: "0.75rem",
                    color: "#8e8e8e"
                  }}>
                    {new Date(content.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {/* Content Text */}
              <div style={{
                marginBottom: "1rem",
                lineHeight: "1.5",
                color: "white",
                fontSize: "0.95rem"
              }}>
                {content.text}
              </div>

              {/* Actions */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end",
                alignItems: "center"
              }}>
                <button
                  onClick={() => handleReportClick(content.id)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#ed4956",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "rgba(237, 73, 86, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {reportModal.isOpen && (
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
          }}
        >
          <div
            style={{
              backgroundColor: "#262626",
              padding: "2rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              border: "1px solid #363636"
            }}
          >
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: "1.5rem",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>
              Report Content
            </h3>
            
            <form onSubmit={handleReportSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="reason" style={{ 
                  display: "block", 
                  marginBottom: "0.5rem",
                  color: "#8e8e8e",
                  fontSize: "0.9rem"
                }}>
                  Reason for reporting:
                </label>
                <textarea
                  id="reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "0.75rem",
                    border: "1px solid #363636",
                    borderRadius: "8px",
                    resize: "vertical",
                    backgroundColor: "#000000",
                    color: "white",
                    fontSize: "0.9rem"
                  }}
                  placeholder="Please explain why you're reporting this content..."
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setReportModal({ isOpen: false, contentId: null })}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #363636",
                    backgroundColor: "transparent",
                    color: "#8e8e8e",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting || !reportReason.trim()}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: reporting || !reportReason.trim() ? "#363636" : "#ed4956",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: reporting || !reportReason.trim() ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  {reporting ? "Reporting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentList;
