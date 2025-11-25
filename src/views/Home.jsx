import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Salary from "../images/salary.png";
import Saving from "../images/saving.png";
import { useTheme } from "../context/ThemeContext";
import AI from "../images/Ai_icon.png";
export default function Home() {
  const calculator = [
    {
      id: 1,
      isAi: false,
      path: "/salary-aftertax",
      title: "รายได้สุทธิหลังเสียภาษี",
      details: "คำนวณรายได้หลังหักภาษี",
      calcColor: "#67B8FF",
    },
    {
      id: 2,
      isAi: true,
      path: "/saving-goal",
      title: "เป้าหมายการออม",
      details: "คำนวณเป้าหมายการออม",
      calcColor: "#867CFF",
    },
    {
      id: 3,
      isAi: true,
      path: "/ai-port",
      title: "แนะนำพอร์ตด้วย AI",
      details: "แนะนำหุ้นที่เหมาะกับคุณ",
      calcColor: "#FF8CA2",
    },
    {
      id: 4,
      isAi: false,
      path: "/debt-management",
      title: "บริหารหนี้สิน",
      details: "แนะนำวิธีการบริหารหนี้สิน",
      calcColor: "#50df84",
    },
  ];

  //setting carousel here!!
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  };
  
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

      <div id="calculate" className="w-full">

        <Slider {...settings}>
        {calculator.map((calc) => (
          <Link to={calc.path}>
          <div //dont change the div closing tag idk why
            title={calc.title}
            className={`w-auto h-60 m-4 rounded-lg shadow-lg hover:shadow-slate-400 dark:hover:shadow-slate-800 dark:hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between p-4 cursor-pointer relative`}
            style={{ backgroundColor: calc.calcColor }}
            key={calc.id}
          >
            {/* Top-left AI icon */}
              <div className="absolute top-4 left-4">
                {calc.isAi && (
                  <img src={AI} alt="AI" className="w-14 h-14 rounded-full" />
                )}
            </div>

              {/* content on left, btn on right */}
              <div className="flex items-end justify-between gap-4 mt-auto">
                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="text-[#f2f1f1] font-bold text-2xl">{calc.title}</h2>
                  <p className="text-[#f2f1f1] font-medium text-sm">{calc.details}</p>
                </div>
                <button className="text-sm text-[#202121] font-semibold bg-[#ffcc00] px-5 py-2 rounded-full hover:shadow-md transition-shadow flex-shrink-0 whitespace-nowrap">
                  เริ่มการคำนวณ
                </button>
              </div>
            </div>
          </Link>
        ))}
        </Slider>
        
      </div>
    </div>
  );
}
