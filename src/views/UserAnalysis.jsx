import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCalculationHistory } from '../context/CalculationHistoryContext';

// Mock data for demonstration
const mockFinancialData = {
  healthScore: 72,
  monthlyIncome: 45000,
  monthlyExpense: 32000,
  savingsRate: 28.9,
  debtToIncome: 15,
  emergencyFund: 3.2, // months
};

const mockHealthData = {
  sleepScore: 68,
  avgSleepHours: 6.5,
  sleepQuality: 'ปานกลาง',
  weeklyCalculations: 12,
};

const UserAnalysis = () => {
  const { user, isLoggedIn } = useAuth();
  const { allHistory } = useCalculationHistory();
  const [activeTab, setActiveTab] = useState('financial');

  // Calculate stats from history
  const financialCalcs = allHistory.filter(h => 
    h.type === 'salary' || h.type === 'saving' || h.type === 'debt'
  ).length;
  const healthCalcs = allHistory.filter(h => h.type === 'sleep').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2b2b2b] dark:text-white">
            {isLoggedIn ? `สวัสดี, ${user?.displayName?.split(' ')[0] || 'ผู้ใช้'}` : 'สวัสดี, ผู้เยี่ยมชม'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            ภาพรวมการวิเคราะห์ส่วนตัวของคุณ
          </p>
        </div>
        
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border border-[#ffcc00]/30 rounded-xl p-4 flex items-center gap-3">
            <i className="fa-solid fa-info-circle text-[#ffcc00]"></i>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              เข้าสู่ระบบเพื่อบันทึกและติดตามข้อมูลของคุณ
            </span>
          </div>
        )}
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'financial'
              ? 'bg-white dark:bg-[#2b2b2b] shadow-md text-[#2b2b2b] dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <i className="fa-solid fa-wallet mr-2"></i>
          สถานะทางการเงิน
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'health'
              ? 'bg-white dark:bg-[#2b2b2b] shadow-md text-[#2b2b2b] dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <i className="fa-solid fa-heart-pulse mr-2"></i>
          สุขภาพ
        </button>
      </div>

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Row - Profile & Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-600 dark:text-gray-300">โปรไฟล์</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fa-solid fa-rotate"></i>
                </button>
              </div>
              
              {/* Score Ring */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${mockFinancialData.healthScore * 3.52} 352`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffcc00" />
                        <stop offset="100%" stopColor="#ff8800" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#2b2b2b] dark:text-white">
                      {mockFinancialData.healthScore}
                    </span>
                    <span className="text-xs text-gray-500">คะแนน</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <h4 className="font-bold text-[#2b2b2b] dark:text-white">สถานะการเงิน</h4>
                <p className="text-sm text-gray-500">ดี</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-green-500">
                  <i className="fa-solid fa-arrow-up"></i>
                  <span>{financialCalcs}</span>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                  <i className="fa-solid fa-circle"></i>
                  <span>{mockFinancialData.debtToIncome}%</span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                  <i className="fa-solid fa-piggy-bank"></i>
                  <span>{mockFinancialData.savingsRate}%</span>
                </div>
              </div>
            </div>

            {/* Savings Rate Card */}
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold opacity-90">อัตราการออม</h3>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-piggy-bank"></i>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">
                {mockFinancialData.savingsRate}%
              </div>
              <p className="opacity-80 text-sm">ต่อเดือน</p>
            </div>

            {/* Emergency Fund Card */}
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold opacity-90">เงินสำรองฉุกเฉิน</h3>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">
                {mockFinancialData.emergencyFund}
              </div>
              <p className="opacity-80 text-sm">เดือน (แนะนำ 6 เดือน)</p>
            </div>
          </div>

          {/* Income vs Expense Chart */}
          <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#2b2b2b] dark:text-white">รายรับ vs รายจ่าย</h3>
                <p className="text-sm text-gray-500">สรุปรายเดือน</p>
              </div>
              <select className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm">
                <option>เดือนนี้</option>
                <option>3 เดือนล่าสุด</option>
                <option>6 เดือนล่าสุด</option>
              </select>
            </div>

            {/* Simple Bar Comparison */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">รายรับ</span>
                  <span className="font-bold text-green-500">฿{mockFinancialData.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">รายจ่าย</span>
                  <span className="font-bold text-red-500">฿{mockFinancialData.monthlyExpense.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full" 
                    style={{ width: `${(mockFinancialData.monthlyExpense / mockFinancialData.monthlyIncome) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#ffcc00]/10 to-[#ffaa00]/10 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">เหลือเก็บ</span>
                <span className="text-2xl font-bold text-[#ffcc00]">
                  ฿{(mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpense).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Areas */}
          <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-[#2b2b2b] dark:text-white mb-6">พื้นที่การเงินที่พัฒนา</h3>
            
            <div className="space-y-4">
              {[
                { name: 'การออมเงิน', value: 75, color: 'from-green-400 to-emerald-500' },
                { name: 'การจัดการหนี้', value: 60, color: 'from-blue-400 to-cyan-500' },
                { name: 'การลงทุน', value: 25, color: 'from-purple-400 to-pink-500' },
                { name: 'เงินสำรองฉุกเฉิน', value: 53, color: 'from-orange-400 to-amber-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    ></motion.div>
                  </div>
                  <span className="w-12 text-right font-bold text-sm text-gray-600 dark:text-gray-300">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/salary-after-tax" className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc00] to-[#ffaa00] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-calculator text-[#2b2b2b]"></i>
              </div>
              <h4 className="font-semibold text-[#2b2b2b] dark:text-white">คำนวณเงินเดือน</h4>
              <p className="text-xs text-gray-500 mt-1">หลังหักภาษี</p>
            </Link>
            <Link to="/saving-goal" className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-piggy-bank text-white"></i>
              </div>
              <h4 className="font-semibold text-[#2b2b2b] dark:text-white">เป้าหมายการออม</h4>
              <p className="text-xs text-gray-500 mt-1">วางแผนอนาคต</p>
            </Link>
            <Link to="/debt-management" className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-credit-card text-white"></i>
              </div>
              <h4 className="font-semibold text-[#2b2b2b] dark:text-white">จัดการหนี้สิน</h4>
              <p className="text-xs text-gray-500 mt-1">ปลดหนี้เร็วขึ้น</p>
            </Link>
            <Link to="/financial" className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-database text-white"></i>
              </div>
              <h4 className="font-semibold text-[#2b2b2b] dark:text-white">ข้อมูลศูนย์กลาง</h4>
              <p className="text-xs text-gray-500 mt-1">จัดการโปรไฟล์</p>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Row - Sleep Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sleep Score Card */}
            <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-600 dark:text-gray-300">คะแนนการนอน</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fa-solid fa-rotate"></i>
                </button>
              </div>
              
              {/* Score Ring */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradientSleep)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${mockHealthData.sleepScore * 3.52} 352`}
                    />
                    <defs>
                      <linearGradient id="gradientSleep" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#2b2b2b] dark:text-white">
                      {mockHealthData.sleepScore}
                    </span>
                    <span className="text-xs text-gray-500">คะแนน</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <h4 className="font-bold text-[#2b2b2b] dark:text-white">คุณภาพการนอน</h4>
                <p className="text-sm text-gray-500">{mockHealthData.sleepQuality}</p>
              </div>

              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-purple-500">
                  <i className="fa-solid fa-moon"></i>
                  <span>{healthCalcs} ครั้ง</span>
                </div>
              </div>
            </div>

            {/* Avg Sleep Hours Card */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold opacity-90">เวลานอนเฉลี่ย</h3>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-bed"></i>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">
                {mockHealthData.avgSleepHours}
              </div>
              <p className="opacity-80 text-sm">ชั่วโมง / คืน (แนะนำ 7-9 ชม.)</p>
            </div>

            {/* Weekly Calculations Card */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold opacity-90">การคำนวณสัปดาห์นี้</h3>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">
                {mockHealthData.weeklyCalculations}
              </div>
              <p className="opacity-80 text-sm">ครั้ง</p>
            </div>
          </div>

          {/* Sleep Insights */}
          <div className="bg-white dark:bg-[#2b2b2b] rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-[#2b2b2b] dark:text-white mb-6">ข้อมูลเชิงลึกการนอน</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-sun text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2b2b2b] dark:text-white">เวลาตื่นที่แนะนำ</h4>
                    <p className="text-sm text-gray-500">สำหรับพรุ่งนี้</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-600">06:30 น.</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-moon text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2b2b2b] dark:text-white">เวลานอนที่แนะนำ</h4>
                    <p className="text-sm text-gray-500">สำหรับคืนนี้</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-indigo-600">22:30 น.</p>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <Link to="/sleep-calculator" className="block">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">คำนวณเวลานอนใหม่</h3>
                  <p className="opacity-80">วางแผนการนอนที่สมบูรณ์แบบสำหรับคุณ</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-arrow-right text-2xl"></i>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default UserAnalysis;
