import { Link } from "react-router-dom";

const ModeratorDashboard = () => {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Moderator Dashboard</h1>

      <p>Welcome, Moderator</p>

      <div style={{ marginTop: "2rem" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem" }}>
            <Link to="/moderator/queue">🛑 View Moderation Queue</Link>
          </li>

          <li>
            <Link to="/moderator/reports">🚨 View User Reports</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
