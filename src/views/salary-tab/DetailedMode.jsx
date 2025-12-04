import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "../../components/salary/CalculatorComponents";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function DetailedMode({ calculate, loading }) {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  
  // Unit states for all fields
  const [units, setUnits] = useState({
    monthlySalary: "month",
    monthlyBonusExtra: "month",
    lifeInsurance: "year",
    ssf: "year",
    rmf: "year",
    provident: "year",
    parentsHealthInsurance: "year",
    donation: "year"
  });

  const validationSchema = Yup.object({
    monthlySalary: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();

  const unitOptions = [
    { value: "month", label: "บาท/เดือน" },
    { value: "year", label: "บาท/ปี" }
  ];

  const handleUnitChange = (field, value) => {
    setUnits(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Detailed Mode">
        <Formik
          initialValues={{
            monthlySalary: savedData?.salary || "",
            monthlyBonusExtra: "",
            familyStatus: "single",
            childrenCount: "",
            parentsCount: "",
            lifeInsurance: "",
            ssf: "",
            rmf: "",
            provident: "",
            parentsHealthInsurance: "",
            donation: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // Normalize all values to annual
            const normalizedValues = {
              ...values,
              monthlySalary: units.monthlySalary === "month" ? Number(values.monthlySalary) * 12 : Number(values.monthlySalary),
              monthlyBonusExtra: units.monthlyBonusExtra === "month" ? Number(values.monthlyBonusExtra) * 12 : Number(values.monthlyBonusExtra),
              lifeInsurance: units.lifeInsurance === "month" ? Number(values.lifeInsurance) * 12 : Number(values.lifeInsurance),
              ssf: units.ssf === "month" ? Number(values.ssf) * 12 : Number(values.ssf),
              rmf: units.rmf === "month" ? Number(values.rmf) * 12 : Number(values.rmf),
              provident: units.provident === "month" ? Number(values.provident) * 12 : Number(values.provident),
              parentsHealthInsurance: units.parentsHealthInsurance === "month" ? Number(values.parentsHealthInsurance) * 12 : Number(values.parentsHealthInsurance),
              donation: units.donation === "month" ? Number(values.donation) * 12 : Number(values.donation)
            };
            calculate(normalizedValues, "detailed");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              {/* Income Section */}
              <CalculatorSection title="รายได้">
                <CalculatorInput
                  name="monthlySalary"
                  label="เงินเดือนต่อเดือน"
                  placeholder={units.monthlySalary === "month" ? "30000" : "360000"}
                  required={true}
                  value={values.monthlySalary}
                  error={errors.monthlySalary}
                  touched={touched.monthlySalary}
                  setFieldValue={setFieldValue}
                  savedValue={savedData?.salary}
                  unitOptions={unitOptions}
                  currentUnit={units.monthlySalary}
                  onUnitChange={(val) => handleUnitChange("monthlySalary", val)}
                />
                <CalculatorInput
                  name="monthlyBonusExtra"
                  label="โบนัส/รายได้เสริมต่อเดือน"
                  placeholder={units.monthlyBonusExtra === "month" ? "5000" : "60000"}
                  value={values.monthlyBonusExtra}
                  error={errors.monthlyBonusExtra}
                  touched={touched.monthlyBonusExtra}
                  setFieldValue={setFieldValue}
                  unitOptions={unitOptions}
                  currentUnit={units.monthlyBonusExtra}
                  onUnitChange={(val) => handleUnitChange("monthlyBonusExtra", val)}
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
                    placeholder={units.lifeInsurance === "month" ? "0" : "0"}
                    value={values.lifeInsurance}
                    error={errors.lifeInsurance}
                    touched={touched.lifeInsurance}
                    setFieldValue={setFieldValue}
                    unitOptions={unitOptions}
                    currentUnit={units.lifeInsurance}
                    onUnitChange={(val) => handleUnitChange("lifeInsurance", val)}
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
                    placeholder={units.ssf === "month" ? "0" : "0"}
                    value={values.ssf}
                    error={errors.ssf}
                    touched={touched.ssf}
                    setFieldValue={setFieldValue}
                    unitOptions={unitOptions}
                    currentUnit={units.ssf}
                    onUnitChange={(val) => handleUnitChange("ssf", val)}
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
                    placeholder={units.rmf === "month" ? "0" : "0"}
                    value={values.rmf}
                    error={errors.rmf}
                    touched={touched.rmf}
                    setFieldValue={setFieldValue}
                    unitOptions={unitOptions}
                    currentUnit={units.rmf}
                    onUnitChange={(val) => handleUnitChange("rmf", val)}
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
                    placeholder={units.provident === "month" ? "0" : "0"}
                    value={values.provident}
                    error={errors.provident}
                    touched={touched.provident}
                    setFieldValue={setFieldValue}
                    unitOptions={unitOptions}
                    currentUnit={units.provident}
                    onUnitChange={(val) => handleUnitChange("provident", val)}
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
                    placeholder={units.parentsHealthInsurance === "month" ? "0" : "0"}
                    value={values.parentsHealthInsurance}
                    error={errors.parentsHealthInsurance}
                    touched={touched.parentsHealthInsurance}
                    setFieldValue={setFieldValue}
                    unitOptions={unitOptions}
                    currentUnit={units.parentsHealthInsurance}
                    onUnitChange={(val) => handleUnitChange("parentsHealthInsurance", val)}
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
                    placeholder={units.donation === "month" ? "0" : "0"}
                    value={values.donation}
                    error={errors.donation}
                    touched={touched.donation}
                    setFieldValue={setFieldValue}
                    unitOptions={unitOptions}
                    currentUnit={units.donation}
                    onUnitChange={(val) => handleUnitChange("donation", val)}
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
                  className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 ${
                    isResetting 
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
                  className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 shadow-md flex justify-center items-center gap-2 ${
                    loading 
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
