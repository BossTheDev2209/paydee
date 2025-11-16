import { useState } from "react";
import QuickMode from "./salary-tab/QuickMode";
import DetailedMode from "./salary-tab/DetailedMode";

export default function SalaryAfterTax() {
  const [mode, setMode] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = (values) => {
    setLoading(true);
    setTimeout(() => {
      const salary = Number(values.salary);
      const expenses = Number(values.expenses);
      const tax = Number(values.tax);
      const bonus = Number(values.bonus);
      const extraIncome = Number(values.extraIncome);
      const commutingCost = Number(values.commutingCost);
      const housingCost = Number(values.housingCost);
      const debt = Number(values.debt);
      const deduction = Number(values.deduction);

      // quick mode
      const netTax = (tax / 100) * salary;
      const quickNet = salary - (netTax + expenses);
      const netYear = quickNet * 12;
      const taxYear = netTax * 12;
      console.log(quickNet);

      // detailed mode
      const detailedNet = (salary + bonus + extraIncome) - (commutingCost + housingCost + debt + netTax) - deduction

      setResult({ salary, tax, expenses, netTax, quickNet, netYear, taxYear, detailedNet });
      setLoading(false);
    });
  };
  return (
    <section className="w-full">
      <h1 className="font-bold">Salary After Tax</h1>
      <h3 className="text-black/60">
        คำนวณรายได้สุทธิหลังหักภาษีและค่าใช้จ่าย
      </h3>

      <div className="w-full flex justify-center">
        {/* personal detail */}
        <section className="w-full md:w-10/12 p-4">
          {mode === "quick" ? (
            <QuickMode
              calculate={calculate}
              switchMode={() => setMode("detailed")}
            />
          ) : (
            <DetailedMode
              calculate={calculate}
              switchMode={() => setMode("quick")}
            />
          )}

          <div className="w-full p-4 bg-[#fdfdfd] rounded-lg mt-10">
            <h1 className="font-bold"> ผลลัพธ์ </h1>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <h1 className="text-5xl">
                  <i className="fa-solid fa-spinner text-[#ffcc00] animate-spin"></i>
                </h1>
              </div>
            ) : result ? (
              <>
                <div className="">
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="w-full md:w-6/12"> รายได้สุทธิต่อเดือน </h2>
                    <h2 className="w-full md:w-6/12 md:text-end">
                      {result.quickNet.toLocaleString()} บาท
                    </h2>
                  </p>
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="w-full md:w-6/12"> รายได้สุทธิต่อปี </h2>
                    <h2 className="w-full md:w-6/12 md:text-end">
                      {result.netYear.toLocaleString()} บาท
                    </h2>
                  </p>
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="w-full md:w-6/12"> หักภาษี </h2>
                    <h2 className="w-full md:w-6/12 md:text-end">
                      {result.netTax.toLocaleString()} บาท
                    </h2>
                  </p>
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="w-full md:w-6/12"> ภาษีต่อปี </h2>
                    <h2 className="w-full md:w-6/12 md:text-end">
                      {result.taxYear.toLocaleString()} บาท
                    </h2>
                  </p>
                </div>
              </>
            ) : (
              <h1> </h1>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
