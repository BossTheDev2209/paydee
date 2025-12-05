import { useNavigate } from "react-router-dom";
import SectionContainer from "../components/SectionContainer";
import { Link } from "react-router-dom";

export default function InvestmentInfo() {
    const navigate = useNavigate();

    const investmentTypes = [
        {
            id: "bank",
            title: "เงินฝากธนาคาร",
            detail: "เป็นการนำเงินฝากไว้กับธนาคาร",
            returns: "ดอกเบี้ย(ค่อนข้างน้อย)",
            risk: "ต่ำ",
            riskColor: "text-green-500",
            icon: "fa-solid fa-piggy-bank"
        },
        {
            id: "bonds",
            title: "พันธบัตรรัฐบาล",
            detail: "เป็นการให้รัฐบาลกู้ยืมเงินจากผู้ซื้อ",
            returns: "ดอกเบี้ย(มักสูงกว่าธนาคาร)",
            risk: "ต่ำ",
            riskColor: "text-green-500",
            icon: "fa-solid fa-file-contract"
        },
        {
            id: "gold",
            title: "ทองคำ",
            detail: "เป็นการนำเงินไปซื้อทอง ซึ่งอาจอยู่ในรูปแบบทองคำแท่ง ทองรูปพรรณ หรือกองทุนทองคำ",
            returns: "ส่วนต่างจากราคาที่เพิ่มสูงขึ้นเทียบระหว่างตอนซื้อและขาย",
            risk: "ปานกลาง",
            riskColor: "text-yellow-500",
            icon: "fa-solid fa-coins"
        },
        {
            id: "funds",
            title: "กองทุนรวม",
            detail: "เป็นการนำเงินไปให้กับผู้จัดการกองทุน ซึ่งมีหน้าที่นำเงินที่ได้ไปลงทุน",
            returns: "ส่วนต่างจากราคาหลักทรัพย์ที่สูงขึ้น",
            risk: "ปานกลาง",
            riskColor: "text-yellow-500",
            icon: "fa-solid fa-chart-pie"
        },
        {
            id: "estate",
            title: "อสังหาริมทรัพย์",
            detail: "เป็นการนำเงินไปซื้ออสังหาริมทรัพย์ เช่น บ้าน คอนโด ที่ดิน",
            returns: "ค่าเช่า/ส่วนต่างของราคา",
            risk: "สูง",
            riskColor: "text-orange-500",
            icon: "fa-solid fa-building"
        },
        {
            id: "share",
            title: "หุ้น",
            detail: "เป็นการนำเงินไปซื้อส่วนแบ่งของบริษัท หรือก็คือการซื้อสิทธิในการเป็นเจ้าของ",
            returns: "ส่วนแบ่งกำไรและส่วนต่างราคาหุ้น",
            risk: "สูงมาก",
            riskColor: "text-red-500",
            icon: "fa-solid fa-chart-line"
        },
    ];

    return (
        <section className="w-full min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20">
            {/* Header Section - Standardized */}
            <div className="w-full bg-[#ffcc00] py-8 md:py-12 px-4 shadow-md mb-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
                        ข้อที่ควรรู้ก่อนการลงทุน
                    </h1>
                    <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
                        ข้อมูลพื้นฐานเพื่อเตรียมความพร้อมก่อนเริ่มลงทุน
                    </h3>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <Link to="/" className="inline-flex items-center text-[#979797] hover:text-[#2b2b2b] dark:hover:text-white transition-colors duration-300 mb-6">
                    <i className="fa-solid fa-arrow-left-long mr-2"></i>
                    Back to Home
                </Link>

                {/* Intro Section */}
                <SectionContainer title="การลงทุนคืออะไร ?">
                    <p className="text-base md:text-lg leading-relaxed text-[#3d3d3d] dark:text-[#f2f1f1] indent-8">
                        คือการนำทรัพย์สินที่มีมูลค่ามาใช้เพื่อสร้างผลตอบแทน
                        หรือกำไรที่อาจะเกิดขึ้นในอนาคต
                        ซึ่งสามารถแบ่งออกได้เป็นหลายประเภทโดยแต่ละประเภทจะมีความเสี่ยงในการลงทุนที่แตกต่างกันโดยดูจากโอกาสที่การลงทุนนั้น
                        ๆ จะทำให้เกิดการขาดทุนได้
                    </p>
                </SectionContainer>

                {/* Scroll Indicator */}
                <div className="flex flex-col items-center justify-center py-6 animate-bounce text-gray-400 dark:text-gray-500">
                    <span className="text-sm mb-2">เลื่อนเพื่ออ่านต่อ</span>
                    <i className="fa-solid fa-chevron-down text-2xl"></i>
                </div>

                {/* Investment Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {investmentTypes.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-[#3d3d3d] rounded-2xl p-6 shadow-sm border border-transparent hover:border-[#ffcc00]/50 transition-all duration-300 hover:shadow-md flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[#ffcc00]/20 flex items-center justify-center text-[#ffcc00] text-xl">
                                    <i className={item.icon}></i>
                                </div>
                                <h3 className="text-xl font-bold text-[#2b2b2b] dark:text-white">{item.title}</h3>
                            </div>

                            <div className="flex-grow space-y-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
                                <p><span className="font-semibold text-gray-900 dark:text-gray-100">รายละเอียด:</span> {item.detail}</p>
                                <p><span className="font-semibold text-gray-900 dark:text-gray-100">ผลตอบแทน:</span> {item.returns}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">ความเสี่ยง</span>
                                <span className={`font-bold ${item.riskColor}`}>{item.risk}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Requirements Section */}
                <SectionContainer title="อยากจะเริ่มลงทุน ต้องทำอย่างไร?">
                    <div className="space-y-6 text-[#3d3d3d] dark:text-[#f2f1f1]">
                        <div>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-clipboard-check text-[#ffcc00]"></i>
                                สิ่งที่ควรมีก่อนการลงทุน
                            </h3>
                            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
                                <li> เอกสารยืนยันตัวตน เช่น บัตรประชาชน หรือหนังสือเดินทาง </li>
                                <li> บัญชีธนาคารที่สามารถใช้งานได้ </li>
                                <li> สำหรับผู้ที่อายุไม่เกิน 20 ปี จะไม่สามารถเปิดบัญชีได้ด้วยตัวเอง </li>
                                <li> เงินทุนที่มากพอสำหรับการลงทุน หรือเป็นเงินที่พร้อมจะสูญเสียได้ </li>
                                <li> ความรู้พื้นฐานในการลงทุน และการติดตามเงินในพอร์ตการลงทุนอย่างต่อเนื่อง </li>
                                <li> เข้าใจถึงเป้าหมายในการลงทุน </li>
                            </ul>
                        </div>

                        <div className="bg-[#ffcc00]/10 p-4 rounded-xl border border-[#ffcc00]/20">
                            <p className="text-base md:text-lg">
                                เมื่อมีสิ่งที่ควรมีสำหรับการเริ่มลงทุนครบแล้ว ก็สามารถเริ่มได้จากการ
                                <span className="font-bold"> เปิดบัญชีซื้อขายหลักทรัพย์ </span>
                                หรืออาจเปิดบัญชีผ่านบริษัทหลักทรัพย์หรือโบรกเกอร์ ซึ่งควรเลือกบริษัทที่น่าเชื่อถือ
                            </p>
                        </div>
                    </div>
                </SectionContainer>

                {/* How to Profit Section */}
                <SectionContainer title="เราจะได้กำไรจากตลาดหลักทรัพย์ได้อย่างไร">
                    <p className="text-base md:text-lg leading-relaxed text-[#3d3d3d] dark:text-[#f2f1f1] indent-8">
                        ในกราฟการเปลี่ยนแปลงของราคาตลาดตามเวลา หากพิจารณาที่ช่วงเวลาหนึ่ง ๆ
                        (เช่น 1 วัน หรือ 5 นาที) เราจะสามารถบอกข้อมูลหลัก ๆ ได้ 4 อย่าง คือ
                        ราคาเปิด ราคาปิด ราคาสูงสุด และราคาต่ำสุด
                        กำไรเกิดขึ้นเมื่อ <span className="font-bold text-green-600">ราคาขาย สูงกว่า ราคาซื้อ</span>
                    </p>
                </SectionContainer>


                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 w-full pb-10">
                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-3 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[200px]"
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        onClick={() => navigate("/ai-port")}
                        className="group px-8 py-3 rounded-full bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#e6b800] transition-colors shadow-lg hover:shadow-xl min-w-[200px] flex items-center justify-center gap-2"
                    >
                        เข้าใจแล้ว
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>

            </div>
        </section>
    );
}
