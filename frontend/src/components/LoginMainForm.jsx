/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const LoginMainForm = ({ userType }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      // Send the login request
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      // Check response and handle navigation
      if (response.data.token) {
        // alert(`Login successful as ${response.data.user_type}`);
        // Store token if needed (for future API requests)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_type", response.data.user_type);

        // Navigate to the corresponding page
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
          default:
            console.warn("Unknown user type:", response.data.user_type);
            setError("Unknown user type. Contact support."); // Handle unknown types
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-box">
            {" "}
            <input
              type="password"
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
