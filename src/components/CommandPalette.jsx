import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { popularCalculators } from "../data/calculators";

export default function CommandPalette({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Filter items based on query
    // Flattening the list if we have more categories, but for now just using popularCalculators
    // We can expand this to include other pages like 'Financial' or 'Policy'
    const staticPages = [
        { title: "หน้าแรก", path: "/", details: "กลับสู่หน้าหลัก", icon: "fa-solid fa-home", altName: "Main, Home" },
        { title: "ข้อมูลศูนย์กลาง", path: "/financial", details: "จัดการข้อมูลส่วนตัว", icon: "fa-solid fa-user-gear", altName: "Financial Profile" },
        { title: "เกี่ยวกับเรา", path: "/about-us", details: "ข้อมูลเกี่ยวกับ PayDee", icon: "fa-solid fa-info-circle", altName: "About Us, Policy" },
    ];

    const allItems = [
        ...popularCalculators.map(item => ({ ...item, type: 'Calculator' })),
        ...staticPages.map(item => ({ ...item, type: 'Page' }))
    ];

    const filteredItems = allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.details.toLowerCase().includes(query.toLowerCase()) ||
        (item.altName && item.altName.toLowerCase().includes(query.toLowerCase()))
    );

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
        }
    }, [isOpen]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    navigate(filteredItems[selectedIndex].path);
                    onClose();
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current && listRef.current.children[selectedIndex]) {
            listRef.current.children[selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl bg-white/10 dark:bg-black/20 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden relative border border-white/40 dark:border-white/10 flex flex-col max-h-[80vh] backdrop-blur-3xl saturate-200"
                    >
                        {/* Search Input */}
                        <div className="flex items-center px-6 py-5 border-b border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-md">
                            <i className="fa-solid fa-magnifying-glass text-[#ffcc00] mr-4 text-xl"></i>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="ค้นหาเครื่องมือคำนวณ หรือ หน้าต่างๆ..."
                                className="w-full bg-transparent border-none outline-none text-xl text-[#2b2b2b] dark:text-white placeholder-gray-500/50 dark:placeholder-gray-400/50 font-bold"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="hidden md:flex items-center gap-1">
                                <kbd className="px-2 py-1 text-[10px] font-black text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10">ESC</kbd>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="overflow-y-auto p-2" ref={listRef}>
                            {filteredItems.length === 0 ? (
                                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                    <i className="fa-regular fa-face-frown-open text-3xl mb-3 block"></i>
                                    <p>ไม่พบผลลัพธ์สำหรับ "{query}"</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredItems.map((item, index) => (
                                        <div
                                            key={item.id || item.path} // Use path as fallback key for static pages
                                            onClick={() => {
                                                navigate(item.path);
                                                onClose();
                                            }}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={`px-4 py-4 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-200 ${index === selectedIndex
                                                ? "bg-[#ffcc00] text-[#2b2b2b] shadow-lg scale-[1.02] z-10"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5"
                                                }`}
                                        >
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${index === selectedIndex ? 'bg-[#ffcc00] text-[#2b2b2b]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                                {item.aiIcon ? (
                                                    <img src={item.aiIcon} alt="AI" className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <i className={`${item.icon || 'fa-solid fa-calculator'} text-lg`}></i>
                                                )}
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold flex items-center justify-between">
                                                    <span>{item.title}</span>
                                                    {index === selectedIndex && (
                                                        <i className="fa-solid fa-arrow-turn-down-left text-xs text-[#2b2b2b]/50 dark:text-white/50"></i>
                                                    )}
                                                </div>
                                                <div className="text-xs opacity-70 truncate">{item.details}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-gray-100/50 dark:bg-black/40 border-t border-gray-100/10 dark:border-white/10 text-[10px] text-gray-500 dark:text-gray-400 flex justify-between items-center backdrop-blur-md">
                            <span className="font-medium opacity-80">
                                ค้นหาอย่างรวดเร็วด้วย <kbd className="font-sans px-1.5 py-0.5 bg-white/50 dark:bg-white/10 rounded border border-gray-200/50 dark:border-white/10 mx-1">Ctrl</kbd> + <kbd className="font-sans px-1.5 py-0.5 bg-white/50 dark:bg-white/10 rounded border border-gray-200/50 dark:border-white/10 mx-1">K</kbd>
                            </span>
                            <span className="font-bold tracking-wider opacity-60">PayDee Search</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
