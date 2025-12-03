import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "../../components/salary/CalculatorComponents";
import { Input } from "../../components/ui/input";
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

export default function QuickMode({ calculate }) {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    salary: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();

  const quickModeFields = [
    { name: "salary", label: "รายได้ต่อเดือน", placeholder: "30000", required: true },
    { name: "expenses", label: "ค่าใช้จ่ายต่อเดือน", placeholder: "30000" },
  ];

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Quick Mode">
        <Formik
          initialValues={{
            salary: savedData?.salary || "",
            expenses: savedData?.expenses || "",
            tax: savedData?.tax || "",
            familyStatus: "single",
            children: "",
            hasSSF: false,
            ssfAmount: "",
            hasRMF: false,
            rmfAmount: "",
            hasLifeInsurance: false,
            lifeInsuranceAmount: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            calculate(values, "quick");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <CalculatorSection>
                {quickModeFields.map((field) => (
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
                        <span className="text-[#2b2b2b] dark:text-gray-200 text-sm">บาท</span>
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
                        <span className="text-[#2b2b2b] dark:text-gray-200 text-sm">บาท</span>
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
                        <span className="text-[#2b2b2b] dark:text-gray-200 text-sm">บาท</span>
                      </div>
                    )}
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
