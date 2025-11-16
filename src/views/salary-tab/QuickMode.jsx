import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useState } from "react";

export default function QuickMode({ calculate, switchMode }) {
  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] rounded-lg mt-10">
        {/* <p className="text-xl">
              <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2]"></i>
              Personal
            </p> */}
        <p className="text-3xl font-bold"> Quick Mode </p>
        <Formik
          initialValues={{
            salary: "",
            expenses: "",
            tax: "",
          }}
          onSubmit={(values) => {
            console.log("a", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="w-full pad-main">
                <TextField
                  title="รายได้ต่อเดือน (บาท)"
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
                />
              </div>
              <div className="w-full pad-main">
                <TextField
                  title="ค่าใช้จ่ายต่อเดือน (บาท)"
                  id="expenses"
                  name="expenses"
                  placeholder="20000"
                  value={values.expenses}
                  onChange={(e) =>
                    setFieldValue(
                      "expenses",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main">
                <TextField
                  title="ภาษี (ร้อยละ)"
                  id="tax"
                  name="tax"
                  placeholder="10"
                  value={values.tax}
                  onChange={(e) =>
                    setFieldValue("tax", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              <div className="w-full pad-main flex flex-wrap gap-2">
                <button
                  type="button"
                  className="w-full btn-base bg-[#ffcc00]"
                  onClick={() => calculate(values)}
                >
                  คำนวณ
                </button>
                <button
                  type="button"
                  className="w-full btn-base bg-[#f2f2f2]"
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
