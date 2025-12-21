import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

// Translation dictionary
const translations = {
  th: {
    // Header
    search: 'ค้นหาการคำนวณ...',
    history: 'ประวัติ',
    aboutUs: 'เกี่ยวกับเรา',
    userAnalysis: 'วิเคราะห์รายบุคคล',
    financial: 'ข้อมูลศูนย์กลาง',
    settings: 'ตั้งค่า',
    login: 'เข้าสู่ระบบ',
    logout: 'ออกจากระบบ',
    
    // Home
    heroTitle: 'คำนวณภาษีและการเงินง่ายๆ',
    heroSubtitle: 'เครื่องมือคำนวณภาษีเงินได้ ดอกเบี้ยเงินกู้ และวางแผนการเงินของคุณ',
    getStarted: 'เริ่มต้นใช้งาน',
    learnMore: 'เรียนรู้เพิ่มเติม',
    
    // Calculator types
    salaryCalculator: 'คำนวณเงินเดือนหลังหักภาษี',
    savingGoal: 'เป้าหมายการออม',
    debtManagement: 'จัดการหนี้สิน',
    sleepCalculator: 'คำนวณเวลานอน',
    
    // Common
    calculate: 'คำนวณ',
    reset: 'รีเซต',
    back: 'กลับ',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    baht: 'บาท',
    year: 'ปี',
    month: 'เดือน',
    
    // Auth
    loginTitle: 'เข้าสู่ระบบ PayDee',
    loginSubtitle: 'เพื่อบันทึกข้อมูลและวิเคราะห์การเงิน',
    loginWithGoogle: 'เข้าสู่ระบบด้วย Google',
    continueAsGuest: 'ใช้งานแบบไม่เข้าสู่ระบบ',
    
    // Benefits
    saveToCloud: 'บันทึกข้อมูลไว้บน Cloud',
    smartAnalysis: 'วิเคราะห์การเงินอัจฉริยะ (เร็วๆ นี้)',
    viewHistory: 'ดูประวัติการคำนวณย้อนหลัง',
    useAnywhere: 'ใช้งานได้ทุกอุปกรณ์',
  },
  en: {
    // Header
    search: 'Search calculations...',
    history: 'History',
    aboutUs: 'About Us',
    userAnalysis: 'User Analysis',
    financial: 'Financial Hub',
    settings: 'Settings',
    login: 'Sign In',
    logout: 'Sign Out',
    
    // Home
    heroTitle: 'Easy Tax & Finance Calculator',
    heroSubtitle: 'Tools for calculating income tax, loan interest, and planning your finances',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Calculator types
    salaryCalculator: 'Salary After Tax',
    savingGoal: 'Saving Goal',
    debtManagement: 'Debt Management',
    sleepCalculator: 'Sleep Calculator',
    
    // Common
    calculate: 'Calculate',
    reset: 'Reset',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    baht: 'Baht',
    year: 'Year',
    month: 'Month',
    
    // Auth
    loginTitle: 'Sign in to PayDee',
    loginSubtitle: 'Save your data and analyze your finances',
    loginWithGoogle: 'Sign in with Google',
    continueAsGuest: 'Continue as guest',
    
    // Benefits
    saveToCloud: 'Save to Cloud',
    smartAnalysis: 'Smart Analysis (Coming Soon)',
    viewHistory: 'View calculation history',
    useAnywhere: 'Access from any device',
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('paydee-language');
    return saved || 'th';
  });

  useEffect(() => {
    localStorage.setItem('paydee-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isEnglish: language === 'en',
    isThai: language === 'th'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
