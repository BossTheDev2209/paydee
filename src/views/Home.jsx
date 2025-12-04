import { Link } from "react-router-dom";
import SectionContainer from "../components/SectionContainer";
import CalculatorCarousel from "../components/CalculatorCarousel";
import AI from "../images/Ai_icon.png";

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
  {/*mockup*/}
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
    <div className="w-full min-h-screen pb-20 bg-[#f2f2f2] dark:bg-[#303030]">
      {/*Hero*/}
      <div className="w-full pt-20 pb-12 px-4 flex flex-col items-center text-center animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] mb-4">
          เครื่องคิดเลข<span className="text-[#ffcc00]">ทางการเงิน</span>
        </h1>
        <p className="text-sm md:text-base text-[#3d3d3d]/80 dark:text-[#f2f1f1]/80 max-w-2xl mb-10">
          ใช้เครื่องคำนวณของเราเพื่อช่วยปรับปรุงงบประมาณรายเดือนของคุณ<br className="hidden md:block" />
          เปรียบเทียบต้นทุน และวางแผนอนาคตของคุณ
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
          <button className="flex items-center justify-center px-6 py-3 bg-[#e0e0e0] dark:bg-[#4a4a4a] text-[#3d3d3d] dark:text-[#f2f1f1] rounded-lg font-medium hover:bg-[#d0d0d0] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 ease-in-out w-full sm:w-auto min-w-[200px]" onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>เลือกเครื่องคำนวณ</span>
          </button>

          <Link to="/financial" className="w-full sm:w-auto">
            <button className="w-full px-6 py-3 bg-[#ffcc00] text-[#2b2b2b] rounded-lg font-bold hover:bg-[#e6b800] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 ease-in-out shadow-sm min-w-[200px]">
              ไปกรอก ข้อมูลศูนย์กลาง
            </button>
          </Link>
        </div>
      </div>

      {/*Content*/}
      <div id="calculators" className="max-w-6xl mx-auto px-4 space-y-8">

        <SectionContainer title="ยอดนิยม">
          <CalculatorCarousel items={popularCalculators} />
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
