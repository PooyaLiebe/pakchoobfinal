import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import OperatorLogin from "./pages/OperatorLogin";
import TechnicianLogin from "./pages/TechnicianLogin";
import AdminLogin from "./pages/AdminLogin";
import LoginMainForm from "./components/LoginMainForm";
import Register from "./components/RegisterUser";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import Start from "./pages/StartPage";
import Sidebar from "./components/Sidebar";

function Logout() {
  localStorage.clear();
  return <Navigate to={"/login"} />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const showSidebar =
    isLoggedIn &&
    ![
      "/",
      "/login",
      "/register",
      "/adminlogin",
      "/operatorlogin",
      "/technicianlogin",
    ].includes(location.pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* BackGround */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {showSidebar && <Sidebar />}

        <Routes>
          <Route path="/" element={<Start />} />
          <Route
            path="/login"
            element={<LoginMainForm onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/operatorlogin" element={<OperatorLogin />} />
          <Route path="/technicianlogin" element={<TechnicianLogin />} />
          <Route
            path="/admindashboard"
            element={
              isLoggedIn ? <AdminDashboard /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/operatordashboard"
            element={
              isLoggedIn ? <OperatorDashboard /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/techniciandashboard"
            element={
              isLoggedIn ? <TechnicianDashboard /> : <Navigate to={"/login"} />
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
