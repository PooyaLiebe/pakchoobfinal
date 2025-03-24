/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart2, FormInput, Menu, Power } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "@mui/material";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userType, setUserType] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserType = localStorage.getItem("user_type");
    setUserType(storedUserType);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType"); // Remove userType on logout
    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (userType === "pm") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/admindashboard",
        },
        {
          name: "Submit Form",
          icon: FormInput,
          color: "#6366f1",
          href: "/submitform",
        },
        { name: "Forms", icon: FormInput, color: "#6366f1", href: "/forms" },
        {
          name: "Pm Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Pm Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmsubmit",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else if (userType === "mechanic") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/admindashboard",
        },
        {
          name: "Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/techniciansubmit",
        },
        {
          name: "Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/mechanicform",
        },
        {
          name: "PM Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else if (userType === "electric") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/electricdashboard",
        },
        {
          name: "Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/techniciansubmit",
        },
        {
          name: "Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/electricform",
        },
        {
          name: "Pm Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else if (userType === "utility") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/utilitydashboard",
        },
        {
          name: "Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/techniciansubmit",
        },
        {
          name: "Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/utilityform",
        },
        {
          name: "Pm Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else if (userType === "production") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/operatordashboard",
        },
        {
          name: "Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/operatorsubmit",
        },
        {
          name: "Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/productionform",
        },
        {
          name: "Pm Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else if (userType === "metalworking") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/metalworkingdashboard",
        },
        {
          name: "Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/techniciansubmit",
        },
        {
          name: "Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/metalworkingform",
        },
        {
          name: "Pm Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else if (userType === "tarashkari") {
      setMenuItems([
        {
          name: "Dashboard",
          icon: BarChart2,
          color: "#6366f1",
          href: "/tarashkaridashboard",
        },
        {
          name: "Submit",
          icon: FormInput,
          color: "#6366f1",
          href: "/tarashkarisubmit",
        },
        {
          name: "Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/tarashkariform",
        },
        {
          name: "Pm Forms",
          icon: FormInput,
          color: "#6366f1",
          href: "/pmforms",
        },
        {
          name: "Logout",
          icon: Power,
          color: "#6366f1",
          href: "/logout",
        },
      ]);
    } else {
      setMenuItems([]);
    }
  }, [userType]);

  if (!userType) {
    return null;
  }

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>
        <nav className="mt-8 flex-grow">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Tooltip title={item.name} placement="right">
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Tooltip>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
