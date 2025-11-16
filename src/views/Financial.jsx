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
  ];
  const country = [
    { id: 1, label: "ไทย" },
    { id: 2, label: "สหราชอณาจักร" },
    { id: 3, label: "สหรัฐอเมริกา" },
  ];
  return (
    <section className="w-full">
      <h1 className="font-bold">Financial Profile</h1>
      <p>some detail</p>

      <div className="w-full flex flex-wrap">
        {/* personal detail */}
        <section className="w-full md:w-6/12 p-4">
          <div className="w-full p-4 bg-[#fdfdfd] rounded-lg mt-10">
            <p className="text-xl">
              <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2]"></i>
              Personal
            </p>
            <Formik
              initialValues={{
                age: "",
                status: "",
                country: "",
                optional: "",
              }}
              onSubmit={(values) => {
                console.log("a", values);
              }}
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form>
                  <div className="w-full pad-main">
                    <TextField
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
                    />
                  </div>

                  <div className="w-full pad-main">
                    <TextSelect
                      title="สถานะ"
                      name="status"
                      options={status}
                      value={selected.status}
                      onChange={(item) =>
                        setSelected((prev) => ({ ...prev, status: [item] }))
                      }
                      optionValue="id"
                      optionLabel={(item) => item.label}
                    />
                  </div>

                  <div className="w-full pad-main">
                    <TextSelect
                      title="ประเทศ"
                      name="status"
                      options={country}
                      value={selected.country}
                      onChange={(item) =>
                        setSelected((prev) => ({ ...prev, country: [item] }))
                      }
                      optionValue="id"
                      optionLabel={(item) => item.label}
                    />
                  </div>

                  <div className="w-full pad-main">
                    <TextField
                      title="เป้าหมายทางการเงิน"
                      id="optional"
                      name="optional"
                      placeholder="ซื้อบ้าน, เกษียณ, ฯลฯ"
                      value={values.optional}
                      onChange={(e) =>
                        setFieldValue("optional", e.target.value)
                      }
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>

        {/* financial detail */}
        <section className="w-full md:w-6/12 p-4">
          <div className="w-full p-4 bg-[#fdfdfd] rounded-lg mt-10">
            <p className="text-xl">
              <i className="fa-regular fa-user p-2 rounded-full bg-[#f2f2f2]"></i>
              Financial Detail
            </p>
            <Formik
              initialValues={{
                salary: "",
                expenses: "",
                saving: "",
                debt: "",
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
                  <div className="w-full pad-main">
                    <TextField
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
                    />
                  </div>
                  <div className="w-full pad-main">
                    <TextField
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
                    />
                  </div>
                  <div className="w-full pad-main">
                    <TextField
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
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </div>
          <div className="w-full flex gap-4 justify-center">
            <button type="reset" className="btn-base bg-[#f2f2f2] border shadow-sm">
              reset
            </button>
            <button type="submit" className="btn-base bg-[#ffcc22] border shadow-sm">
              save
            </button>
          </div>
    </section>
  );
}
