import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MechanicLogin from "./pages/MechanicLogin";
import ElectricLogin from "./pages/ElectricLogin";
import AdminLogin from "./pages/AdminLogin";
import LoginMainForm from "./components/LoginMainForm";
import Register from "./components/RegisterUser";
import AdminDashboard from "./pages/AdminDashboard";
import MechanicDashboard from "./pages/MechanicDashboard";
import ElectricDashboard from "./pages/ElectricDashboard";
import Start from "./pages/StartPage";
import Sidebar from "./components/Sidebar";
import SubmitForm from "./pages/SubmitForm";
import Forms from "./pages/Forms";
import UtilityDashboard from "./pages/UtilityDashboard";
import ProductionDashboard from "./pages/ProductionDashboard";
import MechanicForm from "./pages/MechanicForm";
import ElectricForm from "./pages/ElectricForm";
import ProductionForm from "./pages/ProductionForm";
import UtilityForm from "./pages/UtilityForm";
import TarashKariForm from "./pages/TarashKariForm";
import MetalWorkingForm from "./pages/MetalWorkingForm";
import TarashKariDashboard from "./pages/TarashKariDashboard";
import MetalWorking from "./pages/MetalWorking";
import TechnicianSubmit from "./pages/TechnicianSubmit";

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
    !["/", "/login", "/register", "/adminlogin"].includes(location.pathname);

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
          <Route path="/mechanicdashboard" element={<MechanicDashboard />} />
          <Route path="/electricdashboard" element={<ElectricDashboard />} />
          <Route path="/utilitydashboard" element={<UtilityDashboard />} />
          <Route path="/metalworkingdashboard" element={<MetalWorking />} />
          <Route
            path="/tarashkaridashboard"
            element={<TarashKariDashboard />}
          />
          <Route
            path="/mechanicform"
            element={<MechanicForm user_type="mechanic" />}
          />
          <Route
            path="/productiondashboard"
            element={<ProductionDashboard />}
          />
          <Route
            path="/admindashboard"
            element={
              isLoggedIn ? <AdminDashboard /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/mechanicdashboard"
            element={
              isLoggedIn ? <MechanicLogin /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/electricdashboard"
            element={
              isLoggedIn ? <ElectricLogin /> : <Navigate to={"/login"} />
            }
          />
          <Route path="/submitform" element={<SubmitForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/mechanicform" element={<MechanicForm />} />
          <Route path="/electricform" element={<ElectricForm />} />
          <Route path="/productionform" element={<ProductionForm />} />
          <Route path="/utilityform" element={<UtilityForm />} />
          <Route path="/tarashkariform" element={<TarashKariForm />} />
          <Route path="/metalworkingform" element={<MetalWorkingForm />} />
          <Route path="/techniciansubmit" element={<TechnicianSubmit />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
