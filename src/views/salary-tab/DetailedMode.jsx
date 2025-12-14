import React, { useState, useEffect, useRef } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "../../components/salary/CalculatorComponents";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { calculateTaxDetailed } from "../../utils/taxDetailed";

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

// Convert Quick Mode data to Detailed Mode format
function convertQuickToDetailed(quickData) {
  if (!quickData) return {};
  
  const result = {};
  
  // Use salary directly (no conversion)
  if (quickData.salary) {
    result.monthlySalary = quickData.salary;
  }
  
  // Map expenses to miscCost (monthly)
  if (quickData.expenses) {
    result.miscCost = quickData.expenses;
  }
  
  // Map family status
  if (quickData.familyStatus) {
    result.familyStatus = quickData.familyStatus;
  }
  
  // Map children
  if (quickData.children) {
    result.childrenCount = quickData.children;
  }
  
  // Map SSF (if checked)
  if (quickData.hasSSF && quickData.ssfAmount) {
    result.ssf = quickData.ssfAmount;
  }
  
  // Map RMF (if checked)
  if (quickData.hasRMF && quickData.rmfAmount) {
    result.rmf = quickData.rmfAmount;
  }
  
  // Map Life Insurance (if checked)
  if (quickData.hasLifeInsurance && quickData.lifeInsuranceAmount) {
    result.lifeInsurance = quickData.lifeInsuranceAmount;
  }
  
  return result;
}

export default function DetailedMode({ calculate, loading }) {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const formRef = useRef(null);

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

  // Only require salary and housing (most crucial)
  const validationSchema = Yup.object({
    monthlySalary: Yup.string().required("กรุณากรอกข้อมูล"),
    housingCost: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();
  const quickModeData = loadQuickModeData();
  const convertedData = convertQuickToDetailed(quickModeData);

  // Mock data for testing
  const fillMockData = (setFieldValue) => {
    setFieldValue("monthlySalary", "30,000");
    setFieldValue("monthlyBonusExtra", "60,000");
    setFieldValue("housingCost", "7,000");
    setFieldValue("transportCost", "2,000");
    setFieldValue("debtPayment", "3,000");
    setFieldValue("foodCost", "5,000");
    setFieldValue("utilitiesCost", "1,500");
    setFieldValue("insuranceServiceCost", "800");
    setFieldValue("miscCost", "2,000");
  };

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Detailed Mode">
        <Formik
          initialValues={{
            monthlySalary: convertedData.monthlySalary || savedData?.salary || "",
            monthlyBonusExtra: "",
            familyStatus: convertedData.familyStatus || savedData?.familyStatus || "single",
            childrenCount: convertedData.childrenCount || "",
            parentsCount: "",
            lifeInsurance: convertedData.lifeInsurance || "",
            ssf: convertedData.ssf || "",
            rmf: convertedData.rmf || "",
            provident: "",
            parentsHealthInsurance: "",
            donation: "",
            // Expense fields (monthly)
            housingCost: "",
            transportCost: "",
            debtPayment: "",
            foodCost: "",
            utilitiesCost: "",
            insuranceServiceCost: "",
            miscCost: convertedData.miscCost || "",
          }}
          validationSchema={validationSchema}
          innerRef={formRef}
          onSubmit={(values) => {
            // All values are already annual in Detailed Mode, no normalization needed
            calculate(values, "detailed");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              {/* Mock Data Button for Testing */}
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => fillMockData(setFieldValue)}
                  className="px-4 py-2 text-sm rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-flask"></i>
                  เติมข้อมูลตัวอย่าง
                </button>
              </div>

              {/* Income Section */}
              <CalculatorSection title="รายได้">
                <CalculatorInput
                  name="monthlySalary"
                  label="เงินเดือนต่อเดือน"
                  placeholder="360000"
                  required={true}
                  value={values.monthlySalary}
                  error={errors.monthlySalary}
                  touched={touched.monthlySalary}
                  setFieldValue={setFieldValue}
                  savedValue={savedData?.salary}
                  unit="บาท/ปี"
                />
                <CalculatorInput
                  name="monthlyBonusExtra"
                  label="โบนัสรายปี"
                  placeholder="60000"
                  value={values.monthlyBonusExtra}
                  error={errors.monthlyBonusExtra}
                  touched={touched.monthlyBonusExtra}
                  setFieldValue={setFieldValue}
                  unit="บาท/ปี"
                />
              </CalculatorSection>

              {/* Expense Section */}
              <CalculatorSection title="รายจ่าย">
                <CalculatorInput
                  name="housingCost"
                  label="ค่าที่พักต่อเดือน"
                  placeholder="10000"
                  required={true}
                  value={values.housingCost}
                  error={errors.housingCost}
                  touched={touched.housingCost}
                  setFieldValue={setFieldValue}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="transportCost"
                  label="ค่าเดินทางต่อเดือน"
                  placeholder="3000"
                  value={values.transportCost}
                  error={errors.transportCost}
                  touched={touched.transportCost}
                  setFieldValue={setFieldValue}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="debtPayment"
                  label="หนี้สินขั้นต่ำต่อเดือน"
                  placeholder="5000"
                  value={values.debtPayment}
                  error={errors.debtPayment}
                  touched={touched.debtPayment}
                  setFieldValue={setFieldValue}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="foodCost"
                  label="ค่าอาหารต่อเดือน"
                  placeholder="8000"
                  value={values.foodCost}
                  error={errors.foodCost}
                  touched={touched.foodCost}
                  setFieldValue={setFieldValue}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="utilitiesCost"
                  label="ค่าสาธารณูปโภคต่อเดือน"
                  placeholder="2000"
                  value={values.utilitiesCost}
                  error={errors.utilitiesCost}
                  touched={touched.utilitiesCost}
                  setFieldValue={setFieldValue}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="insuranceServiceCost"
                  label="ค่าเบี้ยประกัน/บริการที่จำเป็นต่อเดือน"
                  placeholder="1000"
                  value={values.insuranceServiceCost}
                  error={errors.insuranceServiceCost}
                  touched={touched.insuranceServiceCost}
                  setFieldValue={setFieldValue}
                  unit="บาท/เดือน"
                />
                <CalculatorInput
                  name="miscCost"
                  label="ค่าใช้จ่ายเบ็ดเตล็ดและอื่น ๆ"
                  placeholder="0"
                  value={values.miscCost}
                  error={errors.miscCost}
                  touched={touched.miscCost}
                  setFieldValue={setFieldValue}
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
                      <RadioGroupItem value="single" id="detailed-single" />
                      <Label htmlFor="detailed-single" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">โสด</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="married-no-income" id="detailed-married-no-income" />
                      <Label htmlFor="detailed-married-no-income" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">สมรส (คู่สมรสไม่มีรายได้)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="married-with-income" id="detailed-married-with-income" />
                      <Label htmlFor="detailed-married-with-income" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">สมรส (คู่สมรสมีรายได้)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Dependents Section */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base">
                    ผู้พึ่งพิง
                  </p>

                  {/* Children */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      จำนวนบุตร
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="childrenCount"
                        name="childrenCount"
                        placeholder="0"
                        value={values.childrenCount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("childrenCount", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[30px] text-right hidden md:block">
                      คน
                    </span>
                  </div>

                  {/* Parents */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      จำนวนพ่อ/แม่ที่อุปการะ
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="parentsCount"
                        name="parentsCount"
                        placeholder="0"
                        value={values.parentsCount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("parentsCount", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[30px] text-right hidden md:block">
                      คน
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-0 md:ml-[41.666%]">
                    (พ่อแม่ของคุณ + พ่อแม่คู่สมรสรวมกัน)
                  </p>
                </div>

                {/* Investment Deductions */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base">
                    เงินลงทุน/ประกันที่ใช้ลดหย่อน
                  </p>

                  {/* Life Insurance */}
                  <CalculatorInput
                    name="lifeInsurance"
                    label={
                      <>
                        ประกันชีวิต
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                          (≤ 100,000)
                        </span>
                      </>
                    }
                    placeholder="0"
                    value={values.lifeInsurance}
                    error={errors.lifeInsurance}
                    touched={touched.lifeInsurance}
                    setFieldValue={setFieldValue}
                    unit="บาท/ปี"
                  />

                  {/* SSF */}
                  <CalculatorInput
                    name="ssf"
                    label={
                      <>
                        SSF
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                          (≤ 200,000 และ ≤ 30% รายได้)
                        </span>
                      </>
                    }
                    placeholder="0"
                    value={values.ssf}
                    error={errors.ssf}
                    touched={touched.ssf}
                    setFieldValue={setFieldValue}
                    unit="บาท/ปี"
                  />

                  {/* RMF */}
                  <CalculatorInput
                    name="rmf"
                    label={
                      <>
                        RMF
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                          (≤ 500,000 และ ≤ 30% รายได้)
                        </span>
                      </>
                    }
                    placeholder="0"
                    value={values.rmf}
                    error={errors.rmf}
                    touched={touched.rmf}
                    setFieldValue={setFieldValue}
                    unit="บาท/ปี"
                  />

                  {/* Provident Fund */}
                  <CalculatorInput
                    name="provident"
                    label={
                      <>
                        Provident fund / กบข.
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                          (≤ 15% รายได้)
                        </span>
                      </>
                    }
                    placeholder="0"
                    value={values.provident}
                    error={errors.provident}
                    touched={touched.provident}
                    setFieldValue={setFieldValue}
                    unit="บาท/ปี"
                  />

                  {/* Parent Health Insurance */}
                  <CalculatorInput
                    name="parentsHealthInsurance"
                    label={
                      <>
                        ประกันสุขภาพพ่อแม่
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                          (≤ 100,000)
                        </span>
                      </>
                    }
                    placeholder="0"
                    value={values.parentsHealthInsurance}
                    error={errors.parentsHealthInsurance}
                    touched={touched.parentsHealthInsurance}
                    setFieldValue={setFieldValue}
                    unit="บาท/ปี"
                  />

                  {/* Donation */}
                  <CalculatorInput
                    name="donation"
                    label={
                      <>
                        เงินบริจาค
                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                          (≤ 10% ของรายได้สุทธิ)
                        </span>
                      </>
                    }
                    placeholder="0"
                    value={values.donation}
                    error={errors.donation}
                    touched={touched.donation}
                    setFieldValue={setFieldValue}
                    unit="บาท/ปี"
                  />
                </div>
              </CalculatorSection>

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

                    // Reset form values
                    setFieldValue("monthlySalary", "");
                    setFieldValue("monthlyBonusExtra", "");
                    setFieldValue("familyStatus", "single");
                    setFieldValue("childrenCount", "");
                    setFieldValue("parentsCount", "");
                    setFieldValue("lifeInsurance", "");
                    setFieldValue("ssf", "");
                    setFieldValue("rmf", "");
                    setFieldValue("provident", "");
                    setFieldValue("parentsHealthInsurance", "");
                    setFieldValue("donation", "");
                    // Reset expense fields
                    setFieldValue("housingCost", "");
                    setFieldValue("transportCost", "");
                    setFieldValue("debtPayment", "");
                    setFieldValue("foodCost", "");
                    setFieldValue("utilitiesCost", "");
                    setFieldValue("insuranceServiceCost", "");
                    setFieldValue("miscCost", "");

                    // Scroll to top
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
