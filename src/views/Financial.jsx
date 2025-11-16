import React from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import TextField from "../components/TextField";
import TextSelect from "../components/TextSelect";
import { useState } from "react";

export default function Financial() {
  const [selected, setSelected] = useState({
    status: [],
    country: [],
  });
  const status = [
    { id: 1, label: "นักเรียน/นักศึกษา" },
    { id: 2, label: "พนักงานประจำ" },
    { id: 3, label: "ฟรีแลนซ์" },
    { id: 4, label: "ว่างงาน" },
  ];
  const country = [
    { id: 1, label: "ไทย" },
    { id: 2, label: "สหราชอณาจักร" },
    { id: 3, label: "สหรัฐอเมริกา" },
  ];

  const validationSchema = Yup.object({
    age: Yup.string().required("กรุณากรอกข้อมูล"),
    status: Yup.number().required("กรุณาเลือกสถานะ"),
    country: Yup.number().required("กรุณาเลือกประเทศ"),
    optional: Yup.string().required("กรุณากรอกข้อมูล"),
    salary: Yup.string().required("กรุณากรอกข้อมูล"),
    expenses: Yup.string().required("กรุณากรอกข้อมูล"),
    saving: Yup.string().required("กรุณากรอกข้อมูล"),
    debt: Yup.string().required("กรุณากรอกข้อมูล"),
  });

  return (
    <section className="w-full">
      <h1 className="font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">Financial Profile</h1>
      <p className="text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">some detail</p>
      <Formik
        initialValues={{
          age: "",
          status: "",
          country: "",
          optional: "",
          salary: "",
          expenses: "",
          saving: "",
          debt: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("a", values);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="w-full">
            <div className="w-full flex flex-wrap">
              {/* personal detail */}
              <section className="w-full md:w-6/12 p-4">
                <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
                  <p className="text-xl text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2] dark:bg-[#3d3d3d] transition-colors duration-300"></i>
                    Personal
                  </p>
                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextField
                      required
                      title="อายุ"
                      id="age"
                      name="age"
                      placeholder="25"
                      value={values.age}
                      onChange={(e) =>
                        setFieldValue(
                          "age",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      touched={touched.age}
                      error={errors.age}
                    />
                  </div>

                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextSelect
                      required
                      title="สถานะ"
                      name="status"
                      options={status}
                      value={selected.status}
                      onChange={(item) => {
                        setSelected((prev) => ({ ...prev, status: [item] }));
                        setFieldValue("status", item.id);
                      }}
                      onBlur={() => setFieldTouched("country", true)}
                      optionValue="id"
                      optionLabel={(item) => item.label}
                      touched={touched.status}
                      error={errors.status}
                    />
                  </div>

                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextSelect
                      required
                      title="ประเทศ"
                      name="country"
                      options={country}
                      value={selected.country}
                      onChange={(item) => {
                        setSelected((prev) => ({ ...prev, country: [item] }));
                        setFieldValue("country", item.id);
                      }}
                      touched={touched.country}
                      error={errors.country}
                      optionValue="id"
                      optionLabel={(item) => item.label}
                    />
                  </div>

                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextField
                      required
                      title="เป้าหมายทางการเงิน"
                      id="optional"
                      name="optional"
                      placeholder="ซื้อบ้าน, เกษียณ, ฯลฯ"
                      value={values.optional}
                      onChange={(e) =>
                        setFieldValue("optional", e.target.value)
                      }
                      touched={touched.optional}
                      error={errors.optional}
                    />
                  </div>
                </div>
              </section>

              {/* financial profile */}
              <section className="w-full md:w-6/12 p-4">
                <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
                  <p className="text-xl text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2] dark:bg-[#3d3d3d] transition-colors duration-300"></i>
                    Financial Detail
                  </p>

                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextField
                      required
                      title="รายได้ต่อเดือน (บาท)"
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
                      touched={touched.salary}
                      error={errors.salary}
                    />
                  </div>
                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextField
                      required
                      title="ค่าใช้จ่ายต่อเดือน (บาท)"
                      id="expenses"
                      name="expenses"
                      placeholder="8000"
                      value={values.expenses}
                      onChange={(e) =>
                        setFieldValue(
                          "expenses",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      touched={touched.expenses}
                      error={errors.expenses}
                    />
                  </div>
                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextField
                      required
                      title="เงินออมปัจจุบัน (บาท)"
                      id="saving"
                      name="saving"
                      placeholder="50000"
                      value={values.saving}
                      onChange={(e) =>
                        setFieldValue(
                          "saving",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      touched={touched.saving}
                      error={errors.saving}
                    />
                  </div>
                  <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <TextField
                      required
                      title="หนี้สินต่อเดือน (บาท)"
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
                      touched={touched.debt}
                      error={errors.debt}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* btn */}
            <div className="w-full flex gap-4 justify-center">
              <button
                type="reset"
                className="btn-base text-[#f2f1f1] dark:text-[#3d3d3d] bg-[#979797] dark:bg-[#f2f1f1] border shadow-sm"
              >
                reset
              </button>
              <button
                type="submit"
                className="btn-base bg-[#ffcc22] border shadow-sm"
              >
                save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
