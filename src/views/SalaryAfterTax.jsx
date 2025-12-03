import { useState } from "react";
import QuickMode from "./salary-tab/QuickMode";
import DetailedMode from "./salary-tab/DetailedMode";
import { Link, useSearchParams } from "react-router-dom";
import { CalculatorCard } from "../components/salary/CalculatorComponents";

export default function SalaryAfterTax() {
  const [params, setParams] = useSearchParams();
  const modeParam = params.get("mode");
  const currentMode = modeParam === "detailed" ? "detailed" : "quick";
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleModeChange = (newMode) => {
    setParams({ mode: newMode });
    setResult(null); // Clear result when switching modes
  };

  const calculate = (values, mode) => {
    setLoading(true);
    setTimeout(() => {
      const salary = Number(values.salary || 0);
      const expenses = Number(values.expenses || 0);
      const tax = Number(values.tax || 0);
      const bonus = Number(values.bonus || 0);
      const extraIncome = Number(values.extraIncome || 0);
      const commutingCost = Number(values.commutingCost || 0);
      const housingCost = Number(values.housingCost || 0);
      const debt = Number(values.debt || 0);
      const deduction = Number(values.deduction || 0);

      // quick mode
      const Qnet = (salary - expenses) * 12;

      // detailed mode
      const Dnet =
        (salary +
          bonus +
          extraIncome -
          (commutingCost + housingCost + debt + deduction + expenses)) *
        12;

      const netTax = mode === "quick" ? (tax / 100) * Qnet : (tax / 100) * Dnet;
      const netMount =
        mode === "quick" ? (Qnet - netTax) / 12 : (Dnet - netTax) / 12;
      const netYearAfterTax = mode === "quick" ? Qnet - netTax : Dnet - netTax;

      setResult({
        netTax,
        netMount,
        netYearAfterTax,
      });
      setLoading(false);
    });
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
      {/* Header Section */}
      <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
            รายได้สุทธิหลังหักภาษี
          </h1>
          <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
            คำนวณรายได้สุทธิหลังหักภาษีและค่าใช้จ่าย
          </h3>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6">
          <i className="fa-solid fa-arrow-left-long mr-2"></i>
          Back to Home
        </Link>

        {/* Mode Toggle */}
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

        {/* Calculator Form */}
        <div className="mb-10">
          {currentMode === "quick" ? (
            <QuickMode
              key="quick"
              calculate={(values) => calculate(values, "quick")}
            />
          ) : (
            <DetailedMode
              key="detailed"
              calculate={(values) => calculate(values, "detailed")}
            />
          )}
        </div>

        {/* Results Section */}
        {(loading || result) && (
          <CalculatorCard title="ผลลัพธ์" className="animate-fade-in-up">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <i className="fa-solid fa-spinner text-[#ffcc00] text-4xl animate-spin"></i>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                  <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                    รายได้สุทธิต่อเดือน
                  </h2>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#2b2b2b] dark:text-[#ffcc00]">
                    {result.netMount.toLocaleString()} <span className="text-base font-normal text-gray-500">บาท</span>
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                  <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                    รายได้สุทธิต่อปี
                  </h2>
                  <h2 className="text-xl md:text-2xl font-bold text-[#2b2b2b] dark:text-white">
                    {result.netYearAfterTax.toLocaleString()} <span className="text-base font-normal text-gray-500">บาท</span>
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center">
                  <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                    ภาษีต่อปี
                  </h2>
                  <h2 className="text-xl md:text-2xl font-bold text-red-500">
                    {result.netTax.toLocaleString()} <span className="text-base font-normal text-gray-500">บาท</span>
                  </h2>
                </div>
              </div>
            )}
          </CalculatorCard>
        )}
      </div>
    </section>
  );
}
