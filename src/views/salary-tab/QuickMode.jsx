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

              <div className="mt-8 w-full justify-between flex gap-4">
                <button
                  type="button"
                  className="w-full md:w-1/2 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                  onClick={() => navigate("/")}
                >
                  กลับ
                </button>
                <button
                  type="submit"
                  className="w-full md:w-1/2 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors shadow-md"
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
