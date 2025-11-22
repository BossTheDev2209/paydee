import { useState } from "react";
import QuickMode from "./saving-goal-tab/QuickMode";
import DetailedMode from "./saving-goal-tab/DetailedMode";

function formatDuration(days) {
  if (days < 7) return `${days} วัน`;

  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // ถ้าน้อยกว่า 30 วัน → แสดงเป็นสัปดาห์
  if (days < 30) return `${weeks} สัปดาห์`;

  // ถ้าน้อยกว่า 365 วัน → แสดงเป็นเดือน
  if (days < 365) return `${months} เดือน`;

  // ถ้ามากกว่า 1 ปี → แสดงปี + เดือน
  const remainingAfterYears = days - years * 365;
  const extraMonths = Math.floor(remainingAfterYears / 30);

  if (extraMonths > 0) {
    return `${years} ปี ${extraMonths} เดือน`;
  } else {
    return `${years} ปี`;
  }
}

export default function SavingGoal() {
  const [mode, setMode] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = (values) => {
    setLoading(true);
    setTimeout(() => {
      const target = Number(values.target);
      const saving = Number(values.saving);
      const amount = Number(values.amount);
      const frequency = Number(values.frequency);
      const salary = Number(values.salary);
      const expenses = Number(values.expenses);
      const debt = Number(values.debt);
      const tax = Number(values.tax);
      // const durationText = formatDuration(totalDays);

      const freq = [
        { id: 1, days: 1 },
        { id: 2, days: 7 },
        { id: 3, days: 30 },
      ];
      const selectedFreq = freq.find((f) => f.id === Number(values.frequency));
      const daysPerSave = selectedFreq ? selectedFreq.days : 0;

      // quick mode
      const totalQuick = target / amount;
      const durationQuick = formatDuration(totalQuick);
      console.log(totalQuick);

      // detailed mode
      const remaining = target - saving;
      const timeDetailed = remaining / amount;
      const totalDetailed = timeDetailed * daysPerSave;
      const durationDetailed = formatDuration(totalDetailed);
      console.log(totalDetailed);

      setResult({ totalQuick, totalDetailed, durationDetailed, durationQuick });
      setLoading(false);
    });
  };
  return (
    <section className="w-full">
      <h1 className="text-lg md:text-2xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        Saving Goal
      </h1>
      <h3 className="text-sm md:text-lg text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        คำนวณเป้าหมายการออม
      </h3>

      <div className="w-full flex justify-center">
        {/* personal detail */}
        <section className="w-full md:w-10/12">
          {mode === "quick" ? (
            <QuickMode
              calculate={calculate}
              switchMode={() => setMode("detailed")}
            />
          ) : (
            <DetailedMode
              calculate={calculate}
              switchMode={() => setMode("quick")}
            />
          )}

          <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
            <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
              ผลลัพธ์
            </h1>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <h1 className="text-5xl">
                  <i className="fa-solid fa-spinner text-[#ffcc00] animate-spin"></i>
                </h1>
              </div>
            ) : result ? (
              <>
                <div className="">
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="w-full md:w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      ระยะเวลา
                    </h2>
                    <h2 className="w-full md:w-6/12 md:text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.totalQuick.toLocaleString()} วัน
                    </h2>
                  </p>
                  {/* <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="w-full md:w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      
                      รายได้สุทธิต่อปี
                    </h2>
                    <h2 className="w-full md:w-6/12 md:text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.totalQuick.toLocaleString()} บาท
                    </h2>
                  </p> */}
                </div>
              </>
            ) : (
              <h1> </h1>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
