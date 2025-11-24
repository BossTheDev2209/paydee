import { Link } from "react-router-dom";
import Salary from "../images/salary.png";
import Saving from "../images/saving.png";
import AI from "../images/Ai_icon.png";
import { useTheme } from "../context/ThemeContext";
export default function Home() {
  const calculator = [
    {
      id: 1,
      isAi: false,
      path: "/salary-aftertax",
      title: "รายได้สุทธิหลังเสียภาษี",
      details: "คำนวณรายได้หลังหักภาษี",
    },
    {
      id: 2,
      isAi: true,
      path: "/saving-goal",
      title: "เป้าหมายการออม",
      details: "คำนวณเป้าหมายการออม",
    },
    // {
    //   id: 2,
    //   img: AI,
    //   path: "/ai-port",
    //   title: "แนะนำพอร์ตด้วย AI",
    //   details: "แนะนำหุ้นที่เหมาะกับคุณ",
    //   color: "bg-purple-500",
    // },
  ];

  return (
    <div className="w-full">
      <div className="w-full mt-16 p-8 flex flex-col items-center">
        <span className="text-2xl md:text-5xl sm:text-4xl my-3 font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          เครื่องคิดเลข<span className="text-[#ffcc00]">ทางการเงิน</span>
        </span>
        <p className="text-xs md:text-base sm:text-sm text-center text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          ใช้เครื่องคำนวณของเราเพื่อช่วยปรับปรุงงบประมาณรายเดือนของคุณ
          เปรียบเทียบต้นทุน และวางแผนอนาคตของคุณ
        </p>

        <div className="w-full md:w-8/12 xl:w-6/12 flex flex-wrap md:flex-nowrap gap-4 justify-center my-10">
          <a href="#calculate" className="w-full md:w-6/12">
            <button className="w-full btn-base text-[#f2f2f2] dark:text-[#f2f1f1] bg-[#979797] dark:bg-[#353535] border shadow-sm">
              เริ่มต้นใช้งาน
            </button>
          </a>
          <Link to="/financial" className="w-full md:w-6/12">
            <button className="w-full btn-base bg-[#ffcc22] border shadow-sm">
              กรอก Financial Profile
            </button>
          </Link>
        </div>
      </div>

      <div id="calculate" className="w-full flex flex-wrap md:flex-nowrap">
        {calculator.map((item, idx) => (
          <div key={idx} className="w-full flex">
            <div className="w-full py-4 md:px-4 flex">
              <div className="w-full rounded-lg p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300">
                <img src={item.img} className="w-32 h-32" />
                <h2 className="pt-4 font-bold underline text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                  {item.title}
                </h2>
                <p className="text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                  {item.details}
                </p>
                <Link to={item.path} className="w-full">
                  <button className="btn-base bg-[#ffcc00] w-full mt-4">
                    เริ่มการคำนวณ
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
