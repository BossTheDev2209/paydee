import React from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
            console.log("a", values);
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              {/* รายได้ */}
              <section className="w-full p-2 bg-[#f2f2f2] dark:bg-[#3d3d3d] rounded-lg my-4">
                <div className="w-full">
                  <h2 className="w-full text-3xl font-bold my-6 text-[#3d3d3d] dark:text-[#f2f2f1]">
                    รายได้
                  </h2>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      รายได้ต่อเดือน
                      <span className="text-red-500 font-bold px-1">*</span>
                    </p>
                    <div className="w-full md:w-4/12">
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
                        touched={touched.salary}
                        error={errors.salary}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">โบนัส</p>
                    <div className="w-full md:w-4/12">
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
              </section>

              {/* รายจ่าย */}
              <section className="w-full p-2 bg-[#f2f2f2] dark:bg-[#3d3d3d] rounded-lg my-4">
                <div className="w-full">
                  <h2 className="w-full text-3xl font-bold my-6 text-[#3d3d3d] dark:text-[#f2f2f1]">
                    รายจ่าย
                  </h2>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      ค่าที่พักต่อเดือน
                      <span className="text-red-500 text-xl font-bold px-1">
                        *
                      </span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="housingCost"
                        name="housingCost"
                        placeholder="30000"
                        value={values.housingCost}
                        onChange={(e) =>
                          setFieldValue(
                            "housingCost",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.housingCost}
                        touched={touched.housingCost}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      ค่าเดินทางต่อเดือน
                      <span className="text-red-500 text-xl font-bold px-1">
                        *
                      </span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="commutingCost"
                        name="commutingCost"
                        placeholder="2000"
                        value={values.commutingCost}
                        onChange={(e) =>
                          setFieldValue(
                            "commutingCost",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.commutingCost}
                        touched={touched.commutingCost}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      หนี้สินต่อเดือน
                      <span className="text-red-500 text-xl font-bold px-1">
                        *
                      </span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="debt"
                        name="debt"
                        placeholder="5000"
                        value={values.debt}
                        onChange={(e) =>
                          setFieldValue(
                            "debt",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.debt}
                        touched={touched.debt}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      ค่าอาหาร
                      <span className="text-red-500 text-xl font-bold px-1">
                        *
                      </span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="food"
                        name="food"
                        placeholder="1000"
                        value={values.food}
                        onChange={(e) =>
                          setFieldValue(
                            "food",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.food}
                        touched={touched.food}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      ค่าสาธารณูปโภคต่อเดือน
                      <span className="text-red-500 text-xl font-bold px-1">
                        *
                      </span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="utilityCost"
                        name="utilityCost"
                        placeholder="1000"
                        value={values.utilityCost}
                        onChange={(e) =>
                          setFieldValue(
                            "utilityCost",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.utilityCost}
                        touched={touched.utilityCost}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">
                      ค่าประกัน/บริการที่จำเป็นต่อเดือน
                      <span className="text-red-500 text-xl font-bold px-1">
                        *
                      </span>
                    </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="service"
                        name="service"
                        placeholder="1000"
                        value={values.service}
                        onChange={(e) =>
                          setFieldValue(
                            "service",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.service}
                        touched={touched.service}
                      />
                    </div>
                    <p className="w-fit px-2 text-end hidden md:block">บาท</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-wrap md:flex-nowrap items-center pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <p className="w-full">ค่าใช้จ่ายเบ็ดเตล็ดอื่น ๆ </p>
                    <div className="w-full md:w-4/12">
                      <TextField
                        id="other"
                        name="other"
                        placeholder="1000"
                        value={values.other}
                        onChange={(e) =>
                          setFieldValue(
                            "other",
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
                  type="submit"
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
