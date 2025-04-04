/* eslint-disable no-unused-vars */
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import { useState } from "react";
import api from "../api";
import { useEffect } from "react";
import { Send, Trash } from "lucide-react";
import { Tooltip } from "@mui/material";
import "../styles/SubmitForm.css";
import { useParams } from "react-router-dom";

export default function FormTable() {
  const { formcode } = useParams();
  const [values, setValues] = useState();
  const [submitform, setSubmitform] = useState([]);
  const [technicianform, setTechnicianForm] = useState([]);
  const [aghlams, setAghlams] = useState([]); // Assuming aghlams data
  const [personels, setPersonels] = useState([]); // Assuming personels data
  const [mergedTechnicianForms, setMergedTechnicianForms] = useState([]);
  const [userType, setUserType] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [modalValues, setModalValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mergedFormData, setMergedFormData] = useState({
    submit_form_id: "",
    technician_form_id: "",
    aghlam_id: "",
    personel_id: "",
  });

  // Function to add a new form to the state
  const addNewForm = (newForm) => {
    setSubmitform((prevForms) => [newForm, ...prevForms]);
  };

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
    return true; // If no match, show all
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const token = localStorage.getItem("user_token");

        if (!token) {
          console.error("Token is missing!");
          return;
        }

        const res = await api.get(`/api/submitform/${formcode}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setValues(res.data);
      } catch (error) {
        console.error("Error Fetching form data", error);
      }
    };

    if (formcode) fetchFormData();
  }, [formcode]);
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

  const handleSend = (id) => {
    const selectedForm = submitform.find((form) => form.id === id);
    if (selectedForm) {
      console.log("Selected Form:", selectedForm); // Debugging
      console.log("Form Code:", selectedForm.formcode); // Debugging

      setSelectedRowId(id);
      setModalValues({
        formcode: selectedForm.formcode, // Ensure `formcode` is being passed
        // Add initial values for other modal fields if needed
      });
      setIsModalOpen(true);
    } else {
      alert("Form not found.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setValues({ select1: "", select2: "" });
    setSelectedRowId(null);
  };

  {
    /*Set the merged data to state*/
  }
  useEffect(() => {
    if (technicianform.length || aghlams.length || personels.length) {
      const mergedData = technicianform.map((techForm) => ({
        ...techForm,
        aghlams: aghlams.filter(
          (aghlam) => aghlam.formcode === techForm.formcode
        ),
        personels: personels.filter(
          (personel) => personel.formcode === techForm.formcode
        ),
      }));

      setMergedTechnicianForms(mergedData);
    }
  }, [technicianform, aghlams, personels]);

  {
    /* Handle Modal Submit*/
  }

  const handleModalSubmit = async () => {
    const userType = localStorage.getItem("userType"); // User-Type may still be required for backend logic

    const requestData = {
      submit_form_id: "12345",
      technician_form_id: "67890",
      aghlam_ids: [1, 2, 3],
      personel_ids: [4, 5],
    };

    try {
      const response = await api.post("/api/mergedform/", {
        headers: {
          "User-Type": userType || "Unknown", // Only header required
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Request failed:", errorData);
        alert(errorData?.error || "Failed to submit form.");
      } else {
        const responseData = await response.json();
        console.log("Form submitted successfully:", responseData);
        alert("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Network error:", error.message);
      alert(
        "An error occurred. Please check your network connection and try again."
      );
    }
  };

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
            className={`text-white rounded-2xl w-full ${
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
        <div className="flex justify-start mt-4">
          <Tooltip title={"Delete"} placement="top">
            <button
              onClick={() => handleDelete(params.row.id)}
              className="text-red-400 hover:text-red-300 cursor-pointer"
            >
              <Trash size={18} />
            </button>
          </Tooltip>
          <Tooltip title={"Send"} placement="top">
            <button
              onClick={() => handleSend(params.row.id)}
              className="text-pink-500 hover:text-pink-300 cursor-pointer ml-2"
            >
              <Send size={18} />
            </button>
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
  const handlePaginationChange = (params) => {
    setPaginationModel(params);
  };
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
            <div>
              <header className="flex justify-center text-center mb-4 bg-gray-700 rounded-2xl">
                لیست فرم های ثبت شده
              </header>
            </div>
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
                pageSize={paginationModel.pageSize}
                onPageChange={(newPage) =>
                  setPaginationModel((prev) => ({ ...prev, page: newPage }))
                }
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
        {isModalOpen && (
          <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
              <motion.div>
                <div className="fixed inset-0 flex items-center justify-center">
                  <div className="fixed inset-0 bg-gray-500 opacity-40" />
                  <div className="w-[520px] justify-center flex aling-center rounded-2xl">
                    <div className="container">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleModalSubmit();
                        }}
                      >
                        <header>ثبت نهایی فرم</header>
                        <div className="grid grid-cols-1">
                          <div className="input-field">
                            <label
                              htmlFor="formcode"
                              className="flex justify-center text-center"
                            >
                              شماره درخواست
                            </label>
                            <input
                              type="text"
                              id="formcode"
                              value={modalValues?.formcode || ""}
                              placeholder="شماره درخواست"
                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                              disabled
                            />
                          </div>
                          <div className="input-field">
                            <label
                              htmlFor="typeform"
                              className="flex justify-center text-center"
                            >
                              فرم
                            </label>
                            <select
                              id="formtype"
                              name="formtype"
                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                              value={values?.formtype || ""}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="pm">PM</option>
                              <option value="em">EM</option>
                              <option value="cm">CM</option>
                              <option value="gm">GM</option>
                            </select>
                          </div>
                          <div className="flex justify-center text-center">
                            <button className="nextBtn" type="submit">
                              تایید
                            </button>
                            <button
                              type="button"
                              className="nextBtnCancel"
                              onClick={() => setIsModalOpen(false)}
                            >
                              خروج
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
