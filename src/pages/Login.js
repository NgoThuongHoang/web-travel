import React, { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from '../features/auth/authSlice';
import { useAuth } from '../contexts/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordAlert, setShowForgotPasswordAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();
  const dispatch = useDispatch();

  // Load thông tin đăng nhập từ localStorage khi component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await dispatch(loginUser({ 
        email, 
        password 
      }));

      if (loginUser.fulfilled.match(result)) {
        const { user, role } = result.payload;
        contextLogin(user, role);

        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
          localStorage.setItem("rememberMe", "false");
        }

        // Chuyển hướng về trang admin hoặc trang trước đó (nếu có)
        const from = location.state?.from?.pathname || "/admin";
        navigate(from);
      } else {
        throw new Error(result.payload || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.message);
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPasswordAlert(true);
    setTimeout(() => setShowForgotPasswordAlert(false), 5000);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        backgroundImage: "url('/images/demo2.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 128, 128, 0.5)" }}
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
              <i className="fas fa-envelope"></i>
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
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
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
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </a>
          </div>
          <button 
            type="submit" 
            className="btn btn-light w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;