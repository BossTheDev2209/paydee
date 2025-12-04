
import { calculateTaxQuick } from "./taxQuick.js";
import { calculateTaxDetailed } from "./taxDetailed.js";

console.log("=== UI Input Verification ===\n");

// Case 1: Quick Mode (Simulating QuickMode.jsx logic which strips commas first)
// QuickMode.jsx: salary: Number(String("85,000").replace(/,/g, '')) -> 85000
const q1 = calculateTaxQuick({
    salaryMonth: 85000,
    bonusYear: 0,
    familyStatus: "single"
});
console.log("Q1 (Number Input): Tax =", q1.tax_year.toLocaleString(), "(Expected 85,200)");

// Case 2: Detailed Mode (Simulating DetailedMode.jsx which passes strings with commas)
// DetailedMode.jsx: passes values directly
const d1 = calculateTaxDetailed({
    monthlySalary: "85,000",
    monthlyBonusExtra: "0",
    familyStatus: "single",
    housingCost: "10,000"
});
console.log("D1 (String with Comma Input): Tax =", d1.tax_year.toLocaleString(), "(Expected 85,200)");
console.log("D1 Expenses:", d1.total_monthly_expenses.toLocaleString(), "(Expected 10,000)");

// Case 3: Detailed Mode with mixed inputs
const d2 = calculateTaxDetailed({
    monthlySalary: "90,000",
    monthlyBonusExtra: "200,000",
    familyStatus: "single",
    lifeInsurance: "50,000",
    ssf: "100,000",
    rmf: "100,000"
});
console.log("D2 (Mixed Inputs): Tax =", d2.tax_year.toLocaleString());
