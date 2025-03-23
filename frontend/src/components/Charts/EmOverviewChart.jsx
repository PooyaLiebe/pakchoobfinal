/* eslint-disable no-unused-vars */
import React from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { XAxis } from "recharts";
import { YAxis } from "recharts";
import { motion } from "framer-motion";

const emergencyForms = [
  {
    month: "فروردین",
    form: 510,
  },
  {
    month: "اردیبهشت",
    form: 380,
  },
  {
    month: "خرداد",
    form: 460,
  },
  {
    month: "تیر",
    form: 220,
  },
  {
    month: "مرداد",
    form: 180,
  },
  {
    month: "شهریور",
    form: 320,
  },
  {
    month: "مهر",
    form: 630,
  },
  {
    month: "آبان",
    form: 750,
  },
  {
    month: "آذر",
    form: 580,
  },
  {
    month: "دی",
    form: 710,
  },
  {
    month: "بهمن",
    form: 780,
  },
  {
    month: "اسفند",
    form: 631,
  },
];

const EmOverviewChart = () => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Emergency Forms
      </h2>
      <div className="h-80 ">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={emergencyForms}>
            <CartesianGrid strokeDasharray={"3 3"} stroke="#4b5563" />
            <XAxis dataKey={"month"} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31,41,55,0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#e5e7eB" }}
            />
            <Line
              type={"monotone"}
              dataKey={"form"}
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EmOverviewChart;
