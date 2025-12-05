import { color } from "framer-motion";
import { useState, useEffect } from "react";
import { Label } from "recharts";

export default function AIPort() {
  const [loading, setLoading] = useState(false);
  const [market, setMarket] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch("https://market-stock-suggestion.onrender.com/market_stock/listing"),
  //     { method: "GET", headers: { "Content-Type": "application/json" } };
  // });

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://market-stock-suggestion.onrender.com/market_stock/listing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            years_forecast: "10",
            n_sims: "50000",
          }),
        }
      );

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      console.log(res);

      return await res.json();
    } catch (error) {
      console.error("Fetch Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMarketData();
      if (data) setMarket(data);
      console.log(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const bank = [
    {
      id: 1,
      title: "เงินฝากธนาคาร",
      detail: "เป็นการนำเงินฝากไว้กับธนาคาร",
      returns: "ดอกบี้ย(ค่อนข้างน้อย)",
      risk: "ต่ำ",
    },
  ];
  const bonds = [
    {
      id: 1,
      title: "พันธบัตรรัฐบาล",
      detail: "เป็นการให้รัฐบาลกู้ยืมเงินจากผู้ซื้อ",
      returns: "ดอกเบี้ย(มักสูงกว่าธนาคาร)",
      risk: "ต่ำ",
    },
  ];
  const gold = [
    {
      id: 1,
      title: "ทองคำ",
      detail:
        "เป็นการนำเงินไปซื้อทอง ซึ่งอาจอยู่ในรูปแบบทองคำแท่ง ทองรูปพรรณ หรือกองทุนทองคำ ",
      returns: "ส่วนต่างจากราคาที่เพิ่มสูงขึ้นเทียบระหว่างตอนซื้อและขาย",
      risk: "ปานกลาง",
    },
  ];
  const funds = [
    {
      id: 1,
      title: "กองทุนรวม",
      detail:
        "เป็นการนำเงินไปให้กับผู้จัดการกองทุน ซึ่งมีหน้าที่นำเงินที่ได้ไปลงทุน เช่น หุ้น พันธบัตร หรืออสังหาริมทรัพย์ ",
      returns:
        "ส่วนต่างจากราคาหลักทรัพย์ในกองทุนที่สูงขึ้น หลังหักค่าส่วนแบ่งกำไรจากผู้จัดการกองทุน ",
      risk: "ปานกลาง",
    },
  ];
  const estate = [
    {
      id: 1,
      title: "อสังหาริมทรัพย์",
      detail:
        "เป็นการนำเงินไปซื้ออสังหาริมทรัพย์ เช่น บ้าน คอนโด ที่ดินโดยการได้ผลตอบแทนอาจเกิดได้จากหลายปัจจัยขึ้นกับความต้องการของผู้ลงทุน",
      returns:
        "ค่าเช่า/ส่วนต่างของราคาจากการเปลี่ยนแปลงของสภาพเศรษฐกิจ/การขายเพื่อเอากำไร",
      risk: "ขึ้นกับประเภทอสังหา ฯ",
    },
  ];
  const share = [
    {
      id: 1,
      title: "หุ้น",
      detail:
        "เป็นการนำเงินไปซื้อส่วนแบ่งของบริษัท หรือก็คือการซื้อสิทธิในการเป็น เข้าของส่วนหนึ่งของบริษัทนั้น ๆ",
      returns:
        "ส่วนแบ่งกำไรจากบริษัท และส่วนต่างของราคาหุ้นเทียบระหว่างตอนซื้อและตอนขาย",
      risk: "สูง",
    },
  ];

  return (
    <section className="p-4 w-full flex flex-col items-center min-h-screen bg-gray-50 dark:bg-[#1a1a1a] pb-20 rounded-lg">
      {/* Header Section */}
      <div className="w-full md:w-10/12 bg-[#add8e6] py-8 md:py-12 px-4 shadow-md mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2b2b2b] mb-4">
            ข้อที่ควรรู้ก่อนการลงทุน
          </h1>
          <h3 className="text-lg md:text-xl text-[#2b2b2b]/80">
            ข้อมูลนี้เป็นข้อมูลเพื่อการศึกษาเท่านั้น
            ผู้ใช้วานควรศึกษาข้อมูลและปรึกษาผู้แนะนำการลงทุนที่ได้รับอนุญาตก่อนตัดสินใจ
            <span className="text-blue-600 underline px-2">
              รายละเอียดเพิ่มเติม
            </span>
          </h3>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-[#fdfdfd] dark:bg-[#2b2b2b] rounded-2xl shadow-lg p-8 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center">
          การลงทุนคืออะไร ?
        </h1>
        <p className="py-4 md:p-8 text-xs md:text-lg text-center indent-8">
          คือการนำทรัพย์สินที่มีมูลค่ามาใช้เพื่อสร้างผลตอบแทน
          หรือกำไรที่อาจะเกิดขึ้นในอนาคต
          ซึ่งสามารถแบ่งออกได้เป็นหลายประเภทโดยแต่ละประเภทจะมีความเสี่ยงในการลงทุนที่แตกต่างกันโดยดูจากโอกาสที่การลงทุนนั้น
          ๆ จะทำให้เกิดการขาดทุนได้
        </p>

        {/* bank */}
        <div className="w-full py-2">
          {bank.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] rounded-lg text-sm md:text-lg"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-none  p-4">
                  <div className="grid md:grid-cols-4 justify-between text-nowrap truncate">
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ประเภท
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      รายละเอียด
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ผลตอบแทน
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ความเสี่ยง
                    </p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.title}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.detail}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.returns}
                    </p>
                    <p
                      className={`w-full border border-blue-500 p-2 my-2 rounded-lg text-center flex items-center justify-center`}
                    >
                      {item.risk}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* bonds */}
        <div className="w-full py-2">
          {bonds.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-none  p-4">
                  <div className="grid md:grid-cols-4 justify-between text-nowrap truncate">
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ประเภท
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      รายละเอียด
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ผลตอบแทน
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ความเสี่ยง
                    </p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.title}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.detail}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.returns}
                    </p>
                    <p className="w-full border border-blue-500 p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.risk}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* gold */}
        <div className="w-full py-2">
          {gold.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-none  p-4">
                  <div className="grid md:grid-cols-4 justify-between text-nowrap truncate">
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ประเภท
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      รายละเอียด
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ผลตอบแทน
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ความเสี่ยง
                    </p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.title}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.detail}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.returns}
                    </p>
                    <p className="w-full border border-yellow-500 p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.risk}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* funds */}
        <div className="w-full py-2">
          {funds.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-none  p-4">
                  <div className="grid md:grid-cols-4 justify-between text-nowrap truncate">
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ประเภท
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      รายละเอียด
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ผลตอบแทน
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ความเสี่ยง
                    </p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.title}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.detail}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.returns}
                    </p>
                    <p className="w-full border border-yellow-500 p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.risk}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* estate */}
        <div className="w-full py-2">
          {estate.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-none  p-4">
                  <div className="grid md:grid-cols-4 justify-between text-nowrap truncate">
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ประเภท
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      รายละเอียด
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ผลตอบแทน
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ความเสี่ยง
                    </p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.title}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.detail}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.returns}
                    </p>
                    <p className="w-full border border-orange-500 p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.risk}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* share */}
        <div className="w-full py-2">
          {share.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-none  p-4">
                  <div className="grid md:grid-cols-4 justify-between text-nowrap truncate">
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ประเภท
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      รายละเอียด
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ผลตอบแทน
                    </p>
                    <p className="w-full underline py-4 my-2 text-center flex items-center md:justify-center">
                      ความเสี่ยง
                    </p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.title}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.detail}
                    </p>
                    <p className="w-full border p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.returns}
                    </p>
                    <p className="w-full border border-red-500 p-2 my-2 rounded-lg text-center flex items-center justify-center">
                      {item.risk}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* section2 */}
        <h1 className="mt-10 text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center">
          อยากจะเริ่มลงทุน ต้องทำอย่างไร?
        </h1>
        <div className="my-4 p-4 w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg">
          <h2 className="mb-4 font-semibold"> สิ่งที่ควรมีก่อนการลงทุน </h2>
          <ul className="list-disc pl-8">
            <li> เอกสารยืนยันตัวตน เช่น บัตรประชาชน หรือหนังสือเดินทาง </li>
            <li> บัญชีธนาคารที่สามารถใช้งานได้ </li>
            <li>
              สำหรับผู้ที่อายุไม่เกิน 20 ปี จะไม่สามารถเปิดบัญชีได้ด้วยตัวเอง
            </li>
            <li>
              เงินทุนที่มากพอสำหรับการลงทุน หรือเป็นเงินที่พร้อมจะสูญเสียได
            </li>
            <li>
              ความรู้พื้นฐานในการลงทุน เช่น ประเภทของการลงทุน การดูราคาตลาด
              ความสามารถในการวิเคราะห์ปัจจัยพื้นฐานที่ส่งผลต่อการลงทุน
              และการติดตามเงินในพอร์ตการลงทุนอย่างต่อเนื่อง
            </li>
            <li>
              เข้าใจถึงเป้าหมายในการลงทุน ไม่ว่าจะเป็นการลงทุนระยะยาวและสั้น
            </li>
            <li>
              ความสามารถในการเข้าถึงข้อมูล ความรู้ และการติดตามข่าวสาร
              และสามารถหาที่ปรึกษาทางการเงินได้หากเกิดปัญหาหรือข้อสงไส
            </li>
          </ul>

          <h2 className="mt-8 mb-4 font-semibold">สิ่งที่ควรมีก่อนการลงทุน</h2>
          <p className="indent-8">
            เมื่อมีสิ่งที่ควรมีสำหรับการเริ่มลงทุนครบแล้ว ก็สามารถเริ่มได้จากการ
            เปิดบัญชีซื้อขายหลักทรัพย์ หรืออาจเปิดบัญชีผ่านบริษัทหลักทรัพย์หรือ
            โบรกเกอร์ ซึ่งควรเลือกบริษัทที่น่าเชื่อถือ และตรวจสอบได้
            เพื่อความปลอดภัย
          </p>
        </div>

        {/* section3 */}
        <h1 className="mt-10 text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center">
          เราจะได้กำไรจากตลาดหลักทรัพย์ได้อย่างไร
        </h1>
        <div className="my-4 p-4 w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg">
          <p className="indent-8">
            ในกราฟการเปลี่ยนแปลงของราคาตลาดตามเวลา หากพิจารณาที่ช่วงเวลาหนึ่ง ๆ
            (เช่น 1 วัน หรือ 5 นาที) เราจะสามารถบอกข้อมูลหลัก ๆ ได้ 4 อย่าง คือ
            ราคาเปิด ราคาปิด ราคาสูงสุด และราคาต่ำสุด
            ซึ่งจะอยู่ในรูปแบบกราฟแท่งเทียบของช่วงเวลาที่พิจารณา
            ซึ่งการจะได้กำไรนั้น ก็คือเมื่อราคาปิดในช่วงเวลาที่เราขายออก
            มีมากกว่าราคาปิดในช่วงเวลาที่เราซื้อนั้นเอง
            โดยจะคิดเป็นอัตราส่วนเทียบกับเงินที่เราซื้อ
            และเงินที่ได้มามากขึ้นนั้นก็คือกำไรจากการขายหุ้นตัวนั้น
          </p>
        </div>

        {/* section4 */}
        <h1 className="mt-10 text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center">
          ตัวอย่างผลการจำลองแนวโน้ม ของกลุ่มอุตสาหกรรม
          ในตลาดหลักทรัพย์แห่งประเทศไทย
        </h1>
        <p className="py-4 md:p-8 text-xs md:text-lg text-center text-red-500">
          คำเตือน การคาดการณ์นี้เป็นการคาดการณ์เพื่อการศึกษาและ
          ยกตัวอย่างเท่านั้น โดยมีจุดประสงค์เพื่อเพิ่มความเข้าใจให้กับผู้ใช้
          ซึ่งข้อมูลที่เห็นนั้นมิใช่ราคาที่อยู่ในดีชนีอุตสาหกรรมนั้นจริง ๆ
          เพราะด้วยข้อจำกัดด้านการเข้าถึงข้อมูล
          ดังนั้นจึงไม่ควรนำข้อมูลนี้ไปใช้ในการประกอบการตัดสินใจ ในการลงทุน
          และเราไม่รับผิดชอบกับความเสียหายที่เกิดขึ้นหาก
          ผู้ใช้นำข้อมูลเหล่านี้ไปใช้ในการประกอบการตัดสินใจในการลงทุน
          <span className="text-blue-500 underline px-2">
            รายละเอียดเพิ่มเติม
          </span>
        </p>
        <div className="my-4 p-4 w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-sm md:text-lg">
          {/* industrial */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.INDUS?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.INDUS?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.INDUS?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.INDUS?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* tech */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.TECH?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.TECH?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.TECH?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.TECH?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* consump */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.CONSUMP?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.CONSUMP?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.CONSUMP?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.CONSUMP?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* propcon */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.PROPCON?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.PROPCON?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.PROPCON?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.PROPCON?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* argo */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.ARGO?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.ARGO?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.ARGO?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.ARGO?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* service */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.SERVICE?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.SERVICE?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.SERVICE?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.SERVICE?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* resourc */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.RESOURC?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.RESOURC?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.RESOURC?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.RESOURC?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* fincial */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.FINCIAL?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.FINCIAL?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.FINCIAL?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.FINCIAL?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* set */}
          <section className="w-full py-2">
            <div className="w-full bg-[#f2f2f2] dark:bg-[#3d3d3d] py-8 rounded-lg text-base md:text-xl">
              <div className="w-full flex items-center">
                <p className="w-5/12">
                  {loading || !market ? (
                    <p className="w-6/12 text-center">loading..</p>
                  ) : (
                    <p className="w-full font-semibold text-2xl">{market.SET?.Name}</p>
                  )}
                </p>
                <div className="w-7/12">
                  <div className="w-full flex">
                    <p className="w-6/12">
                      {" "}
                      ราคาล่าสุด
                      <span className="text-red-400 underline">
                        จากการคำนวณ:{" "}
                      </span>{" "}
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.SET?.start_price.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12"> ราคาที่คาดการณ์: </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.SET?.median.toFixed(3)}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex">
                    <p className="w-6/12">
                      โอกาสที่ราคาปิดจะอยู่เหนือราคาล่าสุด:
                    </p>
                    {loading || !market ? (
                      <p className="w-6/12 text-center">loading..</p>
                    ) : (
                      <p className="w-6/12 text-start px-4">
                        {market.SET?.prob_gain.toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
