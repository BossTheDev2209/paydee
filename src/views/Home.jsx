import { Link } from "react-router-dom";
import Salary from "../images/salary.png";
import Saving from "../images/saving.png";
import AI from "../images/Ai_icon.png";
import { useTheme } from "../context/ThemeContext";
export default function Home() {
  const calculator = [
    {
      id: 1,
      img: AI,
      path: "/salary-aftertax",
      title: "รายได้สุทธิหลังเสียภาษี",
      details: "คำนวณรายได้หลังหักภาษี",
    },
    {
      id: 2,
      img: AI,
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
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          เครื่องคิดเลข <span className="text-light-primary">ทางการเงิน</span>
        </span>
        <p className="text-center text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          ใช้เครื่องคำนวณของเราเพื่อช่วยปรับปรุงงบประมาณรายเดือนของคุณ
          เปรียบเทียบต้นทุน และวางแผนอนาคตของคุณ
        </p>

        <div className="flex gap-4 mt-10 mb-10">
         <a href="#calculate"> <button className="btn-base bg-[#fdfdfd] text-[#3d3d3d] dark:bg-[#202121] dark:text-[#f2f1f1] transition-colors duration-300">เริ่มต้นใช้งาน</button> </a> 
          <Link to="/financial">
            <button className="btn-base bg-[#ffcc00]">
              ไปกรอก financial profile
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
                <h2 className="pt-4 font-bold underline text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">{item.title}</h2>
                <p className="text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">{item.details}</p>
                <Link to={item.path} className="w-full">
                  <button className="btn-base bg-[#ffcc00] w-full mt-4"> เริ่มการคำนวณ </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
