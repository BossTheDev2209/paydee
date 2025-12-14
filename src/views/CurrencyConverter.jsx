import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CalculatorCard, CalculatorSection } from "../components/salary/CalculatorComponents";
import { Input } from "../components/ui/input";
import SlotCounter from "../components/ui/SlotCounter";
import { motion, AnimatePresence } from "framer-motion";

// Initial fallback
const initialCurrencies = [
    { value: "THB", label: "THB - Thai Baht", flag: "th" },
    { value: "USD", label: "USD - US Dollar", flag: "us" },
    { value: "EUR", label: "EUR - Euro", flag: "eu" },
    { value: "JPY", label: "JPY - Japanese Yen", flag: "jp" },
    { value: "GBP", label: "GBP - British Pound", flag: "gb" },
    { value: "CNY", label: "CNY - Chinese Yuan", flag: "cn" },
    { value: "KRW", label: "KRW - South Korean Won", flag: "kr" },
    { value: "SGD", label: "SGD - Singapore Dollar", flag: "sg" },
];

const CurrencyDropdown = ({ options, value, onChange, label, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.value.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={ref}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                {label}
            </label>
            <div
                className={`relative w-full bg-white dark:bg-[#3d3d3d] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-200 hover:border-[#ffcc00] ${isOpen ? 'ring-2 ring-[#ffcc00]/20 border-[#ffcc00]' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {value.flag && (
                        <img
                            src={`https://flagcdn.com/w40/${value.flag}.png`}
                            alt={value.value}
                            className="w-8 h-6 object-cover rounded shadow-sm"
                        />
                    )}
                    <div>
                        <div className="font-bold text-[#2b2b2b] dark:text-gray-200 leading-none">{value.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[120px] md:max-w-none">
                            {value.label.split(' - ')[1] || value.label}
                        </div>
                    </div>
                </div>
                <i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-[#3d3d3d] rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 overflow-hidden max-h-[300px] flex flex-col"
                    >
                        <div className="p-2 border-b border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-black/20 sticky top-0">
                            <div className="relative">
                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input
                                    type="text"
                                    placeholder="Search currency..."
                                    className="w-full bg-white dark:bg-[#2b2b2b] pl-9 pr-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-500 outline-none focus:border-[#ffcc00]"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-1">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Loading rates...</div>
                            ) : filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${value.value === opt.value ? 'bg-[#ffcc00]/10 dark:bg-[#ffcc00]/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        {opt.flag ? (
                                            <img
                                                src={`https://flagcdn.com/w40/${opt.flag}.png`}
                                                alt={opt.value}
                                                className="w-8 h-6 object-cover rounded shadow-sm flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                                                {opt.value.substring(0, 2)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between">
                                                <span className={`font-bold ${value.value === opt.value ? 'text-[#e6b800] dark:text-[#ffcc00]' : 'text-[#2b2b2b] dark:text-gray-200'}`}>
                                                    {opt.value}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {opt.label.split(' - ')[1] || opt.label}
                                            </div>
                                        </div>
                                        {value.value === opt.value && <i className="fa-solid fa-check text-[#ffcc00] text-sm"></i>}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">No currency found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function CurrencyConverter() {
    const [amount, setAmount] = useState("");
    const [fromCurrency, setFromCurrency] = useState(initialCurrencies[1]); // USD
    const [toCurrency, setToCurrency] = useState(initialCurrencies[0]);   // THB
    const [result, setResult] = useState(null);
    const [rates, setRates] = useState(null);
    const [loadingRates, setLoadingRates] = useState(true);
    const [currencyOptions, setCurrencyOptions] = useState(initialCurrencies);

    // Fetch Rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
                const data = await response.json();
                setRates(data.rates);

                // Construct options with flags (approximate matching)
                const options = Object.keys(data.rates).map(code => {
                    // Simple heuristic for flag codes (first 2 letters usually work for many)
                    let flagCode = code.slice(0, 2).toLowerCase();
                    // Manual overrides for common mismatches if needed, e.g.
                    if (code === 'EUR') flagCode = 'eu';
                    if (code === 'GBP') flagCode = 'gb';
                    if (code === 'CNY') flagCode = 'cn';
                    if (code === 'JPY') flagCode = 'jp';
                    if (code === 'KRW') flagCode = 'kr';
                    if (code === 'THB') flagCode = 'th';
                    if (code === 'USD') flagCode = 'us';
                    if (code === 'SGD') flagCode = 'sg';
                    if (code === 'HKD') flagCode = 'hk';
                    if (code === 'AUD') flagCode = 'au';

                    // Try to use Intl.DisplayNames for better labels
                    let label = code;
                    try {
                        const regionNames = new Intl.DisplayNames(['th', 'en'], { type: 'currency' });
                        label = `${code} - ${regionNames.of(code)}`;
                    } catch (e) {
                        // Fallback
                    }

                    return {
                        value: code,
                        label: label,
                        flag: flagCode
                    };
                }).sort((a, b) => a.value.localeCompare(b.value));

                setCurrencyOptions(options);

                // Update selected currencies with full objects if they exist in new options
                // (to ensure labels/flags are correct)
                const newFrom = options.find(o => o.value === fromCurrency.value);
                const newTo = options.find(o => o.value === toCurrency.value);
                if (newFrom) setFromCurrency(newFrom);
                if (newTo) setToCurrency(newTo);

                setLoadingRates(false);
            } catch (error) {
                console.error("Failed to fetch rates", error);
                setLoadingRates(false);
            }
        };

        fetchRates();
    }, []);

    const handleCalculate = () => {
        if (!amount || !fromCurrency || !toCurrency || !rates) return;

        const amountValue = parseFloat(amount.replace(/,/g, ""));
        if (isNaN(amountValue)) return;

        const rateFrom = rates[fromCurrency.value];
        const rateTo = rates[toCurrency.value];

        const converted = (amountValue / rateFrom) * rateTo;
        const rate = rateTo / rateFrom;

        setResult({
            convertedAmount: converted,
            rate: rate,
            from: fromCurrency,
            to: toCurrency,
            inputAmount: amountValue
        });

        setTimeout(() => {
            document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSwap = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
        setResult(null);
    };

    return (
        <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
            {/* Header Section */}
            <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#ffcc00] z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4"
                    >
                        <i className="fa-solid fa-money-bill-transfer mr-4"></i>
                        แปลงสกุลเงิน
                    </motion.h1>
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-[#2b2b2b]/80"
                    >
                        อัตราแลกเปลี่ยนเรียลไทม์ แม่นยำ ทันใจ
                    </motion.h3>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <Link to="/" className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6 group">
                    <i className="fa-solid fa-arrow-left-long mr-2 group-hover:-translate-x-1 transition-transform"></i>
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <CalculatorCard title="ระบุจำนวนเงินและเลือกสกุล" className="mb-8 overflow-visible">
                        <div className="space-y-8">
                            {/* Input Section */}
                            <div className="bg-gray-50 dark:bg-[#3d3d3d]/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    จำนวนเงินที่ต้องการแปลง
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9.]/g, "");
                                            setAmount(val);
                                        }}
                                        placeholder="0.00"
                                        className="w-full text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#ffcc00] outline-none py-2 text-[#2b2b2b] dark:text-gray-200 placeholder-gray-300 transition-colors"
                                    />
                                    <span className="absolute right-0 bottom-4 text-gray-400 font-medium text-lg">
                                        {fromCurrency.value}
                                    </span>
                                </div>
                            </div>

                            {/* Currency Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-end relative">
                                <div className="z-20">
                                    <CurrencyDropdown
                                        label="จาก (From)"
                                        options={currencyOptions}
                                        value={fromCurrency}
                                        onChange={setFromCurrency}
                                        isLoading={loadingRates}
                                    />
                                </div>

                                <div className="flex justify-center pb-2 z-10">
                                    <button
                                        onClick={handleSwap}
                                        className="w-14 h-14 rounded-full bg-white dark:bg-[#4d4d4d] flex items-center justify-center text-[#ffcc00] hover:text-white hover:bg-[#ffcc00] active:scale-90 transition-all shadow-md border border-gray-100 dark:border-gray-600 group"
                                    >
                                        <i className="fa-solid fa-arrow-right-arrow-left group-hover:rotate-180 transition-transform duration-300 text-lg"></i>
                                    </button>
                                </div>

                                <div className="z-20">
                                    <CurrencyDropdown
                                        label="เป็น (To)"
                                        options={currencyOptions}
                                        value={toCurrency}
                                        onChange={setToCurrency}
                                        isLoading={loadingRates}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons - Standard Style */}
                            <div className="mt-8 w-full justify-between flex flex-col md:flex-row gap-4">
                                <button
                                    type="button"
                                    className="w-full md:w-1/3 py-3 rounded-lg bg-white dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-[#333] transition-colors active:scale-95 duration-200 border border-transparent dark:border-gray-600 shadow-sm"
                                    onClick={() => window.history.back()}
                                >
                                    กลับหน้าแรก
                                </button>
                                <button
                                    type="button"
                                    className="w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 border border-transparent bg-white dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] dark:border-gray-600 shadow-sm"
                                    onClick={() => { setAmount(""); setResult(null); }}
                                >
                                    รีเซต
                                </button>
                                <button
                                    onClick={handleCalculate}
                                    disabled={!amount || loadingRates}
                                    className={`w-full md:w-1/3 py-3 rounded-lg font-bold transition-all duration-200 shadow-md flex justify-center items-center gap-2 ${!amount || loadingRates
                                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        : "bg-[#ffcc00] text-[#2b2b2b] hover:bg-[#e6b800] active:scale-95"
                                        }`}
                                >
                                    คำนวณ
                                </button>
                            </div>
                        </div>
                    </CalculatorCard>
                </motion.div>

                {/* Result Card */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            id="result"
                            className="mb-20"
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                        >
                            <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-xl overflow-hidden border-2 border-[#ffcc00]">
                                <div className="bg-gradient-to-r from-[#ffcc00] to-[#ffd633] px-6 py-4 flex justify-between items-center">
                                    <h3 className="text-[#2b2b2b] font-bold text-xl flex items-center gap-2">
                                        <i className="fa-solid fa-receipt"></i>
                                        ผลลัพธ์การคำนวณ
                                    </h3>
                                    <div className="text-[#2b2b2b]/70 text-sm font-medium">
                                        {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}
                                    </div>
                                </div>

                                <div className="p-8 text-center space-y-6">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                                            จำนวนเงิน {Number(result.inputAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {result.from.value}
                                        </p>
                                        <div className="text-5xl md:text-7xl font-black text-[#2b2b2b] dark:text-[#ffcc00] tracking-tight flex items-baseline justify-center gap-3 flex-wrap">
                                            <SlotCounter value={result.convertedAmount} decimalPlaces={2} />
                                            <span className="text-2xl md:text-3xl font-bold text-gray-400">{result.to.value}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
                                        <div className="bg-gray-50 dark:bg-[#3d3d3d] px-6 py-3 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-xs text-gray-400 mb-1">อัตราแลกเปลี่ยน (Rate)</p>
                                            <p className="font-mono font-bold text-[#2b2b2b] dark:text-gray-200 text-lg">
                                                1 {result.from.value} = {result.rate.toFixed(6)} {result.to.value}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-[#3d3d3d] px-6 py-3 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-xs text-gray-400 mb-1">อัตราแลกเปลี่ยนย้อนกลับ</p>
                                            <p className="font-mono font-bold text-[#2b2b2b] dark:text-gray-200 text-lg">
                                                1 {result.to.value} = {(1 / result.rate).toFixed(6)} {result.from.value}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        * อัตราแลกเปลี่ยนมีการเปลี่ยนแปลงตลอดเวลา ข้อมูลนี้สำหรับการอ้างอิงเบื้องต้นเท่านั้น
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
