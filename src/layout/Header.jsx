import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setOpen((prev) => !prev);
  const handleClick = () => {
    setOpen(false);
  };

  const menuItems = [
    { label: "หน้าแรก", path: "/" },
    { label: "เกี่ยวกับเรา", path: "/about-us" },
  ];

  return (
    <>
      {/* Desktop Sticky Header */}
      <header
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-4"
          }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="font-bold text-[#2b2b2b] text-lg">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2b2b2b] dark:text-white">
                PayDee
              </h1>
              <p className={`text-xs ${scrolled ? "text-gray-600 dark:text-gray-400" : "text-[#2b2b2b]/70 dark:text-white/70"}`}>
                เพย์ดี
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-[#ffcc00] hover:text-[#2b2b2b] ${scrolled
                    ? "text-gray-600 dark:text-gray-300"
                    : "text-[#2b2b2b]/80 dark:text-white/80"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* CTA Button */}
            <Link to="/financial">
              <button className="ml-2 px-5 py-2 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold text-sm hover:bg-[#e6b800] transition-all shadow-md">
                ข้อมูลศูนย์กลาง
              </button>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`ml-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${scrolled
                  ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "bg-[#2b2b2b]/10 dark:bg-white/10 hover:bg-[#2b2b2b]/20 dark:hover:bg-white/20"
                }`}
            >
              <i className={`fa-solid ${isDark ? "fa-sun text-yellow-400" : "fa-moon text-gray-600 dark:text-white"}`}></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Sticky Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-5 h-0.5 bg-[#2b2b2b] dark:bg-white rounded transition-all ${open ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-5 h-0.5 bg-[#2b2b2b] dark:bg-white rounded transition-all ${open ? "opacity-0" : ""}`}></span>
            <span className={`w-5 h-0.5 bg-[#2b2b2b] dark:bg-white rounded transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffcc00] flex items-center justify-center shadow-sm">
              <span className="font-bold text-[#2b2b2b]">P</span>
            </div>
            <div>
              <div className="font-bold text-[#2b2b2b] dark:text-white">PayDee</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">เพย์ดี</div>
            </div>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <i className={`fa-solid ${isDark ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"}`}></i>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden fixed top-[60px] left-0 right-0 z-40 bg-white dark:bg-[#1a1a1a] shadow-lg transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={handleClick}
              className="block px-4 py-3 rounded-lg font-medium text-center transition-all text-gray-600 dark:text-gray-300 hover:bg-[#ffcc00] hover:text-[#2b2b2b]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/financial"
            onClick={handleClick}
            className="block px-4 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold text-center"
          >
            ข้อมูลศูนย์กลาง
          </Link>
        </nav>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}
