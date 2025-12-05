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

  if (days < 30) return `${weeks} สัปดาห์`;
  if (days < 365) return `${months} เดือน`;

  const remainingAfterYears = days - years * 365;
  const extraMonths = Math.floor(remainingAfterYears / 30);

  if (extraMonths > 0) {
    return `${years} ปี ${extraMonths} เดือน`;
  } else {
    return `${years} ปี`;
  }
}

const AdjustmentSection = ({ result, selectedDate }) => {
  if (!result || !selectedDate || !result.totalTarget) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(selectedDate);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return null;

  let daysPerSave = 1;
  switch (result.frequency) {
    case "day": daysPerSave = 1; break;
    case "week": daysPerSave = 7; break;
    case "month": daysPerSave = 30; break;
    default: daysPerSave = 1;
  }

  const numberOfSaves = Math.floor(diffDays / daysPerSave);
  // Avoid division by zero
  const newAmount = numberOfSaves > 0 ? Math.ceil(result.totalTarget / numberOfSaves) : result.totalTarget;

  const formatThaDate = (date) => {
    return date.toLocaleDateString("th-TH", { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-6 mt-6 w-full mx-auto border border-gray-100 dark:border-gray-800">
      <h3 className="text-xl font-bold mb-6 text-[#1e293b] dark:text-white">สิ่งที่ต้องปรับสำหรับเป้าหมายใหม่</h3>

      <div className="space-y-6">
        {/* Amount Adjustment */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#ffcc00]"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">จำนวนเงินออมต่อครั้ง</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffcc00] font-bold text-lg">{result.amountPerSave.toLocaleString()}</span>
            <span className="text-[#1e293b] dark:text-gray-400 text-sm">บาท</span>
            <i className="fa-solid fa-arrow-right text-gray-400 text-sm mx-1"></i>
            <span className="text-[#ffcc00] font-bold text-lg">{newAmount.toLocaleString()}</span>
            <span className="text-[#1e293b] dark:text-gray-400 text-sm">บาท</span>
          </div>
        </div>

        {/* Date Adjustment */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#ffcc00]"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">เป้าหมายเงินออม</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffcc00] font-bold text-lg">{formatThaDate(result.targetDay)}</span>
            <i className="fa-solid fa-arrow-right text-gray-400 text-sm mx-1"></i>
            <span className="text-[#ffcc00] font-bold text-lg">{formatThaDate(targetDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    setResult(null);
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
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  }

  const calculateSavingUntil = (targetDate, amountPerSave, frequency) => {
    if (!targetDate || !amountPerSave) return 0;

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let daysPerSave = 1;
    switch (frequency) {
      case "day": daysPerSave = 1; break;
      case "week": daysPerSave = 7; break;
      case "month": daysPerSave = 30; break;
      default: daysPerSave = 1;
    }

    const numberOfSave = Math.floor(diffDays / daysPerSave);
    return numberOfSave * amountPerSave;
  };

  const calculate = (values, mode) => {
    if (!values.amount || !values.target) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const target = Number(String(values.target).replace(/,/g, ''));
      const saving = Number(String(values.saving || 0).replace(/,/g, ''));
      const amount = Number(String(values.amount).replace(/,/g, ''));

      let daysPerSave = 0;
      switch (values.frequency) {
        case "day": daysPerSave = 1; break;
        case "week": daysPerSave = 7; break;
        case "month": daysPerSave = 30; break;
        default: daysPerSave = 1;
      }

      const totalQuick = target / amount;
      const totalDetailed = (target - saving) / amount;

      const totalDays = mode === "quick" ? totalQuick * daysPerSave : totalDetailed * daysPerSave;
      const duration = formatDuration(totalDays);

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
        const midDate = new Date(startDate.getTime() + (totalDays / 2) * 86400000);

        return [
          { name: formatShortDate(startDate), date: startDate, amount: startMoney },
          { name: formatShortDate(midDate), date: midDate, amount: midMoney },
          { name: formatShortDate(endDate), date: endDate, amount: target },
        ];
      };

      setResult({
        duration,
        targetDay: targetDay,
        chartData: generateChartData(),
        amountPerSave: amount,
        frequency: values.frequency,
        totalTarget: target,
      });
      setActiveStartDate(targetDay);

      if (selectedDate) {
        const totalSaving = calculateSavingUntil(selectedDate, amount, values.frequency);
        setEstimatedSaving(totalSaving);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [result]);

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
      {/* Header Section - Same as Salary After Tax */}
      <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
            เป้าหมายการออม
          </h1>
          <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
            คำนวณระยะเวลาในการออมเงินตามเป้าหมาย
          </h3>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6">
          <i className="fa-solid fa-arrow-left-long mr-2"></i>
          Back to Home
        </Link>

        {/* Mode Toggle - Same as Salary After Tax */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-[#2b2b2b] p-1.5 rounded-full shadow-sm inline-flex">
            <button
              onClick={() => handleModeChange("quick")}
              className={`px-8 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${currentMode === "quick"
                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-md"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              Quick
            </button>
            <button
              onClick={() => handleModeChange("detailed")}
              className={`px-8 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${currentMode === "detailed"
                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-md"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              Detailed
            </button>
          </div>
        </div>

        {currentMode === "quick" ? (
          <QuickMode key="quick" calculate={calculate} loading={loading} />
        ) : (
          <DetailedMode key="detailed" calculate={calculate} loading={loading} />
        )}

        {/* Result Section */}
        <div
          id="result"
          className="w-full p-4 bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg mt-10"
        >
          <h1 className="flex justify-center items-center gap-2 text-xl md:text-2xl font-bold text-[#2b2b2b] w-full bg-[#ffcc00] rounded-xl py-3 text-center mb-6">
            ผลลัพธ์
            <button onClick={() => setModal(true)}>
              <i className="fa-solid fa-circle-info"></i>
            </button>
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <i className="fa-solid fa-spinner text-[#ffcc00] animate-spin text-5xl"></i>
            </div>
          ) : result ? (
            <>
              <p className="flex flex-col items-center gap-y-4 mb-8">
                <h2 className="font-semibold text-xl md:text-2xl text-[#3d3d3d] dark:text-white">
                  คุณจะถึงเป้าหมายในวันที่
                </h2>
                <span className="p-2 px-4 rounded-lg font-semibold bg-[#ffcc00] text-[#2b2b2b] text-base md:text-xl">
                  {formatDate(result.targetDay)}
                </span>
              </p>
              <div className="calendar-container">
                {/* Calendar Title */}
                <h3 className="calendar-title">
                  <i className="fa-solid fa-calendar-day text-[#d4a800]"></i>
                  เลือกวันที่เพื่อดูยอดเงินออมสะสม
                </h3>

                <Calendar
                  onChange={(date) => {
                    setValue(date);
                    setSelectedDate(date);
                    if (result) {
                      const totalSaving = calculateSavingUntil(date, result.amountPerSave, result.frequency);
                      setEstimatedSaving(totalSaving);
                    }
                  }}
                  value={value}
                  activeStartDate={activeStartDate}
                  onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
                  tileClassName={({ date }) => {
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
                  formatShortWeekday={(locale, date) =>
                    ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'][date.getDay()]
                  }
                  nextLabel={<i className="fa-solid fa-chevron-right text-sm"></i>}
                  prevLabel={<i className="fa-solid fa-chevron-left text-sm"></i>}
                  next2Label={null}
                  prev2Label={null}
                />

                {/* Calendar Legend */}
                <div className="calendar-legend">
                  <div className="calendar-legend-item">
                    <div className="calendar-legend-dot calendar-legend-dot--today"></div>
                    <span className="calendar-legend-text">วันนี้</span>
                  </div>
                  <div className="calendar-legend-item">
                    <div className="calendar-legend-dot calendar-legend-dot--selected"></div>
                    <span className="calendar-legend-text">วันที่เลือก</span>
                  </div>
                  <div className="calendar-legend-item">
                    <div className="calendar-legend-dot calendar-legend-dot--target"></div>
                    <span className="calendar-legend-text">วันถึงเป้าหมาย</span>
                  </div>
                </div>

                {/* Estimated Savings Display */}
                {selectedDate && estimatedSaving !== null && (
                  <div className="calendar-savings-display">
                    <p>
                      ยอดเงินออมสะสม ณ วันที่ <span className="text-[#1e293b] dark:text-white font-bold">{formatDate(selectedDate)}</span>
                    </p>
                    <span className="amount">{estimatedSaving.toLocaleString()} บาท</span>
                  </div>
                )}
              </div>

              {/* Line Chart */}
              <div className="mt-10">
                <h2 className="text-center text-[#3d3d3d] dark:text-white font-semibold py-4">
                  กราฟแสดงความเติบโตของเงินออม
                </h2>
                <LineChartComponent
                  data={result.chartData}
                  selectedDate={selectedDate}
                  estimatedSaving={estimatedSaving}
                  formatDate={formatShortDate}
                />
                {/* Adjustment Section Component */}
                <AdjustmentSection result={result} selectedDate={selectedDate} />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="flex flex-col gap-4">
            <button
              className="bg-[#ffcc00] p-4 rounded-lg font-bold"
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
