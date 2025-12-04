import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import RadioGroup from "../../components/RadioGroup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function QuickMode({ calculate, switchMode, loading }) {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const validationSchema = Yup.object({
    target: Yup.string().required("กรุณากรอกข้อมูล"),
    amount: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
          Quick Mode
        </h1>
        <Formik
          initialValues={{
            target: "",
            amount: "",
            frequency: "day",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("saved", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <section className="w-full p-2 bg-[#f2f2f2] dark:bg-[#3d3d3d] rounded-lg my-4">
                <div className="w-full">
                  <h2 className="w-full text-3xl font-bold my-6 text-[#3d3d3d] dark:text-[#f2f2f1]">
                    รายได้
                  </h2>
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-9/12">ความถี่ในการออม</p>
                    <div className="w-full md:w-4/12">
                      <RadioGroup
                        direction="row"
                        name="frequency"
                        value={values.frequency}
                        onChange={(value) => setFieldValue("frequency", value)}
                        options={[
                          { label: "รายวัน", value: "day" },
                          { label: "รายสัปดาห์", value: "week" },
                          { label: "รายเดือน", value: "month" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      เป้าหมายการออม
                      <span className="text-red-500 font-bold px-1">*</span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
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
                        error={errors.target}
                        touched={touched.target}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      จำนวนเงินออมต่อครั้ง
                      <span className="text-red-500 font-bold px-1">*</span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="amount"
                        name="amount"
                        placeholder="5000"
                        value={values.amount}
                        onChange={(e) =>
                          setFieldValue(
                            "amount",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.amount}
                        touched={touched.amount}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>
              </section>

              {/* btn */}
              <div className="mt-8 w-full justify-between pad-main flex gap-2">
                <button
                  type="button"
                  className="w-4/12 btn-base bg-[#f2f1f1] active:scale-95 duration-200"
                  onClick={() => navigate("/")}
                >
                  กลับ
                </button>
                <button
                  type="reset"
                  className={`w-4/12 btn-base transition-all duration-200 active:scale-95 ${
                    isResetting 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                  onClick={() => {
                    setIsResetting(true);
                    setTimeout(() => setIsResetting(false), 1000);
                    
                    setFieldValue("target", "");
                    setFieldValue("amount", "");
                    setFieldValue("frequency", "day");
                  }}
                >
                  {isResetting ? (
                    <>
                      <i className="fa-solid fa-check mr-2"></i>
                      เรียบร้อย
                    </>
                  ) : (
                    "รีเซต"
                  )}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-4/12 btn-base transition-all duration-200 flex justify-center items-center gap-2 ${
                    loading 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-[#ffcc00] active:scale-95"
                  }`}
                  onClick={() => calculate(values, "quick")}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      กำลังคำนวณ...
                    </>
                  ) : (
                    "คำนวณ"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
