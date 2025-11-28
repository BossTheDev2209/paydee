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
    { id: 1, label: "รายวัน" },
    { id: 2, label: "รายสัปดาห์" },
    { id: 3, label: "รายเดือน" },
  ];

  // // ดึง item ที่ตรงกับ values.frequency
  // const selectedFreq = frequency.find(f => f.id === Number(values.frequency));
  // // ระยะเวลาที่ถึงเป้าหมาย
  // const daysPerSave = selectedFreq ? selectedFreq.days : 0;

  return (
    <div className="w-full">
      <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
          Detailed Mode
        </h1>
        <Formik
          initialValues={{
            target: "",
            saving: savedData?.saving || "",
            amount: "",
            frequency: "",
            salary: savedData?.salary || "",
            food: savedData?.food || "",
            commutingCost: savedData?.commutingCost || "",
            housingCost: savedData?.housingCost || "",
            internetCost: savedData?.internetCost || "",
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
                  title="ความถี่ในการออม"
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
                <h3 className="font-bold mb-2 my-8">รายได้</h3>
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
                  title="โบนัส"
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
                  title="รายได้เสริมต่อเดือน"
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
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <h3 className="font-bold mb-2 my-8">รายจ่าย</h3>
                <TextField
                  title="ค่าอาหารต่อเดือน"
                  id="food"
                  name="food"
                  placeholder="1000"
                  value={values.food}
                  onChange={(e) =>
                    setFieldValue("food", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              <div className="w-full pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                <TextField
                  title="ค่าเดินทางต่อเดือน"
                  id="commutingCost"
                  name="commutingCost"
                  placeholder="1500"
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
                  title="ค่าที่พักอาศัยต่อเดือน"
                  id="housingCost"
                  name="housingCost"
                  placeholder="6000"
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
                  title="ค่าโทรศัพท์หรืออินเทอร์เน็ตต่อเดือน"
                  id="internetCost"
                  name="internetCost"
                  placeholder="2000"
                  value={values.internetCost}
                  onChange={(e) =>
                    setFieldValue(
                      "internetCost",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
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
