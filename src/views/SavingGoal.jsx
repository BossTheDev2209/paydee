import { useState, useEffect } from "react";
import QuickMode from "./saving-goal-tab/QuickMode";
import DetailedMode from "./saving-goal-tab/DetailedMode";
import { Link, useSearchParams } from "react-router-dom";
import LineChartComponent from "../components/LineChart";
function formatDuration(days) {
  if (days < 7) return `${days} วัน`;

  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // น้อยกว่า 30 วัน → แสดงเป็นสัปดาห์
  if (days < 30) return `${weeks} สัปดาห์`;

  // น้อยกว่า 365 วัน → แสดงเป็นเดือน
  if (days < 365) return `${months} เดือน`;

  // มากกว่า 1 ปี → แสดงปี + เดือน
  const remainingAfterYears = days - years * 365;
  const extraMonths = Math.floor(remainingAfterYears / 30);

  if (extraMonths > 0) {
    return `${years} ปี ${extraMonths} เดือน`;
  } else {
    return `${years} ปี`;
  }
}

export default function SavingGoal() {
  const [params, setParams] = useSearchParams();
  const modeParam = params.get("mode");
  const currentMode = modeParam === "detailed" ? "detailed" : "quick";
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const today = new Date();

  const handleModeChange = (newMode) => {
    setParams({ mode: newMode });
    setResult(null); // Clear result when switching modes
  };

  const calculate = (values, mode) => {
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

      let daysPerSave = 0;
      switch (values.frequency) {
        case "day":
          daysPerSave = 1;
          break;
        case "week":
          daysPerSave = 7;
          break;
        case "month":
          daysPerSave = 30;
          break;
        default:
          daysPerSave = 1;
      }

      // quick mode
      const totalQuick = target / amount;
      console.log(totalQuick);

      // detailed mode
      const totalDetailed = (target - saving) / amount;
      const year = (salary - (expenses + debt)) * 12;
      const mount = (year - (tax / 100) * year) / 12;
      const remaining = mount - (expenses + debt + amount);
      console.log(remaining);
      console.log(totalDetailed);

      const totalDays =
        mode === "quick"
          ? totalQuick * daysPerSave
          : totalDetailed * daysPerSave;
      const duration = formatDuration(totalDays);
      console.log(totalDays);

      const targetDay = new Date();
      targetDay.setDate(today.getDate() + totalDays);

      function formatDate(date) {
        return date.toLocaleDateString("th", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      console.log(formatDate(targetDay));

      const generateChartData = () => {
        const startDate = today;
        const endDate = targetDay;
        const startMoney = mode === "quick" ? 0 : saving;
        const midMoney = (startMoney + target) / 2;

        const midDate = new Date(
          startDate.getTime() + (totalDays / 2) * 86400000
        );

        return [
          { name: formatDate(startDate), amount: startMoney },
          { name: formatDate(midDate), amount: midMoney },
          { name: formatDate(endDate), amount: target },
        ];
      };

      setResult({
        duration,
        remaining,
        targetDay: formatDate(targetDay),
        chartData: generateChartData(),
      });
      setLoading(false);
    });
  };
  
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [result]);

  return (
    <section className="w-full">
      <Link to="/" className="w-full">
        <p className="w-full text-start text-base md:text-xl mb-8 text-[#979797] transition-colors duration-300">
          <i class="fa-solid fa-arrow-left-long pr-6"></i>
          Back to Home
        </p>
      </Link>
      <h1 className="text-lg md:text-2xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        Saving Goal
      </h1>
      <h3 className="text-sm md:text-lg text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        คำนวณเป้าหมายการออม
      </h3>

      <div className="w-full flex justify-center">
        {/* personal detail */}
        <section className="w-full md:w-10/12">
          <div className="flex justify-center my-6">
            <div className="bg-[#e0e0e0] dark:bg-[#4a4a4a] p-1 rounded-full flex">
              <button
                onClick={() => handleModeChange("quick")}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${currentMode === "quick"
                    ? "bg-[#ffcc00] text-[#2b2b2b] font-bold shadow-md"
                    : "text-[#979797] hover:text-[#3d3d3d] dark:hover:text-[#f2f1f1]"
                  }`}
              >
                Quick
              </button>
              <button
                onClick={() => handleModeChange("detailed")}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${currentMode === "detailed"
                    ? "bg-[#ffcc00] text-[#2b2b2b] font-bold shadow-md"
                    : "text-[#979797] hover:text-[#3d3d3d] dark:hover:text-[#f2f1f1]"
                  }`}
              >
                Detailed
              </button>
            </div>
          </div>

          {currentMode === "quick" ? (
            <QuickMode
              key="quick"
              calculate={calculate}
              loading={loading}
            // switchMode={() => setMode("detailed")}
            />
          ) : (
            <DetailedMode
              key="detailed"
              calculate={calculate}
              loading={loading}
            // switchMode={() => setMode("quick")}
            />
          )}

          <div id="result" className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
            <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
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
                    <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      ระยะเวลา
                    </h2>
                    <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.duration}
                    </h2>
                  </p>
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      วันที่จะถึงเป้าหมาย
                    </h2>
                    <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.targetDay}
                    </h2>
                  </p>

                  {/* line chart */}
                  <div className="mt-10">
                    <LineChartComponent data={result.chartData} />
                  </div>
                </div>
                {mode === "detailed" ? (
                  <>
                    <h1 className="text-xl md:text-3xl font-bold text-[#f2f1f1] w-full bg-[#52b2bf] rounded-lg p-1 text-center mb-4 mt-10">
                      AI Insight
                    </h1>
                    <p className="text-lg md:text-2xl font-semibold flex flex-wrap justify-between pad-main text-[#d0312d]">
                      สิ่งที่ควรปรับปรุง
                    </p>
                    <p className="flex flex-wrap justify-between pad-main">
                      <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        ค่าใช้จ่ายอาหร
                      </h2>
                      <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        สูงกว่าเฉลี่ย 34 %
                      </h2>
                    </p>
                    <p className="flex flex-wrap justify-between pad-main">
                      <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        สถานะรายจ่าย
                      </h2>
                      <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        ไม่สม่ำเสมอ
                      </h2>
                    </p>
                    <p className="flex flex-wrap justify-between pad-main">
                      <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        งบเริ่มต้น
                      </h2>
                      <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        น้อยเกินไป
                      </h2>
                    </p>


                    <hr className="my-4"/>
                    <p className="text-lg md:text-2xl font-semibold flex flex-wrap justify-between pad-main text-[#52b2bf]">
                      สิ่งที่แนะนำ
                    </p>
                    <p className="flex flex-wrap justify-between pad-main">
                      <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        ค่าใช้จ่ายอาหร
                      </h2>
                      <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        ควรลด 20 บาท/วัน
                      </h2>
                    </p>
                    <p className="flex flex-wrap justify-between pad-main">
                      <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        สถานะรายจ่าย
                      </h2>
                      <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        เปลี่ยนวิธีการออมเป็นแบบทยอย
                      </h2>
                    </p>
                    <p className="flex flex-wrap justify-between pad-main">
                      <h2 className="text-base md:text-xl w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        งบเริ่มต้น
                      </h2>
                      <h2 className="text-base md:text-xl w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                        ควรลดหมวดโทรศัพท์ 200 บาท/เดือน
                      </h2>
                    </p>
                  </>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
