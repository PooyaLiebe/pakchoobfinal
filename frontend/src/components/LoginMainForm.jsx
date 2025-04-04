/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

const LoginMainForm = ({ userType }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/login/", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_type", response.data.user_type);

        switch (response.data.user_type) {
          case "pm":
            navigate("/admindashboard");
            break;
          case "electric":
            navigate("/electricdashboard");
            break;
          case "mechanic":
            navigate("/mechanicdashboard");
            break;
          case "utility":
            navigate("/utilitydashboard");
            break;
          case "production":
            navigate("/productiondashboard");
            break;
          case "metalworking":
            navigate("/metalworkingdashboard");
            break;
          case "tarashkari":
            navigate("/tarashkaridashboard");
            break;
          default:
            console.warn("Unknown user type:", response.data.user_type);
            setError("Unknown user type. Contact support.");
            break;
        }
      } else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="wrapper">
        <h2 className="text-2xl text-center font-mono">Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-box">
            {" "}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-box">
            {" "}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginMainForm;
