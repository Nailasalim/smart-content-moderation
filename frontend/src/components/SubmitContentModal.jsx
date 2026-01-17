import { useState } from "react";
import { submitContent } from "../api/content.api";

const SubmitContentModal = ({ isOpen, onClose, onSubmitSuccess }) => {
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
      await submitContent(text);
      setText("");
      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError("Failed to submit content. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setText("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
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
          maxWidth: "600px",
          border: "1px solid #363636"
        }}
      >
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: "1.5rem",
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold"
        }}>
          Submit Content
        </h3>
        
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
                minHeight: "150px",
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
              onClick={handleClose}
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
  );
};

export default SubmitContentModal;
