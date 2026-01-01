// frontend/src/pages/Login/Login.jsx
import { apiRequest } from "../../services/api";
import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

const handleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });

  } catch (err) {
    console.error("Login error:", err);
    setError(err.message || "Server not reachable");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="title">Admin Login</h2>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Email / Mobile Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <span
            className="show-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <div className="options">
          <label className="remember">
            <input type="checkbox" disabled={loading} />
            Remember me
          </label>
          <a href="#" className="forgot">Forgot Password?</a>
        </div>

        <button 
          className="login-btn" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default Login;
