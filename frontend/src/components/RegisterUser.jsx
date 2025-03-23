import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("operator");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        password,
        user_type: userType,
      });

      if (response.data.status === "success") {
        setMessage("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {message && (
        <p
          style={{ color: message.includes("successfully") ? "green" : "red" }}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="operator">Operator</option>
          <option value="technician">Technician</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
