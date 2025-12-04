import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

    // Prepare pie chart data
    const getPieData = () => {
        if (!insightData?.numbers) return [];
        const needs = Math.max(0, insightData.numbers.actual_needs_pct || 0);
        const savings = Math.max(0, insightData.numbers.actual_savings_pct || 0);
        const wants = Math.max(0, 100 - needs - savings);
        return [
            { name: "ค่าใช้จ่ายที่จำเป็น", value: needs, color: "#f59e0b" },
            { name: "ความต้องการส่วนตัว", value: wants, color: "#10b981" },
            { name: "การออม/การลงทุน", value: savings, color: "#3b82f6" }
        ];
    };

    // Prepare bar chart data
    const getBarData = () => {
        return [
            { name: "การออม", standard: 20, user: Math.max(0, insightData?.numbers?.actual_savings_pct || 0) },
            { name: "ความต้องการ", standard: 30, user: 30 },
            { name: "หนี้สิน", standard: 40, user: insightData?.numbers?.debt_to_income_pct || 0 },
            { name: "ค่าใช้จ่าย", standard: 50, user: insightData?.numbers?.actual_needs_pct || 0 }
        ];
    };

    // Health score color
    const getScoreColor = (score) => {
        if (score >= 70) return "#10b981";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    };

    // Use demo data
    const useDemoData = () => {
        setInsightData({
            numbers: {
                health_score: 65,
                actual_needs_pct: 68,
                actual_savings_pct: 12,
                debt_to_income_pct: 20
            },
            panels: {
                left_panel: "ค่าที่อยู่อาศัยเกินมาตรฐาน 18% ทำให้เงินสำรองลดลง",
                middle_panel: "การเงินของคุณอยู่ในระดับปานกลาง มีโอกาสปรับปรุงได้",
                right_panel: "ลองพิจารณาลดค่าใช้จ่ายที่ไม่จำเป็นหรือหารายได้เสริม"
            }
        });
        setError(null);
    };

    return (
        <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 py-10 md:py-14 px-4 shadow-lg mb-10">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        รายงานข้อมูลเชิงลึกทางการเงิน
                    </h1>
                    <h3 className="text-lg md:text-xl text-white/80">
                        วิเคราะห์โดย AI
                    </h3>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <Link
                    to="/salary-aftertax?mode=detailed"
                    className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-8"
                >
                    <i className="fa-solid fa-arrow-left-long mr-2"></i>
                    กลับไปหน้าคำนวณ
                </Link>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center h-80 bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-lg">
                        <i className="fa-solid fa-spinner text-blue-500 text-6xl animate-spin mb-6"></i>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">กำลังวิเคราะห์ข้อมูลของคุณ...</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">อาจใช้เวลา 30-60 วินาที</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-white dark:bg-[#2b2b2b] border-2 border-red-300 dark:border-red-800 rounded-2xl p-8 text-center shadow-lg">
                        <i className="fa-solid fa-triangle-exclamation text-red-500 text-6xl mb-6"></i>
                        <p className="text-red-600 dark:text-red-400 text-xl mb-4">{error}</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            API Server อาจกำลัง Cold Start รอ 30-60 วินาที แล้วลองอีกครั้ง
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {expenseData && (
                                <button
                                    onClick={fetchFinancialInsight}
                                    className="px-8 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors text-lg"
                                >
                                    <i className="fa-solid fa-rotate-right mr-2"></i>
                                    ลองอีกครั้ง
                                </button>
                            )}
                            <button
                                onClick={useDemoData}
                                className="px-8 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors text-lg"
                            >
                                <i className="fa-solid fa-flask mr-2"></i>
                                ใช้ข้อมูลตัวอย่าง
                            </button>
                            <button
                                onClick={() => navigate("/salary-aftertax?mode=detailed")}
                                className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors text-lg"
                            >
                                กลับไปคำนวณ
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && insightData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Top Row: Score and Pie Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Panel 1: Financial Strength Score */}
                            <div className="bg-white dark:bg-[#2b2b2b] rounded-3xl shadow-xl p-8">
                                <h3 className="text-2xl font-bold text-[#2b2b2b] dark:text-white mb-6 text-center">
                                    ความแข็งแรงทางการเงิน
                                </h3>

                                {/* Circular Score */}
                                <div className="flex justify-center my-8">
                                    <div
                                        className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-lg"
                                        style={{
                                            background: `conic-gradient(${getScoreColor(insightData.numbers?.health_score)} ${(insightData.numbers?.health_score || 0) * 3.6}deg, #e5e7eb 0deg)`
                                        }}
                                    >
                                        <div className="w-36 h-36 rounded-full bg-white dark:bg-[#2b2b2b] flex flex-col items-center justify-center shadow-inner">
                                            <span className="text-5xl font-bold" style={{ color: getScoreColor(insightData.numbers?.health_score) }}>
                                                {Math.round(insightData.numbers?.health_score || 0)}
                                            </span>
                                            <span className="text-gray-500 text-lg">/100</span>
                                        </div>
                                    </div>
                                </div>

                                {/* LLM Text */}
                                <div className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl">
                                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {insightData.panels?.middle_panel || "กำลังวิเคราะห์..."}
                                    </p>
                                </div>
                            </div>

                            {/* Panel 2: Expense Breakdown Pie Chart */}
                            <div className="bg-white dark:bg-[#2b2b2b] rounded-3xl shadow-xl p-8">
                                <h3 className="text-2xl font-bold text-[#2b2b2b] dark:text-white mb-2 text-center">
                                    สัดส่วนค่าใช้จ่าย
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                                    {insightData.numbers?.actual_needs_pct > 50 && `เกินมาตรฐาน ${Math.round(insightData.numbers?.actual_needs_pct - 50)}%`}
                                </p>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getPieData()}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={3}
                                                dataKey="value"
                                                label={({ name, value }) => `${Math.round(value)}%`}
                                            >
                                                {getPieData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-6 mt-4">
                                    {getPieData().map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></span>
                                            <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* LLM Text */}
                                <div className="mt-6 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {insightData.panels?.left_panel || "กำลังวิเคราะห์..."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Bar Chart and Recommendations */}
                        <div className="bg-white dark:bg-[#2b2b2b] rounded-3xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-[#2b2b2b] dark:text-white mb-2 text-center">
                                การจัดสรรรายได้เทียบกับเกณฑ์มาตรฐาน
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                                เทียบกับหลักการวางแผนการเงิน 50-30-20
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Bar Chart */}
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getBarData()} barGap={8}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                                            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                                            <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                                            <Legend wrapperStyle={{ fontSize: 14 }} />
                                            <Bar dataKey="standard" name="เกณฑ์มาตรฐาน" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                                            <Bar dataKey="user" name="คุณ" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Recommendation Box */}
                                <div className="flex flex-col justify-center">
                                    <div className="border-3 border-blue-400 rounded-2xl p-6 bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src="/images/Ai_icon.png" alt="AI" className="w-8 h-8" />
                                            <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">คำแนะนำจาก AI</h4>
                                        </div>
                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {insightData.panels?.right_panel || "กำลังวิเคราะห์..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link
                                to="/"
                                className="px-8 py-4 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors text-lg text-center"
                            >
                                หน้าแรก
                            </Link>
                            <Link
                                to="/salary-aftertax?mode=detailed"
                                className="px-8 py-4 rounded-xl bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors text-lg text-center"
                            >
                                คำนวณอีกครั้ง
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
