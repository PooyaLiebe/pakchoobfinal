/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Send, Trash } from "lucide-react";
import { Tooltip } from "@mui/material";
import axios from "axios";
import api from "../api";
import { Link, Navigate } from "react-router-dom";

const FormTable = () => {
  const [submitform, setSubmitform] = useState([]);
  const [technicianform, setTechnicianForm] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput1, setModalInput1] = useState("");
  const [modalInput2, setModalInput2] = useState("");
  const [modalInput3, setModalInput3] = useState("");
  const [userType, setUserType] = useState("");

  const filteredForms = submitform.filter((form) => {
    if (userType === "mechanic") {
      return form.worktype === "mechanic";
    } else if (userType === "electric") {
      return form.worktype === "electric";
    } else if (userType === "production") {
      return form.worktype === "production";
    } else if (userType === "utility") {
      return form.worktype === "utility";
    }
    return true;
  });

  const getForm = async () => {
    try {
      const res = await api.get("/api/submitform/list/");
      console.log("API Response:", res.data);
      setSubmitform(res.data);
    } catch (err) {
      console.error("Error Fetching data:", err);
    }
  };

  const getTechnicianForm = async () => {
    try {
      const res = await api.get("/api/techniciansubmit/list/");
      console.log("API Response", res.data);

      const updatedForms = res.data.map((form) => {
        let statusText = "در حال انجام"; // Default case

        if (form.jobstatus === "بله") {
          statusText = "کار انجام شد";
        } else if (form.jobstatus === "در حال انجام") {
          statusText = "در حال انجام";
        } else if (form.jobstatus === "خیر") {
          statusText = "کار انجام نشد";
        }

        return { ...form, jobstatus: statusText };
      });

      setTechnicianForm(updatedForms); // Update state with modified data
    } catch (err) {
      console.error("Error Fetching data:", err);
    }
  };

  useEffect(() => {
    getForm();
    getTechnicianForm();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/api/submitform/delete/${id}/`);

      if (res.status === 204) {
        alert("Form Deleted");
        setSubmitform((prevForms) =>
          prevForms.filter((form) => form.id !== id)
        );
      } else {
        console.error("Deletion failed:", res);
        alert("Failed to delete the form");
      }
    } catch (err) {
      console.error("Error deleting the form:", err);
      alert("Failed to delete the form");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700 mb-8 rounded"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          لیست تمامی فرم ها
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Form Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Problem Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Production Stop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Machine Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Machine Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Machine Place Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Work Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stop Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Failure Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Suggest Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Work Suggest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fix Repair
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Report Inspection
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fault Dm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Operator Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Problem Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredForms.map((form) => (
              <motion.tr key={form.id}>
                <td className="px-6 py-4 text-gray-100">{form.formcode}</td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(form.problemdate).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.productionstop || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">{form.section}</td>
                <td className="px-6 py-4 text-gray-300">
                  {form.machinename || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.machinecode || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.machineplacecode || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.worktype || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(form.stoptime).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.failuretime || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.shift || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.suggesttime || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.worksuggest || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.fixrepair || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.reportinspection || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.faultdm || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.operatorname || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.problemdescription || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      form.jobstatus === "بله"
                        ? "bg-green-500"
                        : form.jobstatus === "در حال انجام"
                        ? "bg-yellow-500"
                        : form.jobstatus === "خیر"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {form.jobstatus === "بله"
                      ? "کار انجام شد"
                      : form.jobstatus === "در حال انجام"
                      ? "در حال انجام"
                      : form.jobstatus === "خیر"
                      ? "کار انجام نشد"
                      : "N/A"}
                  </span>
                </td>
                <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* <Tooltip title={"Edit"} placement="top">
                    {" "}
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2 cursor-pointer">
                      <Edit size={18} />
                    </button>
                  </Tooltip> */}
                  <Tooltip title={"Delete"} placement="top">
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="text-red-400 hover:text-red-300 mr-2 cursor-pointer"
                    >
                      <Trash size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title={"Send"} placement="top">
                    <Link to={`/techniciansubmit/${form.formcode}`}>
                      <button className="text-pink-500 hover:text-pink-300 cursor-pointer">
                        <Send size={18} />
                      </button>
                    </Link>
                  </Tooltip>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 overflow-y-auto h-full w-full">
          <h3 className="flex justify-center mt-2 text-2xl font-mono">ارسال</h3>
          <div className="flex justify-center mt-7 font-mono">
            <select
              name="sendworktype"
              className="text-center"
              id="sendworktype"
              onChange={(e) =>
                setModalInput1({
                  ...modalInput1,
                  sendworktype: e.target.value,
                })
              }
              required
            >
              <option className="bg-gray-800" value="mechanic">
                Mechanic
              </option>
              <option className="bg-gray-800" value="electric">
                Electric
              </option>
              <option className="bg-gray-800" value="production">
                Production
              </option>
              <option className="bg-gray-800" value="utility">
                Utility
              </option>
            </select>
          </div>
          <div className="mt-5 flex justify-center">
            <button
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:shadow-outline mr-2"
              onClick={handleSendModal}
            >
              ارسال
            </button>
            <button
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              onClick={() => {
                closeModal();
              }}
            >
              لغو
            </button>
          </div>
        </div>
      )} */}
    </motion.div>
  );
};

export default FormTable;
