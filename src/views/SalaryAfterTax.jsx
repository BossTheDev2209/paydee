import { useState, useEffect } from "react";
import { calculateTaxQuick } from "../utils/taxQuick";
import { calculateTaxDetailed } from "../utils/taxDetailed";
import QuickMode from "./salary-tab/QuickMode";
import DetailedMode from "./salary-tab/DetailedMode";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CalculatorCard } from "../components/salary/CalculatorComponents";
import { motion, AnimatePresence } from "framer-motion";
import SlotCounter from "../components/ui/SlotCounter";
import TermsModal from "../components/TermsModal";

export default function SalaryAfterTax() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const modeParam = params.get("mode");
  const currentMode = modeParam === "detailed" ? "detailed" : "quick";
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modal, setModal] = useState(false);

  const handleTermsAccept = () => {
    setModal(false);
  };

  const handleTermsReject = () => {
    setModal(false);
    navigate("/");
  };

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
              <CalculatorCard
                title="ผลลัพธ์"
                id="result"
                onInfoClick={() => setModal(true)}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <i className="fa-solid fa-spinner text-[#ffcc00] text-4xl animate-spin"></i>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Status Message */}
                    <div className="text-center mb-6">
                      {(result.total_monthly_expenses > 0 ? result.remaining_cash_month : result.net_income_month_after_tax) > 0 ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-green-600 dark:text-green-400 font-bold text-xl md:text-2xl"
                        >
                          {result.total_monthly_expenses > 0
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

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* รายได้ Category */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-700/50"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-arrow-trend-up text-white text-sm"></i>
                          </div>
                          <h3 className="font-bold text-green-700 dark:text-green-400">รายได้</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-green-600/70 dark:text-green-400/70 mb-1">ต่อเดือน</p>
                            <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400">
                              <SlotCounter value={result.net_income_month_after_tax} />
                              <span className="text-sm font-normal ml-1">บาท</span>
                            </p>
                          </div>
                          <div className="pt-2 border-t border-green-200 dark:border-green-700/50">
                            <p className="text-xs text-green-600/70 dark:text-green-400/70 mb-1">ต่อปี</p>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                              <SlotCounter value={result.net_income_year_after_tax} />
                              <span className="text-sm font-normal ml-1">บาท</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* รายจ่าย Category */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-700/50"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-arrow-trend-down text-white text-sm"></i>
                          </div>
                          <h3 className="font-bold text-orange-700 dark:text-orange-400">รายจ่าย</h3>
                        </div>
                        {result.total_monthly_expenses > 0 ? (
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mb-1">ต่อเดือน</p>
                              <p className="text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-400">
                                <SlotCounter value={result.total_monthly_expenses} />
                                <span className="text-sm font-normal ml-1">บาท</span>
                              </p>
                            </div>
                            <div className="pt-2 border-t border-orange-200 dark:border-orange-700/50">
                              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mb-1">ต่อปี</p>
                              <p className="text-lg font-semibold text-orange-600 dark:text-orange-500">
                                <SlotCounter value={result.total_yearly_expenses} />
                                <span className="text-sm font-normal ml-1">บาท</span>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-20 text-orange-400 dark:text-orange-500/50">
                            <p className="text-sm text-center">ไม่มีข้อมูลค่าใช้จ่าย</p>
                          </div>
                        )}
                      </motion.div>

                      {/* ภาษี Category */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-5 border border-red-200 dark:border-red-700/50"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-file-invoice-dollar text-white text-sm"></i>
                          </div>
                          <h3 className="font-bold text-red-700 dark:text-red-400">ภาษี</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-red-600/70 dark:text-red-400/70 mb-1">ต่อเดือน</p>
                            <p className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-400">
                              <SlotCounter value={Math.round(result.tax_year / 12)} />
                              <span className="text-sm font-normal ml-1">บาท</span>
                            </p>
                          </div>
                          <div className="pt-2 border-t border-red-200 dark:border-red-700/50">
                            <p className="text-xs text-red-600/70 dark:text-red-400/70 mb-1">ต่อปี</p>
                            <p className="text-lg font-semibold text-red-600 dark:text-red-500">
                              <SlotCounter value={result.tax_year} />
                              <span className="text-sm font-normal ml-1">บาท</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* เงินคงเหลือ - Summary Card (Show whenever expenses > 0) */}
                    {result.total_monthly_expenses > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`rounded-xl p-6 border-2 ${result.remaining_cash_month >= 0
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400'
                          : 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400'
                          }`}
                      >
                        <div className="text-center text-white">
                          <p className="text-sm opacity-90 mb-2">เงินคงเหลือหลังหักค่าใช้จ่าย</p>
                          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <div>
                              <p className="text-3xl md:text-4xl font-bold">
                                <SlotCounter value={result.remaining_cash_month} />
                                <span className="text-lg font-normal ml-1">บาท/เดือน</span>
                              </p>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/30"></div>
                            <div>
                              <p className="text-xl md:text-2xl font-semibold opacity-90">
                                <SlotCounter value={result.remaining_cash_year} />
                                <span className="text-base font-normal ml-1">บาท/ปี</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons - Show whenever expenses > 0 */}
                    {result.total_monthly_expenses > 0 && (
                      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <Link
                          to="/"
                          className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors text-center"
                        >
                          หน้าแรก
                        </Link>
                        {currentMode === "detailed" && (
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
                        )}
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

      {/* Terms Modal - Added at the end of the section */}
      <TermsModal
        isOpen={modal}
        onClose={() => setModal(false)}
        onAccept={handleTermsAccept}
        onReject={handleTermsReject}
        calculatorType="salary-tax"
        showButtons={true}
      />
    </section>
  );
}
