import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import OperatorLogin from "./pages/OperatorLogin";
import TechnicianLogin from "./pages/TechnicianLogin";
import AdminLogin from "./pages/AdminLogin";
import LoginMainForm from "./components/LoginMainForm";
import Register from "./components/RegisterUser";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import Start from "./pages/StartPage";
import { Sidebar } from "lucide-react";

function App() {
  const location = useLocation();
  const showSidebar = ![
    "/",
    "/login",
    "/register",
    "/adminlogin",
    "/operatorlogin",
    "/technicianlogin",
  ].includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BackGround */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {showSidebar && <Sidebar />}

      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<LoginMainForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/operatorlogin" element={<OperatorLogin />} />
        <Route path="/technicianlogin" element={<TechnicianLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/operatordashboard" element={<OperatorDashboard />} />
        <Route path="/techniciandashboard" element={<TechnicianDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
