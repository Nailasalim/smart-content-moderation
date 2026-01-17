import { useEffect, useState } from "react";
import {
  getFlaggedContent,
  takeModerationAction,
} from "../../api/moderation.api";

const ModerationQueue = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  const fetchFlaggedContent = async () => {
    try {
      setLoading(true);
      const res = await getFlaggedContent();
      setContents(res.data.data || res.data);
    } catch (err) {
      setError("Failed to load moderation queue");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (contentId, action) => {
    try {
      await takeModerationAction(contentId, action);
      // Remove moderated item from UI
      setContents((prev) =>
        prev.filter((item) => item.id !== contentId)
      );
    } catch {
      alert("Failed to apply moderation action");
    }
  };

  if (loading) return <p>Loading moderation queue...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Moderation Queue</h1>

      {contents.length === 0 && <p>No flagged content 🎉</p>}

      {contents.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #555",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p><strong>Content:</strong> {item.text}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Submitted by:</strong> {item.user?.email}</p>

          <button
            onClick={() => handleAction(item.id, "APPROVE")}
            style={{ marginRight: "1rem" }}
          >
            Approve
          </button>

          <button
            onClick={() => handleAction(item.id, "REMOVE")}
            style={{ color: "red" }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ModerationQueue;
