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
  const [aghlams, setAghlams] = useState([]); // Assuming aghlams data
  const [personels, setPersonels] = useState([]); // Assuming personels data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput1, setModalInput1] = useState("");
  const [modalInput2, setModalInput2] = useState("");
  const [modalInput3, setModalInput3] = useState("");
  const [userType, setUserType] = useState("");

  // Assuming jobstatus is a field in the technicianform that we want to merge with submitform
  const getForms = async () => {
    try {
      const res = await api.get("/api/submitform/list/");
      console.log("API Response for SubmitForm:", res.data);
      setSubmitform(res.data);
    } catch (err) {
      console.error("Error Fetching SubmitForm data:", err);
    }
  };

  const getTechnicianForms = async () => {
    try {
      const res = await api.get("/api/techniciansubmit/list/");
      console.log("API Response for TechnicianForm:", res.data);
      setTechnicianForm(res.data);
    } catch (err) {
      console.error("Error Fetching TechnicianForm data:", err);
    }
  };
  const getAghlamsData = async () => {
    try {
      const res = await api.get("/api/aghlams/list/");
      console.log("API Response for Aghlams:", res.data);
      setAghlams(res.data);
    } catch (err) {
      console.error("Error Fetching Aghlams data:", err);
    }
  };

  const getPersonelsData = async () => {
    try {
      const res = await api.get("/api/personels/list/");
      console.log("API Response for Personels:", res.data);
      setPersonels(res.data);
    } catch (err) {
      console.error("Error Fetching Personels data:", err);
    }
  };

  useEffect(() => {
    getForms(); // Fetch submitform data
    getTechnicianForms(); // Fetch technicianform data
    getAghlamsData();
    getPersonelsData();
  }, []);

  // Merging jobstatus from technicianform into submitform based on formcode (or id)
  const mergedSubmitForms = submitform.map((submit) => {
    // Find the matching technician form
    const technician = technicianform.find(
      (techForm) => techForm.formcode === submit.formcode // or use another identifier like `id`
    );

    // If a matching technician form exists, add the jobstatus to the submit form
    if (technician) {
      return { ...submit, jobstatus: technician.jobstatus };
    }
    return submit; // If no match, just return the original submit form
  });

  const mergedTechnicianForms = technicianform.map((techForm) => {
    // Find matching aghlams and personels data based on formcode
    const aghlamData = aghlams.find(
      (aghlam) => aghlam.formcode === techForm.formcode
    );
    const personelData = personels.find(
      (personel) => personel.formcode === techForm.formcode
    );

    // Merge the data if matching entries exist
    return {
      ...techForm,
      aghlam: aghlamData || null, // Add aghlams data if available
      personel: personelData || null, // Add personels data if available
    };
  });

  const filteredForms = mergedSubmitForms.filter((form) => {
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
            {filteredForms.map((form, index) => (
              <motion.tr key={`${form.id}-${index}`}>
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
                    className={`text-white ${
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
                      : "در حال انجام کار"}
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
      <div>
        <br />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          لیست فرم تکنیسین
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
                Failure Part
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Failure Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Spare Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Start Failure Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Problem Description
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                JobStatus
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Kala Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Count Kala
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vahed Kala
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Code Kala
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Flamble
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Shop Kala
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Personel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Personel Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date Submit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Special Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Start Time Repair
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                End Time Repair
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Repair Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Unit Repair
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Delay Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Failure Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Failure Reason Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Suggestion Failure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mergedTechnicianForms.map((form, index) => (
              <motion.tr key={`${form.id}-${index}`}>
                <td className="px-6 py-4 text-gray-100">{form.formcode}</td>
                <td className="px-6 py-4 text-gray-300">
                  {form.failurepart || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(form.failuretime).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-300">{form.sparetime}</td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(form.startfailuretime).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.problemdescription || "N/A"}
                </td>
                {/* <td className="px-6 py-4 text-gray-300">
                  {form.jobstatus || "N/A"}
                </td> */}
                <td className="px-6 py-4 text-gray-300">
                  {form.kalaname || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.countkala || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.vahedkala || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.codekala || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.flamekala || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.shopkala || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.personel || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.personelnumber || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.datesubmit || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.specialjob || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.starttimerepair || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.endtimerepair || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.repairstatus || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.unitrepair || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.shift || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.delayreason || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.failurereason || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.failurereasondescription || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {form.suggestionfailure || "N/A"}
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
    </motion.div>
  );
};

export default FormTable;
