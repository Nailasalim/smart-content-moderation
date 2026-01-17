import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitContent } from "../../api/content.api";

const SubmitContent = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await submitContent(text);
      
      // Check if content was flagged
      if (response.data.content.status === "FLAGGED") {
        navigate("/dashboard?flagged=true");
      } else {
        navigate("/dashboard?submitted=true");
      }
    } catch (err) {
      setError("Failed to submit content. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            Submit Content
          </h1>
          <p style={{
            color: "#8e8e8e",
            fontSize: "0.9rem"
          }}>
            Share your thoughts with the community
          </p>
        </div>

        {/* Submit Form */}
        <div style={{
          backgroundColor: "#262626",
          borderRadius: "12px",
          padding: "2rem",
          border: "1px solid #363636"
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="content" style={{ 
                display: "block", 
                marginBottom: "0.5rem",
                color: "#8e8e8e",
                fontSize: "0.9rem"
              }}>
                Your content:
              </label>
              <textarea
                id="content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                disabled={submitting}
                style={{
                  width: "100%",
                  minHeight: "200px",
                  padding: "0.75rem",
                  border: "1px solid #363636",
                  borderRadius: "8px",
                  resize: "vertical",
                  backgroundColor: "#000000",
                  color: "white",
                  fontSize: "1rem",
                  fontFamily: "inherit"
                }}
                placeholder="Share your thoughts with the community..."
              />
              {error && (
                <div style={{
                  color: "#ed4956",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem"
                }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #363636",
                  backgroundColor: "transparent",
                  color: "#8e8e8e",
                  borderRadius: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  if (!submitting) {
                    e.target.style.backgroundColor = "#363636";
                    e.target.style.color = "white";
                  }
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
                disabled={submitting || !text.trim()}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: submitting || !text.trim() ? "#363636" : "#0095f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: submitting || !text.trim() ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  transition: "all 0.2s ease"
                }}
              >
                {submitting ? "Submitting..." : "Submit Content"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitContent;
