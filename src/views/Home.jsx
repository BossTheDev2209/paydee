import { Link } from "react-router-dom";
import SectionContainer from "../components/SectionContainer";
import CalculatorCarousel from "../components/CalculatorCarousel";
import AI from "../images/Ai_icon.png";
import { motion } from "framer-motion";

export default function Home() {

  const popularCalculators = [
    {
      id: 1,
      path: "/salary-aftertax",
      title: "รายได้สุทธิหลังภาษี",
      details: "คำนวณรายได้หลังหักภาษี",
      bgColor: "#67B8FF",
      isAi: true,
      aiIcon: AI
    },
    {
      id: 2,
      path: "/saving-goal",
      title: "เป้าหมายการออม",
      details: "คำนวณเป้าหมายการออม",
      bgColor: "#867CFF",
      isAi: true,
      aiIcon: AI
    },
    {
      id: 3,
      path: "/ai-port",
      title: "ตัวอย่างแนวโน้มจำลองตลาดหลักทรัพย์",
      details: "แนะนำหุ้นที่เหมาะกับคุณ",
      bgColor: "#FF8CA2",
      isAi: true,
      aiIcon: AI
    },
    {
      id: 4,
      path: "/debt-management",
      title: "บริหารหนี้สิน",
      details: "วางแผนจัดการหนี้สิน",
      bgColor: "#50df84",
      icon: "fa-solid fa-hand-holding-dollar"
    }
  ];
  {/*mockup*/ }
  const category1 = [
    { id: 101, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
    { id: 102, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
    { id: 103, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
    { id: 104, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
  ];

  const category2 = [
    { id: 201, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
    { id: 202, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
    { id: 203, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
    { id: 204, path: "#", title: "ชื่อ", details: "คำอธิบาย", bgColor: "#FFE66D" },
  ];

  return (
    <div className="w-full min-h-screen pb-20 bg-gray-50 dark:bg-[#1a1a1a]">
      {/* Hero Section with Visual Interest */}
      <div className="relative w-full overflow-hidden rounded-b-[40px] shadow-xl">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffcc00] via-[#ffd633] to-[#ffe066]"></div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/15 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full pt-24 md:pt-28 pb-16 px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#2b2b2b] mb-4 leading-tight">
              เครื่องคิดเลข<br className="md:hidden" />
              <span className="relative">
                ทางการเงิน
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
            className="text-base md:text-lg text-[#2b2b2b]/80 max-w-2xl mb-10 leading-relaxed"
          >
            ใช้เครื่องคำนวณของเราเพื่อช่วยปรับปรุงงบประมาณรายเดือนของคุณ<br className="hidden md:block" />
            เปรียบเทียบต้นทุน และวางแผนอนาคตของคุณ
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center"
          >
            <button
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#2b2b2b] text-white rounded-xl font-bold text-lg hover:bg-[#1a1a1a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto min-w-[220px] shadow-lg"
              onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>เลือกเครื่องคำนวณ</span>
              <i className="fa-solid fa-arrow-down group-hover:translate-y-1 transition-transform"></i>
            </button>

            <Link to="/financial" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white text-[#2b2b2b] rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg min-w-[220px] border-2 border-[#2b2b2b]/10">
                ไปกรอก ข้อมูลศูนย์กลาง
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div id="calculators" className="max-w-6xl mx-auto px-4 space-y-8 pt-12">

        <SectionContainer title="ยอดนิยม" featured>
          <CalculatorCarousel items={popularCalculators} large />
        </SectionContainer>

        <SectionContainer title="เครื่องคำนวณใช้สูตร">
          <CalculatorCarousel items={category1} />
        </SectionContainer>

        <SectionContainer title="เครื่องคำนวณฝังปัญญาประดิษฐ์">
          <CalculatorCarousel items={category2} />
        </SectionContainer>

      </div>
    </div>
  );
}
