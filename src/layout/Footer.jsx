import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    เครื่องมือ: [
      { label: "รายได้สุทธิหลังเสียภาษี", path: "/salary-aftertax" },
      { label: "เป้าหมายการออม", path: "/saving-goal" },
      { label: "แนะนำพอร์ตด้วย AI", path: "/ai-port" },
      { label: "ข้อมูลศูนย์กลาง", path: "/financial" },
    ],
    เกี่ยวกับ: [
      { label: "เกี่ยวกับเรา", path: "/about-us" },
      { label: "ติดต่อเรา", path: "/contact" },
    ],
    กฎหมาย: [
      { label: "ข้อกำหนดการใช้งาน", path: "/terms-of-use" },
      { label: "นโยบายความเป็นส่วนตัว", path: "/privacy-policy" },
    ],
  };

  return (
    <footer className="w-full bg-[#fdfdfd] dark:bg-[#2b2b2b] text-[#2b2b2b] dark:text-[#f2f1f1] transition-colors duration-300 border-t border-[#e0e0e0] dark:border-[#3d3d3d]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            <h2 className="text-2xl font-bold">PayDee</h2>
            <p className="text-lg">เพย์ดี</p>
            <p className="text-sm text-[#2b2b2b]/70 dark:text-[#f2f1f1]/70">
              เครื่องคิดเลขทางการเงินที่ช่วยคุณวางแผนอนาคตทางการเงินได้อย่างมั่นใจ
            </p>
          </div>

          <div className="border-t border-[#e0e0e0] dark:border-[#3d3d3d] md:border-t-0 md:border-l md:mx-4"></div>

          <div className="md:w-2/3 grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-bold">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-sm text-[#2b2b2b]/70 dark:text-[#f2f1f1]/70 hover:text-[#ffcc00] dark:hover:text-[#ffcc00] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e0e0e0] dark:border-[#3d3d3d] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#2b2b2b]/70 dark:text-[#f2f1f1]/70">
            © {currentYear} PayDee. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-[#2b2b2b]/70 dark:text-[#f2f1f1]/70 hover:text-[#ffcc00] dark:hover:text-[#ffcc00] transition-colors"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook text-xl"></i>
            </a>
            <a
              href="#"
              className="text-[#2b2b2b]/70 dark:text-[#f2f1f1]/70 hover:text-[#ffcc00] dark:hover:text-[#ffcc00] transition-colors"
              aria-label="Twitter"
            >
              <i className="fa-brands fa-twitter text-xl"></i>
            </a>
            <a
              href="#"
              className="text-[#2b2b2b]/70 dark:text-[#f2f1f1]/70 hover:text-[#ffcc00] dark:hover:text-[#ffcc00] transition-colors"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
