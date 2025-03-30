/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SubmitForm.css";
import { motion } from "framer-motion";
import Header from "../components/Common/Header";
import api from "../api.js";

const sectionCodes2 = {
  Chipper: "01",
  "Conveyor Line": "02",
  "Dryer & Air Grader": "03",
  Refiner: "04",
  "Before Press": "05",
  Press: "06",
  "After Press": "07",
  Sanding: "09",
  "Cooling System": "08",
  "Steam Boiler": "10",
  General: "11",
};
const sectionCodes = {
  Melamine: "01",
  "High Glass": "05",
  Formalin: "08",
  Resin: "07",
  "Purification Plant": "04",
  Agheshte: "03",
};
const SubmitForm = () => {
  const [values, setValues] = useState({
    formcode: "",
    problemdate: "",
    phase: "",
    productionstop: "خیر",
    section: "01",
    machinename: "",
    machinecode: "",
    machineplacecode: "",
    worktype: "mechanic",
    stoptime: "",
    failuretime: "",
    shift: "A",
    suggesttime: "فوری",
    worksuggest: "اضطراری",
    fixrepair: "درخواست اپراتو",
    reportinspection: "بازرسی فنی",
    faultdm: "اختلال در کارکرد",
    operatorname: "",
    problemdescription: "",
  });

  const [userType, setUserType] = useState("admin");
  const [generatedFormCode, setGeneratedFormCode] = useState(""); // new state
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.machinename || !values.machinecode || !values.operatorname) {
      setErrorMessage("فیلد های ضرروری را پر کنید");
      return;
    }

    try {
      const response = await api.post("/api/submitform/", {
        ...values,
        user_type: userType,
      });
      if (response.data.status === "success") {
        setGeneratedFormCode(response.data.formcode); // Set the received formcode
        setValues({
          formcode: "",
          problemdate: "",
          phase: "01",
          productionstop: "خیر",
          section: "01",
          machinename: "",
          machinecode: "",
          machineplacecode: "",
          worktype: "mechanic",
          stoptime: "",
          failuretime: "",
          shift: "A",
          suggesttime: "فوری",
          worksuggest: "اضطراری",
          fixrepair: "درخواست اپراتو",
          reportinspection: "بازرسی فنی",
          faultdm: "اختلال در کارکرد",
          operatorname: "",
          problemdescription: "",
        });
        setTimeout(() => {
          setGeneratedFormCode("");
        }, 3000);
        navigate("/submitform");
      } else {
        setErrorMessage("خطا در ارسال فرم لطفا دوباره امتحان کنید");
        console.error("حطا در ارسال فرم", response.data.message);
      }
    } catch (error) {
      console.error("خطا در ارسال فرم", error);
    }
  };

  const isStopTimeDisabled = values.productionstop === "خیر";

  // Function to update section based on the phase
  const getSectionCodes = () => {
    return values.phase === "01" ? sectionCodes : sectionCodes2;
  };

  useEffect(() => {
    const savedPhase = localStorage.getItem("phase");
    if (savedPhase) {
      setValues((prevValues) => ({
        ...prevValues,
        phase: savedPhase,
        section: savedPhase === "01" ? "Melamine" : "Chipper",
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => {
      const newValues = { ...prevValues, [name]: value };
      if (name === "phase") {
        localStorage.setItem("phase", value);
        const updatedSection = Object.keys(
          value === "01" ? sectionCodes : sectionCodes2
        )[0];
        newValues.section = updatedSection;
      }
      return newValues;
    });
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title={"ثبت فرم"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="body dark:bg-secondary-dark-bg rounded-3xl z-10">
            <div className="container">
              <form onSubmit={handleSubmit}>
                {generatedFormCode && (
                  <div>
                    <h3>کد فرم شما : {generatedFormCode}</h3>
                  </div>
                )}
                <div className="form first">
                  <div className="details personal">
                    <div className="fields">
                      <div className="input-field">
                        <label
                          htmlFor="problemdate"
                          className="flex justify-center items-center"
                        >
                          تاریخ بروز مشکل
                        </label>
                        <input
                          type="datetime-local"
                          name="problemdate"
                          className="outline-none text-12 w-[full] sm:w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2"
                          id="problemdate"
                          value={values.problemdate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="productionstop"
                          className="flex justify-center items-center"
                        >
                          فاز
                        </label>
                        <select
                          name="phase"
                          className="text-center"
                          id="phase"
                          value={values.phase}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="01">MDF1</option>
                          <option value="02">MDF2</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="productionstop"
                          className="flex justify-center items-center"
                        >
                          مشکل باعث توقف خط شده است ؟
                        </label>
                        <select
                          name="productionstop"
                          className="text-center"
                          id="productionstop"
                          value={values.productionstop}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="خیر">خیر</option>
                          <option value="بله">بله</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="section"
                          className="flex justify-center items-center"
                        >
                          بخش
                        </label>
                        <select
                          name="section"
                          id="section"
                          className="text-center"
                          value={values.section}
                          onChange={handleInputChange}
                          required
                        >
                          {Object.keys(getSectionCodes()).map((sectionName) => (
                            <option key={sectionName} value={sectionName}>
                              {sectionName} {/* Displaying section name */}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="machinename"
                          className="flex justify-center items-center"
                        >
                          نام دستگاه
                        </label>
                        <input
                          type="text"
                          name="machinename"
                          placeholder="نام دستگاه را وارد کنید"
                          id="machinename"
                          className="text-center"
                          value={values.machinename}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="machinecode"
                          className="flex justify-center items-center"
                        >
                          کد دستگاه
                        </label>
                        <input
                          type="text"
                          name="machinecode"
                          placeholder="کد دستگاه را وارد کنید"
                          id="machinecode"
                          className="text-center"
                          value={values.machinecode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="machineplacecode"
                          className="flex justify-center items-center"
                        >
                          کد محل استقرار دستگاه
                        </label>
                        <input
                          type="text"
                          name="machineplacecode"
                          placeholder="کد محل استقرار دستگاه را وارد کنید"
                          id="machineplacecode"
                          className="text-center"
                          value={values.machineplacecode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="worktype"
                          className="flex justify-center items-center"
                        >
                          واحد مربوطه
                        </label>
                        <select
                          name="worktype"
                          className="text-center"
                          id="worktype"
                          value={values.worktype}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="mechanic">Mechanic</option>
                          <option value="electric">Electric</option>
                          <option value="utility">Utility</option>
                          <option value="metalworking">Metal Working</option>
                          <option value="tarashkari">Tarash Kari</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="stoptime"
                          className="flex justify-center items-center"
                        >
                          ساعت شروع توقف
                        </label>
                        <input
                          type="datetime-local"
                          name="stoptime"
                          id="stoptime"
                          className="outline-none text-14 w-full font-normal flex justify-center text-center items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                          value={values.stoptime}
                          onChange={handleInputChange}
                          required
                          disabled={isStopTimeDisabled}
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="failuretime"
                          className="flex justify-center text-center"
                        >
                          میزان ساعت کار تجهیز در زمان بروز عیب
                        </label>
                        <input
                          type="time"
                          name="failuretime"
                          id="failuretime"
                          className="flex justify-center text-center"
                          placeholder="میزان ساعت کار را وارد کنید"
                          value={values.failuretime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="shift"
                          className="flex justify-center items-center"
                        >
                          شیفت
                        </label>
                        <select
                          name="shift"
                          className="text-center"
                          id="shift"
                          value={values.shift}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="suggesttime"
                          className="flex justify-center items-center"
                        >
                          زمان پیشنهادی برای شروع تعمیر
                        </label>
                        <select
                          name="suggesttime"
                          className="text-center"
                          id="suggesttime"
                          value={values.suggesttime}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="فوری">فوری</option>
                          <option value="ساعات آتی">ساعات آتی</option>
                          <option value="اولین روز کاری">اولین روز کاری</option>
                          <option value="در اولین فرصت">در اولین فرصت</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="worksuggest"
                          className="flex justify-center items-center"
                        >
                          نوع کار درخواستی
                        </label>
                        <select
                          name="worksuggest"
                          className="text-center"
                          id="worksuggest"
                          value={values.worksuggest}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="اضطراری">اضطراری</option>
                          <option value="بهسازی">بهسازی</option>
                          <option value="پایش وضعیت(غیر برنامهای)">
                            پایش وضعیت(غیر برنامه ای)
                          </option>
                          <option value="آماده سازی برای تعمیرات">
                            آماده سازی برای تعمیر
                          </option>
                          <option value="خدمات عمومی">خدمات عمومی</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="fixrepair"
                          className="flex justify-center items-center"
                        >
                          تعمیر و تعویض اصلاحی ناشی از
                        </label>
                        <select
                          name="fixrepair"
                          className="text-center"
                          id="fixrepair"
                          value={values.fixrepair}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="درخواست اپراتور">
                            درخواست اپراتور
                          </option>
                          <option value="درخواست واحد نت">
                            درخواست واحد نت
                          </option>
                          <option value="گزارش واحد ایمنی">
                            گزارش واحد ایمنی
                          </option>
                          <option value="آماده سازی برای تعمیر">
                            آماده سازی برای تعمیر
                          </option>
                          <option value="خدمات عمومی">خدمات عمومی</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="reportinspection"
                          className="flex justify-center items-center"
                        >
                          گزارش بازرسی
                        </label>
                        <select
                          name="reportinspection"
                          className="text-center"
                          id="reportinspection"
                          value={values.reportinspection}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="بازرسی فنی">بازرسی فنی</option>
                          <option value="واحد نت">واحد نت</option>
                          <option value="اپراتور">اپراتور</option>
                          <option value="سایر">سایر</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="faultdm"
                          className="flex justify-center items-center"
                        >
                          روش کشف عیب
                        </label>
                        <select
                          name="faultdm"
                          className="text-center"
                          id="faultdm"
                          value={values.faultdm}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="اختلال در کارکرد">
                            اختلال در کارکرد
                          </option>
                          <option value="تعمیرات دوره ای">
                            تعمیرات دوره ای
                          </option>
                          <option value="مشاهده تصادفی">مشاهده تصادفی</option>
                          <option value="بازرسی دوره ای">بازرسی دوره ای</option>
                          <option value="تست عملکرد">تست عملکرد</option>
                          <option value="پایش وضعیت دوره ای">
                            پایش وضعیت دوره ای
                          </option>
                          <option value="آماده به کار نبودن در حین نیاز">
                            آماده به کار نبودن در حین نیاز
                          </option>
                          <option value="در حین انجام تعمیرات اصلاحی">
                            در حین انجام تعیرات اصلاحی
                          </option>
                          <option value="فالت با آلارم">فالت با آلارم</option>
                          <option value="سایر روش ها">سایر</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="operatorname"
                          className="flex justify-center items-center"
                        >
                          نام اپراتور
                        </label>
                        <input
                          type="text"
                          name="operatorname"
                          id="operatorname"
                          className="text-center"
                          placeholder="نام اپراتور را وارد کنید"
                          value={values.operatorname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="problemdescription"
                          className="flex justify-center items-center"
                        >
                          کلیات شرح عیب مشاهده شده
                        </label>
                        <textarea
                          name="problemdescription"
                          id="problemdescription"
                          className="text-center"
                          placeholder="کلیات شرح عیب مشاهده شده را توضیح دهید : "
                          value={values.problemdescription}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="nextBtn">
                      ثبت
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SubmitForm;
