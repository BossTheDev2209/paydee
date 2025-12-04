import { calculateTaxQuick } from "./taxQuick.js";
import { calculateTaxDetailed } from "./taxDetailed.js";

// Q1: Basic salary, no bonus
const q1 = calculateTaxQuick({
    salaryMonth: 85000,
    bonusYear: 0,
    familyStatus: "single",
    childrenCount: 0,
    parentsCount: 0
});
console.log("Q1 Tax:", q1.tax_year, "Net/mo:", Math.round(q1.net_income_month_after_tax));

// Q2: With bonus
const q2 = calculateTaxQuick({
    salaryMonth: 85000,
    bonusYear: 200000,
    familyStatus: "single"
});
console.log("Q2 Tax:", q2.tax_year, "Annual:", q2.annual_income);

// D1: Should match Q1
const d1 = calculateTaxDetailed({
    salaryMonth: 85000,
    bonusYear: 0,
    familyStatus: "single"
});
console.log("D1 Tax:", d1.tax_year, "(matches Q1?", d1.tax_year === q1.tax_year, ")");

// D3: Negative cash flow
const d3 = calculateTaxDetailed({
    salaryMonth: 75000,
    bonusYear: 0,
    childrenCount: 1,
    parentsCount: 2,
    housingCost: 70000
});
console.log("D3 CashMonth:", d3.remaining_cash_month, "Negative?", d3.remaining_cash_month < 0);
