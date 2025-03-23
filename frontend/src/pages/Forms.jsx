/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Common/Header";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import StatCard from "../components/Common/StatCard";
import FormTable from "../Components/FormTable";
const Forms = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Forms" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {" "}
        {/* STATS */}
        <motion.div
          className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 "
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="PM" icon={Zap} value={"21"} color="#6366f1" />
          <StatCard name="EM" icon={Zap} value={"60"} color="#8B5CF6" />
          <StatCard name="CM" icon={Zap} value={"52"} color="#ec4899" />
          <StatCard name="GM" icon={Zap} value={"30"} color="#10b981" />
        </motion.div>
        {/* Form */}
        <FormTable />
        {/* CHARTS */}
      </main>
    </div>
  );
};

export default Forms;
