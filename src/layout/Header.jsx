import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import CommandPalette from "../components/CommandPalette";
import CalculationHistory from "../components/CalculationHistory";
import SettingsModal from "../components/SettingsModal";
import UserMenu from "../components/UserMenu";
import { useCalculationHistory } from "../context/CalculationHistoryContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
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

  // Handle shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setHistoryOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <>
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CalculationHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Desktop Sticky Header */}
      <header
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-3"
          }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#ffcc00] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="font-bold text-[#2b2b2b] text-base">P</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-[#2b2b2b] dark:text-white leading-tight">PayDee</h1>
              <p className={`text-[10px] ${scrolled ? "text-gray-500" : "text-[#2b2b2b]/60 dark:text-white/60"}`}>เพย์ดี</p>
            </div>
          </Link>

          {/* Center: Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all min-w-[220px] lg:min-w-[320px] ${scrolled
              ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
              : "bg-white/60 dark:bg-black/30 border-white/30 dark:border-white/10 text-gray-500 dark:text-gray-400"
              } hover:border-[#ffcc00] hover:shadow-md`}
          >
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
            <span className="text-sm flex-1 text-left">{t('search')}</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-gray-200 dark:bg-gray-700 px-1.5 font-mono text-[10px] text-gray-500">
              ⌘K
            </kbd>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* History */}
            <button
              onClick={() => setHistoryOpen(true)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${scrolled
                ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-white/60 dark:bg-black/30 hover:bg-white/80 dark:hover:bg-black/50"
                }`}
              title={t('history')}
            >
              <i className="fa-solid fa-history text-sm text-gray-600 dark:text-gray-300"></i>
              <span className="hidden xl:inline text-sm text-gray-600 dark:text-gray-300">{t('history')}</span>
              {allHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ffcc00] text-[#2b2b2b] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {allHistory.length > 9 ? '9+' : allHistory.length}
                </span>
              )}
            </button>

            {/* Financial Hub */}
            <Link to="/financial">
              <button className="px-4 py-2 rounded-full bg-[#ffcc00] text-[#2b2b2b] font-semibold text-sm hover:bg-[#e6b800] transition-all shadow-sm hover:shadow-md">
                {t('financial')}
              </button>
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all font-semibold text-xs ${scrolled
                ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-white/60 dark:bg-black/30 hover:bg-white/80 dark:hover:bg-black/50"
                }`}
              title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            >
              {language === 'th' ? '🇹🇭' : '🇬🇧'}
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${scrolled
                ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-white/60 dark:bg-black/30 hover:bg-white/80 dark:hover:bg-black/50"
                }`}
              title={t('settings')}
            >
              <i className="fa-solid fa-gear text-gray-600 dark:text-gray-300"></i>
            </button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Mobile Sticky Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5"
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
            <span className="font-bold text-[#2b2b2b] dark:text-white">PayDee</span>
          </Link>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLanguage}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs"
            >
              {language === 'th' ? '🇹🇭' : '🇬🇧'}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-white"
            >
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
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
          <Link
            to="/financial"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold"
          >
            <i className="fa-solid fa-database"></i>
            {t('financial')}
          </Link>
          <button
            onClick={() => { setHistoryOpen(true); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <i className="fa-solid fa-history"></i>
            {t('history')}
            {allHistory.length > 0 && (
              <span className="ml-auto bg-[#ffcc00] text-[#2b2b2b] text-xs rounded-full px-2 py-0.5 font-bold">
                {allHistory.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setSettingsOpen(true); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <i className="fa-solid fa-gear"></i>
            {t('settings')}
          </button>
          <Link
            to="/about-us"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <i className="fa-solid fa-info-circle"></i>
            {t('aboutUs')}
          </Link>
          
          {/* User section in mobile */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <UserMenu />
          </div>
        </nav>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-16"></div>
    </>
  );
}
