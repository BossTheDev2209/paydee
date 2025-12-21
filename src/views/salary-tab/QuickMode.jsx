import React, { useState, useEffect, useRef } from "react";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "../../components/salary/CalculatorComponents";
import { Input } from "../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { useCalculationHistory } from "../../context/CalculationHistoryContext";

// Component to auto-save Quick Mode data to sessionStorage (clears on refresh/close)
function AutoSaveQuickMode() {
  const { values } = useFormikContext();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("quick-mode-data", JSON.stringify(values));
    }, 300); // Debounce to avoid too many writes
    return () => clearTimeout(timer);
  }, [values]);
  
  return null;
}

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

function loadQuickModeData() {
  try {
    const saved = sessionStorage.getItem("quick-mode-data");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function QuickMode({ calculate, loading }) {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const formRef = useRef(null);
  const { addCalculation } = useCalculationHistory();

  // Global Enter key to submit form
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // Don't submit if in a textarea
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
    salary: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();
  const quickModeData = loadQuickModeData();

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Quick Mode">
        <Formik
          initialValues={{
            salary: quickModeData?.salary || savedData?.salary || "",
            expenses: quickModeData?.expenses || savedData?.expenses || "",
            tax: "",
            familyStatus: quickModeData?.familyStatus || savedData?.familyStatus || "single",
            children: quickModeData?.children || "",
            hasSSF: quickModeData?.hasSSF || false,
            ssfAmount: quickModeData?.ssfAmount || "",
            hasRMF: quickModeData?.hasRMF || false,
            rmfAmount: quickModeData?.rmfAmount || "",
            hasLifeInsurance: quickModeData?.hasLifeInsurance || false,
            lifeInsuranceAmount: quickModeData?.lifeInsuranceAmount || "",
          }}
          validationSchema={validationSchema}
          innerRef={formRef}
          onSubmit={(values) => {
            // Pass monthly values directly to tax engine
            const normalizedValues = {
              ...values,
              salary: Number(String(values.salary).replace(/,/g, '')),
              expenses: Number(String(values.expenses).replace(/,/g, ''))
            };
            calculate(normalizedValues, "quick");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <AutoSaveQuickMode />
              <CalculatorSection>
                <CalculatorInput
                  name="salary"
                  label="รายได้ต่อเดือน"
                  placeholder="30000"
                  required={true}
                  value={values.salary}
                  error={errors.salary}
                  touched={touched.salary}
                  setFieldValue={setFieldValue}
                  savedValue={savedData?.salary}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="expenses"
                  label="ค่าใช้จ่ายต่อเดือน"
                  placeholder="30000"
                  value={values.expenses}
                  error={errors.expenses}
                  touched={touched.expenses}
                  setFieldValue={setFieldValue}
                  savedValue={savedData?.expenses}
                  unit="บาท/เดือน"
                />
              </CalculatorSection>

              {/* Tax Deduction Section */}
              <CalculatorSection title="ภาษี/ลดหย่อน">
                {/* Family Status */}
                <div className="space-y-2">
                  <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base block">
                    สถานภาพครอบครัว <span className="text-red-500">*</span>
                  </label>
                  <RadioGroup
                    value={values.familyStatus}
                    onValueChange={(value) => setFieldValue("familyStatus", value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">โสด</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="married-no-income" id="married-no-income" />
                      <Label htmlFor="married-no-income" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">สมรส (คู่สมรสไม่มีรายได้)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="married-with-income" id="married-with-income" />
                      <Label htmlFor="married-with-income" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">สมรส (คู่สมรสมีรายได้)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Children - Only show when married */}
                {(values.familyStatus === "married-no-income" || values.familyStatus === "married-with-income") && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      มีบุตร (จำนวน)
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="children"
                        name="children"
                        placeholder="0"
                        value={values.children}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("children", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[30px] text-right hidden md:block">
                      คน
                    </span>
                  </div>
                )}

                {/* Investment Deductions */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base">
                    การลงทุนเพื่อลดหย่อนภาษี
                  </p>

                  {/* SSF */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.hasSSF}
                        onChange={(e) => setFieldValue("hasSSF", e.target.checked)}
                        className="w-4 h-4 text-[#ffcc00] focus:ring-[#ffcc00] rounded"
                      />
                      <span className="text-[#2b2b2b] dark:text-gray-200">ฉันลงทุนใน SSF</span>
                    </label>
                    {values.hasSSF && (
                      <div className="ml-7 flex items-center gap-2">
                        <Input
                          placeholder="จำนวนเงิน (ไม่บังคับ)"
                          value={values.ssfAmount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue("ssfAmount", val);
                          }}
                          className="flex-1"
                        />
                        <span className="text-[#2b2b2b] dark:text-gray-200 text-sm">บาท/ปี</span>
                      </div>
                    )}
                  </div>

                  {/* RMF */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.hasRMF}
                        onChange={(e) => setFieldValue("hasRMF", e.target.checked)}
                        className="w-4 h-4 text-[#ffcc00] focus:ring-[#ffcc00] rounded"
                      />
                      <span className="text-[#2b2b2b] dark:text-gray-200">ฉันลงทุนใน RMF</span>
                    </label>
                    {values.hasRMF && (
                      <div className="ml-7 flex items-center gap-2">
                        <Input
                          placeholder="จำนวนเงิน (ไม่บังคับ)"
                          value={values.rmfAmount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue("rmfAmount", val);
                          }}
                          className="flex-1"
                        />
                        <span className="text-[#2b2b2b] dark:text-gray-200 text-sm">บาท/ปี</span>
                      </div>
                    )}
                  </div>

                  {/* Life Insurance */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.hasLifeInsurance}
                        onChange={(e) => setFieldValue("hasLifeInsurance", e.target.checked)}
                        className="w-4 h-4 text-[#ffcc00] focus:ring-[#ffcc00] rounded"
                      />
                      <span className="text-[#2b2b2b] dark:text-gray-200">ฉันมีประกันชีวิต</span>
                    </label>
                    {values.hasLifeInsurance && (
                      <div className="ml-7 flex items-center gap-2">
                        <Input
                          placeholder="จำนวนเงิน (ไม่บังคับ)"
                          value={values.lifeInsuranceAmount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue("lifeInsuranceAmount", val);
                          }}
                          className="flex-1"
                        />
                        <span className="text-[#2b2b2b] dark:text-gray-200 text-sm">บาท/ปี</span>
                      </div>
                    )}
                  </div>
                </div>
              </CalculatorSection>

              <div className="mt-8 w-full justify-between flex gap-4">
                <button
                  type="button"
                  className="w-full md:w-1/3 py-3 btn-back transition-all duration-300 active:scale-95"
                  onClick={() => navigate("/")}
                >
                  กลับหน้าหลัก
                </button>
                <button
                  type="reset"
                  className={`w-full md:w-1/3 py-3 btn-danger transition-all duration-300 active:scale-95 ${isResetting ? "opacity-70" : ""}`}
                  onClick={() => {
                    setIsResetting(true);
                    setTimeout(() => setIsResetting(false), 1000);
                    // Reset form values logic remains same...
                    setFieldValue("salary", "");
                    setFieldValue("expenses", "");
                    setFieldValue("tax", "");
                    setFieldValue("familyStatus", "single");
                    setFieldValue("children", "");
                    setFieldValue("hasSSF", false);
                    setFieldValue("ssfAmount", "");
                    setFieldValue("hasRMF", false);
                    setFieldValue("rmfAmount", "");
                    setFieldValue("hasLifeInsurance", false);
                    setFieldValue("lifeInsuranceAmount", "");
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
                  className={`w-full md:w-1/3 py-3 btn-primary transition-all duration-300 flex justify-center items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
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
