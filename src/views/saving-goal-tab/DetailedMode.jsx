import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useState } from "react";
import RadioGroup from "../../components/RadioGroup";
import { useNavigate } from "react-router-dom";

function loadData() {
  try {
    const saved = localStorage.getItem("financial-form");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function DetailedMode({ calculate, switchMode }) {
  const navigate = useNavigate();
  const savedData = loadData();

  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4 ">
          Detailed Mode
        </h1>
        <Formik
          initialValues={{
            target: "",
            saving: savedData?.saving || "",
            amount: "",
            frequency: "day",
            salary: savedData?.salary || "",
            increase: "",
            bonus: "",
            extraIncome: "",
          }}
          onSubmit={(values) => {
            console.log("a", values);
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
                    <p className="w-full">ความถี่ในการออม</p>
                    <div className="w-full flex justify-end">
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
                    <p className="w-full">โบนัส</p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="bonus"
                        name="bonus"
                        placeholder="30000"
                        value={values.bonus}
                        onChange={(e) =>
                          setFieldValue(
                            "bonus",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">รายได้เสริม</p>
                    <div className="w-full md:w-4/12">
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
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">รายได้ต่อเดือน</p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="salary"
                        name="salary"
                        placeholder="5000"
                        value={values.salary}
                        onChange={(e) =>
                          setFieldValue(
                            "salary",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>
              </section>

              {/* การออม */}
              <section className="w-full p-2 bg-[#f2f2f2] dark:bg-[#3d3d3d] rounded-lg my-4">
                <div className="w-full">
                  <h2 className="w-full text-3xl font-bold my-6 text-[#3d3d3d] dark:text-[#f2f2f1]">
                    การออม
                  </h2>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">เป้าหมายการออม</p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="target"
                        name="target"
                        placeholder="10000"
                        value={values.target}
                        onChange={(e) =>
                          setFieldValue(
                            "target",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">เงินเก็บปัจจุบัน</p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="saving"
                        name="saving"
                        placeholder="10000"
                        value={values.saving}
                        onChange={(e) =>
                          setFieldValue(
                            "saving",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">จำนวนเงินออมต่อครั้ง</p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="amount"
                        name="amount"
                        placeholder="2000"
                        value={values.amount}
                        onChange={(e) =>
                          setFieldValue(
                            "amount",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">อัตราดอกเบี้ย</p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="increase"
                        name="increase"
                        placeholder="2000"
                        value={values.increase}
                        onChange={(e) =>
                          setFieldValue(
                            "increase",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
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
                  className="w-4/12 btn-base bg-[#f2f1f1]"
                  onClick={() => navigate("/")}
                >
                  กลับ
                </button>
                <button
                  type="button"
                  className="w-4/12 btn-base bg-[#ffcc00]"
                  onClick={() => calculate(values, "detailed")}
                >
                  คำนวณ
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
