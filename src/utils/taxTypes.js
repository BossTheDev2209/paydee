// taxTypes.js
export const TAX_BRACKETS = [
  { limit: 150000, rate: 0 },
  { limit: 300000, rate: 0.05 },
  { limit: 500000, rate: 0.10 },
  { limit: 750000, rate: 0.15 },
  { limit: 1000000, rate: 0.20 },
  { limit: 2000000, rate: 0.25 },
  { limit: 5000000, rate: 0.30 },
  { limit: Infinity, rate: 0.35 }
];

export const ALLOWANCE_TAXPAYER = 60000;
export const ALLOWANCE_SPOUSE_NO_INCOME = 60000;
export const ALLOWANCE_CHILD = 30000;
export const ALLOWANCE_PARENT = 30000;

export const DEDUCTION_EXPENSE_RATE = 0.5;
export const DEDUCTION_EXPENSE_MAX = 100000;

// ค่าคงที่สำหรับคำนวณภายใน (ไม่ต้องรับ Input)
export const SOCIAL_SECURITY_RATE = 0.05;
export const MAX_SOCIAL_SECURITY_MONTHLY = 750; // สูงสุด 750 บาท/เดือน

export const MAX_LIFE_INSURANCE = 100000;
export const MAX_PARENT_HEALTH = 15000;
export const MAX_PROVIDENT_RATE = 0.15;

export const MAX_SSF = 200000;
export const MAX_RMF = 500000;
export const MAX_RETIREMENT_GROUP = 500000; // กลุ่มเกษียณรวมกันไม่เกิน 5 แสน

export const DONATION_RATE_CAP = 0.10;

export function toNumber(val) {
  if (typeof val === 'string') {
    val = val.replace(/,/g, '');
  }
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

export function clampDeduction(value, maxAmount, maxRate, incomeBase) {
  const amount = toNumber(value);
  const rateLimit = maxRate ? (incomeBase * maxRate) : Infinity;
  return Math.min(amount, maxAmount, rateLimit);
}