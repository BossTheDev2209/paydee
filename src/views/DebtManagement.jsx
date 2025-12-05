import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { CalculatorCard, CalculatorSection, CalculatorInput } from "@/components/salary/CalculatorComponents";
import { motion, AnimatePresence } from "framer-motion";
import SlotCounter from "@/components/ui/SlotCounter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Line, ReferenceLine, CartesianGrid, Legend } from 'recharts';
import TermsModal from "@/components/TermsModal";

export default function DebtManagement() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("quick"); // 'quick' | 'detailed'
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    // Quick Mode State
    const [quickState, setQuickState] = useState({
        principal: "",
        interest: "",
        calculationType: "days",
        targetValue: ""
    });

    // Detailed Mode State
    const [detailedState, setDetailedState] = useState({
        balance: "",
        apr: "",
        minPayment: "",
        extraPayment: ""
    });

    const handleQuickChange = (field, value) => {
        setQuickState(prev => ({ ...prev, [field]: value }));
        setResult(null);
    };

    const handleDetailedChange = (field, value) => {
        setDetailedState(prev => ({ ...prev, [field]: value }));
        setResult(null);
    };

    const resetForm = () => {
        setIsResetting(true);
        setTimeout(() => setIsResetting(false), 1000);
        setQuickState({
            principal: "",
            interest: "",
            calculationType: "days",
            targetValue: ""
        });
        setDetailedState({
            balance: "",
            apr: "",
            minPayment: "",
            extraPayment: ""
        });
        setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculate = () => {
        setLoading(true);
        setResult(null);

        setTimeout(() => {
            if (mode === "quick") {
                calculateQuick();
            } else {
                calculateDetailed();
            }
            setLoading(false);
        }, 600);
    };

    const calculateQuick = () => {
        const principal = parseFloat(String(quickState.principal).replace(/,/g, "")) || 0;
        const interestVal = parseFloat(String(quickState.interest).replace(/,/g, "")) || 0;
        const target = parseFloat(String(quickState.targetValue).replace(/,/g, "")) || 0;

        const totalInterest = principal * (interestVal / 100);
        const totalDebt = principal + totalInterest;

        let computedResult = 0;
        let label = "";

        if (quickState.calculationType === "days") {
            if (target > 0) {
                computedResult = Math.ceil(totalDebt / target);
                label = "จำนวนวันที่ต้องผ่อน";
            }
        } else {
            if (target > 0) {
                computedResult = Math.ceil(totalDebt / target);
                label = "ยอดผ่อนต่อวัน";
            }
        }

        setResult({
            totalDebt,
            totalInterest,
            principal,
            computedResult,
            label,
            type: "quick"
        });
    };

    const simulateDebt = (balance, apr, payment) => {
        let currentBalance = balance;
        let totalInterest = 0;
        let months = 0;
        let isInfinite = false;
        const history = [];

        history.push({ month: 0, balance: Math.round(currentBalance) });

        const maxMonths = 360;

        while (currentBalance > 0) {
            months++;
            const monthlyInterest = currentBalance * (apr / 100) / 12;

            if (payment <= monthlyInterest) {
                isInfinite = true;
                break;
            }

            const principalPaid = payment - monthlyInterest;
            currentBalance -= principalPaid;
            totalInterest += monthlyInterest;

            if (currentBalance < 0) currentBalance = 0;

            history.push({ month: months, balance: Math.round(currentBalance) });

            if (months >= maxMonths) {
                isInfinite = true;
                break;
            }
        }

        return { months, totalInterest, isInfinite, history };
    };

    const calculateDetailed = () => {
        const balance = parseFloat(String(detailedState.balance).replace(/,/g, "")) || 0;
        const apr = parseFloat(String(detailedState.apr).replace(/,/g, "")) || 0;
        const minPayment = parseFloat(String(detailedState.minPayment).replace(/,/g, "")) || 0;
        const extraPayment = parseFloat(String(detailedState.extraPayment).replace(/,/g, "")) || 0;

        // Scenario A: Minimum Payment
        const scenarioA = simulateDebt(balance, apr, minPayment);

        // Scenario B: Minimum + Extra
        const totalPaymentB = minPayment + extraPayment;
        const scenarioB = simulateDebt(balance, apr, totalPaymentB);

        // Merge Data for Chart
        const maxMonths = Math.max(scenarioA.months, scenarioB.months);
        const chartData = [];

        const step = Math.ceil(maxMonths / 50) || 1;

        for (let m = 0; m <= maxMonths; m++) {
            if (m % step === 0 || m === scenarioA.months || m === scenarioB.months) {
                let balA = 0;
                if (m < scenarioA.history.length) balA = scenarioA.history[m].balance;
                else if (scenarioA.isInfinite) balA = scenarioA.history[scenarioA.history.length - 1].balance;
                else balA = 0;

                let balB = 0;
                if (m < scenarioB.history.length) balB = scenarioB.history[m].balance;
                else if (scenarioB.isInfinite) balB = scenarioB.history[scenarioB.history.length - 1].balance;
                else balB = 0;

                chartData.push({
                    month: m,
                    balanceA: balA,
                    balanceB: balB
                });
            }
        }

        setResult({
            scenarioA,
            scenarioB,
            difference: {
                monthsSaved: scenarioA.months - scenarioB.months,
                interestSaved: scenarioA.totalInterest - scenarioB.totalInterest
            },
            chartData,
            type: "detailed"
        });
    };

    useEffect(() => {
        if (result) {
            setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [result]);

    const fillExampleData = () => {
        if (mode === "quick") {
            setQuickState({
                principal: "10,000",
                interest: "5",
                calculationType: "days",
                targetValue: "300"
            });
        } else {
            setDetailedState({
                balance: "50,000",
                apr: "16",
                minPayment: "3,000",
                extraPayment: "1,000"
            });
        }
        setResult(null);
    };

    return (
        <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
            {/* Header */}
            <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
                        จัดการหนี้สิน
                    </h1>
                    <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
                        วางแผนการชำระหนี้ไม่ว่าจะเป็นหนี้เพื่อน หรือหนี้ธนาคาร
                    </h3>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <Link to="/" className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6">
                    <i className="fa-solid fa-arrow-left-long mr-2"></i>
                    กลับหน้าหลัก
                </Link>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-[#2b2b2b] p-1.5 rounded-full shadow-sm inline-flex">
                        <button
                            onClick={() => { setMode("quick"); setResult(null); }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === "quick"
                                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-md"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                }`}
                        >
                            หนี้ทั่วไป (Quick)
                        </button>
                        <button
                            onClick={() => { setMode("detailed"); setResult(null); }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === "detailed"
                                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-md"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                }`}
                        >
                            หนี้ธนาคาร (Detailed)
                        </button>
                    </div>
                </div>

                {/* Input Forms */}
                <div className="mb-10">
                    {mode === "quick" ? (
                        <CalculatorCard title={
                            <div className="flex justify-between items-center w-full">
                                <span>Quick Mode (หนี้ทั่วไป)</span>
                            </div>
                        }>
                            <div onKeyDown={(e) => e.key === "Enter" && calculate()}>
                                <CalculatorSection>
                                    {/* Principal */}
                                    <CalculatorInput
                                        label="ยอดหนี้เงินต้น"
                                        name="principal"
                                        value={quickState.principal}
                                        onChange={(e) => handleQuickChange("principal", e.target.value)}
                                        setFieldValue={handleQuickChange}
                                        placeholder="ระบุยอดหนี้..."
                                        unit="บาท"
                                    />

                                    {/* Interest (Fixed to %) */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 relative">
                                        <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                                            ดอกเบี้ย (ต่อปี)
                                        </label>
                                        <div className="flex-1 w-full md:w-auto relative flex items-center gap-2">
                                            <Input
                                                type="text"
                                                value={quickState.interest}
                                                onChange={(e) => handleQuickChange("interest", e.target.value.replace(/[^0-9.]/g, ""))}
                                                placeholder="ระบุดอกเบี้ย..."
                                                className="w-full"
                                            />
                                            <span className="absolute right-3 text-gray-500">%</span>
                                        </div>
                                        <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[100px] text-right hidden md:block">
                                            {/* unit placeholder spacing */}
                                        </span>
                                    </div>

                                    {/* Toggle Calculation Type */}
                                    <div>
                                        <div className="bg-gray-100/50 dark:bg-[#444]/30 p-1.5 rounded-xl flex gap-1">
                                            <button
                                                onClick={() => handleQuickChange("calculationType", "days")}
                                                className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${quickState.calculationType === "days"
                                                    ? "bg-white dark:bg-[#555] text-[#ffcc00] shadow-sm border border-gray-200 dark:border-gray-500 font-bold"
                                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-200/50"
                                                    }`}
                                            >
                                                จ่ายวันละ X บาท<br /><span className="text-xs opacity-70">(หาจำนวนวัน)</span>
                                            </button>
                                            <button
                                                onClick={() => handleQuickChange("calculationType", "payment")}
                                                className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${quickState.calculationType === "payment"
                                                    ? "bg-white dark:bg-[#555] text-[#ffcc00] shadow-sm border border-gray-200 dark:border-gray-500 font-bold"
                                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-200/50"
                                                    }`}
                                            >
                                                จ่ายภายใน Y วัน<br /><span className="text-xs opacity-70">(หายอดผ่อน)</span>
                                            </button>
                                        </div>
                                    </div>

                                    <CalculatorInput
                                        label={quickState.calculationType === "days" ? "จำนวนเงินที่จ่ายไหวต่อวัน" : "จำนวนวันที่ต้องการผ่อนให้หมด"}
                                        name="targetValue"
                                        value={quickState.targetValue}
                                        onChange={(e) => handleQuickChange("targetValue", e.target.value)}
                                        setFieldValue={handleQuickChange}
                                        placeholder={quickState.calculationType === "days" ? "เช่น 100" : "เช่น 30"}
                                        unit={quickState.calculationType === "days" ? "บาท" : "วัน"}
                                    />
                                </CalculatorSection>
                            </div>
                        </CalculatorCard>
                    ) : (
                        <CalculatorCard title={
                            <div className="flex justify-between items-center w-full">
                                <span>Detailed Mode (หนี้ธนาคาร)</span>
                            </div>
                        }>
                            <div onKeyDown={(e) => e.key === "Enter" && calculate()}>
                                <CalculatorSection title="ข้อมูลหนี้สิน">
                                    <CalculatorInput
                                        label="ยอดหนี้คงเหลือปัจจุบัน"
                                        name="balance"
                                        value={detailedState.balance}
                                        onChange={(e) => handleDetailedChange("balance", e.target.value)}
                                        setFieldValue={handleDetailedChange}
                                        placeholder="เช่น 50,000"
                                        unit="บาท"
                                    />
                                    <CalculatorInput
                                        label="อัตราดอกเบี้ยต่อปี (APR)"
                                        name="apr"
                                        value={detailedState.apr}
                                        onChange={(e) => handleDetailedChange("apr", e.target.value)}
                                        setFieldValue={handleDetailedChange}
                                        placeholder="เช่น 16"
                                        unit="%"
                                    />
                                </CalculatorSection>

                                <CalculatorSection title="แผนการชำระคืน">
                                    <CalculatorInput
                                        label="ยอดขั้นต่ำต่อเดือน (Minimum)"
                                        name="minPayment"
                                        value={detailedState.minPayment}
                                        onChange={(e) => handleDetailedChange("minPayment", e.target.value)}
                                        setFieldValue={handleDetailedChange}
                                        placeholder="เช่น 3,000"
                                        unit="บาท"
                                    />
                                    <CalculatorInput
                                        label="ยอดโปะเพิ่มต่อเดือน (Extra)"
                                        name="extraPayment"
                                        value={detailedState.extraPayment}
                                        onChange={(e) => handleDetailedChange("extraPayment", e.target.value)}
                                        setFieldValue={handleDetailedChange}
                                        placeholder="เช่น 1,000"
                                        unit="บาท"
                                    />
                                </CalculatorSection>
                            </div>
                        </CalculatorCard>
                    )}

                    {/* Reused Action Buttons Layout */}
                    <div className="mt-8 w-full justify-between flex flex-col md:flex-row gap-4">
                        <button
                            type="button"
                            className="w-full md:w-1/3 py-3 rounded-lg bg-white dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-[#333] transition-colors active:scale-95 duration-200 border border-transparent shadow-sm"
                            onClick={() => navigate("/")}
                        >
                            กลับหน้าแรก
                        </button>
                        <button
                            type="button"
                            className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 ${isResetting
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                }`}
                            onClick={resetForm}
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
                            disabled={loading}
                            onClick={calculate}
                            className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 shadow-md flex justify-center items-center gap-2 ${loading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#ffcc00] text-[#2b2b2b] hover:bg-[#e6b800] active:scale-95"
                                }`}
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

                {/* Results Section */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            id="result-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Result Card */}
                            <CalculatorCard title={
                                <div className="flex items-center gap-2 justify-center">
                                    <span>สรุปผลการวางแผน</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setInfoModalOpen(true); }}
                                        className="text-[#2b2b2b] hover:scale-110 transition-transform"
                                    >
                                        <i className="fa-solid fa-circle-info text-lg"></i>
                                    </button>
                                </div>
                            }>
                                {mode === "quick" ? (
                                    <div className="space-y-8">
                                        <div className="text-center">
                                            <p className="text-gray-500 dark:text-gray-400 mb-2">{result.label}</p>
                                            <div className="text-4xl md:text-5xl font-bold text-[#2b2b2b] dark:text-white">
                                                <SlotCounter value={result.computedResult} />
                                                <span className="text-2xl ml-2 font-normal">
                                                    {quickState.calculationType === "days" ? "วัน" : "บาท"}
                                                </span>
                                            </div>
                                            {quickState.calculationType === "days" && (
                                                <p className="text-sm text-gray-400 mt-2">
                                                    (ประมาณ {(result.computedResult / 30).toFixed(1)} เดือน)
                                                </p>
                                            )}
                                        </div>

                                        <div className="h-64 md:h-80 w-full">
                                            <p className="text-center mb-4 font-semibold text-gray-600 dark:text-gray-300">สัดส่วนเงินต้น vs ดอกเบี้ย</p>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={[
                                                        { name: 'เงินต้น', value: result.principal, fill: '#67B8FF' },
                                                        { name: 'ดอกเบี้ย', value: result.totalInterest, fill: '#FF8CA2' },
                                                    ]}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                                    <XAxis dataKey="name" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                                                    <YAxis tickFormatter={(val) => `฿${val / 1000}k`} tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        formatter={(value) => `฿${value.toLocaleString()}`}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                                        {
                                                            [{ fill: '#67B8FF' }, { fill: '#FF8CA2' }].map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                            ))
                                                        }
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="bg-gray-100 dark:bg-[#333] p-4 rounded-xl flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">ยอดหนี้รวมทั้งหมด</span>
                                            <span className="text-xl font-bold text-[#2b2b2b] dark:text-white">
                                                ฿{result.totalDebt.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Detailed Result A/B Comparison */}
                                        {result.scenarioA.isInfinite && result.scenarioB.isInfinite ? (
                                            <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                                                <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
                                                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">หนี้นี้ไม่มีวันหมด!</h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    แม้จะโปะเพิ่มแล้ว ยอดผ่อนก็ยังน้อยกว่าดอกเบี้ย กรุณาเพิ่มยอดผ่อนต่อเดือนให้มากกว่านี้
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-1 gap-6">
                                                    {/* Summary Card */}
                                                    <div className="rounded-xl p-6 border-2 border-emerald-400 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
                                                        <div className="flex flex-col items-center text-center">
                                                            <p className="text-sm opacity-90 mb-2">ประหยัดดอกเบี้ยได้ทั้งหมด</p>
                                                            <p className="text-3xl md:text-5xl font-bold mb-2">
                                                                ฿{Math.round(result.difference.interestSaved || 0).toLocaleString()}
                                                            </p>
                                                            {result.difference.monthsSaved > 0 && (
                                                                <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                                                                    ผ่อนหมดเร็วขึ้น {result.difference.monthsSaved} เดือน
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Detailed Comparison Grid */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Scenario A (Base) */}
                                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent">
                                                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">จ่ายขั้นต่ำ</div>
                                                            <div className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200">
                                                                {result.scenarioA.isInfinite ? "∞" : `${result.scenarioA.months} เดือน`}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">ดอกเบี้ย ฿{Math.round(result.scenarioA.totalInterest).toLocaleString()}</div>
                                                        </div>

                                                        {/* Scenario B (Extra) */}
                                                        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-[#ffcc00]">
                                                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">จ่ายโปะเพิ่ม</div>
                                                            <div className="text-xl md:text-2xl font-bold text-[#2b2b2b] dark:text-white">
                                                                {result.scenarioB.isInfinite ? "∞" : `${result.scenarioB.months} เดือน`}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">ดอกเบี้ย ฿{Math.round(result.scenarioB.totalInterest).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-64 w-full mt-6 bg-white dark:bg-[#1e1e1e] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <p className="text-center mb-4 font-semibold text-gray-600 dark:text-gray-300">กราฟเปรียบเทียบยอดหนี้คงเหลือ</p>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={result.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                                                            <defs>
                                                                <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.5} />
                                                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                                                </linearGradient>
                                                                <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.8} />
                                                                    <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                                            <XAxis dataKey="month" hide />
                                                            <YAxis tickFormatter={(val) => `฿${val / 1000}k`} tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                                                            <Tooltip
                                                                formatter={(value) => `฿${value.toLocaleString()}`}
                                                                labelFormatter={(label) => `เดือนที่ ${label}`}
                                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                            />
                                                            <Legend verticalAlign="top" height={36} iconType="circle" />
                                                            <Area type="monotone" name="จ่ายขั้นต่ำ" dataKey="balanceA" stroke="#94a3b8" fillOpacity={1} fill="url(#colorA)" />
                                                            <Area type="monotone" name="จ่ายโปะเพิ่ม" dataKey="balanceB" stroke="#ffcc00" fillOpacity={1} fill="url(#colorB)" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors text-center w-full md:w-auto"
                                    >
                                        กลับหน้าแรก
                                    </button>
                                    <button
                                        onClick={() => {
                                            setResult(null);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="px-6 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors text-center w-full md:w-auto"
                                    >
                                        คำนวณอีกครั้ง
                                    </button>
                                </div>
                            </CalculatorCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Modal */}
                <TermsModal
                    isOpen={infoModalOpen}
                    onClose={() => setInfoModalOpen(false)}
                    onAccept={() => setInfoModalOpen(false)}
                    onReject={() => setInfoModalOpen(false)}
                    calculatorType="debt-management"
                    showButtons={true}
                />
            </div>
        </section>
    );
}
