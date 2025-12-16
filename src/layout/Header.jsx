import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import CommandPalette from "../components/CommandPalette";
import CalculationHistory from "../components/CalculationHistory";
import { useCalculationHistory } from "../context/CalculationHistoryContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { allHistory } = useCalculationHistory();

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle shortcuts: Ctrl+K (Search), Ctrl+H (History), Ctrl+Z (Back), Ctrl+X (Reset Calculator)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K: Open Search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }

      // Ctrl + H: Open History
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setHistoryOpen((prev) => !prev);
      }

      // Ctrl + Z: Go Back (only when NOT in input/textarea to allow undo in textboxes)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        const target = e.target;
        const isInput = target.tagName === 'INPUT' ||
                        target.tagName === 'TEXTAREA' ||
                        target.isContentEditable ||
                        target.closest('[role="textbox"]') ||
                        target.closest('[contenteditable="true"]');

        // Allow Ctrl+Z to work as undo in textboxes
        if (isInput) {
          return; // Let browser handle undo
        }

        // Only navigate back when not in input
        e.preventDefault();
        navigate(-1);
      }

      // Ctrl + Y: Redo (only when NOT in input/textarea to allow redo in textboxes)
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        const target = e.target;
        const isInput = target.tagName === 'INPUT' ||
                        target.tagName === 'TEXTAREA' ||
                        target.isContentEditable ||
                        target.closest('[role="textbox"]') ||
                        target.closest('[contenteditable="true"]');

        // Allow Ctrl+Y to work as redo in textboxes
        if (isInput) {
          return; // Let browser handle redo
        }

        // Ctrl+Y doesn't have a navigation action, just let browser handle it
        // (or we could add forward navigation if needed)
      }

      // Ctrl + X: Reset Calculator (trigger reset button)
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        const target = e.target;
        const isInput = target.tagName === 'INPUT' ||
                        target.tagName === 'TEXTAREA' ||
                        target.isContentEditable ||
                        target.closest('[role="textbox"]') ||
                        target.closest('[contenteditable="true"]');

        // Don't trigger reset when typing in input fields
        if (isInput) {
          return;
        }

        // Find and click the reset button
        // First try to find button with type="reset"
        let resetButton = document.querySelector('button[type="reset"]');

        // If not found, look for buttons containing "รีเซท" text
        if (!resetButton) {
          const allButtons = document.querySelectorAll('button');
          for (const button of allButtons) {
            if (button.textContent.trim() === 'รีเซท') {
              resetButton = button;
              break;
            }
          }
        }

        if (resetButton) {
          e.preventDefault();
          resetButton.click();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const toggleMenu = () => setOpen((prev) => !prev);
  const handleClick = () => {
    setOpen(false);
  };

  const menuItems = [
    { label: "หน้าแรก", path: "/" },
    { label: "เกี่ยวกับเรา", path: "/about-us" },
    { label: "ข้อกำหนดการใช้งาน", path: "/terms-of-use" },
  ];

  return (
    <>
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CalculationHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

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
          <nav className="flex items-center gap-3">
            {/* Search Trigger (Desktop) */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all group ${scrolled
                ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                : "bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/10 text-[#2b2b2b]/60 dark:text-white/60 hover:bg-white/80 dark:hover:bg-black/30"
                }`}
            >
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
              <span className="text-sm font-medium">ค้นหา...</span>
            </button>

            {/* History Button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all group relative ${scrolled
                ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                : "bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/10 text-[#2b2b2b]/60 dark:text-white/60 hover:bg-white/80 dark:hover:bg-black/30"
                }`}
            >
              <i className="fa-solid fa-history text-sm"></i>
              <span className="text-sm font-medium">ประวัติ</span>
              {allHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ffcc00] text-[#2b2b2b] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {allHistory.length}
                </span>
              )}
            </button>

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

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-white"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <i className={`fa-solid ${isDark ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"}`}></i>
            </button>
          </div>
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
