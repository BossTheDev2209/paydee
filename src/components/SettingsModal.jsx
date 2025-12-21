import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";

export default function SettingsModal({ isOpen, onClose }) {
    const { mode, setMode, style, setStyle } = useTheme();
    const { settings, updateSettings } = useSettings();

    const styles = [
        { id: "modern", label: "Modern", icon: "fa-rocket", desc: "Clean & Professional" },
        { id: "glass", label: "Glass", icon: "fa-wand-magic-sparkles", desc: "Liquid Apple Style" },
        { id: "neo", label: "Neo", icon: "fa-shapes", desc: "Bold & Vibrant" },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20 dark:border-white/10 backdrop-blur-3xl saturate-200 transition-all duration-300"
                >
                    {/* Header */}
                    <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100/10 dark:border-white/10 bg-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-black text-[#2b2b2b] dark:text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#ffcc00] flex items-center justify-center shadow-md">
                                <i className="fa-solid fa-gear text-[#2b2b2b] text-sm"></i>
                            </div>
                            การตั้งค่า (Settings)
                        </h2>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-gray-100/50 dark:bg-white/10 flex items-center justify-center hover:bg-[#ffcc00] hover:text-[#2b2b2b] transition-all duration-300 group"
                        >
                            <i className="fa-solid fa-xmark text-gray-500 dark:text-white/70 group-hover:text-[#2b2b2b]"></i>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Appearance Mode Section */}
                        <section>
                            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
                                โหมดการแสดงผล (Appearance)
                            </h3>
                            <div className="flex p-1.5 bg-gray-100/50 dark:bg-black/40 rounded-2xl border border-gray-200/50 dark:border-white/10 backdrop-blur-md">
                                <button
                                    onClick={() => setMode("light")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all duration-300 ${
                                        mode === "light" 
                                        ? "btn-primary shadow-lg scale-105" 
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                >
                                    <i className="fa-solid fa-sun transition-transform duration-500 group-hover:rotate-45"></i>
                                    Light
                                </button>
                                <button
                                    onClick={() => setMode("dark")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all duration-300 ${
                                        mode === "dark" 
                                        ? "btn-primary shadow-lg scale-105" 
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                >
                                    <i className="fa-solid fa-moon"></i>
                                    Dark
                                </button>
                            </div>
                        </section>

                        {/* Style Section */}
                        <section>
                            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
                                สไตล์ของเว็บไซต์ (Interface Style)
                            </h3>
                            <div className="space-y-3">
                                {styles.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyle(s.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${
                                            style === s.id 
                                            ? "border-[#ffcc00] bg-[#ffcc00]/10 shadow-lg scale-[1.02]" 
                                            : "border-gray-100 dark:border-white/5 hover:border-[#ffcc00]/30 hover:bg-[#ffcc00]/5 bg-white/5"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-500 shadow-sm ${
                                            style === s.id ? "bg-[#ffcc00] text-[#2b2b2b] rotate-6" : "bg-gray-100 dark:bg-white/10 text-gray-400"
                                        }`}>
                                            <i className={`fa-solid ${s.icon}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-black text-base ${style === s.id ? "text-[#2b2b2b] dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                                {s.label}
                                            </p>
                                            <p className="text-[11px] font-medium opacity-60">
                                                {s.desc}
                                            </p>
                                        </div>
                                        {style === s.id && (
                                            <div className="w-8 h-8 rounded-full bg-[#ffcc00] flex items-center justify-center shadow-md animate-pulse">
                                                <i className="fa-solid fa-check text-xs text-[#2b2b2b]"></i>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Privacy Section */}
                        <section>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                                ความเป็นส่วนตัว (Privacy)
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div>
                                    <h4 className="font-bold text-sm text-[#2b2b2b] dark:text-white">บันทึกประวัติการคำนวณ</h4>
                                    <p className="text-[10px] text-gray-400">เก็บข้อมูลไว้ในเครื่องเพื่อดูย้อนหลัง</p>
                                </div>
                                <button
                                    onClick={() => updateSettings({ saveHistory: !settings.saveHistory })}
                                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                                        settings.saveHistory ? "bg-[#ffcc00]" : "bg-gray-300 dark:bg-gray-700"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                            settings.saveHistory ? "translate-x-6" : "translate-x-0.5"
                                        }`}
                                    />
                                </button>
                            </div>
                        </section>

                        {/* Footer Info */}
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400">
                                PayDee v1.2.0 • Build with ❤️ for Finance
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
