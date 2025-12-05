import React, { useState, useEffect, useRef } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "../../components/salary/CalculatorComponents";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function QuickMode({ calculate, loading }) {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const formRef = useRef(null);

  // Global Enter key to submit form
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        if (e.target.tagName === "TEXTAREA") return;
        if (formRef.current) {
          e.preventDefault();
          formRef.current.submitForm();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const validationSchema = Yup.object({
    target: Yup.string().required("กรุณากรอกข้อมูล"),
    amount: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  // Mock data for testing
  const fillMockData = (setFieldValue) => {
    setFieldValue("target", "100,000");
    setFieldValue("amount", "3,000");
    setFieldValue("frequency", "month");
  };

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Quick Mode">
        <Formik
          initialValues={{
            target: "",
            amount: "",
            frequency: "day",
          }}
          validationSchema={validationSchema}
          innerRef={formRef}
          onSubmit={(values) => {
            calculate(values, "quick");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              {/* Mock Data Button */}
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => fillMockData(setFieldValue)}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-all duration-200 flex items-center gap-2"
                >
                  <i className="fa-solid fa-flask"></i>
                  เติมข้อมูลตัวอย่าง
                </button>
              </div>

              <CalculatorSection title="การออม">
                {/* Frequency Radio */}
                <div className="space-y-2">
                  <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base block">
                    ความถี่ในการออม <span className="text-red-500">*</span>
                  </label>
                  <RadioGroup
                    value={values.frequency}
                    onValueChange={(value) => setFieldValue("frequency", value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="day" id="day" />
                      <Label htmlFor="day" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">รายวัน</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="week" id="week" />
                      <Label htmlFor="week" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">รายสัปดาห์</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="month" id="month" />
                      <Label htmlFor="month" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">รายเดือน</Label>
                    </div>
                  </RadioGroup>
                </div>

                <CalculatorInput
                  name="target"
                  label="เป้าหมายการออม"
                  placeholder="100000"
                  required={true}
                  value={values.target}
                  error={errors.target}
                  touched={touched.target}
                  setFieldValue={setFieldValue}
                  unit="บาท"
                />
                <CalculatorInput
                  name="amount"
                  label="จำนวนเงินออมต่อครั้ง"
                  placeholder="3000"
                  required={true}
                  value={values.amount}
                  error={errors.amount}
                  touched={touched.amount}
                  setFieldValue={setFieldValue}
                  unit="บาท"
                />
              </CalculatorSection>

              {/* Buttons - exact same as Salary After Tax */}
              <div className="mt-8 w-full justify-between flex gap-4">
                <button
                  type="button"
                  className="w-full md:w-1/3 py-3 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-300 transition-colors active:scale-95 duration-200"
                  onClick={() => navigate("/")}
                >
                  กลับ
                </button>
                <button
                  type="reset"
                  className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 ${isResetting
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  onClick={() => {
                    setIsResetting(true);
                    setTimeout(() => setIsResetting(false), 1000);
                    setFieldValue("target", "");
                    setFieldValue("amount", "");
                    setFieldValue("frequency", "day");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
                  disabled={loading}
                  className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 shadow-md flex justify-center items-center gap-2 ${loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#ffcc00] text-[#2b2b2b] hover:bg-[#e6b800] active:scale-95"
                    }`}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      กำลังคำนวณ...
                    </>
                  ) : (
                    "คำนวณ"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CalculatorCard>
    </div>
  );
}
