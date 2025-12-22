import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CalculatorCard, CalculatorSection } from "../components/salary/CalculatorComponents";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import TermsModal from "../components/TermsModal";
import { useLanguage } from "../context/LanguageContext";
import { useCalculationHistory } from "../context/CalculationHistoryContext";

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
                            <div className="flex flex-col items-center gap-1">
                                {/* Icons for each sleep stage */}
                                {cycle.label === "Deep Sleep" && (
                                    <i className="fa-solid fa-dumbbell text-sm text-indigo-600 dark:text-indigo-400"></i>
                                )}
                                {cycle.label === "Light Sleep" && (
                                    <i className="fa-solid fa-moon text-sm text-blue-600 dark:text-blue-400"></i>
                                )}
                                {cycle.label === "REM / Wake" && (
                                    <i className="fa-solid fa-brain text-sm text-yellow-600 dark:text-yellow-400"></i>
                                )}
                                <span className={`text-[10px] md:text-xs font-bold text-center leading-tight ${cycle.textClass}`}>
                                    {cycle.label}
                                </span>
                            </div>
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
            
            <div className="flex items-center gap-4 mt-2 justify-center text-[10px] text-gray-500 flex-wrap">
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                    <i className="fa-solid fa-dumbbell text-indigo-600 dark:text-indigo-400"></i>
                    <div className="w-3 h-3 bg-indigo-500 border border-indigo-600 rounded"></div>
                    <span className="font-semibold">Deep Sleep</span>
                    <span className="text-gray-400">(ฟื้นฟูกล้ามเนื้อ)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                    <i className="fa-solid fa-moon text-blue-600 dark:text-blue-400"></i>
                    <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded"></div>
                    <span className="font-semibold">Light Sleep</span>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                    <i className="fa-solid fa-brain text-yellow-600 dark:text-yellow-400"></i>
                    <div className="w-3 h-3 bg-[#ffcc00] border border-yellow-600 rounded"></div>
                    <span className="font-semibold">REM</span>
                    <span className="text-gray-400">(ความจำ)</span>
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
    const { t, language } = useLanguage();
    const { addCalculation } = useCalculationHistory();

    // Quick Mode States
    const [wakeTime, setWakeTime] = useState("07:00");
    const [sleepLatency, setSleepLatency] = useState("15");
    const [activityLevel, setActivityLevel] = useState("medium");
    const [sleepDebt, setSleepDebt] = useState(0);
    const [showPowerNap, setShowPowerNap] = useState(false);

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
    const [selectedHours, setSelectedHours] = useState(null); // null = use cycles, number = use hours
    const [isResetting, setIsResetting] = useState(false);

    const SLEEP_CYCLE_MINUTES = 90;

    const handleModeChange = (newMode) => {
        setParams({ mode: newMode });
        setResult(null);
    };

    const calculateBedtime = (cycles, timeStr, latency, hours = null) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const wakeDate = new Date();
        wakeDate.setHours(hour, minute, 0, 0);

        // If hours is specified, use it; otherwise use cycles
        const totalSleepMinutes = hours !== null 
            ? hours * 60 
            : cycles * SLEEP_CYCLE_MINUTES;
        const totalWithLatency = totalSleepMinutes + parseInt(latency);

        return new Date(wakeDate.getTime() - totalWithLatency * 60000);
    };

    // Calculate cycles from hours (round to nearest cycle)
    const hoursToCycles = (hours) => {
        return Math.round((hours * 60) / SLEEP_CYCLE_MINUTES);
    };

    // Calculate sleep quality assessment
    const assessSleepQuality = (hours) => {
        if (hours < 6) {
            return {
                level: "poor",
                label: "นอนน้อยเกินไป",
                color: "red",
                score: Math.max(0, (hours / 6) * 50),
                description: "การนอนน้อยกว่า 6 ชั่วโมงอาจส่งผลเสียต่อสุขภาพ สมาธิ และความจำ",
                recommendations: [
                    "พยายามนอนให้ได้อย่างน้อย 6 ชั่วโมง",
                    "พิจารณางีบหลับสั้นๆ 20 นาทีในช่วงบ่าย",
                    "ปรับเวลานอนให้เร็วขึ้น"
                ]
            };
        } else if (hours >= 6 && hours < 7) {
            return {
                level: "fair",
                label: "นอนพอใช้",
                color: "orange",
                score: 60 + ((hours - 6) / 1) * 20,
                description: "การนอน 6-7 ชั่วโมงพอใช้ได้ แต่ยังไม่ใช่เวลาที่เหมาะสมที่สุด",
                recommendations: [
                    "ลองเพิ่มเวลานอนเป็น 7-9 ชั่วโมง",
                    "คุณจะรู้สึกสดชื่นและมีสมาธิดีขึ้น"
                ]
            };
        } else if (hours >= 7 && hours <= 9) {
            return {
                level: "excellent",
                label: "นอนเหมาะสม",
                color: "green",
                score: 80 + Math.min(20, (hours - 7) / 2 * 20),
                description: "การนอน 7-9 ชั่วโมงเป็นเวลาที่เหมาะสมที่สุดสำหรับผู้ใหญ่",
                recommendations: [
                    "ยอดเยี่ยม! คุณนอนในเวลาที่เหมาะสม",
                    "รักษาเวลานอนนี้ไว้เพื่อสุขภาพที่ดี"
                ]
            };
        } else if (hours > 9 && hours <= 10) {
            return {
                level: "good",
                label: "นอนมาก",
                color: "blue",
                score: 85,
                description: "การนอน 9-10 ชั่วโมงอาจมากเกินไปเล็กน้อย แต่ยังอยู่ในช่วงที่ยอมรับได้",
                recommendations: [
                    "บางคนอาจรู้สึกง่วงนอนหลังตื่น",
                    "ลองลดเป็น 7-9 ชั่วโมงดู"
                ]
            };
        } else {
            return {
                level: "excessive",
                label: "นอนมากเกินไป",
                color: "purple",
                score: 70,
                description: "การนอนมากกว่า 10 ชั่วโมงอาจไม่จำเป็นและอาจทำให้รู้สึกง่วงนอน",
                recommendations: [
                    "ลองลดเวลานอนเป็น 7-9 ชั่วโมง",
                    "คุณภาพการนอนสำคัญกว่าปริมาณ"
                ]
            };
        }
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

            const calculationResult = {
                type: "quick",
                options,
                wakeTime,
                selectedCycles: 5
            };
            setResult(calculationResult);
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

            const calculationResult = {
                type: "detailed",
                scenarios,
                wakeTime: weekdayWakeTime,
                recommendedCycles,
                recommendations: generateRecommendations(recommendedCycles, sleepQuality, caffeine, nextDayGoal, lastCaffeineTime)
            };
            setResult(calculationResult);
            setSelectedCycles(recommendedCycles);
            setLoading(false);
        }, 800);
    };

    const calculateMetrics = (cycles, quality, caffeine, goal, activity) => {
        // Base scores
        let mental = cycles * 15;
        let physical = cycles * 15;
        
        // Quality Modifiers
        if (quality === "good") {
            mental += 10; physical += 10;
        } else if (quality === "poor") {
            mental -= 15; physical -= 15;
        }

        // Caffeine Impact
        if (caffeine > 2) {
            physical -= 10;
            mental -= 5;
        }

        // Activity/Goal Specific Logic
        if (goal === "exam" || goal === "study") {
            // Emphasis on REM (later cycles)
            if (cycles >= 5) mental += 15;
            else mental -= 5;
        } else if (goal === "physical" || activity === "heavy") {
            // Emphasis on Deep Sleep (early cycles)
            if (cycles >= 4) physical += 15;
        }

        // Sleep Debt Impact
        const debtModifier = (sleepDebt || 0) * 5;
        mental = Math.max(0, mental - debtModifier);
        physical = Math.max(0, physical - debtModifier);

        return {
            Mental: Math.min(100, Math.max(0, mental)),
            Physical: Math.min(100, Math.max(0, physical)),
            Focus: Math.min(100, Math.max(0, (mental + physical) / 2 + 5)),
            Recovery: Math.min(100, Math.max(0, physical + 5)),
        };
    };

    const getWindDownPlan = (bedtimeDate) => {
        const plan = [
            { time: -120, activity: t('caffeineCutoff'), icon: 'fa-mug-hot' },
            { time: -90, activity: t('mealTracker'), icon: 'fa-utensils' },
            { time: -60, activity: 'ควรอาบน้ำอุ่นตอนนี้', icon: 'fa-bath' },
            { time: -30, activity: t('windDown'), icon: 'fa-mobile-screen-button' },
        ];

        return plan.map(item => {
            const time = new Date(bedtimeDate.getTime() + item.time * 60000);
            return {
                ...item,
                formattedTime: formatTime(time)
            };
        });
    };

    const calculatePowerNap = (minutes) => {
        setLoading(true);
        setTimeout(() => {
            const now = new Date();
            const wakeUp = new Date(now.getTime() + (minutes + 15) * 60000); // +15m to fall asleep
            
            const calculationResult = {
                type: "power-nap",
                duration: minutes,
                wakeTime: formatTime(wakeUp),
                recommendations: [
                    minutes === 20 ? "การงีบ 20 นาทีช่วยเพิ่มความตื่นตัวได้ทันทีโดยไม่ทำให้งัวเงีย" : "การงีบ 90 นาทีเป็นหนึ่งรอบการนอนที่สมบูรณ์ ช่วยเรื่องความจำระยะยาว"
                ]
            };
            setResult(calculationResult);
            setLoading(false);
        }, 500);
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
            if (cafTimeVal > 14) {
                 recs.push(`คุณดื่มคาเฟอีนหลังบ่าย 2 (${lastCafTime}) อาจรบกวน Deep Sleep ลองเลื่อนเวลาดื่มให้เร็วขึ้นในวันถัดไป`);
            }
        }

        if (cycles < 5) recs.push("หากนอนน้อยกว่าที่แนะนำ ลองหาเวลางีบ 20 นาทีช่วงบ่ายเพื่อบูสต์พลังงาน");
        if (sleepDebt > 0) recs.push(`คุณมีหนี้การนอน ${sleepDebt} ชม. ระบบพยายามคำนวณรอบการนอนชดเชยให้คุณแล้ว`);
        
        return recs;
    };

    const getAdjustedBedtime = () => {
        if (!result) return null;
        const timeStr = result.type === "quick" ? wakeTime : weekdayWakeTime;
        return calculateBedtime(selectedCycles, timeStr, sleepLatency, selectedHours);
    };

    const getCurrentSleepHours = () => {
        return selectedHours !== null ? selectedHours : (selectedCycles * 1.5);
    };

    const handleHoursChange = (hours) => {
        setSelectedHours(hours);
        // Auto-update cycles to match
        const cycles = hoursToCycles(hours);
        setSelectedCycles(cycles);
    };

    const handleCyclesChange = (cycles) => {
        setSelectedCycles(cycles);
        // Clear hours selection to use cycles
        setSelectedHours(null);
    };

    const handleReset = () => {
        setIsResetting(true);
        setWakeTime("07:00");
        setSleepLatency("15");
        setActivityLevel("medium");
        setSleepDebt(0);
        setWeekdayWakeTime("07:00");
        setSleepQuality("good");
        setCaffeineAmount("none");
        setNextDayGoal("normal");
        setResult(null);
        setSelectedCycles(5);
        setSelectedHours(null);
        setTimeout(() => setIsResetting(false), 1000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Save calculation to history when result changes
    useEffect(() => {
        if (result) {
            // Prepare inputs based on calculation type
            let inputs = {};
            if (result.type === "quick") {
                inputs = {
                    mode: "quick",
                    wakeTime,
                    sleepLatency,
                    activityLevel,
                    sleepDebt
                };
            } else if (result.type === "detailed") {
                inputs = {
                    mode: "detailed",
                    weekdayWakeTime,
                    sleepQuality,
                    caffeineAmount,
                    lastCaffeineTime,
                    nextDayGoal,
                    sleepLatency
                };
            } else if (result.type === "power-nap") {
                inputs = {
                    mode: "power-nap",
                    duration: result.duration
                };
            }

            addCalculation({
                calculatorType: "sleep-calculator",
                inputs,
                results: result
            });
        }
    }, [result, wakeTime, sleepLatency, activityLevel, sleepDebt, weekdayWakeTime, sleepQuality, caffeineAmount, lastCaffeineTime, nextDayGoal, addCalculation]);

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
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="bg-white dark:bg-[#2b2b2b] p-1.5 rounded-full shadow-sm inline-flex border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => handleModeChange("quick")}
                            className={`px-6 md:px-8 py-2.5 rounded-full text-xs md:text-sm lg:text-base font-bold transition-all duration-300 ${currentMode === "quick"
                                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-md"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                }`}
                        >
                            Quick
                        </button>
                        <button
                            onClick={() => handleModeChange("detailed")}
                            className={`px-6 md:px-8 py-2.5 rounded-full text-xs md:text-sm lg:text-base font-bold transition-all duration-300 ${currentMode === "detailed"
                                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-md"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                }`}
                        >
                            Detailed
                        </button>
                    </div>

                    <button
                        onClick={() => setShowPowerNap(!showPowerNap)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                            showPowerNap 
                            ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300 text-purple-700 dark:text-purple-300 font-bold"
                            : "bg-white dark:bg-[#2b2b2b] border-gray-200 dark:border-gray-700 text-gray-500"
                        }`}
                    >
                        <i className="fa-solid fa-bolt-lightning"></i>
                        {t('powerNap')}
                    </button>
                </div>

                {/* Power Nap Quick Selection */}
                <AnimatePresence>
                    {showPowerNap && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-2 gap-4 mb-8"
                        >
                            <button
                                onClick={() => calculatePowerNap(20)}
                                className="bg-white dark:bg-[#2b2b2b] p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-400 transition-all text-center group"
                            >
                                <div className="text-2xl font-black text-purple-600 mb-1 group-hover:scale-110 transition-transform">20 min</div>
                                <div className="text-xs text-gray-500">บูสต์พลังงานทันที</div>
                            </button>
                            <button
                                onClick={() => calculatePowerNap(90)}
                                className="bg-white dark:bg-[#2b2b2b] p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-400 transition-all text-center group"
                            >
                                <div className="text-2xl font-black text-indigo-600 mb-1 group-hover:scale-110 transition-transform">90 min</div>
                                <div className="text-xs text-gray-500">1 Sleep Cycle</div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

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

                            {/* Sleep Debt Picker */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[#2b2b2b] dark:text-gray-200 font-medium text-sm md:text-base">
                                            {t('sleepDebt')}
                                        </label>
                                        <span className="text-purple-500 font-bold text-lg">{sleepDebt} {t('baht') === 'บาท' ? 'ชม.' : 'Hrs'}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                        ไม่แน่ใจว่าคุณมีหนี้การนอนเท่าไหร่?
                                    </p>
                                    <Link
                                        to="/sleep-debt"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        <i className="fa-solid fa-calculator"></i>
                                        คำนวณหนี้การนอน
                                    </Link>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        หรือป้อนค่าด้วยตนเองด้านล่าง
                                    </p>
                                    <div className="space-y-3 mt-3">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => setSleepDebt(Math.max(0, sleepDebt - 0.5))}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <i className="fa-solid fa-minus text-gray-600 dark:text-gray-300"></i>
                                            </button>
                                            <input 
                                                type="range"
                                                min="0"
                                                max="50"
                                                step="0.5"
                                                value={Math.min(sleepDebt, 50)}
                                                onChange={(e) => setSleepDebt(parseFloat(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
                                            />
                                            <button 
                                                onClick={() => setSleepDebt(sleepDebt + 0.5)}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <i className="fa-solid fa-plus text-gray-600 dark:text-gray-300"></i>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-600 dark:text-gray-400">หรือป้อนค่าตรง:</label>
                                            <input 
                                                type="number"
                                                min="0"
                                                max="200"
                                                step="0.5"
                                                value={sleepDebt}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value) || 0;
                                                    setSleepDebt(Math.max(0, Math.min(200, val)));
                                                }}
                                                className="w-24 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2b2b2b] text-[#2b2b2b] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">ชม.</span>
                                        </div>
                                    </div>
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
                                        {/* Power Nap Result */}
                                        {result && result.type === "power-nap" && (
                                            <div className="text-center py-6">
                                                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <i className="fa-solid fa-bolt-lightning text-3xl text-purple-600"></i>
                                                </div>
                                                <h3 className="text-2xl font-black text-[#2b2b2b] dark:text-white mb-2">
                                                    Power Nap {result.duration} m
                                                </h3>
                                                <p className="text-gray-500 mb-6 font-medium">ความสดชื่นกำลังจะมา!</p>
                                                
                                                <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800 mb-8">
                                                    <p className="text-sm text-purple-800 dark:text-purple-300 font-medium mb-1">ควรตั้งปลุกเวลา</p>
                                                    <p className="text-5xl font-black text-purple-600">{result.wakeTime}</p>
                                                    <p className="text-xs text-purple-500 mt-2 italic">*รวมเวลาเตรียมตัวหลับ 15 นาทีให้แล้ว</p>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    {result.recommendations.map((rec, i) => (
                                                        <div key={i} className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                            {rec}
                                                        </div>
                                                    ))}
                                                </div>

                                                <button 
                                                    onClick={() => setResult(null)}
                                                    className="mt-8 text-gray-400 hover:text-gray-600 font-medium transition-colors"
                                                >
                                                    Back to Full Calculator
                                                </button>
                                            </div>
                                        )}

                                        {result && result.type !== "power-nap" && (
                                            <>
                                        {/* Main Result Display */}
                                        <div className="text-center mb-6">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3, type: "spring" }}
                                            >
                                                {getCurrentSleepHours() < 6 && (
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
                                                    {selectedHours !== null 
                                                        ? `${getCurrentSleepHours().toFixed(1)} ชั่วโมง (${selectedCycles} รอบนอน)`
                                                        : `${selectedCycles} รอบนอน = ${(selectedCycles * 1.5).toFixed(1)} ชั่วโมง`
                                                    }
                                                </p>
                                                
                                                {/* Sleep Quality Assessment */}
                                                {result && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.4 }}
                                                        className="mt-4"
                                                    >
                                                        {(() => {
                                                            const assessment = assessSleepQuality(getCurrentSleepHours());
                                                            return (
                                                                <div className={`p-4 rounded-xl border-2 ${
                                                                    assessment.color === "red" ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800" :
                                                                    assessment.color === "orange" ? "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800" :
                                                                    assessment.color === "green" ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800" :
                                                                    assessment.color === "blue" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800" :
                                                                    "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800"
                                                                }`}>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-lg font-bold ${
                                                                                assessment.color === "red" ? "text-red-600 dark:text-red-400" :
                                                                                assessment.color === "orange" ? "text-orange-600 dark:text-orange-400" :
                                                                                assessment.color === "green" ? "text-green-600 dark:text-green-400" :
                                                                                assessment.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                                                                                "text-purple-600 dark:text-purple-400"
                                                                            }`}>
                                                                                {assessment.label}
                                                                            </span>
                                                                            <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                                                assessment.color === "red" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" :
                                                                                assessment.color === "orange" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                                                                                assessment.color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                                                                                assessment.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                                                                                "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                                            }`}>
                                                                                {Math.round(assessment.score)}/100
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                                        {assessment.description}
                                                                    </p>
                                                                    {assessment.recommendations && assessment.recommendations.length > 0 && (
                                                                        <ul className="space-y-1 mt-2">
                                                                            {assessment.recommendations.map((rec, i) => (
                                                                                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                                                                    <i className="fa-solid fa-circle-check mt-1 text-[#ffcc00]"></i>
                                                                                    <span>{rec}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </motion.div>
                                                )}

                                                <div className="mt-4 inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                                                    <i className="fa-solid fa-bell text-green-500 text-sm"></i>
                                                    <span className="text-xs text-green-700 dark:text-green-300 font-bold uppercase tracking-wider">{t('wakeUpWindow')}</span>
                                                    <span className="text-sm text-green-600 dark:text-green-400 font-mono">
                                                        {(() => {
                                                            const wt = result.type === "quick" ? wakeTime : weekdayWakeTime;
                                                            const [h, m] = wt.split(':').map(Number);
                                                            const date = new Date();
                                                            date.setHours(h, m, 0, 0);
                                                            const start = new Date(date.getTime() - 15 * 60000);
                                                            return `${formatTime(start)} - ${wt}`;
                                                        })()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Sleep Duration Selector */}
                                        <div className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-gray-200">
                                                    เลือกระยะเวลานอน
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedHours(null);
                                                        }}
                                                        className={`px-3 py-1 rounded-lg transition-all ${
                                                            selectedHours === null
                                                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold"
                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                        }`}
                                                    >
                                                        รอบนอน
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedHours(7.5);
                                                            setSelectedCycles(5);
                                                        }}
                                                        className={`px-3 py-1 rounded-lg transition-all ${
                                                            selectedHours !== null
                                                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold"
                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                        }`}
                                                    >
                                                        ชั่วโมง
                                                    </button>
                                                </div>
                                            </div>

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
                                                {/* Hours Selector */}
                                                {selectedHours !== null ? (
                                                    <div>
                                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                                                            {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11].map((hours) => {
                                                                const cycles = hoursToCycles(hours);
                                                                const isDanger = hours < 6;
                                                                const isRecommended = hours >= 7 && hours <= 9;
                                                                const assessment = assessSleepQuality(hours);
                                                                return (
                                                                    <button
                                                                        key={hours}
                                                                        onClick={() => handleHoursChange(hours)}
                                                                        className={`py-3 rounded-xl font-semibold transition-all relative ${
                                                                            Math.abs(selectedHours - hours) < 0.1
                                                                                ? isDanger
                                                                                    ? "bg-red-500 text-white shadow-lg ring-2 ring-red-300"
                                                                                    : "bg-[#ffcc00] text-[#2b2b2b] shadow-lg"
                                                                                : isDanger
                                                                                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50"
                                                                                    : isRecommended
                                                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50"
                                                                                        : "bg-gray-100 dark:bg-[#3d3d3d] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#4d4d4d]"
                                                                        }`}
                                                                    >
                                                                        <div className="text-sm font-black">{hours}</div>
                                                                        <div className="text-[10px] opacity-70">ชม.</div>
                                                                        {isRecommended && !isDanger && (
                                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                                                <i className="fa-solid fa-check text-[8px] text-white"></i>
                                                                            </div>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {/* Custom Hours Input */}
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-sm text-gray-600 dark:text-gray-400">หรือระบุเอง:</label>
                                                            <input
                                                                type="number"
                                                                min="4"
                                                                max="12"
                                                                step="0.5"
                                                                value={selectedHours}
                                                                onChange={(e) => {
                                                                    const val = parseFloat(e.target.value) || 0;
                                                                    if (val >= 4 && val <= 12) {
                                                                        handleHoursChange(val);
                                                                    }
                                                                }}
                                                                className="w-24 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2b2b2b] text-[#2b2b2b] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            />
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">ชั่วโมง</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Cycle Selector Buttons */
                                                    <div className="grid grid-cols-6 gap-2">
                                                        {[2, 3, 4, 5, 6, 7].map((cycles) => {
                                                            const isDanger = cycles < 4;
                                                            const isRecommended = result.type === "detailed"
                                                                ? cycles === result.recommendedCycles
                                                                : cycles === 5;
                                                            return (
                                                                <button
                                                                    key={cycles}
                                                                    onClick={() => handleCyclesChange(cycles)}
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
                                                )}

                                                {/* New Timeline Visualizer */}
                                                <SleepCycleTimeline 
                                                    cycles={selectedCycles}
                                                    bedtime={getAdjustedBedtime() ? formatTime(getAdjustedBedtime()) : ""}
                                                    wakeTime={result.type === "quick" ? wakeTime : weekdayWakeTime}
                                                />
                                                
                                                {/* Sleep Quality Summary */}
                                                {result && selectedHours !== null && (
                                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                                                    คุณภาพการนอนที่คาดหวัง
                                                                </p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {(() => {
                                                                        const assessment = assessSleepQuality(getCurrentSleepHours());
                                                                        return assessment.description;
                                                                    })()}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                                    {Math.round(assessSleepQuality(getCurrentSleepHours()).score)}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">คะแนน</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* One-Click Alarm Sync - Thumb-friendly */}
                                                <div className="pt-4 flex justify-center">
                                                    <button 
                                                        onClick={() => {
                                                            const wt = result.type === "quick" ? wakeTime : weekdayWakeTime;
                                                            const [h, m] = wt.split(':').map(Number);
                                                            const now = new Date();
                                                            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m);
                                                            const end = new Date(start.getTime() + 5 * 60000);
                                                            const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=ตื่นนอน (PayDee)&details=เวลาตื่นที่คำนวณจากรอบการนอน&location=&dates=${start.toISOString().replace(/-|:|\.\d+/g, "")}/${end.toISOString().replace(/-|:|\.\d+/g, "")}`;
                                                            window.open(url, '_blank');
                                                        }}
                                                        className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 min-h-[56px] text-base md:text-lg w-full md:w-auto"
                                                    >
                                                        <i className="fa-brands fa-google text-xl"></i>
                                                        <span>{t('setAlarm')} (Google Calendar)</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Wind-down Countdown & Environment Guide */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Wind-down - Horizontal Timeline */}
                                            <div className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                                <h3 className="font-bold text-[#2b2b2b] dark:text-gray-200 mb-4 flex items-center gap-2">
                                                    <i className="fa-solid fa-hourglass-half text-orange-400"></i>
                                                    {t('windDown')}
                                                </h3>
                                                {/* Horizontal Timeline */}
                                                <div className="relative">
                                                    {/* Timeline Line */}
                                                    <div className="absolute left-0 right-0 top-8 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 dark:from-orange-800 dark:via-orange-700 dark:to-orange-800"></div>
                                                    
                                                    <div className="flex items-start justify-between gap-2 relative z-10">
                                                        {getWindDownPlan(getAdjustedBedtime()).map((step, i) => (
                                                            <div key={i} className="flex flex-col items-center flex-1 min-w-0">
                                                                {/* Time Circle */}
                                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800 flex items-center justify-center shadow-lg mb-2 border-2 border-white dark:border-[#2b2b2b]">
                                                                    <i className={`fa-solid ${step.icon} text-white text-sm`}></i>
                                                                </div>
                                                                {/* Time Label */}
                                                                <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1 text-center">
                                                                    {step.formattedTime}
                                                                </div>
                                                                {/* Activity */}
                                                                <div className="text-[10px] text-gray-600 dark:text-gray-300 text-center leading-tight px-1">
                                                                    {step.activity}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Environment Guide - Expert Tips Style */}
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-sm border border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                                        <i className="fa-solid fa-user-doctor text-white text-lg"></i>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#2b2b2b] dark:text-gray-200 flex items-center gap-2">
                                                            <i className="fa-solid fa-lightbulb text-green-500"></i>
                                                            {t('envGuide')}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">ทิปจากผู้เชี่ยวชาญ</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-white/60 dark:bg-black/20 rounded-lg border border-green-100 dark:border-green-800">
                                                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">{t('tempLight')}</div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                                    <i className="fa-solid fa-temperature-low text-blue-500"></i>
                                                                </div>
                                                                <span>อุณหภูมิที่เหมาะสมคือ <strong>22-25 °C</strong></span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                                <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                                                    <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                                                                </div>
                                                                <span>ควรปิดไฟให้สนิทหรือใช้ไฟส้มสลัว</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                                                        <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <i className="fa-solid fa-quote-left text-white text-xs"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                                            สภาพแวดล้อมที่มืดและเย็นช่วยกระตุ้นการหลั่งเมลาโทนินได้ดีขึ้น ทำให้หลับลึกและตื่นมาสดชื่น
                                                        </p>
                                                    </div>
                                                </div>
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
                                                            { subject: 'Mental', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Mental || 0, fullMark: 100 },
                                                            { subject: 'Physical', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Physical || 0, fullMark: 100 },
                                                            { subject: 'Energy', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Recovery || 0, fullMark: 100 },
                                                            { subject: 'Focus', A: result.scenarios.find(s => s.cycles === selectedCycles)?.metrics.Focus || 0, fullMark: 100 },
                                                        ]}>
                                                            <PolarGrid stroke="#e5e7eb" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                            <Radar
                                                                name="Score"
                                                                dataKey="A"
                                                                stroke="#8b5cf6"
                                                                strokeWidth={3}
                                                                fill="#8b5cf6"
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
                                                
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-center text-[10px] text-gray-500 dark:text-gray-400">
                                                    <div>
                                                        <span className="block font-bold text-indigo-500 uppercase">Mental</span>
                                                        สมองและการเรียนรู้
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-purple-500 uppercase">Physical</span>
                                                        การฟื้นฟูร่างกาย
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
                                                className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                                                        <i className="fa-solid fa-user-doctor text-white text-lg"></i>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-gray-200">
                                                            คำแนะนำจากผู้เชี่ยวชาญ
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">ทิปดีๆ เพื่อการนอนที่มีคุณภาพ</p>
                                                    </div>
                                                </div>
                                                <ul className="space-y-3">
                                                    {result.recommendations.map((rec, i) => (
                                                        <li key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <i className="fa-solid fa-lightbulb text-white text-xs"></i>
                                                            </div>
                                                            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                        </>
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
