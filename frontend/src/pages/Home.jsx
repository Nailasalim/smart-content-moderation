import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      
      if (user.role === "MODERATOR") {
        navigate("/moderator");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, redirect to appropriate page
  if (user) {
    if (user.role === "MODERATOR") {
      navigate("/moderator");
    } else {
      navigate("/dashboard");
    }
    return null;
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
        display: "flex",
        maxWidth: "900px",
        width: "100%",
        minHeight: "600px",
        backgroundColor: "#000000",
        border: "1px solid #262626",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        {/* Left Side - Phone Mockup */}
        <div style={{
          flex: 1,
          backgroundColor: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQ1MCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0NTAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0yMjUgMTUwQzI3NS4xNzcgMTUwIDMxNSAxODkuODIzIDMxNSAyNDBWMzYwQzMxNSA0MTAuMTc3IDI3NS4xNzcgNDUwIDIyNSA0NTBDMTc0LjgyMyA0NTAgMTM1IDQxMC4xNzcgMTM1IDM2MFYyNDBDMTM1IDE4OS44MjMgMTc0LjgyMyAxNTAgMjI1IDE1MFoiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iMjI1IiBjeT0iMjQwIiByPSI0NSIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: { xs: "none", md: "block" }
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "80%"
          }}>
            <h2 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "Arial, sans-serif"
            }}>
              SmartModerate
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#8e8e8e",
              lineHeight: "1.6"
            }}>
              Keep your community safe with AI-powered content moderation and user reporting tools.
            </p>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div style={{
          flex: 1,
          padding: "2rem 3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "350px"
        }}>
          {user ? (
            <div style={{ textAlign: "center" }}>
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

              <p style={{
                color: "#8e8e8e",
                marginBottom: "2rem",
                fontSize: "0.9rem"
              }}>
                Welcome back, {user.name || user.email}!
              </p>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                <Link
                  to="/dashboard"
                  style={{
                    backgroundColor: "#0095f6",
                    color: "white",
                    textDecoration: "none",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#1877f2";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#0095f6";
                  }}
                >
                  Go to Dashboard
                </Link>

                {user.role === "MODERATOR" && (
                  <Link
                    to="/moderator"
                    style={{
                      backgroundColor: "transparent",
                      color: "#0095f6",
                      textDecoration: "none",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      border: "1px solid #262626",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "rgba(0, 149, 246, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    Moderator Panel
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
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

              {/* Login Form */}
              <form onSubmit={handleLogin} style={{
                backgroundColor: "#fafafa",
                border: "1px solid #dbdbdb",
                borderRadius: "8px",
                padding: "2rem 1.5rem",
                marginBottom: "1rem"
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
                
                <input
                  type="text"
                  placeholder="Phone number, username, or email"
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
                    marginBottom: "0.75rem",
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
                    textDecoration: "none",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    marginBottom: "1rem",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer"
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
                  {loading ? "Logging in..." : "Log In"}
                </button>
                <div style={{
                  textAlign: "center",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#8e8e8e",
                    fontSize: "0.8rem",
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#dbdbdb"
                    }}></div>
                    <span>OR</span>
                    <div style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#dbdbdb"
                    }}></div>
                  </div>
                  <p style={{
                    color: "#262626",
                    fontSize: "0.9rem",
                    margin: 0
                  }}>
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: "#0095f6",
                        textDecoration: "none",
                        fontWeight: "600"
                      }}
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
