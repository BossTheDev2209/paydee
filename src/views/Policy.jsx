import { Link } from "react-router-dom";

export default function Policy() {
    return (
            <div className="max-w-4xl mx-auto bg-[#fdfdfd] dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-8 md:p-12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                {/* <Link to="/" className="inline-block mb-8 text-[#979797] hover:text-[#ffcc00] transition-colors">
                    <i className="fa-solid fa-arrow-left-long pr-2"></i>
                    Back to Home
                </Link> */}

                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                    ข้อกำหนดในการใช้งาน <span className="text-[#ffcc00]">(Policy)</span>
                </h1>

                <div className="space-y-12">
                    {/*Terms of Use*/}
                    <section id="terms-of-use" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
                            ข้อตกลงและเงื่อนไขการใช้งาน
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80">
                            [Placeholder]
                        </p>
                    </section>

                    {/*General Disclaimer*/}
                    <section id="disclaimer" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
                            ข้อจำกัดความรับผิดชอบ (Disclaimer)
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80">
                            [Placeholder]
                        </p>
                    </section>

                    {/*Salary After Tax*/}
                    <section id="salary-tax-policy" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
                            นโยบายสำหรับ เครื่องคำนวณภาษี
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80">
                            [Placeholder]
                        </p>
                    </section>

                    {/*Saving Goal*/}
                    <section id="saving-goal-policy" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
                            นโยบายสำหรับ เครื่องคำนวณเป้าหมายการออม
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80">
                            [Placeholder]
                        </p>
                    </section>

                    {/*AI Port*/}
                    <section id="ai-port-policy" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 border-b border-[#e0e0e0] dark:border-[#3d3d3d] pb-2">
                            นโยบายสำหรับ ตัวอย่างแนวโน้มจำลองตลาดหลักทรัพย์
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80">
                            [Placeholder]
                        </p>
                    </section>
                </div>
            </div>
    );
}
