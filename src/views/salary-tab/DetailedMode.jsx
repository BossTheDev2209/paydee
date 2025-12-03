import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "../../components/salary/CalculatorComponents";

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
    salary: Yup.string().required("กรุณากรอกข้อมูล"),
    housingCost: Yup.string().required("กรุณากรอกข้อมูล"),
    commutingCost: Yup.string().required("กรุณากรอกข้อมูล"),
    debt: Yup.string().required("กรุณากรอกข้อมูล"),
    food: Yup.string().required("กรุณากรอกข้อมูล"),
    utilityCost: Yup.string().required("กรุณากรอกข้อมูล"),
    service: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();

  const incomeFields = [
    { name: "salary", label: "รายได้ต่อเดือน", placeholder: "30000", required: true },
    { name: "bonus", label: "โบนัส", placeholder: "5000" },
    { name: "extraIncome", label: "รายได้เสริมต่อเดือน", placeholder: "5000" },
  ];

  const expenseFields = [
    { name: "housingCost", label: "ค่าที่พักต่อเดือน", placeholder: "30000", required: true },
    { name: "commutingCost", label: "ค่าเดินทางต่อเดือน", placeholder: "2000", required: true },
    { name: "debt", label: "หนี้สินขั้นต่ำต่อเดือน", placeholder: "5000", required: true },
    { name: "food", label: "ค่าอาหารต่อเดือน", placeholder: "1000", required: true },
    { name: "utilityCost", label: "ค่าสาธารณูปโภคต่อเดือน", placeholder: "1000", required: true },
    { name: "service", label: "ค่าเบี้ยประกัน/บริการที่จำเป็นต่อเดือน", placeholder: "1000", required: true },
    { name: "other", label: "ค่าใช้จ่ายเบ็ดเตล็ดอื่น ๆ", placeholder: "1000" },
  ];

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Detailed Mode">
        <Formik
          initialValues={{
            salary: savedData?.salary || "",
            extraIncome: "",
            bonus: "",
            housingCost: "",
            commutingCost: "",
            food: "",
            expenses: savedData?.expenses || "",
            debt: "",
            deduction: "",
            utilityCost: "",
            service: "",
            other: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            calculate(values, "detailed");
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
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

              <CalculatorSection title="รายจ่าย">
                {expenseFields.map((field) => (
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
                    setFieldValue("bonus", "");
                    setFieldValue("extraIncome", "");
                    setFieldValue("housingCost", "");
                    setFieldValue("commutingCost", "");
                    setFieldValue("debt", "");
                    setFieldValue("food", "");
                    setFieldValue("utilityCost", "");
                    setFieldValue("service", "");
                    setFieldValue("other", "");
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
