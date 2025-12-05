import { motion, AnimatePresence } from "framer-motion";

// Disclaimer Modal for Calculator Cards
export default function DisclaimerModal({ isOpen, onClose, onAccept, onReject }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Warning Icon */}
                    <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-triangle-exclamation text-white text-2xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            คำเตือนสำคัญ
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="text-base leading-relaxed">
                                เครื่องคำนวณนี้จัดทำขึ้นเพื่อให้ข้อมูลทั่วไปเท่านั้น ผลลัพธ์ที่ได้อาจไม่สะท้อนสถานการณ์จริงของคุณทั้งหมด
                            </p>
                            <p className="text-base leading-relaxed">
                                กรุณาใช้วิจารณญาณในการตัดสินใจทางการเงิน และปรึกษาผู้เชี่ยวชาญหากจำเป็น
                            </p>
                            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                    <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                    ผลการคำนวณอาจมีความคลาดเคลื่อน ไม่ควรนำไปใช้เป็นคำแนะนำทางการเงินโดยตรง
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Buttons */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={onReject}
                            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            ไม่ยินยอม
                        </button>
                        <button
                            onClick={onAccept}
                            className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md"
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
