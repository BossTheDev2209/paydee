import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection } from "../components/salary/CalculatorComponents";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

// Financial Insight Page - Receives expense data and calls LLM API
export default function FinancialInsight() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [insightData, setInsightData] = useState(null);

    // Get expense data from navigation state
    const expenseData = location.state?.expenseData;

    useEffect(() => {
        if (!expenseData) {
            setError("ไม่พบข้อมูลค่าใช้จ่าย กรุณาคำนวณจาก Detailed Mode ก่อน");
            setLoading(false);
            return;
        }

        // Call API
        fetchFinancialInsight();
    }, []);

    const fetchFinancialInsight = async () => {
        try {
            setLoading(true);
            setError(null);

            const requestBody = {
                net_income_monthly: expenseData.net_income_month_after_tax || 0,
                needs_food: expenseData.foodCost || 0,
                needs_housing: expenseData.housingCost || 0,
                needs_transport: expenseData.transportCost || 0,
                needs_utilities: expenseData.utilitiesCost || 0,
                needs_insurance: expenseData.insuranceServiceCost || 0,
                needs_debt: expenseData.debtPayment || 0,
                wants_misc: expenseData.miscCost || 0
            };

            const response = await fetch("https://financial-insight-llm.onrender.com/Financial_Insight", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            setInsightData(data);
        } catch (err) {
            console.error("Financial Insight API Error:", err);
            setError("ไม่สามารถเชื่อมต่อ API ได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    // Pie chart colors
    const PIE_COLORS = ["#f59e0b", "#10b981", "#3b82f6"];

    // Prepare pie chart data
    const getPieData = () => {
        if (!insightData?.numbers) return [];
        const needs = Math.max(0, insightData.numbers.actual_needs_pct || 0);
        const savings = Math.max(0, insightData.numbers.actual_savings_pct || 0);
        const wants = Math.max(0, 100 - needs - savings);
        return [
            { name: "ค่าใช้จ่ายที่จำเป็น", value: needs, color: "#f59e0b" },
            { name: "ความต้องการส่วนตัว", value: wants, color: "#10b981" },
            { name: "การออม,การลงทุน", value: savings, color: "#3b82f6" }
        ];
    };

    // Prepare bar chart data
    const getBarData = () => {
        return [
            { name: "การออม\nการลงทุน", เกณฑ์มาตรฐาน: 20, คุณ: Math.max(0, insightData?.numbers?.actual_savings_pct || 0) },
            { name: "ความต้องการ\nส่วนตัว", เกณฑ์มาตรฐาน: 30, คุณ: 30 },
            { name: "ภาระหนี้สินต่อ\nรายได้", เกณฑ์มาตรฐาน: 40, คุณ: insightData?.numbers?.debt_to_income_pct || 0 },
            { name: "ค่าใช้จ่าย\nจำเป็น", เกณฑ์มาตรฐาน: 50, คุณ: insightData?.numbers?.actual_needs_pct || 0 }
        ];
    };

    // Health score color
    const getScoreColor = (score) => {
        if (score >= 70) return "#10b981";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
            {/* Header */}
            <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
                        รายงานข้อมูลเชิงลึกทางการเงิน
                    </h1>
                    <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
                        วิเคราะห์โดย AI
                    </h3>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <Link
                    to="/salary-aftertax?mode=detailed"
                    className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6"
                >
                    <i className="fa-solid fa-arrow-left-long mr-2"></i>
                    กลับไปหน้าคำนวณ
                </Link>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center h-80">
                        <i className="fa-solid fa-spinner text-[#ffcc00] text-5xl animate-spin mb-4"></i>
                        <p className="text-gray-500 dark:text-gray-400">กำลังวิเคราะห์ข้อมูลของคุณ...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                        <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => navigate("/salary-aftertax?mode=detailed")}
                            className="bg-[#ffcc00] text-[#2b2b2b] font-bold px-6 py-2 rounded-lg hover:bg-[#e6b800] transition-colors"
                        >
                            กลับไปคำนวณ
                        </button>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && insightData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Panel 1: Expense Breakdown Pie Chart */}
                        <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white">
                                    เกิน {Math.round(insightData.numbers?.actual_needs_pct - 50 || 0)}%
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                ของจำนวนเงินถูกใช้ไปกับ....
                            </p>

                            <div className="h-48 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={getPieData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ value }) => `${Math.round(value)}%`}
                                        >
                                            {getPieData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-bold text-[#f59e0b]">ค่าใช้จ่าย<br />จำเป็น</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs">
                                {getPieData().map((item, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                        <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* LLM Text */}
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {insightData.panels?.left_panel || "กำลังวิเคราะห์..."}
                                </p>
                            </div>
                        </div>

                        {/* Panel 2: Financial Strength Score */}
                        <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white">
                                    ความแข็งแรงทางการเงินของคุณ
                                </h3>
                                <i className="fa-solid fa-circle-info text-gray-400 text-sm"></i>
                            </div>

                            {/* Circular Score */}
                            <div className="flex justify-center my-6">
                                <div
                                    className="relative w-32 h-32 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `conic-gradient(${getScoreColor(insightData.numbers?.health_score)} ${(insightData.numbers?.health_score || 0) * 3.6}deg, #e5e7eb 0deg)`
                                    }}
                                >
                                    <div className="w-24 h-24 rounded-full bg-white dark:bg-[#2b2b2b] flex items-center justify-center">
                                        <span className="text-3xl font-bold" style={{ color: getScoreColor(insightData.numbers?.health_score) }}>
                                            {Math.round(insightData.numbers?.health_score || 0)}/100
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">ภาระหนี้สินต่อรายได้</span>
                                        <i className="fa-solid fa-circle-info text-gray-400 text-xs"></i>
                                    </div>
                                    <div className="flex gap-2">
                                        {[15, 40, 50].map((val, i) => (
                                            <span key={i} className={`text-xs px-2 py-1 rounded ${(insightData.numbers?.debt_to_income_pct || 0) <= val ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                {val}%
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">ความสามารถในการสำรองเงิน</span>
                                        <i className="fa-solid fa-circle-info text-gray-400 text-xs"></i>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="h-3 rounded-full transition-all"
                                            style={{
                                                width: `${Math.min(100, Math.max(0, insightData.numbers?.actual_savings_pct || 0))}%`,
                                                backgroundColor: getScoreColor(insightData.numbers?.actual_savings_pct * 3 || 0)
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>น้อยกว่า 1</span>
                                        <span>มากกว่า 1</span>
                                        <span>มากกว่า 3-6</span>
                                    </div>
                                </div>
                            </div>

                            {/* LLM Text */}
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {insightData.panels?.middle_panel || "กำลังวิเคราะห์..."}
                                </p>
                            </div>
                        </div>

                        {/* Panel 3: Income Allocation Bar Chart */}
                        <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white">
                                    การจัดสรรรายได้โดยรวม
                                </h3>
                                <i className="fa-solid fa-circle-info text-gray-400 text-sm"></i>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                เทียบกับเกณฑ์มาตรฐานหลักการวางแผนการเงิน
                            </p>

                            {/* Recommendation Box */}
                            <div className="border-2 border-red-400 rounded-lg p-3 mb-4">
                                <p className="text-red-500 text-xs font-bold mb-1">คำแนะนำ</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {insightData.panels?.right_panel || "กำลังวิเคราะห์..."}
                                </p>
                            </div>

                            {/* Bar Chart */}
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getBarData()} barGap={2}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="เกณฑ์มาตรฐาน" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="คุณ" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                {!loading && (
                    <div className="flex justify-center gap-4 mt-8">
                        <Link
                            to="/"
                            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                        >
                            หน้าแรก
                        </Link>
                        <Link
                            to="/salary-aftertax?mode=detailed"
                            className="px-6 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors"
                        >
                            คำนวณอีกครั้ง
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
