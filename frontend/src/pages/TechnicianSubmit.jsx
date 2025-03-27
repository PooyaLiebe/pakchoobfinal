/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../styles/SubmitForm.css";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Common/Header";
import api from "../api";

function TechnicianSubmit() {
  const [values, setValues] = useState({
    formcode: "",
    failurepart: "Pinion",
    failuretime: "",
    sparetime: "",
    startfailuretime: "",
    problemdescription: "",
  });
  const { formcode } = useParams();
  const [show, setShow] = useState(false);
  const [userType, setUserType] = useState("admin");
  const [showPermit, setShowPermit] = useState(false);
  const [showAghlam, setShowAghlam] = useState(false);
  const [showTech, setShowTech] = useState(false);
  const [generatedFormCode, setGeneratedFormCode] = useState("");
  const [aghlam, setAghlam] = useState({
    formcode: "",
    kalaname: "",
    countkala: "",
    vahedkala: "عدد",
    codekala: "",
    flamekala: "خیر",
    shopkala: "فوری",
  });
  const [tech, setTech] = useState({
    formcode: "",
    personel: "",
    personelnumber: "",
    datesubmit: "",
    specialjob: "رئیس",
    starttimerepair: "",
    endtimerepair: "",
    repairstatus: "تعمیر کامل و قابل کاربری است",
    unitrepair: "Mechanic",
    shift: "A",
    delayreason: "نبود قطعه یدکی",
    failurereason: "اضافه بار",
    failurereasondescription: "",
    suggestionfailure: "",
  });
  const navigate = useNavigate();

  const formatDateTime = (datetime) => {
    return datetime ? `${datetime}:00` : "";
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/techniciansubmit/", {
        // values,
        formcode: values?.formcode || formcode,
        failurepart: values.failurepart,
        failuretime: formatDateTime(values.failuretime),
        sparetime: formatDateTime(values.sparetime),
        startfailuretime: formatDateTime(values.startfailuretime),
        problemdescription: values.problemdescription,
      });

      if (response.data.status === "success") {
        setGeneratedFormCode(response.data.formcode);
        alert("فرم ثبت شد");
        setValues({
          formcode: formcode,
          failurepart: "Pinion",
          failuretime: "",
          sparetime: "",
          startfailuretime: "",
          problemdescription: "",
        });
        setTimeout(() => {
          setGeneratedFormCode("");
        }, 3000);
      } else {
        console.error("⚠️ خطا در ثبت فرم:", response.data.message);
      }
    } catch (error) {
      console.error("❌ خطا در ثبت فرم:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (
      [
        "kalaname",
        "countkala",
        "vahedkala",
        "codekala",
        "flamekala",
        "shopkala",
      ].includes(name)
    ) {
      setAghlam((prevAghlam) => ({
        ...prevAghlam,
        [name]: value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleAghlamSubmit = async (e) => {
    e.preventDefault();
    if (!aghlam.kalaname || !aghlam.countkala || !aghlam.codekala) {
      alert("لطفا همه فیلدهای مورد نیاز را پر کنید");
      return;
    }
    try {
      const response = await api.post("/api/aghlams/", {
        formcode: values.formcode || formcode,
        kalaname: aghlam.kalaname,
        countkala: aghlam.countkala,
        vahedkala: aghlam.vahedkala,
        codekala: aghlam.codekala,
        flamekala: aghlam.flamekala,
        shopkala: aghlam.shopkala,
      });

      if (response.data.status === "success") {
        setGeneratedFormCode(response.data.formcode);
        alert("فرم ثبت شد");
        setAghlam({
          formcode: formcode,
          kalaname: "",
          countkala: "",
          vahedkala: "عدد",
          codekala: "",
          flamekala: "خیر",
          shopkala: "فوری",
        });
        setTimeout(() => {
          setGeneratedFormCode("");
        }, 3000);
      } else {
        console.error("⚠️ خطا در ثبت فرم:", response.data.message);
      }
    } catch (error) {
      console.error("❌ خطا در ثبت فرم:", error);
    }
  };

  const handleTechSubmit = (e) => {
    e.preventDefault();
    api
      .post("/technician", tech)
      .then((result) => {
        if (result.data.Status) {
          alert("اقلام با موفقیت ثبت شد");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    if (event.target.value === "بله") {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleSend = () => {
    // handleSubmit();
    handleClose();
  };

  const handleSelectChangePermit = (event) => {
    if (event.target.value === "بله") {
      setShowPermit(true);
    } else {
      setShowPermit(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleModalClose = (modalType) => {
    switch (modalType) {
      case "aghlam":
        setShowAghlam(true);
        break;
      case "tech":
        setShowTech(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title={"ثبت فرم تکنیسین"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="body dark:bg-secondary-dark-bg rounded-3xl">
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
                          value={values?.formcode || formcode} // Pre-fill with formcode from URL
                          disabled
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="failurepart"
                          className="flex justify-center items-center"
                        >
                          نام قسمت معیوب(بر اساس تکسونومی)
                        </label>
                        <input
                          type="text"
                          name="failurepart"
                          id="failurepart"
                          placeholder="نام قسمت معیوب(بر اساس تکسونومی)"
                          className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 "
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="failuretime"
                          className="flex justify-center items-center"
                        >
                          مدت زمان تشخیص عیب
                        </label>
                        <input
                          type="datetime-local"
                          name="failuretime"
                          className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11"
                          id="failuretime"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="sparetime"
                          className="flex justify-center items-center"
                        >
                          مدت زمان تهیه لوازم یدکی
                        </label>
                        <input
                          type="datetime-local"
                          name="sparetime"
                          id="sparetime"
                          className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label
                          htmlFor="startfailuretime"
                          className="flex justify-center items-center"
                        >
                          میزان ساعت کار تجهیز در زمان شروع به رفع عیب
                        </label>
                        <input
                          type="datetime-local"
                          name="startfailuretime"
                          id="startfailuretime"
                          className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 h-11 "
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
                          className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                          placeholder="کلیات شرح عیب مشاهده شده را توضیح دهید : "
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-center text-center aling-center">
                      <button
                        type="button"
                        className="nextBtnCancel"
                        onClick={() => navigate("/forms")}
                      >
                        لفو فرم
                      </button>
                      <button
                        type="button"
                        className="nextBtn"
                        onClick={() => setShowAghlam(true)}
                      >
                        اقلام
                      </button>
                      <button
                        type="button"
                        className="nextBtn"
                        onClick={() => setShowTech(true)}
                      >
                        تکنیسین
                      </button>
                      <button type="submit" className="nextBtn">
                        ثبت
                      </button>
                      {showAghlam && (
                        <>
                          <div className="flex-1 overflow-auto relative z-10">
                            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                              <motion.div>
                                <div className="fixed inset-0 flex items-center justify-center z-20">
                                  <div className="p-4 rounded">
                                    <div className="container">
                                      <form onSubmit={handleAghlamSubmit}>
                                        <header className="flex mb-6 justify-center text-center font-bold">
                                          شرح و مشخصات قطعات یدکی مصرف شده
                                        </header>
                                        <div className="grid grid-cols-2 gap-4">
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
                                              value={
                                                values?.formcode || formcode
                                              } // Pre-fill with formcode from URL
                                              disabled
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="kalaname"
                                              className="flex justify-center items-center"
                                            >
                                              نام کالا
                                            </label>
                                            <input
                                              type="text"
                                              name="kalaname"
                                              id="kalaname"
                                              placeholder="نام کالا را وارد کنید"
                                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                              value={aghlam.kalaname}
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="countkala"
                                              className="flex justify-center items-center"
                                            >
                                              تعداد
                                            </label>
                                            <input
                                              type="text"
                                              name="countkala"
                                              id="countkala"
                                              placeholder="تعداد کالا را وارد کنید"
                                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                              value={aghlam.countkala}
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="vahedkala"
                                              className="flex justify-center items-center"
                                            >
                                              واحد
                                            </label>
                                            <select
                                              type="text"
                                              name="vahedkala"
                                              id="vahedkala"
                                              placeholder=""
                                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                              value={aghlam.vahedkala}
                                              onChange={handleInputChange}
                                              required
                                            >
                                              <option value="عدد">عدد</option>
                                              <option value="گرم">گرم</option>
                                              <option value="کیلوگرم">
                                                کیلوگرم
                                              </option>
                                              <option value="متر">متر</option>
                                              <option value="سانتی متر">
                                                سانتی متر
                                              </option>
                                              <option value="میلی متر">
                                                میلی متر
                                              </option>
                                              <option value="لیتر">لیتر</option>
                                              <option value="گالن">گالن</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="codekala"
                                              className="flex justify-center items-center"
                                            >
                                              کد کالا
                                            </label>
                                            <input
                                              type="text"
                                              name="codekala"
                                              id="codekala"
                                              placeholder="کد کالا را وارد کنید"
                                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                              value={aghlam.codekala}
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="flamekala"
                                              className="flex justify-center items-center"
                                            >
                                              قطعه مستعمل
                                            </label>
                                            <select
                                              type="text"
                                              name="flamekala"
                                              id="flamekala"
                                              placeholder=""
                                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                              value={aghlam.flamekala}
                                              onChange={handleInputChange}
                                              required
                                            >
                                              <option value="خیر">خیر</option>
                                              <option value="بله">بله</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="shopkala"
                                              className="flex justify-center items-center"
                                            >
                                              خرید فوری
                                            </label>
                                            <select
                                              type="text"
                                              name="shopkala"
                                              id="shopkala"
                                              placeholder=""
                                              className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                              value={aghlam.shopkala}
                                              onChange={handleInputChange}
                                              required
                                            >
                                              <option value="فوری">فوری</option>
                                              <option value="ضروری">
                                                ضروری
                                              </option>
                                              <option value="معمولی">
                                                معمولی
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="flex justify-center text-center">
                                          <button
                                            className="nextBtn"
                                            type="submit"
                                            onClick={handleAghlamSubmit}
                                          >
                                            تایید
                                          </button>
                                          <button
                                            className="nextBtnCancel"
                                            onClick={() => setShowAghlam(false)}
                                          >
                                            خروج
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </main>
                          </div>
                        </>
                      )}
                      {showTech && (
                        <>
                          <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
                          <div className="fixed inset-0 flex items-center justify-center z-20">
                            <div className="bg-white p-4 rounded">
                              <div className="container">
                                <header className="flex">
                                  سرپرست/مسئول تعمیرات
                                </header>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label
                                      htmlFor="personel"
                                      className="flex justify-center items-center"
                                    >
                                      پرسنل انجام دهنده
                                    </label>
                                    <input
                                      type="text"
                                      name="personel"
                                      id="personel"
                                      placeholder="نام و نام خانوادگی پرسنل"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          personel: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="personelnumber"
                                      className="flex justify-center items-center"
                                    >
                                      شماره پرسنلی
                                    </label>
                                    <input
                                      type="text"
                                      name="personelnumber"
                                      id="personelnumber"
                                      placeholder="شماره پرسنلی را وارد کنید"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          personelnumber: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="datesubmit"
                                      className="flex justify-center items-center"
                                    >
                                      تاریخ انجام
                                    </label>
                                    <input
                                      type="datetime-local"
                                      name="datesubmit"
                                      id="datesubmit"
                                      className="outline-none text-14 w-full font-normal flex text-center items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          datesubmit: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="specialjob"
                                      className="flex justify-center items-center"
                                    >
                                      مهارت
                                    </label>
                                    <select
                                      name="specialjob"
                                      id="specialjob"
                                      className="outline-none text-14 w-full font-normal flex text-center items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          specialjob: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      <option value="کارشناس">کارشناس</option>
                                      <option value="رئیس">رئیس</option>
                                      <option value="سرشیفت">سرشیفت</option>
                                      <option value="سرپرست">سرپرست</option>
                                      <option value="تکنسین">تکنسین</option>
                                      <option value="تعمیرکار">تعمیرکار</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="starttimerepair"
                                      className="flex justify-center items-center"
                                    >
                                      ساعت شروع تعمیرات
                                    </label>
                                    <input
                                      type="datetime-local"
                                      name="starttimerepair"
                                      id="starttimerepair"
                                      className="outline-none text-14 w-full font-normal flex text-center items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          starttimerepair: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="endtimerepair"
                                      className="flex justify-center items-center"
                                    >
                                      ساعت پایان تعمیرات
                                    </label>
                                    <input
                                      type="datetime-local"
                                      name="endtimerepair"
                                      id="endtimerepair"
                                      className="outline-none text-14 w-full font-normal flex text-center items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          endtimerepair: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="repairstatus"
                                      className="flex justify-center items-center"
                                    >
                                      وضعیت تعمیر
                                    </label>
                                    <select
                                      name="repairstatus"
                                      id="repairstatus"
                                      className="outline-none text-14 text-center w-full font-normal flex items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          repairstatus: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      <option value="تعمیر کامل و قابل کاربری است">
                                        تعمیر کامل و قابل کاربری است
                                      </option>
                                      <option value="نیاز به تعمیر مجدد دارد">
                                        نیاز به تعمیر مجدد دارد
                                      </option>
                                      <option value="نیاز به بازرسی مجدد دارد">
                                        نیاز به بازرسی مجدد دارد
                                      </option>
                                      <option value="تعمیر کامل نیست و نیاز به تکمیل دارد">
                                        تعمیر کامل نیست و نیاز به تکمیل دارد
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="unitrepair"
                                      className="flex justify-center items-center"
                                    >
                                      {" "}
                                      واحد انجام دهنده
                                    </label>
                                    <select
                                      name="unitrepair"
                                      id="unitrepair"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          unitrepair: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      <option value="Mechanic">Mechanic</option>
                                      <option value="Electric">Electric</option>
                                      <option value="Utility">Utility</option>
                                      <option value="Production">
                                        Production
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="shift"
                                      className="flex justify-center items-center"
                                    >
                                      شیفت
                                    </label>
                                    <select
                                      name="shift"
                                      id="shift"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          shift: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      <option value="A">A</option>
                                      <option value="B">B</option>
                                      <option value="C">C</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="delayreason"
                                      className="flex justify-center items-center"
                                    >
                                      دلیل تاخیر
                                    </label>
                                    <select
                                      name="delayreason"
                                      id="delayreason"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          delayreason: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      <option value="نبود قطعه یدکی">
                                        نبود قطعه یدکی
                                      </option>
                                      <option value="نبودابزار و تجهیزات مناسب">
                                        نبود ابزار و تجهیزات مناسب
                                      </option>
                                      <option value="عدم حضور متخصص تعمیرات">
                                        عدم حضوری متخصص تعمیرات
                                      </option>
                                      <option value="کمبود نیرو">
                                        کمبود نیرو
                                      </option>
                                      <option value="برونسپاری">
                                        برونسپاری
                                      </option>
                                      <option value="تاخیر در صدور مجوزها">
                                        تاخیر در صدور مجوزها
                                      </option>
                                      <option value="تاخیر در ماشین آلات">
                                        تاخیر در ماشین آلات
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="failurereason"
                                      className="flex justify-center items-center"
                                    >
                                      دلیل خرابی
                                    </label>
                                    <select
                                      name="failurereason"
                                      id="failurereason"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          failurereason: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      {" "}
                                      <option value="اضافه بار">
                                        اضافه بار
                                      </option>
                                      <option value="تنظیم نادرست">
                                        تنظیم نادرست
                                      </option>
                                      <option value="حادثه">حادثه</option>
                                      <option value="طراحی غلط">
                                        طراحی غلط
                                      </option>
                                      <option value="بهره برداری نادرست">
                                        بهره برداری نادرست
                                      </option>
                                      <option value="نگهداری ضعیف">
                                        نگهداری ضعیف
                                      </option>
                                      <option value="فرسودگی">فرسودگی</option>
                                      <option value="نامرغوب بودن قطعات">
                                        نامرغوب بودن قطعات
                                      </option>
                                      <option value="نبود / کمبود اطلاعات فنی">
                                        نبود / کمبود اطلاعات فنی
                                      </option>
                                      <option value="تاخیر در ارجاع مکاتبات">
                                        تاخیر در ارجاع مکاتبات
                                      </option>
                                      <option value="نامناسب بودن تعمیرات قبلی">
                                        نامناسب بودن تعمیرات قبلی
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="failurereasondescription"
                                      className="flex justify-center items-center"
                                    >
                                      شرح دلیل خرابی
                                    </label>
                                    <textarea
                                      placeholder="دلیل خرابی را توضیح دهید"
                                      name="failurereasondescription"
                                      id="failurereasondescription"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          failurereasondescription:
                                            e.target.value,
                                        })
                                      }
                                      required
                                    ></textarea>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="suggestionfailure"
                                      className="flex justify-center items-center"
                                    >
                                      پیشنهاد
                                    </label>
                                    <textarea
                                      placeholder="پیشنهاد تکنیسین"
                                      name="suggestionfailure"
                                      id="suggestionfailure"
                                      className="outline-none text-14 w-full font-normal flex justify-center text-center  items-center rounded-md shadow-lg border-2 p-2 h-11 m-2"
                                      onChange={(e) =>
                                        setTech({
                                          ...tech,
                                          suggestionfailure: e.target.value,
                                        })
                                      }
                                      required
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="flex">
                                  <button onClick={handleTechSubmit}>
                                    تایید
                                  </button>
                                  <button onClick={handleModalClose}>
                                    خروج
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default TechnicianSubmit;
