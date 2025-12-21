import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const UserMenu = () => {
  const { user, isLoggedIn, logout, loading, isFirebaseConfigured } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setShowDropdown(false);
  };

  // Don't show if Firebase is not configured
  if (!isFirebaseConfigured) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffcc00] hover:bg-[#e6b800] text-[#2b2b2b] font-medium rounded-full transition-all duration-300 hover:shadow-lg"
        >
          <i className="fa-solid fa-right-to-bracket"></i>
          <span className="hidden sm:inline">เข้าสู่ระบบ</span>
        </button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-10 h-10 rounded-full border-2 border-[#ffcc00]"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#2b2b2b] font-bold">
            {user.displayName?.charAt(0) || 'U'}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2b2b2b] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#2b2b2b] font-bold text-lg">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {user.displayName || 'ผู้ใช้'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-300 border-t-red-600"></div>
                ) : (
                  <i className="fa-solid fa-right-from-bracket"></i>
                )}
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
