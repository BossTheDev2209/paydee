import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, loading } = useAuth();
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    const result = await login();
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
    setIsLoggingIn(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ffcc00] to-[#ffaa00] p-6 text-center">
            <h2 className="text-2xl font-bold text-[#2b2b2b]">เข้าสู่ระบบ PayDee</h2>
            <p className="text-[#2b2b2b]/70 mt-1">เพื่อบันทึกข้อมูลและวิเคราะห์การเงิน</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <i className="fa-solid fa-cloud text-[#ffcc00]"></i>
                <span>บันทึกข้อมูลไว้บน Cloud</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <i className="fa-solid fa-chart-line text-[#ffcc00]"></i>
                <span>วิเคราะห์การเงินอัจฉริยะ (เร็วๆ นี้)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <i className="fa-solid fa-history text-[#ffcc00]"></i>
                <span>ดูประวัติการคำนวณย้อนหลัง</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <i className="fa-solid fa-mobile-screen text-[#ffcc00]"></i>
                <span>ใช้งานได้ทุกอุปกรณ์</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#2b2b2b] border-2 border-gray-200 dark:border-gray-700 hover:border-[#ffcc00] py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-[#ffcc00]"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-200">เข้าสู่ระบบด้วย Google</span>
                </>
              )}
            </button>

            {/* Continue as Guest */}
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
            >
              ใช้งานแบบไม่เข้าสู่ระบบ
            </button>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-400 text-center mt-4">
              เราจะไม่เปิดเผยข้อมูลส่วนตัวของคุณ และจะใช้เพื่อการวิเคราะห์การเงินเท่านั้น
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
