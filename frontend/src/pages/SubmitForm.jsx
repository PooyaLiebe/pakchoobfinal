/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SubmitForm.css";
import { motion } from "framer-motion";
import Header from "../components/Common/Header";
const SubmitForm = () => {
  const [values, setValues] = useState({
    formcode: "",
    problemdate: "",
    productionstop: "خیر",
    section: "Chipper",
    machinename: "",
    machinecode: "",
    machineplacecode: "",
    worktype: "Mechanic",
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
  // const [formcode, setFormcode] = useState("");
  // const [machinename, setMachineName] = useState("");
  const [userType, setUserType] = useState("admin");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/submitform/",
        values,
        {
          user_type: userType,
        }
      );
      if (response.data.status === "success") {
        alert("فرم با موفقیت ثبت شد");
        navigate("/submitform");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isStopTimeDisabled = values.productionstop === "خیر";

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
                <div className="form first">
                  <div className="details personal">
                    <div className="fields">
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
                          placeholder="شماره درخواست"
                          className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                          onChange={(e) =>
                            setValues({ ...values, formcode: e.target.value })
                          }
                          required
                        />
                      </div>
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              problemdate: e.target.value,
                            })
                          }
                          required
                        />
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              productionstop: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({ ...values, section: e.target.value })
                          }
                          required
                        >
                          <option value="Chipper">Chipper</option>
                          <option value="Conveyor Line">Conveyor Line</option>
                          <option value="Dryer & Air Grader">
                            Dryer & Air Grader
                          </option>
                          <option value="Refiner">Refiner</option>
                          <option value="Before Press">Before Press</option>
                          <option value="Press">Press</option>
                          <option value="After Press">After Press</option>
                          <option value="Sanding">Sanding</option>
                          <option value="Cooling System">Cooling System</option>
                          <option value="Steam Boiler">Steam Boiler</option>
                          <option value="General">General</option>
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              machinename: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              machinecode: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              machineplacecode: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({ ...values, worktype: e.target.value })
                          }
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
                          onChange={(e) =>
                            setValues({ ...values, stoptime: e.target.value })
                          }
                          required
                          disabled={isStopTimeDisabled}
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="failuretime"
                          className="flex justify-center items-center"
                        >
                          میزان ساعت کار تجهیز در زمان بروز عیب
                        </label>
                        <input
                          type="text"
                          name="failuretime"
                          id="failuretime"
                          className="text-center"
                          placeholder="میزان ساعت کار را وارد کنید"
                          onChange={(e) =>
                            setValues({
                              ...values,
                              failuretime: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({ ...values, shift: e.target.value })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              suggesttime: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              worksuggest: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({ ...values, fixrepair: e.target.value })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              reportinspection: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({ ...values, faultdm: e.target.value })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              operatorname: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setValues({
                              ...values,
                              problemdescription: e.target.value,
                            })
                          }
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
