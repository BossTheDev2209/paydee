import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionContainer from "../components/SectionContainer";
import CalculatorCarousel from "../components/CalculatorCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { popularCalculators, category1, category2, lifestyleCalculators } from "../data/calculators";

export default function Home() {
  const [lastPath, setLastPath] = useState(localStorage.getItem('lastPath'));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["เงิน", "สุขภาพ", "ไลฟ์สไตล์"];

  // Cycle through words every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen pb-20 bg-gray-50 dark:bg-[#1a1a1a]">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden rounded-b-[40px] shadow-xl bg-gradient-to-br from-[#ffcc00] via-[#ffd633] to-[#ffe066]">
        {/* Background Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/15 blur-3xl"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full pt-20 md:pt-28 pb-12 px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-[#2b2b2b] mb-6 leading-relaxed">
              จัดการ
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 90 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="inline-block mx-2"
                >
                  {words[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
              ของคุณ<br />
              <span className="relative inline-block">
                ให้ง่ายขึ้น
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#2b2b2b" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-[#2b2b2b]/80 max-w-xl mb-8 leading-relaxed font-medium"
          >
            เครื่องมือคำนวณภาษี เงินออม และการลงทุน ที่ออกแบบมาเพื่อนคนไทย
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <button
              className="w-full max-w-xs px-8 py-5 btn-primary transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-xl"
              onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>เริ่มคำนวณทันที</span>
              <i className="fa-solid fa-calculator"></i>
            </button>

            <div className="flex items-center gap-4 text-xs md:text-sm font-semibold text-[#2b2b2b]/60 mt-2 bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-shield-halved"></i> ไม่ต้องสมัครสมาชิก
              </span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-database"></i> ข้อมูลเก็บในเครื่องเท่านั้น
              </span>
            </div>

            {lastPath && (
              <Link to={lastPath} className="mt-4 text-sm font-bold text-[#2b2b2b] hover:underline flex items-center gap-1 group">
                <i className="fa-solid fa-clock-rotate-left group-hover:-rotate-12 transition-transform"></i>
                ทำรายการต่อจากล่าสุด
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div id="calculators" className="max-w-6xl mx-auto px-4 space-y-12 pt-12">

        {/* Helper/Formula Section - Plain and Friendly */}
        <SectionContainer title="เครื่องมือช่วยคำนวณ (Formula Based)" subtitle="คำนวณแม่นยำ ตามสูตรมาตรฐาน">
          <CalculatorCarousel items={category1} />
        </SectionContainer>

        {/* AI Section - Highlighted */}
        <SectionContainer title="ผู้ช่วยอัจฉริยะ (AI Powered)" subtitle="วิเคราะห์ข้อมูลเชิงลึกด้วย AI">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl -m-4"></div>
            <CalculatorCarousel items={category2} />
          </div>
        </SectionContainer>

        {/* Lifestyle Section - New */}
        <SectionContainer title="เครื่องมือไลฟ์สไตล์" subtitle="ดูแลสุขภาพและคุณภาพชีวิต">
          <CalculatorCarousel items={lifestyleCalculators} />
        </SectionContainer>

      </div>
    </div>
  );
}
