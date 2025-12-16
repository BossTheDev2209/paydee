import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalculationHistory } from "../context/CalculationHistoryContext";
import { Input } from "./ui/input";

export default function CalculationHistory({ isOpen, onClose }) {
  const {
    history,
    allHistory,
    searchQuery,
    setSearchQuery,
    removeCalculation,
    clearHistory
  } = useCalculationHistory();

  const [selectedEntry, setSelectedEntry] = useState(null);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  const getCalculatorDisplayName = (type) => {
    switch (type) {
      case "salary-tax":
        return "เครื่องคำนวณภาษีเงินเดือน";
      case "saving-goal":
        return "เครื่องคำนวณเป้าหมายการออม";
      case "debt-management":
        return "เครื่องคำนวณการจัดการหนี้";
      default:
        return type || "ไม่ระบุ";
    }
  };

  const renderEntryDetails = (entry) => {
    if (!entry) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6 mt-4 border border-gray-200 dark:border-gray-600"
      >
        <h3 className="text-lg font-bold text-[#2b2b2b] dark:text-white mb-4">
          รายละเอียดการคำนวณ
        </h3>

        {/* Inputs Section */}
        {entry.inputs && (
          <div className="mb-4">
            <h4 className="font-semibold text-[#2b2b2b] dark:text-white mb-2">ข้อมูลที่ป้อน</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(entry.inputs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className="text-sm font-medium text-[#2b2b2b] dark:text-white">
                    {typeof value === 'boolean' ? (value ? 'ใช่' : 'ไม่') : formatNumber(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {entry.results && (
          <div>
            <h4 className="font-semibold text-[#2b2b2b] dark:text-white mb-2">ผลลัพธ์</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(entry.results).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {formatNumber(value)} บาท
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

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
          className="bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#ffcc00] px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-[#2b2b2b]">
              ประวัติการคำนวณ ({allHistory.length} รายการ)
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#2b2b2b]/10 hover:bg-[#2b2b2b]/20 transition-colors flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark text-[#2b2b2b]"></i>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Input
                type="text"
                placeholder="ค้นหาประวัติการคำนวณ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-200px)]">
            <div className="p-6">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-history text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? "ไม่พบผลการค้นหา" : "ยังไม่มีประวัติการคำนวณ"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        selectedEntry?.id === entry.id
                          ? 'border-[#ffcc00] bg-[#ffcc00]/5'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-[#2b2b2b] dark:text-white">
                            {getCalculatorDisplayName(entry.calculatorType)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(entry.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCalculation(entry.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>

                      {/* Quick Preview */}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.results && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(entry.results).slice(0, 3).map(([key, value]) => (
                              <span key={key} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                                {key}: {formatNumber(value)} บาท
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Expand/Collapse Indicator */}
                      <div className="flex justify-center mt-2">
                        <i className={`fa-solid fa-chevron-${selectedEntry?.id === entry.id ? 'up' : 'down'} text-gray-400`}></i>
                      </div>

                      {/* Details */}
                      <AnimatePresence>
                        {selectedEntry?.id === entry.id && renderEntryDetails(entry)}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {allHistory.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                แสดง {history.length} จาก {allHistory.length} รายการ
              </p>
              <button
                onClick={() => {
                  if (confirm("ต้องการล้างประวัติการคำนวณทั้งหมดหรือไม่?")) {
                    clearHistory();
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                ล้างประวัติทั้งหมด
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

