import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function DisclaimerModal({ isOpen, onClose, onAccept, onReject }) {
    // Block arrow key navigation when modal is open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isOpen && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        };
        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-[#ffcc00] px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-bold text-[#2b2b2b]">
                            ข้อกำหนดการใช้งาน
                        </h2>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-[#2b2b2b]/70 hover:text-[#2b2b2b] transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="text-base leading-relaxed">
                                เครื่องคำนวณนี้จัดทำขึ้นเพื่อให้ข้อมูลทั่วไปเท่านั้น ผลลัพธ์ที่ได้อาจไม่สะท้อนสถานการณ์จริงของคุณทั้งหมด
                            </p>
                            <p className="text-base leading-relaxed">
                                กรุณาใช้วิจารณญาณในการตัดสินใจทางการเงิน และปรึกษาผู้เชี่ยวชาญหากจำเป็น
                            </p>
                            <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded text-amber-900 dark:text-amber-300">
                                <p className="text-sm font-semibold">
                                    <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                    ผลการคำนวณอาจมีความคลาดเคลื่อน ไม่ควรนำไปใช้เป็นคำแนะนำทางการเงินโดยตรง
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-black/20 flex gap-4 justify-end">
                        <button
                            onClick={onReject}
                            className="px-6 py-2.5 rounded-lg text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-white/5 transition-colors"
                        >
                            ไม่ยอมรับ
                        </button>
                        <button
                            onClick={onAccept}
                            className="px-6 py-2.5 rounded-lg bg-[#ffcc00] text-[#2b2b2b] font-bold hover:bg-[#ffdb4d] transition-colors shadow-lg"
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
