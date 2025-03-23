/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart2, FormInput, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "@mui/material";
const ADMIN_SIDEBAR = [
  { name: "Dashboard", icon: BarChart2, color: "#6366f1", href: "/dashboard" },
  {
    name: "Submit Form",
    icon: FormInput,
    color: "#6366f1",
    href: "/submitform",
  },
  { name: "Forms", icon: FormInput, color: "#6366f1", href: "/forms" },
  { name: "Pm Forms", icon: FormInput, color: "#6366f1", href: "/pmforms" },
  { name: "Pm Submit", icon: FormInput, color: "#6366f1", href: "/pmsubmit" },
];

const TECHNICIAN_SIDEBAR = [
  {
    name: "Technician Dashboard",
    icon: BarChart2,
    color: "#6366f1",
    href: "/techniciandashboard",
  },
  {
    name: "Technician Submit",
    icon: FormInput,
    color: "#6366f1",
    href: "/techniciansubmit",
  },
  { name: "Forms", icon: FormInput, color: "#6366f1", href: "/forms" },
  { name: "Pm Forms", icon: FormInput, color: "#6366f1", href: "/pmforms" },
];

const OPERATOR_SIDEBAR = [
  {
    name: "Operator Dashboard",
    icon: BarChart2,
    color: "#6366f1",
    href: "/operatordashboard",
  },
  {
    name: "Operator Submit",
    icon: FormInput,
    color: "#6366f1",
    href: "/operatorsubmit",
  },
  { name: "Forms", icon: FormInput, color: "#6366f1", href: "/forms" },
];

const Sidebar = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  let sidebarItems = [];
  if (role === "admin") sidebarItems = ADMIN_SIDEBAR;
  else if (role === "technician") sidebarItems = TECHNICIAN_SIDEBAR;
  else if (role === "operator") sidebarItems = OPERATOR_SIDEBAR;

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
          {sidebarItems.map((item) => (
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
