import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-[#f2f2f2] dark:bg-[#303030] pt-20 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-[#fdfdfd] dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-8 md:p-12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        <Link to="/" className="inline-block mb-8 text-[#979797] hover:text-[#ffcc00] transition-colors">
          <i className="fa-solid fa-arrow-left-long pr-2"></i>
          Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          About <span className="text-[#ffcc00]">PayDee</span>
        </h1>

        <div className="space-y-12">
          {/* Introduction Section */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
              เกี่ยวกับเรา
            </h2>
            <p className="text-lg leading-relaxed opacity-80 mb-6">
              Paydee
              เป็นเครื่องมือคำนวณการเงินที่ออกแบบมาเพื่อช่วยให้ทุกคนสามารถวางแผนการเงินได้ง่ายขึ้น
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              เราเชื่อว่าการวางแผนการเงินไม่ควรซับซ้อน
              ด้วยเครื่องมือที่ใช้งานง่ายและอินเทอร์เฟซที่เป็นมิตร
              ทุกคนสามารถเริ่มต้นจัดการการเงินส่วนตัวได้
            </p>
          </section>

          {/* Features Section */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
              Features
            </h2>
            <ul className="list-disc pl-6 text-lg leading-relaxed opacity-80 space-y-2">
              <li>คำนวณรายได้หลังหักภาษีและค่าใช้จ่าย</li>
              <li>วางแผนการออมเงินให้ถึงเป้าหมาย</li>
              <li>ใช้งานง่าย รองรับทุกอุปกรณ์</li>
              <li>ใช้งานฟรี ไม่มีค่าใช้จ่าย</li>
            </ul>
          </section>

          <section className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
              Team
            </h2>
            <p className="text-lg leading-relaxed opacity-80">
              Developed by YDP Fellowship (Team 7)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
