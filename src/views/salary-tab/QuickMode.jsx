import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useState } from "react";
import js from "@eslint/js";
import * as Yup from "yup";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function QuickMode({ calculate, switchMode }) {
  const validationSchema = Yup.object({
    salary: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();
  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
          Quick Mode
        </h1>
        <Formik
          initialValues={{
            salary: savedData?.salary || "",
            expenses: savedData?.expenses || "",
            tax: savedData?.tax || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // localStorage.setItem("financial-form", JSON.stringify(values));
            console.log("saved", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <span className="flex w-full gap-2">
                  <p className="">รายได้ต่อเดือน</p>
                  <p className="text-red-500">(required)</p>
                </span>
                <TextField
                  id="salary"
                  name="salary"
                  placeholder="30000"
                  value={values.salary}
                  onChange={(e) =>
                    setFieldValue(
                      "salary",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  error={errors.salary}
                  touched={touched.salary}
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">ค่าใช้จ่ายต่อเดือน</p>
                <TextField
                  id="expenses"
                  name="expenses"
                  placeholder="30000"
                  value={values.expenses}
                  onChange={(e) =>
                    setFieldValue(
                      "expenses",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full pad-main flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="w-full btn-base bg-[#ffcc00]"
                  onClick={() => calculate(values, "quick")}
                >
                  คำนวณ
                </button>
                <button
                  type="button"
                  className="w-full btn-base bg-[#f2f1f1]"
                  onClick={switchMode}
                >
                  สลับไปยัง Detailed Mode
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
