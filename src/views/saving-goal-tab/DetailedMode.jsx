import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import TextSelect from "../../components/TextSelect";
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
  const [selected, setSelected] = useState({
    frequency: [],
  });

  const frequency = [
    { id: 1, label: "รายวัน"},
    { id: 2, label: "รายสัปดาห์"},
    { id: 3, label: "รายเดือน"},
  ];

  // // ดึง item ที่ตรงกับ values.frequency
  // const selectedFreq = frequency.find(f => f.id === Number(values.frequency));
  // // ระยะเวลาที่ถึงเป้าหมาย
  // const daysPerSave = selectedFreq ? selectedFreq.days : 0;

  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        {/* <p className="text-xl">
              <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2]"></i>
              Personal
            </p> */}
        <p className="text-lg md:text-3xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          Detailed Mode
        </p>
        <Formik
          initialValues={{
            target: "",
            saving: savedData?.saving || "",
            amount: "",
            frequency: "",
            salary: savedData?.salary || "",
            expenses: savedData?.expenses || "",
            debt: "",
            tax: "",
          }}
          onSubmit={(values) => {
            console.log("a", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <h3 className="font-bold mb-2">เป้าหมาย</h3>
                <TextField
                  title="จำนวนเป้าหมาย (บาท)"
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
                  title="เงินออมปัจจุบัน (บาท)"
                  id="saving"
                  name="saving"
                  placeholder="5000"
                  value={values.saving}
                  onChange={(e) =>
                    setFieldValue(
                      "saving",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="จำนวนออมต่อครั้ง (บาท)"
                  id="amount"
                  name="amount"
                  placeholder="1000"
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
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <h3 className="font-bold mb-2 my-8">รายได้และค่าใช้จ่าย</h3>
                <TextField
                  title="รายได้ต่อเดือน"
                  id="salary"
                  name="salary"
                  placeholder="20000"
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
                  title="ค่าใช้จ่ายต่อเดือน"
                  id="expenses"
                  name="expenses"
                  placeholder="15000"
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
                  title="หนี้สินต่อเดือน"
                  id="debt"
                  name="debt"
                  placeholder="20000"
                  value={values.debt}
                  onChange={(e) =>
                    setFieldValue("debt", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="ภาษีต่อปี (ร้อยละ)"
                  id="tax"
                  name="tax"
                  placeholder="20000"
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
