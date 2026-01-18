import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await auth.register(name, email, password);
      setSuccess(true);
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div style={{
          textAlign: "center",
          backgroundColor: "#262626",
          padding: "3rem",
          borderRadius: "12px",
          border: "1px solid #363636"
        }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "1rem"
          }}>
            ✅
          </div>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#0095f6"
          }}>
            Registered Successfully!
          </h2>
          <p style={{
            color: "#8e8e8e",
            fontSize: "1rem"
          }}>
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: "350px",
        width: "100%"
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            marginBottom: "0.5rem"
          }}>
            SmartModerate
          </h1>
          <div style={{
            width: "100px",
            height: "1px",
            backgroundColor: "#262626",
            margin: "1rem auto"
          }}></div>
        </div>

        {/* Register Form */}
        <div style={{
          backgroundColor: "#fafafa",
          border: "1px solid #dbdbdb",
          borderRadius: "8px",
          padding: "2rem 1.5rem"
        }}>

          {error && (
            <div style={{
              color: "#ed4956",
              fontSize: "0.85rem",
              marginBottom: "0.5rem",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dbdbdb",
                borderRadius: "4px",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                backgroundColor: "#fafafa"
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dbdbdb",
                borderRadius: "4px",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                backgroundColor: "#fafafa"
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dbdbdb",
                borderRadius: "4px",
                fontSize: "0.9rem",
                marginBottom: "1rem",
                backgroundColor: "#fafafa"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "block",
                width: "100%",
                backgroundColor: loading ? "#8e8e8e" : "#0095f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                padding: "0.5rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                marginBottom: "1rem"
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#1877f2";
                }
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = loading ? "#8e8e8e" : "#0095f6";
              }}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div style={{
          backgroundColor: "#fafafa",
          border: "1px solid #dbdbdb",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          marginTop: "1rem"
        }}>
          <p style={{
            color: "#262626",
            fontSize: "0.9rem",
            margin: 0
          }}>
            Have an account?{" "}
            <Link
              to="/"
              style={{
                color: "#0095f6",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
