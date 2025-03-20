import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

// Import Font Awesome (add this CDN in your index.html or project setup)
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showForgotPasswordAlert, setShowForgotPasswordAlert] = useState(false); // State for forgot password alert
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/admin");
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordAlert(true);
    // Optionally auto-hide the alert after a few seconds
    setTimeout(() => setShowForgotPasswordAlert(false), 5000); // Hide after 5 seconds
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        backgroundImage: "url('/images/demo2.jpeg')", // Replace with your background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 128, 128, 0.5)" }} // Teal overlay to match the new image
      ></div>
      <div
        className="card login-card p-4 position-relative"
        style={{
          width: "400px",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="text-white fw-bold">LOGIN</h2>
        </div>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
              aria-label="Close"
            ></button>
          </div>
        )}
        {showForgotPasswordAlert && (
          <div className="alert alert-info alert-dismissible fade show" role="alert">
            Vui lòng liên hệ Zalo admin để được cấp lại mật khẩu!
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowForgotPasswordAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3 position-relative">
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <i className="fas fa-envelope"></i> {/* Envelope icon for email */}
            </span>
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              ></i>
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label
                className="form-check-label text-white"
                htmlFor="rememberMe"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-white text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                handleForgotPasswordClick();
              }}
            >
              Forgot password?
            </a>
          </div>
          <button type="submit" className="btn btn-light w-100 py-2">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;