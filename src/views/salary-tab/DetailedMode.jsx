import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useState } from "react";
import * as Yup from "yup";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function DetailedMode({ calculate, switchMode }) {
  const validationSchema = Yup.object({
    salary: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  const savedData = loadData();
  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
          Detailed Mode
        </h1>
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
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("a", values);
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
                <p className="w-full">โบนัส</p>
                <TextField
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
                <p className="w-fit px-2 text-end">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">รายได้เสริม</p>
                <TextField
                  id="extraIncome"
                  name="extraIncome"
                  placeholder="5000"
                  value={values.extraIncome}
                  onChange={(e) =>
                    setFieldValue(
                      "extraIncome",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">ค่าใช้จ่ายต่อเดือน</p>
                <TextField
                  id="expenses"
                  name="expenses"
                  placeholder="1000"
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
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">ค่าเดินทางต่อเดือน</p>
                <TextField
                  id="commutingCost"
                  name="commutingCost"
                  placeholder="1000"
                  value={values.commutingCost}
                  onChange={(e) =>
                    setFieldValue(
                      "commutingCost",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">ค่าเดินทางต่อเดือน</p>
                <TextField
                  id="housingCost"
                  name="housingCost"
                  placeholder="1000"
                  value={values.housingCost}
                  onChange={(e) =>
                    setFieldValue(
                      "housingCost",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">หนี้สินต่อเดือน</p>
                <TextField
                  id="debt"
                  name="debt"
                  placeholder="1000"
                  value={values.debt}
                  onChange={(e) =>
                    setFieldValue("debt", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">หนี้สินต่อเดือน</p>
                <TextField
                  id="debt"
                  name="debt"
                  placeholder="1000"
                  value={values.debt}
                  onChange={(e) =>
                    setFieldValue("debt", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">ค่าลดหย่อน</p>
                <TextField
                  id="deduction"
                  name="deduction"
                  placeholder="1000"
                  value={values.deduction}
                  onChange={(e) =>
                    setFieldValue(
                      "deduction",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
                <p className="w-fit px-2 text-end hidden md:block">บาท</p>
              </div>
              <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <p className="w-full">ค่าใช้จ่ายเบ็ดเตล็ด</p>
                <TextField
                  id="miscel"
                  name="miscel"
                  placeholder="1000"
                  value={values.miscel}
                  onChange={(e) =>
                    setFieldValue(
                      "miscel",
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
                  onClick={() => calculate(values, "detailed")}
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
