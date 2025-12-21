import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Use standard components
import { CalculatorSection, CalculatorInput } from "@/components/salary/CalculatorComponents";

export default function AIPort() {
  const [yearInput, setYearInput] = useState("10");
  const [loading, setLoading] = useState(false);
  const [market, setMarket] = useState(null);

  // Wrapper to match CalculatorInput's expected signature
  const setFieldValue = (name, value) => {
    if (name === "year") {
      setYearInput(value);
    }
  };

  // Debounce API calls when input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const cleanValue = yearInput.replace(/,/g, '');
      if (cleanValue) {
        fetchMarketData(cleanValue);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [yearInput]);

  const fetchMarketData = async (years = "10") => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://market-stock-suggestion.onrender.com/market_stock/listing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            years_forecast: years,
            n_sims: "50000",
          }),
        }
      );

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setMarket(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
      return null;
    }
  };

  // Initial fetch handled by the debounce effect on mount since yearInput has default "10"
  // But to avoid double fetch if needed, we can leave it or trust the effect.
  // The effect will run on mount.

  const sectors = [
    { key: "INDUS", name: "อุตสาหกรรม", color: "text-purple-600", bg: "bg-purple-100", border: "hover:border-purple-500", icon: "fa-solid fa-industry" },
    { key: "TECH", name: "เทคโนโลยี", color: "text-blue-600", bg: "bg-blue-100", border: "hover:border-blue-500", icon: "fa-solid fa-microchip" },
    { key: "CONSUMP", name: "สินค้าอุปโภคบริโภค", color: "text-orange-600", bg: "bg-orange-100", border: "hover:border-orange-500", icon: "fa-solid fa-basket-shopping" },
    { key: "PROPCON", name: "อสังหาริมทรัพย์และก่อสร้าง", color: "text-amber-700", bg: "bg-amber-100", border: "hover:border-amber-500", icon: "fa-solid fa-hotel" },
    { key: "ARGO", name: "เกษตรและอุตสาหกรรมอาหาร", color: "text-green-600", bg: "bg-green-100", border: "hover:border-green-500", icon: "fa-solid fa-leaf" },
    { key: "SERVICE", name: "บริการ", color: "text-pink-600", bg: "bg-pink-100", border: "hover:border-pink-500", icon: "fa-solid fa-bell-concierge" },
    { key: "RESOURC", name: "ทรัพยากร", color: "text-cyan-600", bg: "bg-cyan-100", border: "hover:border-cyan-500", icon: "fa-solid fa-oil-well" },
    { key: "FINCIAL", name: "ธุรกิจการเงิน", color: "text-indigo-600", bg: "bg-indigo-100", border: "hover:border-indigo-500", icon: "fa-solid fa-coins" },
    { key: "SET", name: "SET Index", color: "text-red-600", bg: "bg-red-100", border: "hover:border-red-500", icon: "fa-solid fa-chart-line" },
  ];

  const DataCard = ({ sectorKey, sectorName, branding }) => {
    const data = market ? market[sectorKey] : null;

    if (loading || !data) {
      return (
        <div className="bg-white dark:bg-[#3d3d3d] rounded-2xl p-6 shadow-sm border border-transparent h-full flex flex-col items-center justify-center min-h-[220px] animate-pulse">
          <div className={`w-16 h-16 rounded-full mb-4 ${branding.bg} opacity-50`}></div>
          <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      );
    }

    return (
      <div className={`group bg-white dark:bg-[#3d3d3d] rounded-2xl p-6 shadow-sm border border-transparent ${branding.border} transition-all duration-300 hover:shadow-lg h-full flex flex-col relative overflow-hidden`}>
        {/* Decorative Background Icon */}
        <div className={`absolute -right-6 -bottom-6 text-9xl opacity-5 pointer-events-none ${branding.color} transition-transform group-hover:scale-110 group-hover:rotate-12`}>
          <i className={branding.icon}></i>
        </div>

        <div className="flex items-center gap-4 mb-6 z-10 relative">
          <div className={`w-14 h-14 rounded-2xl ${branding.bg} flex items-center justify-center ${branding.color} text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
            <i className={branding.icon}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white truncate" title={data.Name}>
              {data.Name || sectorName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{sectorKey}</p>
          </div>
        </div>

        <div className="bg-gray-50/50 dark:bg-[#2b2b2b]/50 rounded-xl p-5 space-y-5 flex-grow backdrop-blur-sm z-10 relative border border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ราคาปัจจุบัน</span>
            <div className="text-right">
              <span className="block text-2xl font-bold text-[#2b2b2b] dark:text-white tracking-tight">
                {data.start_price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">คาดการณ์ ({yearInput} ปี)</span>
            <div className="text-right">
              <span className={`block text-2xl font-bold tracking-tight ${data.median >= data.start_price ? 'text-green-500' : 'text-red-500'}`}>
                {data.median.toFixed(2)}
              </span>
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${data.median >= data.start_price ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {data.median >= data.start_price ? <i className="fa-solid fa-arrow-trend-up mr-1 text-[10px]"></i> : <i className="fa-solid fa-arrow-trend-down mr-1 text-[10px]"></i>}
                {((Math.abs(data.median - data.start_price) / data.start_price) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">โอกาสกำไร</span>
              <span className={`text-sm font-bold ${branding.color}`}>{data.prob_gain.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${data.prob_gain > 0.5 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(data.prob_gain * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Group sectors based on probability
  const highOpportunity = [];
  const lowOpportunity = [];

  sectors.forEach(sector => {
    const data = market ? market[sector.key] : null;
    // Default to putting in low if no data yet, creates skeleton effect
    if (!data || data.prob_gain <= 0.5) {
      lowOpportunity.push(sector);
    } else {
      highOpportunity.push(sector);
    }
  });

  // Sort: High opp by greatest prob, Low opp by greatest prob (descending)
  if (market) {
    highOpportunity.sort((a, b) => (market[b.key].prob_gain - market[a.key].prob_gain));
    lowOpportunity.sort((a, b) => (market[b.key].prob_gain - market[a.key].prob_gain));
  }

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
      {/* Header Section */}
      <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
            จำลองแนวโน้มตลาดหลักทรัพย์
          </h1>
          <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
            จำลองผลตอบแทนของกลุ่มอุตสาหกรรมในอนาคตด้วย Monte Carlo Simulation
          </h3>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Link to="/investment-info" className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6">
          <i className="fa-solid fa-arrow-left-long mr-2"></i>
          Back to Info
        </Link>

        {/* Warning Banner */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mb-8 shadow-sm">
          <div className="flex items-start">
            <i className="fa-solid fa-circle-exclamation text-red-500 mt-1 mr-3 text-lg"></i>
            <div>
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">คำเตือนสำคัญ</h3>
              <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                การคาดการณ์นี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ข้อมูลเป็นการจำลองทางสถิติและมีความไม่แน่นอน
                มิใช่ข้อมูลราคาจริงในอนาคต ทางเราไม่รับผิดชอบต่อความเสียหายใดๆ จากการนำข้อมูลนี้ไปใช้ตัดสินใจลงทุน
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section using Standard Components */}
        <CalculatorSection title="ตั้งค่าการคำนวณ">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="w-full md:w-1/2">
              <CalculatorInput
                label="จำนวนปีล่วงหน้า"
                name="year"
                placeholder="ระบุจำนวนปี (เช่น 10)"
                value={yearInput}
                setFieldValue={setFieldValue}
                unit="ปี"
              />
              {loading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-[#ffcc00] animate-pulse font-medium">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  กำลังประมวลผล AI...
                </div>
              )}
            </div>
            <div className="pb-4 text-sm text-gray-500 dark:text-gray-400 flex flex-col items-end">
              <span className="text-xs opacity-70 mb-1">ข้อมูลตลาดหลักทรัพย์ (Real-time Simulation)</span>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>{market?.Last_Time_for_index ? `อัปเดต: ${market.Last_Time_for_index}` : "รอสักครู่..."}</span>
              </div>
            </div>
          </div>
        </CalculatorSection>

        {/* High Opportunity Section */}
        {highOpportunity.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                โอกาสกำไรสูง (มากกว่า 50%)
              </h2>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">แนะนำ</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highOpportunity.map((sector) => (
                <DataCard key={sector.key} sectorKey={sector.key} sectorName={sector.name} branding={sector} />
              ))}
            </div>
          </div>
        )}

        {/* Low Opportunity Section */}
        {lowOpportunity.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-orange-500">
              <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                โอกาสกำไรต่ำ/ปานกลาง (น้อยกว่า 50%)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lowOpportunity.map((sector) => (
                <DataCard key={sector.key} sectorKey={sector.key} sectorName={sector.name} branding={sector} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
