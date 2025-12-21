import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection } from "../components/salary/CalculatorComponents";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import TermsModal from "../components/TermsModal";

// Circular Time Picker Component
const CircularTimePicker = ({ value, onChange, label }) => {
    const boxSize = 250;
    const center = boxSize / 2;
    const radius = 90;
    const handleRadius = 15;
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Parse time "HH:mm" to degrees (0-360) for 24h clock
    // 0 deg = 00:00 (Top), 180 deg = 12:00 (Bottom)
    const timeToDegrees = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        const totalMinutes = h * 60 + m; // 0 to 1439
        return (totalMinutes / 1440) * 360;
    };

    // Calculate position from degrees
    const getPosition = (degrees) => {
        const rad = (degrees - 90) * (Math.PI / 180); // -90 to start at top
        return {
            x: center + radius * Math.cos(rad),
            y: center + radius * Math.sin(rad)
        };
    };

    const handleStart = (e) => {
        setIsDragging(true);
        updateTimeFromEvent(e);
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    const handleMove = (e) => {
        if (isDragging) {
            updateTimeFromEvent(e);
        }
    };

    const updateTimeFromEvent = (e) => {
        if (!containerRef.current) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left - center;
        const y = clientY - rect.top - center;

        // Calculate angle
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        // Snap to nearest 15 mins (approx 3.75 degrees)
        // 1 day = 1440 mins. 360 deg = 1440 mins.
        // 1 degree = 4 mins.
        // 15 mins = 3.75 deg.
        
        const totalMinutes = Math.round((angle / 360) * 1440);
        const snappedMinutes = Math.round(totalMinutes / 15) * 15;
        
        // Normalize back to day
        let finalMinutes = snappedMinutes % 1440;
        
        const h = Math.floor(finalMinutes / 60);
        const m = finalMinutes % 60;
        
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        onChange(timeStr);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    const degrees = timeToDegrees(value);
    const pos = getPosition(degrees);

    // Generate hour markers
    const markers = [];
    for (let i = 0; i < 24; i+=2) { // Every 2 hours
        const deg = (i / 24) * 360;
        const rad = (deg - 90) * (Math.PI / 180);
        const outerR = radius + 25;
        const tx = center + outerR * Math.cos(rad);
        const ty = center + outerR * Math.sin(rad);
        markers.push({ num: i, x: tx, y: ty });
    }

    return (
        <div className="flex flex-col items-center select-none space-y-4">
             <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-lg">
                {label}
            </label>
            <div 
                ref={containerRef}
                className="relative cursor-pointer touch-none"
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                style={{ width: boxSize, height: boxSize }}
            >
                {/* Clock Face Background */}
                <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-[#2b2b2b] shadow-inner border border-gray-200 dark:border-gray-600"></div>
                
                {/* SVG Layer */}
                <svg width={boxSize} height={boxSize} className="absolute inset-0 pointer-events-none">
                    {/* Markers */}
                    {markers.map(m => (
                        <text 
                            key={m.num} 
                            x={m.x} 
                            y={m.y} 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            className="text-xs font-bold fill-gray-400 dark:fill-gray-500"
                        >
                            {m.num}
                        </text>
                    ))}
                    
                    {/* Active Arc (optional, maybe nice to show 'day' progress but simpler is just a hand) */}
                    
                    {/* Clock Hand / Knob Line */}
                    <line 
                        x1={center} 
                        y1={center} 
                        x2={pos.x} 
                        y2={pos.y} 
                        stroke="#ffcc00" 
                        strokeWidth="2" 
                    />
                    
                    {/* Center Point */}
                    <circle cx={center} cy={center} r="4" fill="#ffcc00" />
                </svg>

                {/* Draggable Knob */}
                <div 
                    className="absolute w-8 h-8 bg-white dark:bg-[#3d3d3d] border-4 border-[#ffcc00] rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-110 transition-transform"
                    style={{ 
                        left: pos.x - 16, 
                        top: pos.y - 16,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-[#ffcc00] rounded-full"></div>
                </div>

                {/* Digital Time Center Display */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-3xl font-black text-[#2b2b2b] dark:text-white bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-1 rounded-xl">
                        {value}
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-500">หมุนเพื่อเลือกเวลา</p>
        </div>
    );
};

// Sleep Cycle Timeline Component
const SleepCycleTimeline = ({ cycles, bedtime, wakeTime }) => {
    // Cycles = number of 90 min cycles
    // Start Time = bedtime
    // End Time = wakeTime (or calculated from bedtime + cycles)
    
    const cycleData = [];
    const startTimeDate = new Date();
    const [startH, startM] = bedtime?.split(':').map(Number) || [0,0];
    startTimeDate.setHours(startH, startM, 0, 0);

    let currentTime = new Date(startTimeDate);

    for (let i = 0; i < cycles; i++) {
        const cycleStart = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + 90);
        const cycleEnd = new Date(currentTime);
        
        let label = "Light Sleep";
        let colorClass = "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700";
        let textClass = "text-blue-700 dark:text-blue-300";
        
        // Simple logic for stages
        if (i < 2) {
            label = "Deep Sleep";
            colorClass = "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-700";
            textClass = "text-indigo-700 dark:text-indigo-300";
        } else if (i >= cycles - 1) {
            label = "REM / Wake";
            colorClass = "bg-[#ffcc00]/20 border-[#ffcc00]/50";
            textClass = "text-yellow-700 dark:text-yellow-400";
        }

        cycleData.push({
            id: i + 1,
            start: cycleStart,
            end: cycleEnd,
            label,
            colorClass,
            textClass
        });
    }

    const formatTimeShort = (date) => {
        return date.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="w-full mt-6">
            <h4 className="font-bold text-[#2b2b2b] dark:text-gray-200 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-simple text-[#ffcc00]"></i>
                Timeline การนอนของคุณ
            </h4>
            <div className="relative pt-6 pb-2">
                {/* Timeline Axis Line */}
                <div className="absolute left-0 right-0 h-px bg-gray-300 dark:bg-gray-600 top-[2.75rem] z-0"></div>

                <div className="flex w-full gap-1 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {cycleData.map((cycle, idx) => (
                        <motion.div 
                            key={cycle.id}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative flex-1 min-w-[80px] h-20 rounded-lg border-2 ${cycle.colorClass} flex flex-col items-center justify-center p-2 z-10 snap-center group transition-all hover:scale-105`}
                        >
                            {/* Start Time Label (Above) */}
                            {idx === 0 && (
                                <div className="absolute -top-8 left-0 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#2b2b2b] px-1 rounded">
                                    {formatTimeShort(cycle.start)}
                                </div>
                            )}
                            
                            {/* End Time Label (Above - for all) */}
                            <div className="absolute -top-8 -right-4 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#2b2b2b] px-1 rounded shadow-sm">
                                {formatTimeShort(cycle.end)}
                            </div>

                            <span className="text-xs font-bold opacity-50 mb-1">Cycle {cycle.id}</span>
                            <span className={`text-[10px] md:text-xs font-bold text-center leading-tight ${cycle.textClass}`}>
                                {cycle.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
                
                <div className="flex justify-between mt-2 px-1">
                     <div className="text-xs text-gray-400">
                        <i className="fa-solid fa-bed mr-1"></i>
                        เข้านอน {bedtime}
                     </div>
                     <div className="text-xs text-[#ffcc00] font-bold">
                        <i className="fa-solid fa-sun mr-1"></i>
                        ตื่น {wakeTime}
                     </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2 justify-center text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded"></div> Deep Sleep
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div> Light Sleep
                </div>
                <div className="flex items-center gap-1">
                     <div className="w-3 h-3 bg-[#ffcc00]/20 border border-[#ffcc00]/50 rounded"></div> REM/Wake
                </div>
            </div>
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
    const [lastCaffeineTime, setLastCaffeineTime] = useState("14:00");
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

            // Adjust base cycles based on quality and goal
            if (sleepQuality === "poor") baseCycles += 0.5;
            if (sleepQuality === "good") baseCycles -= 0.25;

            const caffeine = caffeineAmount === "none" ? 0 : parseInt(caffeineAmount);
            
            // Goal Impact
            if (nextDayGoal === "exam" || nextDayGoal === "study") baseCycles += 0.5; // Needs REM (more cycles)
            if (nextDayGoal === "physical") baseCycles += 0.75; // Needs Deep Sleep + Duration
            if (nextDayGoal === "rest") baseCycles -= 0.25;

            const recommendedCycles = Math.max(4, Math.min(7, Math.round(baseCycles)));

            const scenarios = [];
            for (let cycles = 2; cycles <= 7; cycles++) {
                const bedtime = calculateBedtime(cycles, weekdayWakeTime, sleepLatency);
                const totalHours = (cycles * SLEEP_CYCLE_MINUTES) / 60;

                // Calculate metrics for Radar Chart
                const metrics = calculateMetrics(cycles, sleepQuality, caffeine, nextDayGoal);

                scenarios.push({
                    cycles,
                    bedtime: formatTime(bedtime),
                    totalHours: totalHours.toFixed(1),
                    metrics,
                    recommended: cycles === recommendedCycles,
                    danger: cycles < 4
                });
            }

            setResult({
                type: "detailed",
                scenarios,
                wakeTime: weekdayWakeTime,
                recommendedCycles,
                recommendations: generateRecommendations(recommendedCycles, sleepQuality, caffeine, nextDayGoal, lastCaffeineTime)
            });
            setSelectedCycles(recommendedCycles);
            setLoading(false);
        }, 800);
    };

    const calculateMetrics = (cycles, quality, caffeine, goal) => {
        // Base scores
        let memory = cycles * 15;
        let focus = cycles * 16;
        let energy = cycles * 14;
        let recovery = cycles * 15;

        // Quality Modifiers
        if (quality === "good") {
            memory += 10; focus += 10; energy += 15; recovery += 15;
        } else if (quality === "poor") {
            memory -= 15; focus -= 20; energy -= 20; recovery -= 10;
        }

        // Caffeine Impact (Negative on deep sleep/recovery if high)
        if (caffeine > 2) {
            recovery -= 15;
            energy += 5; // Temporary boost but crash later, simplistic model: negative overall quality
        }

        // Goal Specific Bonus (If matching goal found, simulate 'preparedness')
        if (goal === "exam" || goal === "study") {
            // Study goals need REM, effectively higher cycles boost memory more
            if (cycles >= 5) memory += 10;
        }
        if (goal === "physical") {
            if (cycles >= 5) recovery += 10;
        }

        return {
            Memory: Math.min(100, Math.max(0, memory)),
            Focus: Math.min(100, Math.max(0, focus)),
            Energy: Math.min(100, Math.max(0, energy)),
            Recovery: Math.min(100, Math.max(0, recovery)),
        };
    };

    const generateRecommendations = (cycles, quality, caffeine, goal, lastCafTime) => {
        const recs = [];
        
        // Goal Specific Advice
        if (goal === "exam" || goal === "study") {
            recs.push("การนอนครบ 5-6 รอบ (7.5-9 ชม.) จะช่วยเพิ่ม REM Sleep ซึ่งสำคัญต่อความจำและการเรียนรู้");
        } else if (goal === "physical") {
            recs.push("Deep Sleep ช่วงต้นคืนสำคัญมากสำหรับการฟื้นฟูกล้ามเนื้อ พยายามเข้านอนให้ตรงเวลา");
        }

        // Caffeine Advice
        if (caffeine > 0) {
            const [h, m] = lastCafTime.split(':').map(Number);
            const cafTimeVal = h + m/60;
            // Assuming bedtime around 22:00 - 24:00 (generic check)
            if (cafTimeVal > 14) {
                 recs.push(`คุณดื่มคาเฟอีนหลังบ่าย 2 (${lastCafTime}) อาจรบกวน Deep Sleep ลองเลื่อนเวลาดื่มให้เร็วขึ้นในวันถัดไป`);
            }
        }

        if (cycles < 5) recs.push("หากนอนน้อยกว่าที่แนะนำ ลองหาเวลางีบ 20 นาทีช่วงบ่ายเพื่อบูสต์พลังงาน");
        
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

                {/* Important Knowledge Banner - Similar to Ai-Port */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8 shadow-sm">
                    <div className="flex items-start">
                        <i className="fa-solid fa-circle-info text-blue-500 mt-1 mr-3 text-lg"></i>
                        <div>
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">ข้อที่ควรรู้ก่อนการคำนวณ</h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed list-disc ml-4 space-y-1">
                                <li>การนอนหลับของคนปกติจะเป็นรอบ (Sleep Cycle) รอบละประมาณ 90 นาที</li>
                                <li>การตื่นในช่วงรอยต่อของรอบการนอน จะทำให้รู้สึกสดชื่นที่สุด (ไม่งัวเงีย)</li>
                                <li>เวลาที่คำนวณได้เป็นเพียงการประมาณการทางสถิติ ร่างกายแต่ละคนอาจแตกต่างกันเล็กน้อย</li>
                            </ul>
                        </div>
                    </div>
                </div>

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
                            <div className="flex justify-center mb-6">
                                <CircularTimePicker
                                    value={currentMode === "quick" ? wakeTime : weekdayWakeTime}
                                    onChange={(val) => currentMode === "quick" ? setWakeTime(val) : setWeekdayWakeTime(val)}
                                    label="คุณต้องการตื่นกี่โมง?"
                                />
                            </div>

                            {/* Sleep Latency Slider */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base">
                                        ใช้เวลาหลับประมาณ
                                    </label>
                                    <span className="text-[#ffcc00] font-bold text-lg">{sleepLatency} นาที</span>
                                </div>
                                
                                <input 
                                    type="range"
                                    min="5"
                                    max="60"
                                    step="5"
                                    value={sleepLatency}
                                    onChange={(e) => setSleepLatency(e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-[#ffcc00]"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                   <i className="fa-solid fa-circle-info mr-1"></i>
                                   เราคำนวณเผื่อเวลาที่คุณพลิกตัวไปมาให้แล้ว
                                </p>
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

                                    <div className="flex flex-col pt-4 border-t border-gray-200 dark:border-gray-600 space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
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
                                        
                                        {caffeineAmount !== "none" && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                    <label className="text-orange-800 dark:text-orange-300 font-medium text-sm">
                                                        ดื่มแก้วล่าสุดตอนกี่โมง?
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={lastCaffeineTime}
                                                        onChange={(e) => setLastCaffeineTime(e.target.value)}
                                                        className="bg-white dark:bg-[#3d3d3d] border border-orange-200 dark:border-orange-700 rounded-md px-3 py-1 text-sm text-[#2b2b2b] dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
                                                    />
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                                                    <i className="fa-solid fa-mug-hot"></i>
                                                    <span>คาเฟอีนอยู่ในร่างกายนาน 6-10 ชม. อาจรบกวนการนอนหลับลึก (Deep Sleep)</span>
                                                </div>
                                            </motion.div>
                                        )}
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
                                className="w-full md:w-1/3 py-3 btn-back transition-all duration-300 active:scale-95"
                                onClick={() => navigate("/")}
                            >
                                กลับหน้าแรก
                            </button>
                            <button
                                type="button"
                                className={`w-full md:w-1/3 py-3 btn-danger transition-all duration-300 active:scale-95 ${isResetting ? "opacity-70" : ""}`}
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
                                className={`w-full md:w-1/3 py-3 btn-primary transition-all duration-300 flex justify-center items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
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

                                            <div className="space-y-6">
                                                {/* Cycle Selector Buttons */}
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
                                                                {isRecommended && !isDanger && (
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <i className="fa-solid fa-check text-[8px] text-white"></i>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* New Timeline Visualizer */}
                                                <SleepCycleTimeline 
                                                    cycles={selectedCycles}
                                                    bedtime={getAdjustedBedtime() ? formatTime(getAdjustedBedtime()) : ""}
                                                    wakeTime={result.type === "quick" ? wakeTime : weekdayWakeTime}
                                                />
                                            </div>
                                        </div>

                                        {/* Quality Scores (Detailed Only - Radar Chart) */}
                                        {result.type === "detailed" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 md:p-6 border border-blue-200 dark:border-blue-700/50"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-gray-200">
                                                        ประสิทธิภาพการนอน
                                                    </h3>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-black/20 px-2 py-1 rounded-lg">
                                                        Based on {selectedCycles} Cycles
                                                    </div>
                                                </div>

                                                <div className="h-[250px] w-full relative">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                            { subject: 'Memory', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Memory || 0, fullMark: 100 },
                                                            { subject: 'Physical', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Recovery || 0, fullMark: 100 },
                                                            { subject: 'Energy', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Energy || 0, fullMark: 100 },
                                                            { subject: 'Focus', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Focus || 0, fullMark: 100 },
                                                        ]}>
                                                            <PolarGrid stroke="#e5e7eb" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                            <Radar
                                                                name="Score"
                                                                dataKey="A"
                                                                stroke="#ffcc00"
                                                                strokeWidth={3}
                                                                fill="#ffcc00"
                                                                fillOpacity={0.4}
                                                            />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                    
                                                    {/* Center Value */}
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="mt-8 pt-2">
                                                            {/* Just central positioning filler if needed */}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                                                    <div>
                                                        <span className="block font-bold text-indigo-500">Memory</span>
                                                        ความจำ & การเรียนรู้
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-green-500">Physical</span>
                                                        ฟื้นฟูร่างกาย
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
