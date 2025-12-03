import React from "react";
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

export default function DetailedMode({ calculate }) {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    monthlySalary: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();

  const incomeFields = [
    { name: "monthlySalary", label: "เงินเดือนต่อเดือน", placeholder: "30000", required: true },
    { name: "monthlyBonusExtra", label: "โบนัส/รายได้เสริมต่อเดือน", placeholder: "5000" },
  ];

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
            calculate(values, "detailed");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              {/* Income Section */}
              <CalculatorSection title="รายได้">
                {incomeFields.map((field) => (
                  <CalculatorInput
                    key={field.name}
                    {...field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    touched={touched[field.name]}
                    setFieldValue={setFieldValue}
                    savedValue={savedData?.[field.name]}
                  />
                ))}
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      ประกันชีวิต
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                        (≤ 100,000)
                      </span>
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="lifeInsurance"
                        name="lifeInsurance"
                        placeholder="0"
                        value={values.lifeInsurance}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("lifeInsurance", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[60px] text-right hidden md:block">
                      บาท/ปี
                    </span>
                  </div>

                  {/* SSF */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      SSF
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                        (≤ 200,000 และ ≤ 30% รายได้)
                      </span>
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="ssf"
                        name="ssf"
                        placeholder="0"
                        value={values.ssf}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("ssf", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[60px] text-right hidden md:block">
                      บาท/ปี
                    </span>
                  </div>

                  {/* RMF */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      RMF
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                        (≤ 500,000 และ ≤ 30% รายได้)
                      </span>
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="rmf"
                        name="rmf"
                        placeholder="0"
                        value={values.rmf}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("rmf", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[60px] text-right hidden md:block">
                      บาท/ปี
                    </span>
                  </div>

                  {/* Provident Fund */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      Provident fund / กบข.
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                        (≤ 15% รายได้)
                      </span>
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="provident"
                        name="provident"
                        placeholder="0"
                        value={values.provident}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("provident", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[60px] text-right hidden md:block">
                      บาท/ปี
                    </span>
                  </div>

                  {/* Parent Health Insurance */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      ประกันสุขภาพพ่อแม่
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                        (≤ 100,000)
                      </span>
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="parentsHealthInsurance"
                        name="parentsHealthInsurance"
                        placeholder="0"
                        value={values.parentsHealthInsurance}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("parentsHealthInsurance", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[60px] text-right hidden md:block">
                      บาท/ปี
                    </span>
                  </div>

                  {/* Donation */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                      เงินบริจาค
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                        (≤ 10% ของรายได้สุทธิ)
                      </span>
                    </label>
                    <div className="flex-1 w-full md:w-auto">
                      <Input
                        id="donation"
                        name="donation"
                        placeholder="0"
                        value={values.donation}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("donation", val);
                        }}
                        className="w-full"
                      />
                    </div>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[60px] text-right hidden md:block">
                      บาท/ปี
                    </span>
                  </div>
                </div>
              </CalculatorSection>

              <div className="mt-8 w-full justify-between flex gap-4">
                <button
                  type="button"
                  className="w-full md:w-1/3 py-3 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                  onClick={() => navigate("/")}
                >
                  กลับ
                </button>
                <button
                  type="reset"
                  className="w-full md:w-1/3 py-3 rounded-lg bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors"
                  onClick={() => {
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
                  รีเซต
                </button>
                <button
                  type="submit"
                  className="w-full md:w-1/3 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors shadow-md"
                >
                  คำนวณ
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CalculatorCard>
    </div>
  );
}
