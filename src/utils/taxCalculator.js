export const calculateTax = (values, mode) => {
  // 1. Annual Income
  // Values are now pre-normalized to annual in the form components
  const annualSalary = Number(values.salary || values.monthlySalary || 0);
  const annualBonusExtra = Number(values.monthlyBonusExtra || 0);
  
  const annualIncome = annualSalary + annualBonusExtra;

  // 2. Base Allowance
  let allowances = 60000; // Taxpayer

  // Family Status
  const familyStatus = values.familyStatus || "single";
  if (familyStatus === "married-no-income") {
    allowances += 60000;
  }

  // Children
  const childrenCount = Number(values.children || values.childrenCount || 0);
  allowances += childrenCount * 30000;

  // Parents
  const parentsCount = Number(values.parentsCount || 0);
  allowances += parentsCount * 30000;

  // 3. Deductions
  let totalDeductions = 0;

  // Helper to clamp values
  const clamp = (val, max, limitRate = 1) => {
    return Math.min(val, max, annualIncome * limitRate);
  };

  // Life Insurance
  let lifeInsurance = 0;
  if (mode === "quick") {
    lifeInsurance = values.hasLifeInsurance ? 100000 : 0;
  } else {
    lifeInsurance = Number(values.lifeInsurance || 0);
  }
  lifeInsurance = Math.min(lifeInsurance, 100000);

  // Parent Health Insurance
  let parentsHealthInsurance = Number(values.parentsHealthInsurance || 0);
  parentsHealthInsurance = Math.min(parentsHealthInsurance, 100000);

  // SSF
  let ssf = 0;
  if (mode === "quick") {
    ssf = values.hasSSF ? annualIncome * 0.10 : 0;
  } else {
    ssf = Number(values.ssf || values.ssfAmount || 0);
  }
  // Rule: min(value, 200,000, 0.30 * annual_income)
  ssf = Math.min(ssf, 200000, annualIncome * 0.30);

  // RMF
  let rmf = 0;
  if (mode === "quick") {
    rmf = values.hasRMF ? annualIncome * 0.10 : 0;
  } else {
    rmf = Number(values.rmf || values.rmfAmount || 0);
  }
  // Rule: min(value, 500,000, 0.30 * annual_income)
  rmf = Math.min(rmf, 500000, annualIncome * 0.30);

  // Provident Fund
  let provident = 0;
  if (mode === "quick") {
    // Prompt says: Provident = 0.05 * annual_income (if checked? Quick mode UI doesn't seem to have provident checkbox in the viewed file, but prompt implies it might. 
    // Looking at QuickMode.jsx, there is NO provident checkbox. 
    // However, the prompt says "Checkbox investments map to assumed values... Provident = 0.05 * annual_income".
    // Since there is no input, we assume 0 for Quick Mode unless I missed a hidden field.
    // Re-reading prompt: "Quick Mode uses a subset of Detailed Mode input. Missing fields = treated as zero."
    // But then "Checkbox investments map to... Provident...". 
    // If the UI doesn't have it, it's 0.
    provident = 0; 
  } else {
    provident = Number(values.provident || 0);
  }
  // Rule: Provident <= 0.15 * annual_income
  provident = Math.min(provident, annualIncome * 0.15);

  // Social Security (Not explicitly mentioned in prompt rules but usually standard. 
  // Prompt says "DEDUCTIONS (CLAMP RULES)..." and lists specific ones. 
  // It doesn't mention Social Security. I will strictly follow the prompt and NOT add Social Security unless it was in the list.)
  
  // Sum deductions so far
  totalDeductions = lifeInsurance + parentsHealthInsurance + ssf + rmf + provident;

  // Donation
  // Donation is calculated AFTER other deductions because it's based on "taxable_income_before_donation"
  const taxableBeforeDonation = Math.max(annualIncome - allowances - totalDeductions, 0);
  
  let donation = 0;
  if (mode === "detailed") {
    donation = Number(values.donation || 0);
  }
  // Rule: Donation <= 0.10 * taxable_income_before_donation
  donation = Math.min(donation, taxableBeforeDonation * 0.10);

  totalDeductions += donation;

  // 4. Taxable Income
  const taxableIncome = Math.max(annualIncome - allowances - totalDeductions, 0);

  // 5. Thai Progressive Tax
  let tax = 0;
  const brackets = [
    { limit: 150000, rate: 0 },
    { limit: 300000, rate: 0.05 },
    { limit: 500000, rate: 0.10 },
    { limit: 750000, rate: 0.15 },
    { limit: 1000000, rate: 0.20 },
    { limit: 2000000, rate: 0.25 },
    { limit: 5000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 },
  ];

  let remainingIncome = taxableIncome;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const range = bracket.limit - previousLimit;
    const taxableAmount = Math.min(remainingIncome, range); // This logic is slightly wrong for standard iteration.
    
    // Correct Iteration Logic:
    // We need to calculate tax for the income falling INTO this bracket.
    // Actually, easier way:
    
    // Let's restart tax calc loop
  }
  
  tax = 0;
  previousLimit = 0;
  for (const bracket of brackets) {
      const range = bracket.limit - previousLimit;
      if (taxableIncome > previousLimit) {
          const taxableInThisBracket = Math.min(taxableIncome - previousLimit, range);
          tax += taxableInThisBracket * bracket.rate;
      }
      previousLimit = bracket.limit;
  }

  // 6. Final Output
  const taxYear = tax;
  const taxMonth = taxYear / 12;
  const netIncomeYearAfterTax = annualIncome - taxYear;
  const netIncomeMonthAfterTax = netIncomeYearAfterTax / 12;
  const effectiveRate = annualIncome > 0 ? taxYear / annualIncome : 0;

  return {
    annual_income: annualIncome,
    total_deductions: totalDeductions + allowances, // "total_deductions" in output usually means everything that reduces taxable income? Or just the specific deductions? 
    // Prompt says "taxable_income = max(annual_income - total_deductions, 0)" in the "TAXABLE INCOME" section.
    // But in the "DEDUCTIONS" section it lists specific items.
    // And "BASE ALLOWANCE" is separate.
    // However, standard accounting: Taxable = Income - Expenses(none here) - Allowances - Deductions.
    // I will return the sum of Allowances + Deductions as "total_deductions" to match the likely expectation of "how much was deducted from income".
    
    taxable_income: taxableIncome,
    tax_year: taxYear,
    tax_month: taxMonth,
    net_income_year_after_tax: netIncomeYearAfterTax,
    net_income_month_after_tax: netIncomeMonthAfterTax,
    effective_rate: effectiveRate
  };
};
