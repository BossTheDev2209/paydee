import { calculateTaxQuick } from "../utils/taxQuick.js";
import { calculateTaxDetailed } from "../utils/taxDetailed.js";

// Mock ค่าคงที่เพื่อให้ Test อ่านง่ายและไม่อิงกับไฟล์ config ภายนอกมากเกินไปในเชิง Logic
// แต่ในการเทสจริง เราจะเทสผ่าน function หลักที่ import มา

describe("Tax Calculation Engine", () => {
  
  // ==========================================
  // 🟡 TEST SUITE 1: QUICK MODE
  // ==========================================
  describe("Quick Mode Calculation", () => {
    
    test("Case Q1: เงินเดือน 20,000 (ต่ำกว่าเกณฑ์เสียภาษี)", () => {
      // Logic:
      // รายได้: 20,000 * 12 = 240,000
      // หักค่าใช้จ่าย (50% ไม่เกิน 100k): 100,000
      // หักส่วนตัว: 60,000
      // หักประกันสังคม (750 * 12): 9,000
      // เงินได้สุทธิ: 240k - 100k - 60k - 9k = 71,000
      // ภาษี: 0 บาท

      const input = {
        salary: 20000,
        expenses: 10000,
        familyStatus: "single",
        children: 0,
        hasLifeInsurance: false,
        hasSSF: false,
        hasRMF: false
      };

      const result = calculateTaxQuick(input);

      expect(result.annual_income).toBe(240000);
      expect(result.taxable_income).toBe(71000);
      expect(result.tax_year).toBe(0);
      // เช็ค Cash Flow: รายได้ 240k - ภาษี 0 - ค่าใช้จ่าย (10k*12) = 120,000
      expect(result.remaining_cash_year).toBe(120000);
    });

    test("Case Q2: เงินเดือน 50,000 (ฐานภาษี 10%)", () => {
      // Logic:
      // รายได้: 600,000
      // หักค่าใช้จ่าย: 100,000
      // หักส่วนตัว: 60,000
      // หักประกันสังคม: 9,000
      // สุทธิ: 431,000
      
      // คำนวณภาษี:
      // 0-150k: 0
      // 150k-300k (150k * 5%): 7,500
      // 300k-431k (131k * 10%): 13,100
      // รวมภาษี: 20,600

      const input = {
        salary: 50000,
        expenses: 20000,
        familyStatus: "single"
      };

      const result = calculateTaxQuick(input);

      expect(result.annual_income).toBe(600000);
      expect(result.taxable_income).toBe(431000);
      expect(result.tax_year).toBe(20600);
    });

    test("Case Q3: ทดสอบ Checkbox ลดหย่อน (ประกัน + SSF)", () => {
      // เงินเดือน 100,000 (1.2M/ปี)
      // ประกันชีวิต 50,000
      // SSF 100,000
      // หักค่าใช้จ่าย 100k, ส่วนตัว 60k, SSO 9k
      // Deductions รวม = 9,000 + 50,000 + 100,000 = 159,000
      // สุทธิ = 1,200,000 - 100,000 - 60,000 - 159,000 = 881,000
      
      // ภาษี:
      // 0-300k: 7,500
      // 300-500k: 20,000
      // 500-750k: 37,500
      // 750-881k (131k * 20%): 26,200
      // รวม: 91,200

      const input = {
        salary: 100000,
        expenses: 0,
        familyStatus: "single",
        hasLifeInsurance: true,
        lifeInsuranceAmount: 50000,
        hasSSF: true,
        ssfAmount: 100000
      };

      const result = calculateTaxQuick(input);
      expect(result.taxable_income).toBe(881000);
      expect(result.tax_year).toBe(91200);
    });
  });

  // ==========================================
  // 🟡 TEST SUITE 2: DETAILED MODE
  // ==========================================
  describe("Detailed Mode Calculation", () => {

    test("Case D1: ครอบครัว + โบนัส + เพดานลดหย่อน 5 แสน", () => {
      // Input:
      // เงินเดือน 100,000 -> 1,200,000
      // โบนัส 300,000
      // รวมรายได้: 1,500,000
      
      // ลดหย่อน:
      // - ค่าใช้จ่าย: 100,000 (Max)
      // - ส่วนตัว: 60,000
      // - คู่สมรส (ไม่มีเงินได้): 60,000
      // - ลูก 2 คน (30k x 2): 60,000
      // - ประกันสังคม: 9,000
      
      // กลุ่มเกษียณ (Test Cap 500k):
      // - PVD 100,000
      // - RMF 300,000
      // - SSF 200,000
      // รวม input = 600,000 -> ต้องถูกตัดเหลือ 500,000
      
      // Total Deductions (ไม่รวมค่าใช้จ่าย/ส่วนตัว): 9,000 + 500,000 = 509,000
      
      // เงินได้สุทธิ:
      // 1,500,000 - 100,000 (Exp) - 180,000 (Family) - 509,000 (Deduct)
      // = 711,000
      
      // ภาษี:
      // 0-150k: 0
      // 150-300k: 7,500
      // 300-500k: 20,000
      // 500-711k (211k * 15%): 31,650
      // รวมภาษี: 59,150

      const input = {
        monthlySalary: 100000,
        monthlyBonusExtra: 300000, // field name อาจจะงงๆ แต่ใน code map เป็น bonusYear
        familyStatus: "married-no-income",
        childrenCount: 2,
        
        provident: 100000,
        rmf: 300000,
        ssf: 200000, // เกิน Cap 500k เมื่อรวมกัน
        
        // Expenses (Cashflow Only)
        housingCost: 10000
      };

      const result = calculateTaxDetailed(input);

      expect(result.annual_income).toBe(1500000);
      
      // เช็ค Allowance (ตัว+เมีย+ลูก2) = 60+60+60 = 180k
      expect(result.allowances).toBe(180000);
      
      // เช็ค Deductions (SSO 9k + Retirement Cap 500k)
      // หมายเหตุ: function return deductions รวม donation ด้วย แต่เคสนี้ donation=0
      expect(result.deductions).toBe(509000);
      
      expect(result.taxable_income).toBe(711000);
      expect(result.tax_year).toBe(59150);
    });

    test("Case D2: เงินบริจาค (Donation Cap 10%)", () => {
      // รายได้ 1,000,000
      // หัก Exp 100,000
      // หัก ส่วนตัว 60,000
      // หัก SSO 9,000
      // เงินได้ก่อนบริจาค = 1,000,000 - 169,000 = 831,000
      
      // บริจาค Max = 10% ของ 831,000 = 83,100
      // Input บริจาค = 100,000 (เกิน) -> ต้องคิดแค่ 83,100
      
      // สุทธิ = 831,000 - 83,100 = 747,900
      
      // ภาษี:
      // 0-500k: 27,500
      // 500-747.9k (247,900 * 15%): 37,185
      // รวม: 64,685

      const input = {
        monthlySalary: 83333.33, // ~1M per year
        bonusYear: 0, // หรือ field monthlyBonusExtra
        familyStatus: "single",
        donation: 100000 // ใส่เกิน 10%
      };

      const result = calculateTaxDetailed(input);

      // ยอมรับความคลาดเคลื่อนทศนิยมเล็กน้อย
      expect(result.annual_income).toBeCloseTo(1000000, 0);
      expect(result.taxable_income).toBeCloseTo(747900, 0);
      expect(result.tax_year).toBeCloseTo(64685, 0);
    });

    test("Case D3: Cash Flow ติดลบ", () => {
      // รายได้ 30,000/เดือน -> 360,000/ปี
      // ภาษี (คิดคร่าวๆ) -> สุทธิเหลือประมาณ 350k+
      // รายจ่าย 40,000/เดือน -> 480,000/ปี
      // Remaining ต้องติดลบ

      const input = {
        monthlySalary: 30000,
        housingCost: 20000,
        foodCost: 10000,
        debtPayment: 10000, // รวม exp = 40,000
        familyStatus: "single"
      };

      const result = calculateTaxDetailed(input);
      
      expect(result.remaining_cash_month).toBeLessThan(0);
      expect(result.remaining_cash_year).toBeLessThan(0);
    });

  });
});

// ==========================================
  // 🔴 TEST SUITE 3: ADVANCED & COMPLEX CASES
  // ==========================================
  describe("Advanced Complex Scenarios", () => {

    test("Case ADV-1: The 'Maxed Out' Retirement (กับดักเพดาน 500,000)", () => {
      // Scenario: ผู้บริหารรายได้สูง พยายามอัดลดหย่อนทุกช่องทาง
      // รายได้: 150,000 * 12 = 1,800,000 บาท
      
      // ลดหย่อนพื้นฐาน:
      // - ค่าใช้จ่าย: 100,000 (Max)
      // - ส่วนตัว: 60,000
      // - ประกันสังคม: 9,000 (Max)
      
      // กลุ่มเกษียณ (Input เข้ามาแบบ Overload):
      // - Provident Fund (PVD): 15% ของ 1.8M = 270,000
      // - SSF: 200,000 (Max)
      // - RMF: 500,000 (Max Input)
      // รวม Input กลุ่มนี้ = 270k + 200k + 500k = 970,000 บาท!!
      // **แต่กฎหมายยอมให้หักได้แค่ 500,000 บาท**
      
      // เงินได้สุทธิ (Taxable Income):
      // 1,800,000 - 100,000 - 60,000 - 9,000 - 500,000 (Capped)
      // = 1,131,000 บาท

      // คำนวณภาษี (Step Calculation):
      // 0 - 150k: 0
      // 150k - 300k (150k * 5%): 7,500
      // 300k - 500k (200k * 10%): 20,000
      // 500k - 750k (250k * 15%): 37,500
      // 750k - 1M (250k * 20%): 50,000
      // 1M - 1.131M (131k * 25%): 32,750
      // รวมภาษี: 147,750 บาท

      const input = {
        monthlySalary: 150000,
        provident: 270000, // ใส่เต็ม 15%
        ssf: 200000,       // ใส่เต็ม Max SSF
        rmf: 500000,       // ใส่เต็ม Max RMF
        familyStatus: "single"
      };

      const result = calculateTaxDetailed(input);

      expect(result.annual_income).toBe(1800000);
      // เช็คว่ารวมลดหย่อน (SSO 9k + Retirement 500k) ต้องได้ 509,000
      expect(result.deductions).toBe(509000); 
      expect(result.taxable_income).toBe(1131000);
      expect(result.tax_year).toBe(147750);
    });

    test("Case ADV-2: The 'Super Rich' (รายได้ 6 ล้าน - ฐาน 35%)", () => {
      // รายได้: 500,000 * 12 = 6,000,000 บาท
      
      // ลดหย่อน:
      // - ค่าใช้จ่าย: 100,000
      // - ส่วนตัว: 60,000
      // - ประกันสังคม: 9,000
      // - ประกันชีวิต: 100,000
      // รวมลดหย่อนพื้นฐาน = 269,000
      
      // เงินได้สุทธิ: 6,000,000 - 269,000 = 5,731,000 บาท
      
      // คำนวณภาษี:
      // ภาษีสะสมถึง 5 ล้านบาทแรก (คำนวณมือ) = 1,265,000 บาท
      // ส่วนที่เกิน 5 ล้าน: 731,000 * 35% = 255,850 บาท
      // รวมภาษี: 1,265,000 + 255,850 = 1,520,850 บาท

      const input = {
        monthlySalary: 500000,
        familyStatus: "single",
        lifeInsurance: 100000
      };

      const result = calculateTaxDetailed(input);

      expect(result.taxable_income).toBe(5731000);
      expect(result.tax_year).toBe(1520850);
      // Effective Tax Rate ควรจะสูง (ประมาณ 25%)
      expect(result.effective_rate).toBeCloseTo(25.34, 1);
    });

    test("Case ADV-3: The 'Borderline' (เกิน 150,000 มา 1 บาท)", () => {
      // โจทย์: ทำยังไงให้ Net Income = 150,001 บาท?
      // Net = Income - 100k(Exp) - 60k(Self) - 9k(SSO) = 150,001
      // Income - 169,000 = 150,001
      // Income = 319,001 บาท
      
      // ดังนั้น:
      // เงินเดือน = 319,001 / 12 = 26,583.4166...
      // เพื่อความแม่นยำ ใส่เป็นรายปีผ่าน Bonus ดีกว่า หรือใส่ salary แบบทศนิยม

      const input = {
        monthlySalary: 0,
        bonusYear: 319001, // ใส่ยอดรวมเป็นโบนัสเลยง่ายดี
        familyStatus: "single"
      };

      const result = calculateTaxDetailed(input);

      expect(result.taxable_income).toBe(150001);
      
      // ภาษี:
      // 0-150,000 = 0
      // 150,001 - 300,000 (คิด 5%)
      // ส่วนเกินคือ 1 บาท -> 1 * 0.05 = 0.05 บาท
      // ระบบควร return 0.05 (หรืออาจจะปัดเศษตาม logic แต่ใน engine เรา return ทศนิยมได้)
      expect(result.tax_year).toBeCloseTo(0.05, 2);
    });

    test("Case ADV-4: Donation Paradox (ลดหย่อนเปลี่ยน -> เพดานบริจาคเปลี่ยน)", () => {
      // เคสนี้เช็คว่าระบบคำนวณลำดับถูกต้องไหม (บริจาคต้องคิดเป็นลำดับสุดท้าย)
      
      // รายได้ 1,000,000
      // ลดหย่อน A (พื้นฐาน): 100k(Exp) + 60k(Self) + 9k(SSO) = 169,000
      // เหลือเงินก่อนบริจาค = 831,000
      // เพดานบริจาค (10%) = 83,100
      
      // แต่! ถ้าเราเพิ่มลดหย่อนประกันชีวิตเข้าไปอีก 100,000
      // เหลือเงินก่อนบริจาค = 731,000
      // เพดานบริจาคจะลดลงเหลือ = 73,100 ทันที
      
      // Input: ใส่บริจาคไปเวอร์ๆ 100,000 (เพื่อให้มันโดน Cap แน่ๆ)
      // แล้วดูว่ามัน Cap ที่ยอดไหน

      const inputWithInsurance = {
        monthlySalary: 83333.3333, // ~1M/year
        lifeInsurance: 100000,     // มีประกัน
        donation: 100000,          // บริจาคเกิน
        familyStatus: "single"
      };

      const result = calculateTaxDetailed(inputWithInsurance);
      
      // คำนวณ Cap บริจาคที่ถูกต้อง:
      // (1,000,000 - 169,000 - 100,000) * 10% = 73,100
      
      // Deductions ที่ return ออกมา ควรเป็น:
      // 9,000(SSO) + 100,000(Life) + 73,100(Donation Capped) = 182,100
      expect(result.deductions).toBeCloseTo(182100, 0);
      
      // Taxable Income สุทธิ:
      // 731,000 - 73,100 = 657,900
      expect(result.taxable_income).toBeCloseTo(657900, 0);
    });

  });