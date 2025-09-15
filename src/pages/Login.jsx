import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";
import { toast } from "react-toastify";
import { useLoginAdminMutation } from "../api/adminAuthApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAdmin({ email, password }).unwrap();

      if (response.success) {
        localStorage.setItem("auth", true);
        localStorage.setItem("adminId", response.admin._id); // store adminId
        toast.success("Login successful 🎉");
        navigate("/dashboard");
      }
    } catch (err) {
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Login failed, please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🔐 Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
 