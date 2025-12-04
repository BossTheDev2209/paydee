import { useState, useEffect } from "react";
import QuickMode from "./saving-goal-tab/QuickMode";
import DetailedMode from "./saving-goal-tab/DetailedMode";
import { Link, useSearchParams } from "react-router-dom";
import LineChartComponent from "../components/LineChart";
import Calendar from "react-calendar";
import "../styles/calendar.css";
import Policy from "./Policy";

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
  const [modal, setModal] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [estimatedSaving, setEstimatedSaving] = useState(null);
  const [value, setValue] = useState(new Date());
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

  function formatDate(date) {
    return date.toLocaleDateString("th", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatShortDate(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // เดือน +1 เพราะ getMonth() เริ่มจาก 0
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // เอา 2 หลักสุดท้ายของปี

    return `${month}/${day}/${year}`; // mm/dd/yy
  }

  const calculateSavingUntil = (targetDate, amountPerSave, frequency) => {
    if (!targetDate || !amountPerSave) return 0;

    const tody = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let daysPerSave = 1;
    switch (frequency) {
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

    const numberOfSave = Math.floor(diffDays / daysPerSave);
    return numberOfSave * amountPerSave;
  };

  // calculate
  const calculate = (values, mode) => {
    if (!values.amount || !values.target) {
      setLoading(false);
      return;
    }

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
      if (!isNaN(totalDays)) {
        targetDay.setDate(today.getDate() + totalDays);
        targetDay.setHours(0, 0, 0, 0);
      } else {
        targetDay.setTime(today.getTime());
      }

      const generateChartData = () => {
        const startDate = today;
        const endDate = targetDay;
        const startMoney = mode === "quick" ? 0 : saving;
        const midMoney = (startMoney + target) / 2;

        const midDate = new Date(
          startDate.getTime() + (totalDays / 2) * 86400000
        );

        return [
          { name: formatShortDate(startDate), date: startDate, amount: startMoney },
          { name: formatShortDate(midDate), date: midDate, amount: midMoney },
          { name: formatShortDate(endDate), date: endDate, amount: target },
        ];
      };

      setResult({
        duration,
        remaining,
        targetDay: targetDay,
        chartData: generateChartData(),
        amountPerSave: amount,
        frequency: values.frequency,
      });
      setActiveStartDate(targetDay);

      if (selectedDate) {
        const totalSaving = calculateSavingUntil(
          selectedDate,
          amount,
          values.frequency
        );
        setEstimatedSaving(totalSaving);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document
          .getElementById("result")
          ?.scrollIntoView({ behavior: "smooth" });
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
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  currentMode === "quick"
                    ? "bg-[#ffcc00] text-[#2b2b2b] font-bold shadow-md"
                    : "text-[#979797] hover:text-[#3d3d3d] dark:hover:text-[#f2f1f1]"
                }`}
              >
                Quick
              </button>
              <button
                onClick={() => handleModeChange("detailed")}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  currentMode === "detailed"
                    ? "bg-[#ffcc00] text-[#2b2b2b] font-bold shadow-md"
                    : "text-[#979797] hover:text-[#3d3d3d] dark:hover:text-[#f2f1f1]"
                }`}
              >
                Detailed
              </button>
            </div>
          </div>

          {currentMode === "quick" ? (
            <QuickMode key="quick" calculate={calculate} loading={loading} />
          ) : (
            <DetailedMode
              key="detailed"
              calculate={calculate}
              loading={loading}
            />
          )}

          <div
            id="result"
            className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10"
          >
            <h1 className="flex justify-center items-center gap-2 text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
              ผลลัพธ์
              <button onClick={() => setModal(true)}>
                <span className="text-center ">
                  <i className="fa-solid fa-circle-info"></i>
                </span>
              </button>
            </h1>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <h1 className="text-5xl">
                  <i className="fa-solid fa-spinner text-[#ffcc00] animate-spin"></i>
                </h1>
              </div>
            ) : result ? (
              <>
                <p className="pad-main flex flex-col items-center gap-y-4">
                  <h2 className="font-semibold text-xl md:text-2xl text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    คุณจะถึงเป้าหมายในวันที่
                  </h2>
                  <h2 className="p-2 px-4 rounded-lg font-semibold bg-[#ffcc00] text-[#3d3d3d] text-base md:text-xl transition-colors duration-300">
                    {formatDate(result.targetDay)}
                  </h2>
                </p>
                <div className="">
                  <div className="w-full flex flex-col items-center my-10">
                    <Calendar
                      onChange={(date) => {
                        setValue(date);
                        setSelectedDate(date);

                        if (result) {
                          const totalSaving = calculateSavingUntil(
                            date,
                            result.amountPerSave,
                            result.frequency
                          );
                          setEstimatedSaving(totalSaving);

                          const newChartData = result.chartData.map(
                            (item, index, arr) => {
                              const progress = index / (arr.length - 1);
                              return {
                                ...item,
                                extraAmount: Math.round(progress * totalSaving),
                              };
                            }
                          );
                          setResult({ ...result, chartData: newChartData });
                        }
                      }}
                      value={value}
                      activeStartDate={activeStartDate}
                      onActiveStartDateChange={({ activeStartDate }) => {
                        setActiveStartDate(activeStartDate);
                      }}
                      tileClassName={({ date, view }) => {
                        if (result) {
                          const targetDate = result.targetDay;

                          const isSameDay =
                            date.getFullYear() === targetDate.getFullYear() &&
                            date.getMonth() === targetDate.getMonth() &&
                            date.getDate() === targetDate.getDate();

                          if (isSameDay) return "target-day";
                        }
                        return null;
                      }}
                    />

                    {/* show data */}
                    {selectedDate && estimatedSaving !== null && (
                      <p className="mt-4 text-center text-lg md:text-xl font-semibold text-[#3d3d3d] dark:text-[#f2f1f1]">
                        คุณจะออมได้
                        <span className="text-[#ffcc00] px-2">
                          {estimatedSaving.toLocaleString()}
                        </span>
                        บาท
                      </p>
                    )}
                  </div>

                  {/* line chart */}
                  <div className="mt-10 md:p-10">
                    <h2 className="text-center text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300 font-semibold px-10 py-4">
                      กราฟแสดงความเติบโตของเงินออม
                    </h2>
                    <LineChartComponent
                      data={result.chartData}
                      selectedDate={selectedDate}
                      estimatedSaving={estimatedSaving}
                      formatDate={formatShortDate}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>
      {/* modal */}
      {modal && (
        <div className="transition-all duration-300 fixed inset-0  bg-white dark:bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="flex flex-col gap-4 ">
            <button
              className="bg-[#ffcc00] p-4 rounded-lg"
              onClick={() => setModal(false)}
            >
              ปิด
            </button>
            <Policy />
          </div>
        </div>
      )}
    </section>
  );
}
