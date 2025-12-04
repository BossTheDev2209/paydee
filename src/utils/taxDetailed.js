// taxDetailed.js
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
  MAX_PROVIDENT_RATE,
  MAX_RETIREMENT_GROUP,
  SOCIAL_SECURITY_RATE,
  MAX_SOCIAL_SECURITY_MONTHLY,
  DONATION_RATE_CAP,
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

export function calculateTaxDetailed(values = {}) {
  // 1. รายได้ (Detailed Mode ส่งมาเป็นรายปีตาม UI หรือรายเดือน)
  const salaryMonth = toNumber(values.monthlySalary ?? values.salaryMonth ?? 0); // จาก input name="monthlySalary"
  const bonusYear = toNumber(values.monthlyBonusExtra ?? values.bonusYear ?? 0); // จาก input name="monthlyBonusExtra"

  const baseIncome = salaryMonth * 12;
  const annualIncome = baseIncome + bonusYear;

  // 2. ค่าใช้จ่าย
  const standardExpense = Math.min(annualIncome * DEDUCTION_EXPENSE_RATE, DEDUCTION_EXPENSE_MAX);

  // 3. ลดหย่อนส่วนตัว/ครอบครัว
  let allowances = ALLOWANCE_TAXPAYER;
  if (values.familyStatus === "married-no-income") {
    allowances += ALLOWANCE_SPOUSE_NO_INCOME;
  }

  const children = toNumber(values.childrenCount ?? values.children ?? 0);
  const parents = toNumber(values.parentsCount ?? values.parents ?? 0);
  allowances += (children * ALLOWANCE_CHILD) + (parents * ALLOWANCE_PARENT);

  // 4. ลดหย่อนอื่นๆ
  // 4.1 ประกันสังคม (คำนวณอัตโนมัติจาก salaryMonth)
  const ssoMonth = Math.min(salaryMonth * SOCIAL_SECURITY_RATE, MAX_SOCIAL_SECURITY_MONTHLY);
  const socialSecurity = ssoMonth * 12;

  // 4.2 ประกัน/สุขภาพ
  const lifeInsurance = Math.min(toNumber(values.lifeInsurance), MAX_LIFE_INSURANCE);
  const parentsHealth = Math.min(toNumber(values.parentsHealthInsurance ?? values.parentsHealth), MAX_PARENT_HEALTH);

  // 4.3 กลุ่มเกษียณ (SSF / RMF / PVD)
  const ssf = clampDeduction(values.ssf, MAX_SSF, 0.30, annualIncome);
  const rmf = clampDeduction(values.rmf, MAX_RMF, 0.30, annualIncome);
  const provident = clampDeduction(values.provident ?? values.providentFund, Infinity, MAX_PROVIDENT_RATE, annualIncome);

  const retirementTotal = Math.min(ssf + rmf + provident, MAX_RETIREMENT_GROUP);

  const totalDeductions = socialSecurity + lifeInsurance + parentsHealth + retirementTotal;

  // 5. เงินบริจาค (10% ของเงินได้หลังหักค่าใช้จ่ายและลดหย่อน)
  const incomeBeforeDonation = Math.max(annualIncome - standardExpense - allowances - totalDeductions, 0);
  const donationCap = incomeBeforeDonation * DONATION_RATE_CAP;
  const donation = Math.min(toNumber(values.donation), donationCap);

  // 6. คำนวณภาษี
  const taxableIncome = Math.max(incomeBeforeDonation - donation, 0);
  const taxYear = calculateProgressiveTax(taxableIncome);
  const netYear = annualIncome - taxYear;

  // 7. Cash Flow (Expenses)
  const monthlyExpenses =
    toNumber(values.housingCost) +
    toNumber(values.transportCost) +
    toNumber(values.debtPayment) +
    toNumber(values.foodCost) +
    toNumber(values.utilitiesCost) +
    toNumber(values.insuranceServiceCost) +
    toNumber(values.miscCost);

  const yearlyExpenses = monthlyExpenses * 12;
  const remainingCashYear = netYear - yearlyExpenses;

  return {
    annual_income: annualIncome,
    allowances,
    deductions: totalDeductions + donation,
    total_tax_shield: standardExpense + allowances + totalDeductions + donation,

    taxable_income: taxableIncome,
    tax_year: taxYear,
    tax_month: taxYear / 12,
    net_income_year_after_tax: netYear,
    net_income_month_after_tax: netYear / 12,
    effective_rate: annualIncome > 0 ? taxYear / annualIncome : 0,

    total_monthly_expenses: monthlyExpenses,
    total_yearly_expenses: yearlyExpenses,
    remaining_cash_year: remainingCashYear,
    remaining_cash_month: remainingCashYear / 12
  };
}