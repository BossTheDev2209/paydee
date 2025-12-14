import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection } from "../components/salary/CalculatorComponents";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import TermsModal from "../components/TermsModal";

// Custom Time Combo Box Component - Type, Scroll, or Pick from dropdown
const TimePicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    // Generate time options (every 15 minutes for finer control)
    const timeOptions = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }

    // Sync inputValue with value prop
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Scroll to selected time when dropdown opens
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            const selectedEl = scrollRef.current.querySelector(`[data-value="${value}"]`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
        }
    }, [isOpen, value]);

    // Parse and validate time input
    const parseTimeInput = (input) => {
        // Remove non-digit characters except colon
        let cleaned = input.replace(/[^0-9:]/g, '');

        // Auto-format: if user types 4 digits like "0730", format to "07:30"
        if (cleaned.length === 4 && !cleaned.includes(':')) {
            cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
        }

        // Parse hour:minute
        const parts = cleaned.split(':');
        if (parts.length === 2) {
            let hour = parseInt(parts[0]) || 0;
            let minute = parseInt(parts[1]) || 0;

            // Clamp values
            hour = Math.max(0, Math.min(23, hour));
            minute = Math.max(0, Math.min(59, minute));

            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }

        return null;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Try to parse and apply if valid
        const parsed = parseTimeInput(newValue);
        if (parsed) {
            onChange(parsed);
        }
    };

    // Handle blur - format and validate
    const handleBlur = () => {
        setIsFocused(false);
        const parsed = parseTimeInput(inputValue);
        if (parsed) {
            setInputValue(parsed);
            onChange(parsed);
        } else {
            // Revert to current value if invalid
            setInputValue(value);
        }
    };

    // Handle scroll wheel - adjust time by 15 minutes
    const handleWheel = (e) => {
        e.preventDefault();
        const [hour, minute] = value.split(':').map(Number);
        let totalMinutes = hour * 60 + minute;

        // Scroll up = later time, scroll down = earlier time
        if (e.deltaY < 0) {
            totalMinutes += 15;
        } else {
            totalMinutes -= 15;
        }

        // Wrap around 24 hours
        if (totalMinutes < 0) totalMinutes = 24 * 60 + totalMinutes;
        if (totalMinutes >= 24 * 60) totalMinutes = totalMinutes - 24 * 60;

        const newHour = Math.floor(totalMinutes / 60);
        const newMinute = totalMinutes % 60;
        const newValue = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;

        onChange(newValue);
        setInputValue(newValue);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            handleWheel({ deltaY: -1, preventDefault: () => { } });
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleWheel({ deltaY: 1, preventDefault: () => { } });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleBlur();
            setIsOpen(false);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Combo box input */}
            <div
                className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-[#3d3d3d] border rounded-md transition-all ${isFocused ? 'border-[#ffcc00] ring-2 ring-[#ffcc00]/20' : 'border-gray-200 dark:border-gray-600'
                    }`}
                onWheel={handleWheel}
            >
                <div className="flex items-center gap-3 flex-1">
                    <i className="fa-regular fa-clock text-gray-500 dark:text-gray-400"></i>
                    <span className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => { setIsFocused(true); setIsOpen(true); }}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="07:00"
                        className="w-20 text-xl font-bold text-center bg-transparent text-[#2b2b2b] dark:text-[#ffcc00] outline-none"
                        maxLength={5}
                    />
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 text-gray-400 hover:text-[#ffcc00] transition-colors"
                    >
                        <i className={`fa-solid fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                </div>
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                พิมพ์เวลา, ใช้ลูกศร ↑↓, หรือเลื่อน scroll
            </p>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 mt-1 w-full bg-white dark:bg-[#2b2b2b] rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
                        >
                            <div
                                ref={scrollRef}
                                className="max-h-48 overflow-y-auto py-1"
                            >
                                {timeOptions.map((time) => (
                                    <button
                                        key={time}
                                        data-value={time}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent blur before click
                                            onChange(time);
                                            setInputValue(time);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full py-2 px-4 text-left transition-all ${time === value
                                            ? "bg-[#ffcc00]/20 text-[#2b2b2b] dark:text-[#ffcc00] font-bold"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function SleepCalculator() {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const modeParam = params.get("mode");
    const currentMode = modeParam === "detailed" ? "detailed" : "quick";

    // Quick Mode States
    const [wakeTime, setWakeTime] = useState("07:00");
    const [sleepLatency, setSleepLatency] = useState("15");
    const [activityLevel, setActivityLevel] = useState("medium");

    // Detailed Mode States
    const [weekdayWakeTime, setWeekdayWakeTime] = useState("07:00");
    const [sleepQuality, setSleepQuality] = useState("good");
    const [caffeineAmount, setCaffeineAmount] = useState("none");
    const [nextDayGoal, setNextDayGoal] = useState("normal");

    // Results & UI States
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [selectedCycles, setSelectedCycles] = useState(5);
    const [isResetting, setIsResetting] = useState(false);

    const SLEEP_CYCLE_MINUTES = 90;

    const handleModeChange = (newMode) => {
        setParams({ mode: newMode });
        setResult(null);
    };

    const calculateBedtime = (cycles, timeStr, latency) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const wakeDate = new Date();
        wakeDate.setHours(hour, minute, 0, 0);

        const totalSleepMinutes = cycles * SLEEP_CYCLE_MINUTES;
        const totalWithLatency = totalSleepMinutes + parseInt(latency);

        return new Date(wakeDate.getTime() - totalWithLatency * 60000);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    const calculateQuickMode = () => {
        if (!wakeTime) return;

        setLoading(true);
        setTimeout(() => {
            const options = [];

            for (let cycles = 2; cycles <= 7; cycles++) {
                const bedtime = calculateBedtime(cycles, wakeTime, sleepLatency);
                const totalHours = (cycles * SLEEP_CYCLE_MINUTES) / 60;

                let qualityScore = cycles * 15 + 10;
                if (activityLevel === "heavy") qualityScore -= 10;
                if (activityLevel === "light") qualityScore += 5;
                qualityScore = Math.min(100, Math.max(0, qualityScore));

                options.push({
                    cycles,
                    bedtime: formatTime(bedtime),
                    totalHours: totalHours.toFixed(1),
                    qualityScore,
                    recommended: cycles === 5,
                    danger: cycles < 4
                });
            }

            setResult({
                type: "quick",
                options,
                wakeTime,
                selectedCycles: 5
            });
            setSelectedCycles(5);
            setLoading(false);
        }, 800);
    };

    const calculateDetailedMode = () => {
        if (!weekdayWakeTime) return;

        setLoading(true);
        setTimeout(() => {
            let baseCycles = 5;

            if (sleepQuality === "poor") baseCycles += 0.5;
            if (sleepQuality === "good") baseCycles -= 0.25;

            const caffeine = caffeineAmount === "none" ? 0 : parseInt(caffeineAmount);
            if (caffeine > 2) baseCycles += 0.25;

            if (nextDayGoal === "exam" || nextDayGoal === "study") baseCycles += 0.5;
            if (nextDayGoal === "physical") baseCycles += 0.75;
            if (nextDayGoal === "rest") baseCycles -= 0.25;

            const recommendedCycles = Math.max(4, Math.min(7, Math.round(baseCycles)));

            const scenarios = [];
            for (let cycles = 2; cycles <= 7; cycles++) {
                const bedtime = calculateBedtime(cycles, weekdayWakeTime, sleepLatency);
                const totalHours = (cycles * SLEEP_CYCLE_MINUTES) / 60;

                const mentalScore = calculateMentalScore(cycles, sleepQuality, caffeine);
                const physicalScore = calculatePhysicalScore(cycles, sleepQuality, nextDayGoal);

                scenarios.push({
                    cycles,
                    bedtime: formatTime(bedtime),
                    totalHours: totalHours.toFixed(1),
                    mentalScore,
                    physicalScore,
                    recommended: cycles === recommendedCycles,
                    danger: cycles < 4
                });
            }

            setResult({
                type: "detailed",
                scenarios,
                wakeTime: weekdayWakeTime,
                recommendedCycles,
                recommendations: generateRecommendations(recommendedCycles, sleepQuality, caffeine)
            });
            setSelectedCycles(recommendedCycles);
            setLoading(false);
        }, 800);
    };

    const calculateMentalScore = (cycles, quality, caffeine) => {
        let score = cycles * 15;
        if (quality === "good") score += 10;
        if (quality === "poor") score -= 15;
        if (caffeine > 3) score -= 10;
        return Math.min(100, Math.max(0, score));
    };

    const calculatePhysicalScore = (cycles, quality, goal) => {
        let score = cycles * 14;
        if (quality === "good") score += 15;
        if (quality === "poor") score -= 20;
        if (goal === "physical") score += 10;
        if (goal === "rest") score += 15;
        return Math.min(100, Math.max(0, score));
    };

    const generateRecommendations = (cycles, quality, caffeine) => {
        const recs = [];
        if (cycles < 5) recs.push("พิจารณางีบ 20-30 นาทีช่วงบ่าย (ก่อน 15:00)");
        if (caffeine > 2) recs.push("ลดคาเฟอีน หรือหลีกเลี่ยงหลังเวลา 14:00");
        recs.push("รักษาเวลานอน-ตื่นให้สม่ำเสมอทุกวัน");
        return recs;
    };

    const getAdjustedBedtime = () => {
        if (!result) return null;
        const timeStr = result.type === "quick" ? wakeTime : weekdayWakeTime;
        return calculateBedtime(selectedCycles, timeStr, sleepLatency);
    };

    const handleReset = () => {
        setIsResetting(true);
        setWakeTime("07:00");
        setSleepLatency("15");
        setActivityLevel("medium");
        setWeekdayWakeTime("07:00");
        setSleepQuality("good");
        setCaffeineAmount("none");
        setNextDayGoal("normal");
        setResult(null);
        setSelectedCycles(5);
        setTimeout(() => setIsResetting(false), 1000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        คำนวณเวลานอน
                    </h1>
                    <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
                        หาเวลานอน-ตื่นที่เหมาะกับคุณตาม Sleep Cycle
                    </h3>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <Link to="/" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6">
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
                    <CalculatorCard title={currentMode === "quick" ? "Quick Mode" : "Detailed Mode"}>
                        <CalculatorSection>
                            {/* Wake Time Picker */}
                            <TimePicker
                                value={currentMode === "quick" ? wakeTime : weekdayWakeTime}
                                onChange={(val) => currentMode === "quick" ? setWakeTime(val) : setWeekdayWakeTime(val)}
                                label="ต้องตื่นเวลา"
                            />

                            {/* Sleep Latency */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                                <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                                    ใช้เวลาหลับประมาณ
                                </label>
                                <div className="flex-1 w-full md:w-auto">
                                    <select
                                        value={sleepLatency}
                                        onChange={(e) => setSleepLatency(e.target.value)}
                                        className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3d3d3d] px-3 py-2 text-sm text-[#2b2b2b] dark:text-gray-200 focus:border-[#ffcc00] outline-none"
                                    >
                                        <option value="5">5 นาที</option>
                                        <option value="10">10 นาที</option>
                                        <option value="15">15 นาที (ปกติ)</option>
                                        <option value="20">20 นาที</option>
                                        <option value="30">30 นาที</option>
                                        <option value="45">45 นาที</option>
                                        <option value="60">60 นาที</option>
                                    </select>
                                </div>
                            </div>
                        </CalculatorSection>

                        {/* Quick Mode: Activity Level */}
                        {currentMode === "quick" && (
                            <CalculatorSection title="ระดับกิจกรรม">
                                <div className="space-y-2">
                                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base block">
                                        วันพรุ่งนี้ต้องทำกิจกรรมหนักแค่ไหน
                                    </label>
                                    <RadioGroup
                                        value={activityLevel}
                                        onValueChange={(value) => setActivityLevel(value)}
                                        className="flex flex-wrap gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="light" id="light" />
                                            <Label htmlFor="light" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">เบา (ทำงานออฟฟิศ)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="medium" id="medium" />
                                            <Label htmlFor="medium" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">ปกติ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="heavy" id="heavy" />
                                            <Label htmlFor="heavy" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">หนัก (ออกกำลังกาย/ใช้แรง)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CalculatorSection>
                        )}

                        {/* Detailed Mode: Additional Options */}
                        {currentMode === "detailed" && (
                            <>
                                <CalculatorSection title="คุณภาพการนอน">
                                    <div className="space-y-2">
                                        <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base block">
                                            คุณภาพการนอนช่วงหลัง
                                        </label>
                                        <RadioGroup
                                            value={sleepQuality}
                                            onValueChange={(value) => setSleepQuality(value)}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="good" id="good" />
                                                <Label htmlFor="good" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">ดี</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ok" id="ok" />
                                                <Label htmlFor="ok" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">ปานกลาง</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="poor" id="poor" />
                                                <Label htmlFor="poor" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">แย่</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                                            ดื่มคาเฟอีนวันนี้
                                        </label>
                                        <div className="flex-1 w-full md:w-auto">
                                            <select
                                                value={caffeineAmount}
                                                onChange={(e) => setCaffeineAmount(e.target.value)}
                                                className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3d3d3d] px-3 py-2 text-sm text-[#2b2b2b] dark:text-gray-200 focus:border-[#ffcc00] outline-none"
                                            >
                                                <option value="none">ไม่ดื่ม</option>
                                                <option value="1">1 แก้ว</option>
                                                <option value="2">2 แก้ว</option>
                                                <option value="3">3 แก้ว</option>
                                                <option value="4">4 แก้ว</option>
                                                <option value="5">5+ แก้ว</option>
                                            </select>
                                        </div>
                                    </div>
                                </CalculatorSection>

                                <CalculatorSection title="เป้าหมายวันพรุ่งนี้">
                                    <RadioGroup
                                        value={nextDayGoal}
                                        onValueChange={(value) => setNextDayGoal(value)}
                                        className="flex flex-wrap gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="normal" id="normal" />
                                            <Label htmlFor="normal" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">ปกติ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="study" id="study" />
                                            <Label htmlFor="study" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">เรียน/ทำงาน</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="exam" id="exam" />
                                            <Label htmlFor="exam" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">สอบ/งานสำคัญ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="physical" id="physical" />
                                            <Label htmlFor="physical" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">ออกกำลังกาย</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="rest" id="rest" />
                                            <Label htmlFor="rest" className="text-[#2b2b2b] dark:text-gray-200 cursor-pointer">พักผ่อน</Label>
                                        </div>
                                    </RadioGroup>
                                </CalculatorSection>
                            </>
                        )}

                        {/* Action Buttons - Standard Style */}
                        <div className="mt-8 w-full justify-between flex flex-col md:flex-row gap-4">
                            <button
                                type="button"
                                className="w-full md:w-1/3 py-3 rounded-lg bg-white dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-[#333] transition-colors active:scale-95 duration-200 border border-transparent dark:border-gray-600 shadow-sm"
                                onClick={() => navigate("/")}
                            >
                                กลับหน้าแรก
                            </button>
                            <button
                                type="button"
                                className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 border border-transparent ${isResetting
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    : "bg-white dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] dark:border-gray-600 shadow-sm"
                                    }`}
                                onClick={handleReset}
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
                                className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 shadow-md flex justify-center items-center gap-2 ${loading
                                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    : "bg-[#ffcc00] text-[#2b2b2b] hover:bg-[#e6b800] active:scale-95"
                                    }`}
                                onClick={currentMode === "quick" ? calculateQuickMode : calculateDetailedMode}
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
                    </CalculatorCard>
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
                                        {/* Main Result Display */}
                                        <div className="text-center mb-6">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3, type: "spring" }}
                                            >
                                                {selectedCycles < 4 && (
                                                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
                                                        <p className="text-red-600 dark:text-red-400 font-bold text-sm">
                                                            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                                                            คำเตือน: การนอนน้อยกว่า 6 ชั่วโมงอาจส่งผลเสียต่อสุขภาพ
                                                        </p>
                                                    </div>
                                                )}
                                                <p className="text-lg mb-2 text-[#2b2b2b] dark:text-gray-200">ควรเข้านอนเวลา</p>
                                                <p className="text-5xl md:text-6xl font-black text-[#ffcc00]">
                                                    {getAdjustedBedtime() ? formatTime(getAdjustedBedtime()) : "--:--"}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                                    ({selectedCycles} รอบนอน = {(selectedCycles * 1.5).toFixed(1)} ชั่วโมง)
                                                </p>
                                            </motion.div>
                                        </div>

                                        {/* Cycle Selector with Danger Zone */}
                                        <div className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-gray-200 mb-4">
                                                ปรับจำนวนรอบนอน
                                            </h3>

                                            {/* Danger Zone Label */}
                                            <div className="flex items-center gap-4 mb-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">นอนน้อยเกินไป</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">แนะนำ</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-6 gap-2">
                                                {[2, 3, 4, 5, 6, 7].map((cycles) => {
                                                    const isDanger = cycles < 4;
                                                    const isRecommended = result.type === "detailed"
                                                        ? cycles === result.recommendedCycles
                                                        : cycles === 5;
                                                    return (
                                                        <button
                                                            key={cycles}
                                                            onClick={() => setSelectedCycles(cycles)}
                                                            className={`py-3 rounded-xl font-semibold transition-all relative ${selectedCycles === cycles
                                                                ? isDanger
                                                                    ? "bg-red-500 text-white shadow-lg ring-2 ring-red-300"
                                                                    : "bg-[#ffcc00] text-[#2b2b2b] shadow-lg"
                                                                : isDanger
                                                                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50"
                                                                    : "bg-gray-100 dark:bg-[#3d3d3d] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#4d4d4d]"
                                                                }`}
                                                        >
                                                            <div className="text-lg font-black">{cycles}</div>
                                                            <div className="text-[10px] opacity-75">{(cycles * 1.5).toFixed(1)}ชม.</div>
                                                            {isRecommended && !isDanger && (
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                                    <i className="fa-solid fa-check text-[8px] text-white"></i>
                                                                </div>
                                                            )}
                                                            {isDanger && (
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                                                                    <i className="fa-solid fa-exclamation text-[8px] text-white"></i>
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Duration Bar */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    <span>ระยะเวลานอน</span>
                                                    <span className="font-bold">{(selectedCycles * 1.5).toFixed(1)} ชั่วโมง</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-3 rounded-full transition-all duration-300 ${selectedCycles < 4 ? "bg-red-500" : "bg-[#ffcc00]"
                                                            }`}
                                                        style={{ width: `${Math.min(100, (selectedCycles * 1.5 / 10) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    <span>3 ชม.</span>
                                                    <span className="text-green-600 dark:text-green-400 font-semibold">แนะนำ 7-8 ชม.</span>
                                                    <span>10 ชม.</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quality Scores (Detailed Only) */}
                                        {result.type === "detailed" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50"
                                            >
                                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-gray-200 mb-4">
                                                    คะแนนคุณภาพ (ประมาณการ)
                                                </h3>

                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-700 dark:text-gray-300">สมาธิ / Mental Clarity</span>
                                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                                {calculateMentalScore(selectedCycles, sleepQuality, caffeineAmount === "none" ? 0 : parseInt(caffeineAmount))}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                            <div
                                                                className="bg-blue-500 h-3 rounded-full transition-all"
                                                                style={{ width: `${calculateMentalScore(selectedCycles, sleepQuality, caffeineAmount === "none" ? 0 : parseInt(caffeineAmount))}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-700 dark:text-gray-300">ฟื้นฟูร่างกาย / Physical Recovery</span>
                                                            <span className="font-bold text-green-600 dark:text-green-400">{calculatePhysicalScore(selectedCycles, sleepQuality, nextDayGoal)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                            <div
                                                                className="bg-green-500 h-3 rounded-full transition-all"
                                                                style={{ width: `${calculatePhysicalScore(selectedCycles, sleepQuality, nextDayGoal)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Recommendations */}
                                        {result.type === "detailed" && result.recommendations && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6"
                                            >
                                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-gray-200 mb-4">
                                                    คำแนะนำ
                                                </h3>
                                                <ul className="space-y-2">
                                                    {result.recommendations.map((rec, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                            <span className="w-2 h-2 rounded-full bg-[#ffcc00] mt-2 flex-shrink-0"></span>
                                                            <span>{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </CalculatorCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Terms Modal */}
            <TermsModal
                isOpen={modal}
                onClose={() => setModal(false)}
                onAccept={() => setModal(false)}
                onReject={() => setModal(false)}
                calculatorType={null}
                showButtons={false}
            />
        </section>
    );
}
