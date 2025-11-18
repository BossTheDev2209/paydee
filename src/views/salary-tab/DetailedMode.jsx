import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useState } from "react";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function DetailedMode({ calculate, switchMode }) {
  const savedData = loadData();
  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        {/* <p className="text-xl">
              <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2]"></i>
              Personal
            </p> */}
        <p className="text-3xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300"> Detailed Mode </p>
        <Formik
          initialValues={{
            salary: savedData?.salary || "",
            extraIncome: "",
            bonus: "",
            housingCost: "",
            commutingCost: "",
            expenses: savedData?.expenses || "",
            debt: "",
            tax: "",
            deduction: "",
          }}
          onSubmit={(values) => {
            console.log("a", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
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
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="โบนัส (บาท)"
                  id="bonus"
                  name="bonus"
                  placeholder="5000"
                  value={values.bonus}
                  onChange={(e) =>
                    setFieldValue(
                      "bonus",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="รายได้เสริมต่อเดือน (บาท)"
                  id="extraIncome"
                  name="extraIncome"
                  placeholder="1270"
                  value={values.extraIncome}
                  onChange={(e) =>
                    setFieldValue(
                      "extraIncome",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
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
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="ค่าเดินทางต่อเดือน (บาท)"
                  id="commutingCost"
                  name="commutingCost"
                  placeholder="20000"
                  value={values.commutingCost}
                  onChange={(e) =>
                    setFieldValue(
                      "commutingCost",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="ค่าที่พักต่อเดือน (บาท)"
                  id="housingCost"
                  name="housingCost"
                  placeholder="20000"
                  value={values.housingCost}
                  onChange={(e) =>
                    setFieldValue(
                      "housingCost",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="หนี้สินขั้นต่ำต่อเดือน (บาท)"
                  id="debt"
                  name="debt"
                  placeholder="20000"
                  value={values.debt}
                  onChange={(e) =>
                    setFieldValue(
                      "debt",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
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
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="ค่าลดหย่อน (บาท)"
                  id="deduction"
                  name="deduction"
                  placeholder="10"
                  value={values.deduction}
                  onChange={(e) =>
                    setFieldValue("deduction", e.target.value.replace(/[^0-9]/g, ""))
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
                  className="w-full btn-base bg-[#f2f1f1]"
                  onClick={switchMode}
                >
                  สลับไปยัง Quick Mode
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
