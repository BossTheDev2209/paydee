import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import TextSelect from "../../components/TextSelect";
import { useState } from "react";
// import js from "@eslint/js";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function QuickMode({ calculate, switchMode }) {
  const [selected, setSelected] = useState({
    frequency: [],
  });
  const frequency = [
    { id: 1, label: "รายวัน" },
    { id: 2, label: "รายสัปดาห์" },
    { id: 3, label: "รายเดือน" },
  ];

  // const savedData = loadData();
  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        {/* <p className="text-xl">
              <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2]"></i>
              Personal
            </p> */}
        <p className="text-xl md:text-3xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          Quick Mode
        </p>
        <Formik
          initialValues={{
            target: "",
            amount: "",
            frequency: "",
          }}
          onSubmit={(values) => {
            // localStorage.setItem("financial-form", JSON.stringify(values));
            console.log("saved", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="เป้าหมายการออม (บาท)"
                  id="target"
                  name="target"
                  placeholder="30000"
                  value={values.target}
                  onChange={(e) =>
                    setFieldValue(
                      "target",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="จำนวนเงินออมต่อครั้ง (บาท)"
                  id="amount"
                  name="amount"
                  placeholder="20000"
                  value={values.amount}
                  onChange={(e) =>
                    setFieldValue(
                      "amount",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextSelect
                  title="ความถึ่ในการออม"
                  name="frequency"
                  options={frequency}
                  value={selected.frequency}
                  onChange={(item) => {
                    setSelected((prev) => ({ ...prev, frequency: [item] }));
                    setFieldValue("frequency", item.id);
                  }}
                  // touched={touched.country}
                  // error={errors.country}
                  optionValue="id"
                  optionLabel={(item) => item.label}
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
