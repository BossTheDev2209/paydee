import { useState, useEffect } from "react";
import { calculateTaxQuick } from "../utils/taxQuick";
import { calculateTaxDetailed } from "../utils/taxDetailed";
import QuickMode from "./salary-tab/QuickMode";
import DetailedMode from "./salary-tab/DetailedMode";
import { Link, useSearchParams } from "react-router-dom";
import { CalculatorCard } from "../components/salary/CalculatorComponents";
import { motion, AnimatePresence } from "framer-motion";
import SlotCounter from "../components/ui/SlotCounter";

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
      const result =
        mode === "detailed"
          ? calculateTaxDetailed(values)
          : calculateTaxQuick(values);

      setResult(result);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [result]);

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
              loading={loading}
            />
          ) : (
            <DetailedMode
              key="detailed"
              calculate={(values) => calculate(values, "detailed")}
              loading={loading}
            />
          )}
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {(loading || result) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <CalculatorCard title="ผลลัพธ์" id="result">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <i className="fa-solid fa-spinner text-[#ffcc00] text-4xl animate-spin"></i>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Conditional Text Animation */}
                    <div className="text-center mb-6">
                      {(currentMode === "detailed" && result.total_monthly_expenses > 0 ? result.remaining_cash_month : result.net_income_month_after_tax) > 0 ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-green-600 dark:text-green-400 font-bold text-xl md:text-2xl"
                        >
                          {currentMode === "detailed" && result.total_monthly_expenses > 0
                            ? "ยินดีด้วย! คุณมีเงินคงเหลือหลังหักค่าใช้จ่าย"
                            : "ยินดีด้วย! คุณมีรายได้สุทธิคงเหลือ"}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-red-500 font-bold text-xl md:text-2xl"
                        >
                          ระวัง! รายจ่ายของคุณเกินรายได้
                        </motion.div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                      <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                        รายได้สุทธิต่อเดือน
                      </h2>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#2b2b2b] dark:text-[#ffcc00]">
                        <SlotCounter value={result.net_income_month_after_tax} /> <span className="text-base font-normal text-gray-500">บาท</span>
                      </h2>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                      <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                        รายได้สุทธิต่อปี
                      </h2>
                      <h2 className="text-xl md:text-2xl font-bold text-[#2b2b2b] dark:text-white">
                        <SlotCounter value={result.net_income_year_after_tax} /> <span className="text-base font-normal text-gray-500">บาท</span>
                      </h2>
                    </div>

                    {/* Show expense and cashflow info only in Detailed Mode with expenses */}
                    {currentMode === "detailed" && result.total_monthly_expenses > 0 && (
                      <>
                        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                          <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                            ค่าใช้จ่ายรวมต่อเดือน
                          </h2>
                          <h2 className="text-xl md:text-2xl font-bold text-orange-500">
                            <SlotCounter value={result.total_monthly_expenses} /> <span className="text-base font-normal text-gray-500">บาท</span>
                          </h2>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                          <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                            ค่าใช้จ่ายรวมต่อปี
                          </h2>
                          <h2 className="text-xl md:text-2xl font-bold text-orange-500">
                            <SlotCounter value={result.total_yearly_expenses} /> <span className="text-base font-normal text-gray-500">บาท</span>
                          </h2>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                          <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                            เงินคงเหลือต่อเดือน
                          </h2>
                          <h2 className={`text-xl md:text-2xl font-bold ${result.remaining_cash_month >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            <SlotCounter value={result.remaining_cash_month} /> <span className="text-base font-normal text-gray-500">บาท</span>
                          </h2>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
                          <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                            เงินคงเหลือต่อปี
                          </h2>
                          <h2 className={`text-xl md:text-2xl font-bold ${result.remaining_cash_year >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            <SlotCounter value={result.remaining_cash_year} /> <span className="text-base font-normal text-gray-500">บาท</span>
                          </h2>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <h2 className="text-lg md:text-xl text-[#2b2b2b] dark:text-gray-200">
                        ภาษีต่อปี
                      </h2>
                      <h2 className="text-xl md:text-2xl font-bold text-red-500">
                        <SlotCounter value={result.tax_year} /> <span className="text-base font-normal text-gray-500">บาท</span>
                      </h2>
                    </div>

                    {/* Action Buttons - Only show in Detailed Mode with expenses */}
                    {currentMode === "detailed" && result.total_monthly_expenses > 0 && (
                      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <Link
                          to="/"
                          className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors text-center"
                        >
                          หน้าแรก
                        </Link>
                        <Link
                          to="/financial-insight"
                          state={{
                            expenseData: {
                              net_income_month_after_tax: result.net_income_month_after_tax,
                              housingCost: Number(String(result.housingCost || 0).replace(/,/g, '')),
                              transportCost: Number(String(result.transportCost || 0).replace(/,/g, '')),
                              debtPayment: Number(String(result.debtPayment || 0).replace(/,/g, '')),
                              foodCost: Number(String(result.foodCost || 0).replace(/,/g, '')),
                              utilitiesCost: Number(String(result.utilitiesCost || 0).replace(/,/g, '')),
                              insuranceServiceCost: Number(String(result.insuranceServiceCost || 0).replace(/,/g, '')),
                              miscCost: Number(String(result.miscCost || 0).replace(/,/g, ''))
                            }
                          }}
                          className="relative px-6 py-3 rounded-lg font-bold text-center transition-all duration-300 overflow-hidden group"
                          style={{
                            background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #8b5cf6 100%)"
                          }}
                        >
                          <span className="relative z-10 text-white flex items-center justify-center gap-2">
                            แนะนำด้วย AI
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L9 9H2l5.5 4.5L5 22l7-5 7 5-2.5-8.5L22 9h-7L12 2z" />
                            </svg>
                          </span>
                          <span className="absolute top-1 right-2 text-white/60 text-lg">✦</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setResult(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors text-center"
                        >
                          คำนวณอีกครั้ง
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </CalculatorCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
