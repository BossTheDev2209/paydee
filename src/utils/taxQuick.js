// taxQuick.js
import {
  TAX_BRACKETS,
  ALLOWANCE_TAXPAYER,
  ALLOWANCE_SPOUSE_NO_INCOME,
  ALLOWANCE_CHILD,
  ALLOWANCE_PARENT,
  DEDUCTION_EXPENSE_RATE,
  DEDUCTION_EXPENSE_MAX,
  MAX_LIFE_INSURANCE,
  MAX_PARENT_HEALTH,
  MAX_SSF,
  MAX_RMF,
  MAX_RETIREMENT_GROUP,
  SOCIAL_SECURITY_RATE,
  MAX_SOCIAL_SECURITY_MONTHLY,
  toNumber,
  clampDeduction
} from "./taxTypes.js";

function calculateProgressiveTax(taxableIncome) {
  let tax = 0;
  let prev = 0;
  for (const { limit, rate } of TAX_BRACKETS) {
    if (taxableIncome > prev) {
      const amount = Math.min(taxableIncome - prev, limit - prev);
      tax += amount * rate;
    }
    prev = limit;
  }
  return tax;
}

export function calculateTaxQuick(values = {}) {
  // 1. รับค่า (Mapping ให้รองรับทั้ง salary และ salaryMonth)
  // แก้ไข: ไม่คูณ 12 ซ้ำซ้อนที่นี่ (จะไปแก้ที่ QuickMode.jsx ให้ส่งรายเดือนมา)
  const salaryMonth = toNumber(values.salary ?? values.salaryMonth ?? values.monthlyIncome ?? 0);
  const bonusYear = toNumber(values.bonusYear ?? values.annualBonus ?? 0); // เผื่อไว้ ถ้า UI ไม่ส่งมาก็เป็น 0

  const annualIncome = (salaryMonth * 12) + bonusYear;

  // 2. ค่าใช้จ่าย (50% ไม่เกิน 1 แสน)
  const standardExpense = Math.min(annualIncome * DEDUCTION_EXPENSE_RATE, DEDUCTION_EXPENSE_MAX);

  // 3. ค่าลดหย่อนส่วนตัว/ครอบครัว
  let allowances = ALLOWANCE_TAXPAYER;
  if (values.familyStatus === "married-no-income") {
    allowances += ALLOWANCE_SPOUSE_NO_INCOME;
  }
  
  const children = toNumber(values.children ?? values.childrenCount ?? 0);
  const parents = toNumber(values.parents ?? values.parentsCount ?? 0); // QuickMode เดิมอาจไม่มี parents แต่ใส่เผื่อไว้ไม่ error
  allowances += (children * ALLOWANCE_CHILD) + (parents * ALLOWANCE_PARENT);

  // 4. คำนวณลดหย่อน
  // 4.1 ประกันสังคม (คำนวณเองจากเงินเดือน ไม่ต้องขอ Input)
  const ssoMonth = Math.min(salaryMonth * SOCIAL_SECURITY_RATE, MAX_SOCIAL_SECURITY_MONTHLY);
  const socialSecurity = ssoMonth * 12;

  // 4.2 ประกันชีวิต & สุขภาพ
  // รองรับทั้งค่าจาก Checkbox (has...) และค่าตรงๆ
  let lifeInsurance = 0;
  if (values.hasLifeInsurance) {
     lifeInsurance = Math.min(toNumber(values.lifeInsuranceAmount), MAX_LIFE_INSURANCE);
  } else {
     lifeInsurance = Math.min(toNumber(values.lifeInsurance), MAX_LIFE_INSURANCE);
  }
  
  const parentsHealth = Math.min(toNumber(values.parentsHealth), MAX_PARENT_HEALTH);

  // 4.3 กลุ่มเกษียณ (SSF / RMF)
  let ssf = 0;
  if (values.hasSSF) {
     ssf = clampDeduction(values.ssfAmount, MAX_SSF, 0.30, annualIncome);
  } else {
     ssf = clampDeduction(values.ssf, MAX_SSF, 0.30, annualIncome);
  }

  let rmf = 0;
  if (values.hasRMF) {
     rmf = clampDeduction(values.rmfAmount, MAX_RMF, 0.30, annualIncome);
  } else {
     rmf = clampDeduction(values.rmf, MAX_RMF, 0.30, annualIncome);
  }

  // รวมกลุ่มเกษียณ (Cap 500,000)
  const retirementTotal = Math.min(ssf + rmf, MAX_RETIREMENT_GROUP);

  // รวมลดหย่อนทั้งหมด
  const totalDeductions = socialSecurity + lifeInsurance + parentsHealth + retirementTotal;

  // 5. คำนวณภาษี
  const taxableIncome = Math.max(annualIncome - standardExpense - allowances - totalDeductions, 0);
  const taxYear = calculateProgressiveTax(taxableIncome);
  const netYear = annualIncome - taxYear;

  // 6. ค่าใช้จ่าย (รับ Input รายเดือนมา)
  const monthlyExpenses = toNumber(values.expenses ?? 0);
  const yearlyExpenses = monthlyExpenses * 12;

  return {
    annual_income: annualIncome,
    allowances,
    deductions: totalDeductions,
    total_tax_shield: standardExpense + allowances + totalDeductions,
    
    taxable_income: taxableIncome,
    tax_year: taxYear,
    tax_month: taxYear / 12,
    net_income_year_after_tax: netYear,
    net_income_month_after_tax: netYear / 12,
    effective_rate: annualIncome > 0 ? taxYear / annualIncome : 0,

    total_monthly_expenses: monthlyExpenses,
    total_yearly_expenses: yearlyExpenses,
    remaining_cash_year: netYear - yearlyExpenses,
    remaining_cash_month: (netYear / 12) - monthlyExpenses
  };
}