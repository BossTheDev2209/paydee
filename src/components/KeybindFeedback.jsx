import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function KeybindFeedback() {
    const [activeKey, setActiveKey] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if modifier key alone is pressed
            if (e.key === "Control" || e.key === "Meta") return;

            let keyName = "";

            // Check for specific shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                keyName = "Search";
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
                keyName = "Undo";
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
                keyName = "Find";
            }

            if (keyName) {
                // Determine display text: "Ctrl + K" or just "Search"
                // User asked for "keybind status", let's show the keys + action
                const keyChar = e.key.toUpperCase();
                const display = (
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <kbd className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-mono border border-gray-700">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-mono border border-gray-700">{keyChar}</kbd>
                        </div>
                        <div className="w-px h-4 bg-gray-700 mx-1"></div>
                        <span className="font-semibold text-sm">{keyName}</span>
                    </div>
                );

                setActiveKey(display);

                // Clear after 2 seconds
                const timer = setTimeout(() => {
                    setActiveKey(null);
                }, 2000);

                return () => clearTimeout(timer);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <AnimatePresence>
            {activeKey && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-6 right-6 z-[100] bg-[#1a1a1a] text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-800 flex items-center gap-3 backdrop-blur-md"
                >
                    {activeKey}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
