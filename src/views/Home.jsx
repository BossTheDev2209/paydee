import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Salary from "../images/salary.png";
import Saving from "../images/saving.png";
import { useTheme } from "../context/ThemeContext";
import AI from "../images/Ai_icon.png";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const cardWidth = 127;

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

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
  // const settings = {
  //   dots: true,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 4,
  //   initialSlide: 0,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //         infinite: true,
  //         dots: true,
  //       },
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2,
  //         initialSlide: 2,
  //         infinite: true,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         infinite: true,
  //         centerMode: false,
  //       },
  //     },
  //   ],
  // };

  return (
    <div className="w-full">
      <div className="w-full mt-16 p-8 flex flex-col items-center">
        <span className="text-nowrap text-2xl md:text-5xl sm:text-4xl my-3 font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          เครื่องคิดเลข<span className="text-[#ffcc00]">ทางการเงิน</span>
        </span>
        <p className="text-xs md:text-base sm:text-sm text-center text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
          ใช้เครื่องคำนวณของเราเพื่อช่วยปรับปรุงงบประมาณรายเดือนของคุณ
          เปรียบเทียบต้นทุน และวางแผนอนาคตของคุณ
        </p>

        <div className="w-full md:w-8/12 xl:w-6/12 flex flex-wrap md:flex-nowrap gap-4 justify-center my-10">
          <a href="#calculate" className="w-full md:w-6/12">
            <button className="w-full btn-base text-[#f2f2f2] dark:text-[#f2f1f1] bg-[#979797] dark:bg-[#353535] border shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 ease-in-out">
              เริ่มต้นใช้งาน
            </button>
          </a>
          <Link to="/financial" className="w-full md:w-6/12">
            <button className="w-full btn-base bg-[#ffcc22] border shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 ease-in-out">
              กรอก Financial Profile
            </button>
          </Link>
        </div>
      </div>

      <div id="calculate" className="w-full overflow-hidden">
        {/* <Slider {...settings} className="w-full">
          {calculator.map((calc) => (
            <div className="w-full">
              <Link to={calc.path} className="w-full flex p-2 md:p-4">
                <div //dont change the div closing tag idk why
                  title={calc.title}
                  className={`w-full h-60 rounded-lg shadow-xl hover:shadow-slate-400 dark:hover:shadow-slate-800 dark:hover:shadow-xl flex justify-between p-4 cursor-pointer relative hover:scale-[1.02] transition-transform duration-300 ease-in-out`}
                  style={{ backgroundColor: calc.calcColor }}
                  key={calc.id}
                >
                  {/* Top-left AI icon */}
        {/* <div className="absolute top-4 left-4">
                    {calc.isAi && (
                      <img
                        src={AI}
                        alt="AI"
                        className="w-14 h-14 rounded-full"
                      />
                    )}
                  </div> */}

        {/* content on left, btn on right */}
        {/* <div className="flex flex-wrap items-end justify-between gap-4 mt-auto">
                    <div className="w-full flex flex-col gap-1 flex-1">
                      <h2 className="text-[#f2f1f1] font-bold text-base lg:text-2xl">
                        {calc.title}
                      </h2>
                      <p className="text-[#f2f1f1] font-medium text-sm">
                        {calc.details}
                      </p>
                    </div>
                    <button className="w-full lg:w-6/12 text-sm text-[#202121] font-semibold bg-[#ffcc00] px-5 py-2 rounded-full hover:shadow-md hover:scale-[1.05] active:scale-[0.98] transition-transform duration-300 ease-in-out flex-shrink-0 whitespace-nowrap">
                      เริ่มการคำนวณ
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider> */}

        <div className="w-full flex relative">
          <button
            className="absolute top-1/2 -translate-y-1/2 z-10 p-2 bg-[#ffcc00] rounded-full shadow
               left-2 block lg:hidden"
            onClick={scrollLeft}
          >
            <i className="fa-solid fa-angle-left bg-[#ffcc00] px-1.5 py-1 rounded-full"></i>
          </button>

          <div className="px-10 w-full flex overflow-x-hidden scroll-smooth"
          ref={containerRef}
          >
            {calculator.map((item, idx) => (
              <div key={idx} className="w-full p-4 flex">
                <Link to={item.path} className="w-full flex">
                  <div
                    className="w-full flex flex-col justify-end p-4 rounded-lg overflow-hidden"
                    style={{ backgroundColor: item.calcColor }}
                  >
                    <section className="w-full h-6/12">
                      {item.isAi && (
                        <img
                          src={AI}
                          alt="AI"
                          className="w-4/12 rounded-full"
                        />
                      )}
                    </section>

                    <section className="w-full h-6/12">
                      <p className="text-sm font-semibold tex-nowrap truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-nowrap truncate">
                        {item.details}
                      </p>
                      <button className="overflow-hidden truncate w-full text-nowrap bg-[#ffcc00] border rounded-full mt-4 text-sm font-semibold py-1 px-2">
                        เริ่มการคำนวณ
                      </button>
                    </section>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button
            className="absolute top-1/2 -translate-y-1/2 z-10 p-2 bg-[#ffcc00] rounded-full shadow
               right-2 block lg:hidden"
            onClick={scrollRight}
          >
            <i className="fa-solid fa-angle-right bg-[#ffcc00] px-1.5 py-1 rounded-full"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
