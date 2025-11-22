import { useState } from "react";
import QuickMode from "./salary-tab/QuickMode";
import DetailedMode from "./salary-tab/DetailedMode";

export default function AboutUs() {
  return (
    <section className="w-full flex flex-col items-center">
      <h1 className="w-full md:w-10/12 text-2xl md:text-4xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        About Paydee
      </h1>

      <div className="w-full flex justify-center">
        {/* personal detail */}
        <section className="w-full md:w-10/12">
          <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-6">
            <p className="text-base md:text-xl text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
              Paydee
              เป็นเครื่องมือคำนวณการเงินที่ออกแบบมาเพื่อช่วยให้ทุกคนสามารถวางแผนการเงินได้ง่ายขึ้น
            </p>
            <p className="text-base md:text-xl text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300 mt-6">
              เราเชื่อว่าการวางแผนการเงินไม่ควรซับซ้อน
              ด้วยเครื่องมือที่ใช้งานง่ายและอินเทอร์เฟซที่เป็นมิตร
              ทุกคนสามารถเริ่มต้นจัดการการเงินส่วนตัวได้
            </p>
            <h1 className="w-full md:w-10/12 text-lg md:text-2xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300 mt-8">
              Features
            </h1>
            <ul className="list-disc pl-4 text-sm md:text-lg text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
              <li>คำนวณรายได้หลังหักภาษีและค่าใช้จ่าย</li>
              <li>วางแผนการออมเงินให้ถึงเป้าหมาย</li>
              <li>ใช้งานง่าย รองรับทุกอุปกรณ์</li>
              <li>ใช้งานฟรี ไม่มีค่าใช้จ่าย</li>
            </ul>
            <hr className="my-6" />
            <p className="text-sm md:text-lg text-[#979797] dark:text-[#979797] transition-colors duration-300 text-nowrap">Developed by YDP Fellowship (Team 7)</p>
          </div>
        </section>
      </div>
    </section>
  );
}
