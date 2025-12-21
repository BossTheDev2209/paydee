import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Format number with commas for display
function formatNumber(value) {
  if (value === undefined || value === null || value === "") return "";
  const numeric = String(value).replace(/,/g, "");
  if (numeric === "") return "";
  return Number(numeric).toLocaleString();
}

// Compact inline input component matching the design
function InlineInput({ label, name, placeholder, value, onChange, unit, optional }) {
  return (
    <div className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700">
      <label className="w-1/3 text-sm md:text-base text-[#2b2b2b] dark:text-white font-medium">
        {label}
        {optional && <span className="text-[#ffcc00] text-xs ml-1">(optional)</span>}
      </label>
      <div className="flex-1 flex items-center gap-3">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ color: '#ffcc00' }}
          className="flex-1 px-6 py-2 h-12 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 font-black focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all text-center text-xl"
        />
        {unit && (
          <span className="w-16 text-sm text-gray-500 dark:text-gray-400 text-right">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// Compact inline select component
function InlineSelect({ label, name, value, onChange, options, optional }) {
  return (
    <div className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700">
      <label className="w-1/3 text-sm md:text-base text-[#2b2b2b] dark:text-white font-medium">
        {label}
        {optional && <span className="text-[#ffcc00] text-xs ml-1">(optional)</span>}
      </label>
      <div className="flex-1">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1a1a1a] text-[#2b2b2b] dark:text-white focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent transition-all"
        >
          <option value="">เลือก...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function AutoModal({ show, title, message }) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-[#2b2b2b] p-8 rounded-2xl w-[90%] max-w-sm shadow-2xl text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <i className="fa-solid fa-check text-green-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#2b2b2b] dark:text-white">{title}</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Financial() {
  const [modal, setModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [savedProfile, setSavedProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("financial-form");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const navigate = useNavigate();

  const defaultProfile = {
    age: "",
    status: "",
    country: "",
    optional: "",
    salary: "",
    expenses: "",
    saving: "",
    debt: "",
  };

  const handleSave = (values) => {
    setSavedProfile(values);
    setModal(true);
    setTimeout(() => {
      setModal(false);
      navigate("/");
    }, 1500);
  };

  const statusOptions = [
    { value: "student", label: "นักเรียน/นักศึกษา" },
    { value: "employee", label: "พนักงานประจำ" },
    { value: "freelance", label: "ฟรีแลนซ์" },
    { value: "unemployed", label: "ว่างงาน" },
  ];

  const countryOptions = [
    { value: "th", label: "ไทย" },
    { value: "uk", label: "สหราชอาณาจักร" },
    { value: "us", label: "สหรัฐอเมริกา" },
  ];

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
      {/* Header Section */}
      <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
            ข้อมูลศูนย์กลาง
          </h1>
          <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
            กรอกข้อมูลเพื่อใช้งานอัตโนมัติในทุกเครื่องคำนวณ
          </h3>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <Link
          to="/"
          className="px-6 py-2 btn-back flex items-center gap-2 mb-6 w-fit transition-all duration-300"
        >
          <i className="fa-solid fa-arrow-left-long"></i>
          Back to Home
        </Link>

        <AutoModal
          show={modal}
          title="บันทึกสำเร็จ!"
          message="ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว"
        />

        <Formik
          initialValues={savedProfile || defaultProfile}
          enableReinitialize
          onSubmit={(values) => {
            localStorage.setItem("financial-form", JSON.stringify(values));
            handleSave(values);
          }}
        >
          {({ setFieldValue, values, resetForm }) => (
            <Form className="space-y-8">
              {/* Personal Section */}
              <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-[#2b2b2b] dark:bg-[#202121] px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-user text-[#ffcc00]"></i>
                    ข้อมูลส่วนตัว
                  </h2>
                </div>
                <div className="p-6">
                  <InlineInput
                    label="อายุ"
                    name="age"
                    placeholder="25"
                    value={values.age}
                    onChange={(e) => setFieldValue("age", e.target.value.replace(/[^0-9]/g, ""))}
                    unit="ปี"
                  />

                  <InlineSelect
                    label="สถานะ"
                    name="status"
                    value={values.status}
                    onChange={(e) => setFieldValue("status", e.target.value)}
                    options={statusOptions}
                  />

                  <InlineSelect
                    label="ประเทศ"
                    name="country"
                    value={values.country}
                    onChange={(e) => setFieldValue("country", e.target.value)}
                    options={countryOptions}
                  />

                  <InlineInput
                    label="เป้าหมายทางการเงิน"
                    name="optional"
                    placeholder="ซื้อบ้าน, เกษียณ, ฯลฯ"
                    value={values.optional}
                    onChange={(e) => setFieldValue("optional", e.target.value)}
                    optional
                  />
                </div>
              </div>

              {/* Financial Section */}
              <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-[#2b2b2b] dark:bg-[#202121] px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-wallet text-[#ffcc00]"></i>
                    ข้อมูลทางการเงิน
                  </h2>
                </div>
                <div className="p-6">
                  <InlineInput
                    label="รายได้ต่อเดือน"
                    name="salary"
                    placeholder="30,000"
                    value={formatNumber(values.salary)}
                    onChange={(e) => setFieldValue("salary", e.target.value.replace(/[^0-9]/g, ""))}
                    unit="บาท"
                    optional
                  />

                  <InlineInput
                    label="ค่าใช้จ่ายต่อเดือน"
                    name="expenses"
                    placeholder="15,000"
                    value={formatNumber(values.expenses)}
                    onChange={(e) => setFieldValue("expenses", e.target.value.replace(/[^0-9]/g, ""))}
                    unit="บาท"
                    optional
                  />

                  <InlineInput
                    label="เงินออมปัจจุบัน"
                    name="saving"
                    placeholder="100,000"
                    value={formatNumber(values.saving)}
                    onChange={(e) => setFieldValue("saving", e.target.value.replace(/[^0-9]/g, ""))}
                    unit="บาท"
                    optional
                  />

                  <InlineInput
                    label="หนี้สินต่อเดือน"
                    name="debt"
                    placeholder="5,000"
                    value={formatNumber(values.debt)}
                    onChange={(e) => setFieldValue("debt", e.target.value.replace(/[^0-9]/g, ""))}
                    unit="บาท"
                    optional
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetting(true);
                    setTimeout(() => setIsResetting(false), 1000);
                    localStorage.removeItem("financial-form");
                    setSavedProfile(null);
                    resetForm({ values: defaultProfile });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-8 py-3 btn-danger transition-all duration-300 active:scale-95 ${isResetting ? "opacity-70" : ""}`}
                >
                  {isResetting ? (
                    <>
                      <i className="fa-solid fa-check mr-2"></i>
                      เรียบร้อย
                    </>
                  ) : (
                    "รีเซต"
                  )}
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 btn-primary transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  บันทึกข้อมูล
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}