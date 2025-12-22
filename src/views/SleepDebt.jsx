import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "@/components/salary/CalculatorComponents";
import { motion, AnimatePresence } from "framer-motion";
import SlotCounter from "@/components/ui/SlotCounter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import TermsModal from "@/components/TermsModal";
import { useCalculationHistory } from "../context/CalculationHistoryContext";

export default function SleepDebt() {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isResetting, setIsResetting] = useState(false);
    const { addCalculation } = useCalculationHistory();

    // Form states
    const [recommendedHours, setRecommendedHours] = useState(8); // Recommended sleep hours per night
    const [sleepHistory, setSleepHistory] = useState([
        { date: new Date(), hours: "" },
        { date: new Date(Date.now() - 86400000), hours: "" },
        { date: new Date(Date.now() - 172800000), hours: "" },
        { date: new Date(Date.now() - 259200000), hours: "" },
        { date: new Date(Date.now() - 345600000), hours: "" },
        { date: new Date(Date.now() - 432000000), hours: "" },
        { date: new Date(Date.now() - 518400000), hours: "" },
    ]);

    const handleTermsAccept = () => {
        setTermsAccepted(true);
        setModal(false);
    };

    const handleTermsReject = () => {
        setModal(false);
        navigate("/");
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("th-TH", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    };

    const updateSleepHours = (index, hours) => {
        const updated = [...sleepHistory];
        updated[index].hours = hours;
        setSleepHistory(updated);
        setResult(null);
    };

    const applyToAll = (hours) => {
        const updated = sleepHistory.map(day => ({ ...day, hours: hours.toString() }));
        setSleepHistory(updated);
        setResult(null);
    };

    const getHoursColor = (hours) => {
        const numHours = parseFloat(hours) || 0;
        if (numHours < 6) return "text-red-600 dark:text-red-400 font-bold";
        if (numHours >= 7 && numHours <= 9) return "text-green-600 dark:text-green-400 font-bold";
        if (numHours >= 6 && numHours < 7) return "text-orange-600 dark:text-orange-400 font-semibold";
        return "text-gray-600 dark:text-gray-400";
    };

    // Calculate sleep quality assessment
    const assessSleepQuality = (hours) => {
        if (hours < 6) {
            return {
                level: "poor",
                label: "นอนน้อยเกินไป",
                color: "red",
                score: Math.max(0, (hours / 6) * 50),
                description: "การนอนน้อยกว่า 6 ชั่วโมงอาจส่งผลเสียต่อสุขภาพ",
                icon: "fa-triangle-exclamation"
            };
        } else if (hours >= 6 && hours < 7) {
            return {
                level: "fair",
                label: "นอนพอใช้",
                color: "orange",
                score: 60 + ((hours - 6) / 1) * 20,
                description: "การนอน 6-7 ชั่วโมงพอใช้ได้ แต่ยังไม่เหมาะสมที่สุด",
                icon: "fa-circle-check"
            };
        } else if (hours >= 7 && hours <= 9) {
            return {
                level: "excellent",
                label: "นอนเหมาะสม",
                color: "green",
                score: 80 + Math.min(20, (hours - 7) / 2 * 20),
                description: "การนอน 7-9 ชั่วโมงเป็นเวลาที่เหมาะสมที่สุด",
                icon: "fa-star"
            };
        } else if (hours > 9 && hours <= 10) {
            return {
                level: "good",
                label: "นอนมาก",
                color: "blue",
                score: 85,
                description: "การนอน 9-10 ชั่วโมงอาจมากเกินไปเล็กน้อย",
                icon: "fa-moon"
            };
        } else {
            return {
                level: "excessive",
                label: "นอนมากเกินไป",
                color: "purple",
                score: 70,
                description: "การนอนมากกว่า 10 ชั่วโมงอาจไม่จำเป็น",
                icon: "fa-bed"
            };
        }
    };

    const addDay = () => {
        const lastDate = sleepHistory[0].date;
        const newDate = new Date(lastDate.getTime() + 86400000);
        setSleepHistory([{ date: newDate, hours: "" }, ...sleepHistory]);
    };

    const removeDay = (index) => {
        if (sleepHistory.length > 1) {
            const updated = sleepHistory.filter((_, i) => i !== index);
            setSleepHistory(updated);
        }
    };

    const calculate = () => {
        setLoading(true);
        setResult(null);

        setTimeout(() => {
            // Calculate sleep debt for each day
            const historyWithDebt = sleepHistory
                .filter(day => day.hours !== "" && day.hours !== null)
                .map(day => {
                    const hours = parseFloat(day.hours) || 0;
                    const debt = Math.max(0, recommendedHours - hours);
                    return {
                        ...day,
                        hours,
                        debt,
                        dateStr: formatDate(day.date)
                    };
                })
                .reverse(); // Oldest first for chart

            // Calculate cumulative sleep debt
            let cumulativeDebt = 0;
            const cumulativeData = historyWithDebt.map(day => {
                cumulativeDebt += day.debt;
                return {
                    ...day,
                    cumulativeDebt: cumulativeDebt
                };
            });

            const totalDebt = cumulativeDebt;
            const averageHours = historyWithDebt.length > 0
                ? historyWithDebt.reduce((sum, day) => sum + day.hours, 0) / historyWithDebt.length
                : 0;
            const daysTracked = historyWithDebt.length;

            // Calculate recovery plan
            const recoveryDays = Math.ceil(totalDebt / 1.5); // Can recover ~1.5 hours per night
            const recoveryHoursPerNight = totalDebt > 0 ? (totalDebt / recoveryDays).toFixed(1) : 0;

            // Generate recommendations
            const recommendations = [];
            if (totalDebt > 0) {
                recommendations.push(`คุณมีหนี้การนอน ${totalDebt.toFixed(1)} ชั่วโมง`);
                recommendations.push(`ควรนอนเพิ่ม ${recoveryHoursPerNight} ชั่วโมงต่อคืน เป็นเวลา ${recoveryDays} วัน`);
                if (totalDebt > 10) {
                    recommendations.push("หนี้การนอนมากเกินไป! พยายามนอนให้ครบ 8-9 ชั่วโมงต่อคืน");
                }
            } else if (averageHours < recommendedHours) {
                recommendations.push(`คุณนอนเฉลี่ย ${averageHours.toFixed(1)} ชั่วโมงต่อคืน ซึ่งน้อยกว่าที่แนะนำ`);
            } else {
                recommendations.push("ยอดเยี่ยม! คุณนอนครบตามที่แนะนำ");
            }

            setResult({
                totalDebt: totalDebt.toFixed(1),
                averageHours: averageHours.toFixed(1),
                daysTracked,
                recoveryDays,
                recoveryHoursPerNight,
                recommendations,
                chartData: cumulativeData,
                historyData: historyWithDebt
            });
            setLoading(false);
        }, 600);
    };

    const resetForm = () => {
        setIsResetting(true);
        setRecommendedHours(8);
        setSleepHistory([
            { date: new Date(), hours: "" },
            { date: new Date(Date.now() - 86400000), hours: "" },
            { date: new Date(Date.now() - 172800000), hours: "" },
            { date: new Date(Date.now() - 259200000), hours: "" },
            { date: new Date(Date.now() - 345600000), hours: "" },
            { date: new Date(Date.now() - 432000000), hours: "" },
            { date: new Date(Date.now() - 518400000), hours: "" },
        ]);
        setResult(null);
        setTimeout(() => setIsResetting(false), 1000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Save to history
    useEffect(() => {
        if (result) {
            addCalculation({
                calculatorType: "sleep-debt",
                inputs: {
                    recommendedHours,
                    sleepHistory: sleepHistory.filter(d => d.hours !== "")
                },
                results: result
            });
        }
    }, [result, recommendedHours, sleepHistory, addCalculation]);

    useEffect(() => {
        if (!termsAccepted) {
            setModal(true);
        }
    }, [termsAccepted]);

    return (
        <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
            {/* Header */}
            <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
                        <i className="fa-solid fa-moon mr-3"></i>
                        คำนวณหนี้การนอน
                    </h1>
                    <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
                        ติดตามและคำนวณหนี้การนอนของคุณ
                    </h3>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <Link to="/" className="px-6 py-2 btn-back flex items-center gap-2 mb-6 w-fit transition-all duration-300">
                    <i className="fa-solid fa-arrow-left-long"></i>
                    Back to Home
                </Link>

                {/* Terms Modal */}
                <TermsModal
                    isOpen={modal}
                    onClose={() => setModal(false)}
                    onAccept={handleTermsAccept}
                    onReject={handleTermsReject}
                />

                {/* Calculator Form */}
                <CalculatorCard title="บันทึกการนอน">
                    <div className="space-y-6">
                        {/* Recommended Hours */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ชั่วโมงการนอนที่แนะนำต่อคืน
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setRecommendedHours(Math.max(6, recommendedHours - 0.5))}
                                    className="w-10 h-10 rounded-lg bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <i className="fa-solid fa-minus text-gray-600 dark:text-gray-300"></i>
                                </button>
                                <div className="flex-1 text-center">
                                    <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{recommendedHours}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-2">ชั่วโมง</span>
                                </div>
                                <button
                                    onClick={() => setRecommendedHours(Math.min(10, recommendedHours + 0.5))}
                                    className="w-10 h-10 rounded-lg bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <i className="fa-solid fa-plus text-gray-600 dark:text-gray-300"></i>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                ผู้ใหญ่ควรนอน 7-9 ชั่วโมงต่อคืน
                            </p>
                        </div>

                        {/* Sleep History */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white">
                                    บันทึกการนอนย้อนหลัง
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => applyToAll(recommendedHours)}
                                        className="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5"
                                        title="กรอกเท่ากันทุกวัน"
                                    >
                                        <i className="fa-solid fa-copy"></i>
                                        กรอกเท่ากันทุกวัน
                                    </button>
                                    <button
                                        onClick={addDay}
                                        className="px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                        เพิ่มวัน
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {sleepHistory.map((day, index) => {
                                    const hoursValue = parseFloat(day.hours) || 0;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-white dark:bg-[#2b2b2b] rounded-xl border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                                                    {formatDate(day.date)}
                                                </div>
                                                <div className="flex-1">
                                                    {/* Slider */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 w-8">0</span>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="12"
                                                            step="0.5"
                                                            value={hoursValue}
                                                            onChange={(e) => updateSleepHours(index, e.target.value)}
                                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
                                                        />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">12</span>
                                                    </div>
                                                </div>
                                                {sleepHistory.length > 1 && (
                                                    <button
                                                        onClick={() => removeDay(index)}
                                                        className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center flex-shrink-0"
                                                    >
                                                        <i className="fa-solid fa-trash text-xs"></i>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {/* Quick Select Buttons */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">เลือกเร็ว:</span>
                                                    {[6, 7, 8, 9].map(hrs => (
                                                        <button
                                                            key={hrs}
                                                            onClick={() => updateSleepHours(index, hrs.toString())}
                                                            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                                                                hoursValue === hrs
                                                                    ? "bg-purple-600 text-white shadow-md"
                                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                            }`}
                                                        >
                                                            {hrs} ชม.
                                                        </button>
                                                    ))}
                                                </div>
                                                {/* Hours Display with Color and Quality */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-2xl font-bold ${getHoursColor(day.hours)}`}>
                                                                {day.hours || "0"}
                                                            </span>
                                                            <span className="text-gray-600 dark:text-gray-400 text-sm">ชั่วโมง</span>
                                                        </div>
                                                        {day.hours && parseFloat(day.hours) > 0 && (
                                                            <div className="mt-1">
                                                                {(() => {
                                                                    const assessment = assessSleepQuality(parseFloat(day.hours));
                                                                    return (
                                                                        <div className={`flex items-center gap-1 text-[10px] ${
                                                                            assessment.color === "red" ? "text-red-600 dark:text-red-400" :
                                                                            assessment.color === "orange" ? "text-orange-600 dark:text-orange-400" :
                                                                            assessment.color === "green" ? "text-green-600 dark:text-green-400" :
                                                                            assessment.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                                                                            "text-purple-600 dark:text-purple-400"
                                                                        }`}>
                                                                            <i className={`fa-solid ${assessment.icon}`}></i>
                                                                            <span className="font-semibold">{assessment.label}</span>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="px-8 py-3 btn-back transition-all duration-300"
                            >
                                กลับหน้าหลัก
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className={`px-8 py-3 btn-danger transition-all duration-300 ${isResetting ? "opacity-70" : ""}`}
                            >
                                {isResetting ? (
                                    <>
                                        <i className="fa-solid fa-check mr-2"></i>
                                        เรียบร้อย
                                    </>
                                ) : (
                                    "รีเซต"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={calculate}
                                disabled={loading || sleepHistory.every(d => !d.hours)}
                                className={`px-8 py-3 btn-primary transition-all duration-300 flex items-center justify-center gap-2 ${loading || sleepHistory.every(d => !d.hours) ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                        กำลังคำนวณ...
                                    </>
                                ) : (
                                    "คำนวณ"
                                )}
                            </button>
                        </div>
                    </div>
                </CalculatorCard>

                {/* Results Section */}
                <AnimatePresence>
                    {(loading || result) && (
                        <motion.div
                            id="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-10 bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-6 md:p-8"
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-40">
                                    <i className="fa-solid fa-spinner text-[#ffcc00] animate-spin text-5xl"></i>
                                </div>
                            ) : result && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-[#2b2b2b] dark:text-white text-center mb-6">
                                        ผลลัพธ์การคำนวณ
                                    </h2>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                                            <div className="text-sm opacity-90 mb-2">หนี้การนอนรวม</div>
                                            <div className="text-4xl font-bold">
                                                <SlotCounter value={parseFloat(result.totalDebt)} />
                                                <span className="text-xl ml-1">ชม.</span>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                                            <div className="text-sm opacity-90 mb-2">ชั่วโมงเฉลี่ยต่อคืน</div>
                                            <div className="text-4xl font-bold">
                                                <SlotCounter value={parseFloat(result.averageHours)} />
                                                <span className="text-xl ml-1">ชม.</span>
                                            </div>
                                            {/* Sleep Quality Assessment */}
                                            {(() => {
                                                const assessment = assessSleepQuality(parseFloat(result.averageHours));
                                                return (
                                                    <div className="mt-3 pt-3 border-t border-white/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <i className={`fa-solid ${assessment.icon} text-sm`}></i>
                                                                <span className="text-xs opacity-90">{assessment.label}</span>
                                                            </div>
                                                            <div className="text-xs opacity-75">
                                                                {Math.round(assessment.score)}/100
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                                            <div className="text-sm opacity-90 mb-2">วันที่ติดตาม</div>
                                            <div className="text-4xl font-bold">{result.daysTracked}</div>
                                            <div className="text-sm opacity-90 mt-1">วัน</div>
                                        </div>
                                    </div>

                                    {/* Overall Sleep Quality Assessment */}
                                    {result.historyData && result.historyData.length > 0 && (
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                                            <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-chart-line text-indigo-500"></i>
                                                สรุปคุณภาพการนอน
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Daily Quality Breakdown */}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">คุณภาพการนอนแต่ละวัน:</p>
                                                    <div className="space-y-2">
                                                        {result.historyData.map((day, idx) => {
                                                            const assessment = assessSleepQuality(day.hours);
                                                            return (
                                                                <div key={idx} className="flex items-center justify-between p-2 bg-white/60 dark:bg-black/20 rounded-lg">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400 w-16">{day.dateStr}</span>
                                                                        <span className={`text-xs font-semibold ${
                                                                            assessment.color === "red" ? "text-red-600 dark:text-red-400" :
                                                                            assessment.color === "orange" ? "text-orange-600 dark:text-orange-400" :
                                                                            assessment.color === "green" ? "text-green-600 dark:text-green-400" :
                                                                            assessment.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                                                                            "text-purple-600 dark:text-purple-400"
                                                                        }`}>
                                                                            {assessment.label}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {day.hours.toFixed(1)} ชม.
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {/* Overall Assessment */}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">ภาพรวม:</p>
                                                    {(() => {
                                                        const avgAssessment = assessSleepQuality(parseFloat(result.averageHours));
                                                        const goodDays = result.historyData.filter(d => {
                                                            const a = assessSleepQuality(d.hours);
                                                            return a.level === "excellent" || a.level === "good";
                                                        }).length;
                                                        const poorDays = result.historyData.filter(d => {
                                                            const a = assessSleepQuality(d.hours);
                                                            return a.level === "poor" || a.level === "fair";
                                                        }).length;
                                                        return (
                                                            <div className="space-y-3">
                                                                <div className={`p-4 rounded-lg border-2 ${
                                                                    avgAssessment.color === "red" ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800" :
                                                                    avgAssessment.color === "orange" ? "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800" :
                                                                    avgAssessment.color === "green" ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800" :
                                                                    avgAssessment.color === "blue" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800" :
                                                                    "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800"
                                                                }`}>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <i className={`fa-solid ${avgAssessment.icon} text-lg ${
                                                                                avgAssessment.color === "red" ? "text-red-600 dark:text-red-400" :
                                                                                avgAssessment.color === "orange" ? "text-orange-600 dark:text-orange-400" :
                                                                                avgAssessment.color === "green" ? "text-green-600 dark:text-green-400" :
                                                                                avgAssessment.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                                                                                "text-purple-600 dark:text-purple-400"
                                                                            }`}></i>
                                                                            <span className={`font-bold ${
                                                                                avgAssessment.color === "red" ? "text-red-700 dark:text-red-300" :
                                                                                avgAssessment.color === "orange" ? "text-orange-700 dark:text-orange-300" :
                                                                                avgAssessment.color === "green" ? "text-green-700 dark:text-green-300" :
                                                                                avgAssessment.color === "blue" ? "text-blue-700 dark:text-blue-300" :
                                                                                "text-purple-700 dark:text-purple-300"
                                                                            }`}>
                                                                                {avgAssessment.label}
                                                                            </span>
                                                                        </div>
                                                                        <div className={`text-2xl font-bold ${
                                                                            avgAssessment.color === "red" ? "text-red-600 dark:text-red-400" :
                                                                            avgAssessment.color === "orange" ? "text-orange-600 dark:text-orange-400" :
                                                                            avgAssessment.color === "green" ? "text-green-600 dark:text-green-400" :
                                                                            avgAssessment.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                                                                            "text-purple-600 dark:text-purple-400"
                                                                        }`}>
                                                                            {Math.round(avgAssessment.score)}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {avgAssessment.description}
                                                                    </p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                                                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{goodDays}</div>
                                                                        <div className="text-gray-600 dark:text-gray-400">วันที่ดี</div>
                                                                    </div>
                                                                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                                                                        <div className="text-lg font-bold text-red-600 dark:text-red-400">{poorDays}</div>
                                                                        <div className="text-gray-600 dark:text-gray-400">วันที่ต้องปรับ</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Chart */}
                                    {result.chartData && result.chartData.length > 0 && (
                                        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white mb-4">
                                                กราฟหนี้การนอนสะสม
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={result.chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis 
                                                        dataKey="dateStr" 
                                                        stroke="#6b7280"
                                                        fontSize={12}
                                                    />
                                                    <YAxis 
                                                        stroke="#6b7280"
                                                        fontSize={12}
                                                        label={{ value: 'ชั่วโมง', angle: -90, position: 'insideLeft' }}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#fff', 
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="cumulativeDebt" 
                                                        stroke="#8b5cf6" 
                                                        strokeWidth={3}
                                                        name="หนี้สะสม (ชม.)"
                                                        dot={{ fill: '#8b5cf6', r: 4 }}
                                                    />
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="hours" 
                                                        stroke="#3b82f6" 
                                                        strokeWidth={2}
                                                        name="ชั่วโมงนอน"
                                                        dot={{ fill: '#3b82f6', r: 3 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {/* Recovery Plan */}
                                    {parseFloat(result.totalDebt) > 0 && (
                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-lightbulb text-orange-500"></i>
                                                แผนการชดเชยหนี้การนอน
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    เพื่อชดเชยหนี้การนอน {result.totalDebt} ชั่วโมง คุณควร:
                                                </p>
                                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                                    <li>นอนเพิ่ม {result.recoveryHoursPerNight} ชั่วโมงต่อคืน</li>
                                                    <li>เป็นเวลา {result.recoveryDays} วัน</li>
                                                    <li>หรือนอนให้ครบ {recommendedHours} ชั่วโมงต่อคืนอย่างสม่ำเสมอ</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white mb-4 flex items-center gap-2">
                                            <i className="fa-solid fa-info-circle text-blue-500"></i>
                                            คำแนะนำ
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col md:flex-row justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <Link
                                            to="/sleep-calculator"
                                            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center flex items-center justify-center gap-2"
                                        >
                                            <i className="fa-solid fa-moon"></i>
                                            ไปที่เครื่องคำนวณเวลานอน
                                        </Link>
                                        <button
                                            onClick={resetForm}
                                            className="px-8 py-3 btn-back transition-all duration-300"
                                        >
                                            คำนวณใหม่
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

