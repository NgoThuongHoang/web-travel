import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordAlert, setShowForgotPasswordAlert] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/accounts/login", { // Sửa URL API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Kiểm tra nếu response không phải JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response không phải JSON:", text);
        throw new Error("Server trả về dữ liệu không phải JSON. Kiểm tra API!");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại!");
      }

      // Kiểm tra trạng thái tài khoản
      if (data.status !== "Hoạt động") {
        throw new Error("Tài khoản không hoạt động!");
      }

      // Lưu thông tin user và role vào Redux
      dispatch(login({
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
        },
        role: data.role,
      }));

      // Chuyển hướng dựa trên vai trò
      if (data.role === "Admin" || data.role === "User") {
        navigate("/admin");
      } else {
        throw new Error("Vai trò không hợp lệ!");
      }
    } catch (err) {
      setError(err.message);
      console.error("Lỗi đăng nhập:", err);
    }
  };

  const handleForgotPasswordClick = () => {
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
                id="ensurePool"
              />
              <label
                className="form-check-label text-white"
                htmlFor="ensurePool"
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