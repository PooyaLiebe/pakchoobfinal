/* eslint-disable no-unused-vars */
import * as React from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import { useState } from "react";
import api from "../api";
import { useEffect } from "react";
import { Send, Trash } from "lucide-react";
import { Tooltip } from "@mui/material";

const paginationModel = { page: 0, pageSize: 5 };

export default function MechanicForm() {
  const [submitform, setSubmitform] = useState([]);
  const [technicianform, setTechnicianForm] = useState([]);
  const [aghlams, setAghlams] = useState([]);
  const [personels, setPersonels] = useState([]);
  const [mergedTechnicianForms, setMergedTechnicianForms] = useState([]);
  const [userType, setUserType] = useState("tarashkari");

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

  // Filtered Submit Form
  const filteredForms = mergedSubmitForms.filter((form) => {
    if (userType === "mechanic") {
      return form.worktype === "mechanic";
    } else if (userType === "electric") {
      return form.worktype === "electric";
    } else if (userType === "production") {
      return form.worktype === "production";
    } else if (userType === "utility") {
      return form.worktype === "utility";
    } else if (userType === "metalworking") {
      return form.worktype === "metalworking";
    } else if (userType === "tarashkari") {
      return form.worktype === "tarashkari";
    }
    return true;
  });

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

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/api/submitform/delete/${id}/`);
      if (res.status === 204) {
        alert("Form Deleted");
        // Update state to remove the deleted item (more efficient than re-fetching)
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

  // Technician Filter UserType
  const filteredTechnicianForms = technicianform.filter((form) =>
    filteredForms.some(
      (filteredForm) => filteredForm.formcode === form.formcode
    )
  );

  // Set the merged data to state
  useEffect(() => {
    // Filter technician forms inside useEffect to avoid unnecessary re-renders
    const filteredTechnicianForms = technicianform.filter((form) =>
      filteredForms.some(
        (filteredForm) => filteredForm.formcode === form.formcode
      )
    );

    const newMergedData = filteredTechnicianForms.map((techForm) => {
      const aghlamMatches = aghlams.filter(
        (aghlam) => aghlam.formcode === techForm.formcode
      );
      const personelMatches = personels.filter(
        (personel) => personel.formcode === techForm.formcode
      );

      return {
        ...techForm,
        aghlams: aghlamMatches.length > 0 ? aghlamMatches : [],
        personels: personelMatches.length > 0 ? personelMatches : [],
      };
    });

    // Only update state if merged data has changed to prevent unnecessary renders
    if (
      JSON.stringify(newMergedData) !== JSON.stringify(mergedTechnicianForms)
    ) {
      console.log("Merging technician forms...");
      setMergedTechnicianForms(newMergedData);
    }
  }, [
    technicianform,
    filteredForms,
    aghlams,
    personels,
    mergedTechnicianForms,
  ]); // Add mergedTechnicianForms to dependencies to compare state

  const columns = [
    { field: "formcode", headerName: "Form Code", width: 180 },
    {
      field: "problemdate",
      headerName: "Problem Date",
      width: 200,
      type: "dateTime",
    },
    { field: "productionstop", headerName: "Production Stop", width: 180 },
    { field: "section", headerName: "Section", width: 180 },
    { field: "machinename", headerName: "Machine Name", width: 180 },
    { field: "machinecode", headerName: "Machine Code", width: 180 },
    { field: "machineplacecode", headerName: "Machine Place Code", width: 180 },
    { field: "worktype", headerName: "Work Type", width: 180 },
    {
      field: "stoptime",
      headerName: "Stop Time",
      width: 180,
      type: "dateTime",
    },
    { field: "failuretime", headerName: "Failure Time", width: 180 },
    { field: "shift", headerName: "Shift", width: 180 },
    { field: "suggesttime", headerName: "Suggest Time", width: 180 },
    { field: "worksuggest", headerName: "Work Suggest", width: 180 },
    { field: "fixrepair", headerName: "Fix Repair", width: 180 },
    { field: "reportinspection", headerName: "Report Inspection", width: 180 },
    { field: "faultdm", headerName: "Fault Dm", width: 180 },
    { field: "operatorname", headerName: "Operator Name", width: 180 },
    {
      field: "problemdescription",
      headerName: "Problem Description",
      width: 180,
    },
    {
      field: "jobstatus",
      headerName: "Status",
      width: 180,
      renderCell: (params) => {
        const status = params.value;
        return (
          <span
            className={`text-white ${
              status === "بله"
                ? "bg-green-500"
                : status === "در حال انجام"
                ? "bg-yellow-500"
                : status === "خیر"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          >
            {status === "بله"
              ? "کار انجام شد"
              : status === "در حال انجام"
              ? "در حال انجام"
              : status === "خیر"
              ? "کار انجام نشد"
              : "در حال انجام کار"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div className="flex justify-start mt-1">
          {/* <Tooltip title={"Delete"} placement="top">
            <button
              onClick={() => handleDelete(params.row.id)}
              className="text-red-400 hover:text-red-300 cursor-pointer"
            >
              <Trash size={18} />
            </button>
          </Tooltip> */}
          <Tooltip title={"Send"} placement="top">
            <Link
              to={`/techniciansubmit/${params.row.formcode}`}
              className="w-0 m-0"
            >
              <button className="text-pink-500 hover:text-pink-300 cursor-pointer mt-5 ml-2">
                <Send size={18} />
              </button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];
  const columns_technician = [
    { field: "formcode", headerName: "Form Code", width: 150 },
    { field: "failurepart", headerName: "Failure Part", width: 150 },
    { field: "failuretime", headerName: "Failure Time", width: 150 },
    { field: "sparetime", headerName: "Spare Time", width: 150 },
    { field: "startfailuretime", headerName: "Start Failure Time", width: 180 },
    {
      field: "problemdescription",
      headerName: "Problem Description",
      width: 200,
    },
    { field: "kalaname", headerName: "Kala Name", width: 150 },
    { field: "countkala", headerName: "Count Kala", width: 130 },
    { field: "vahedkala", headerName: "Vahed Kala", width: 130 },
    { field: "codekala", headerName: "Code Kala", width: 150 },
    { field: "flamekala", headerName: "Flamble", width: 130 },
    { field: "shopkala", headerName: "Shop Kala", width: 150 },
    { field: "personel", headerName: "Personnel", width: 150 },
    { field: "personelnumber", headerName: "Personnel Number", width: 180 },
    {
      field: "datesubmit",
      headerName: "Date Submit",
      width: 150,
      type: "dateTime", // Ensure the column type is set to "dateTime"
    },
    { field: "specialjob", headerName: "Special Job", width: 180 },
    {
      field: "starttimerepair",
      type: "dateTime",
      headerName: "Start Time Repair",
      width: 180,
    },
    {
      field: "endtimerepair",
      type: "dateTime",
      headerName: "End Time Repair",
      width: 180,
    },
    { field: "repairstatus", headerName: "Repair Status", width: 160 },
    { field: "unitrepair", headerName: "Unit Repair", width: 160 },
    { field: "shift", headerName: "Shift", width: 120 },
    { field: "delayreason", headerName: "Delay Reason", width: 200 },
    { field: "failurereason", headerName: "Failure Reason", width: 200 },
    {
      field: "failurereasondescription",
      headerName: "Failure Reason Description",
      width: 250,
    },
    {
      field: "suggestionfailure",
      headerName: "Suggestion Failure",
      width: 250,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 160,
    //   renderCell: (params) => (
    //     <div className="flex justify-start mt-1">
    //       <Tooltip title={"Delete"} placement="top">
    //         <button
    //           onClick={() => handleDelete(params.row.id)}
    //           className="text-red-400 hover:text-red-300 cursor-pointer"
    //         >
    //           <Trash size={18} />
    //         </button>
    //       </Tooltip>
    //       <Tooltip title={"Send"} placement="top">
    //         <Link
    //           to={`/techniciansubmit/${params.row.formcode}`}
    //           className="w-0 m-0"
    //         >
    //           <button className="text-pink-500 hover:text-pink-300 cursor-pointer mt-5 ml-2">
    //             <Send size={18} />
    //           </button>
    //         </Link>
    //       </Tooltip>
    //     </div>
    //   ),
    // },
  ];
  console.log(mergedTechnicianForms);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700 mb-8 rounded"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Admin Form */}
          <div
            style={{ width: "100%", height: 400 }}
            className="overflow-x-auto"
          >
            <Paper sx={{ height: 400, width: "100%", minWidth: 600 }}>
              <DataGrid
                rows={filteredForms.map((form, index) => ({
                  id: form.id || index, // Ensure each row has a unique 'id'
                  formcode: form.formcode,
                  problemdate: form.problemdate
                    ? new Date(form.problemdate)
                    : null,
                  productionstop: form.productionstop,
                  section: form.section,
                  machinename: form.machinename,
                  machinecode: form.machinecode,
                  machineplacecode: form.machineplacecode,
                  worktype: form.worktype,
                  stoptime: form.stoptime ? new Date(form.stoptime) : null,
                  failuretime: form.failuretime,
                  shift: form.shift,
                  suggesttime: form.suggesttime,
                  worksuggest: form.worksuggest,
                  fixrepair: form.fixrepair,
                  reportinspection: form.reportinspection,
                  faultdm: form.faultdm,
                  operatorname: form.operatorname,
                  problemdescription: form.problemdescription,
                  jobstatus: form.jobstatus,
                }))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
              />
            </Paper>
          </div>
          <div>
            <br />
          </div>
          <div>
            <header className="flex justify-center text-center mb-4 bg-gray-700 rounded-2xl">
              لیست تکنیسین
            </header>
          </div>
          <div
            style={{ width: "100%", height: 400 }}
            className="overflow-x-auto"
          >
            {/* Technician Form */}
            <Paper sx={{ height: 400, width: "100%", minWidth: 600 }}>
              <DataGrid
                rows={mergedTechnicianForms.map((form, index) => ({
                  id: form.id || index,
                  formcode: form.formcode,
                  failurepart: form.failurepart || "N/A",
                  failuretime: form.failuretime || "N/A",
                  sparetime: form.sparetime || "N/A",
                  startfailuretime: form.startfailuretime || "N/A",
                  problemdescription: form.problemdescription || "N/A",
                  kalaname:
                    form.aghlams.length > 0 ? form.aghlams[0].kalaname : "N/A",
                  countkala:
                    form.aghlams.length > 0 ? form.aghlams[0].countkala : "N/A",
                  vahedkala:
                    form.aghlams.length > 0 ? form.aghlams[0].vahedkala : "N/A",
                  codekala:
                    form.aghlams.length > 0 ? form.aghlams[0].codekala : "N/A",
                  flamekala:
                    form.aghlams.length > 0 ? form.aghlams[0].flamekala : "N/A",
                  shopkala:
                    form.aghlams.length > 0 ? form.aghlams[0].shopkala : "N/A",
                  personel:
                    form.personels.length > 0
                      ? form.personels[0].personel
                      : "N/A",
                  personelnumber:
                    form.personels.length > 0
                      ? form.personels[0].personelnumber
                      : "N/A",
                  datesubmit:
                    form.personels.length > 0 && form.personels[0].datesubmit
                      ? new Date(form.personels[0].datesubmit)
                      : null,
                  specialjob:
                    form.personels.length > 0
                      ? form.personels[0].specialjob
                      : "N/A",
                  starttimerepair:
                    form.personels.length > 0 &&
                    form.personels[0].starttimerepair
                      ? new Date(form.personels[0].starttimerepair)
                      : null,
                  endtimerepair:
                    form.personels.length > 0 && form.personels[0].endtimerepair
                      ? new Date(form.personels[0].endtimerepair)
                      : null,
                  repairstatus:
                    form.personels.length > 0
                      ? form.personels[0].repairstatus
                      : "N/A",
                  unitrepair:
                    form.personels.length > 0
                      ? form.personels[0].unitrepair
                      : "N/A",
                  shift:
                    form.personels.length > 0 ? form.personels[0].shift : "N/A",
                  delayreason:
                    form.personels.length > 0
                      ? form.personels[0].delayreason
                      : "N/A",
                  failurereason:
                    form.personels.length > 0
                      ? form.personels[0].failurereason
                      : "N/A",
                  failurereasondescription:
                    form.personels.length > 0
                      ? form.personels[0].failurereasondescription
                      : "N/A",
                  suggestionfailure:
                    form.personels.length > 0
                      ? form.personels[0].suggestionfailure
                      : "N/A",
                }))}
                columns={columns_technician}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
              />
            </Paper>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
