import { useState } from "react";
import QuickMode from "./salary-tab/QuickMode";
import DetailedMode from "./salary-tab/DetailedMode";
import { Link, useSearchParams } from "react-router-dom";

export default function SalaryAfterTax() {
  const [params] = useSearchParams();
  const Mode = params.get("mode");
  const [mode, setMode] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = (values, mode) => {
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
      const Qnet = (salary - expenses) * 12;

      // detailed mode
      const Dnet =
        (salary +
          bonus +
          extraIncome -
          (commutingCost + housingCost + debt + deduction + expenses)) *
        12;

      const netTax = mode === "quick" ? (tax / 100) * Qnet : (tax / 100) * Dnet;
      const netMount =
        mode === "quick" ? (Qnet - netTax) / 12 : (Dnet - netTax) / 12;
      const netYearAfterTax = mode === "quick" ? Qnet - netTax : Dnet - netTax;

      console.log(netTax);
      console.log(netMount);
      console.log(netYearAfterTax);

      setResult({
        netTax,
        netMount,
        netYearAfterTax,
      });
      setLoading(false);
    });
  };
  return (
    <section className="w-full">
      <Link to="/" className="w-full">
        <p className="w-full text-start text-base md:text-xl mb-8 text-[#979797] transition-colors duration-300">
          <i class="fa-solid fa-arrow-left-long pr-6"></i>
          Back to Home
        </p>
      </Link>
      <h1 className="text-lg md:text-2xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        Salary After Tax
      </h1>
      <h3 className="text-sm md:text-lg text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
        คำนวณรายได้สุทธิหลังหักภาษีและค่าใช้จ่าย
      </h3>

      <div className="w-full flex justify-center">
        {/* personal detail */}
        <section className="w-full md:w-10/12">
          {Mode === "quick" ? (
            <QuickMode
              key="quick"
              calculate={(values) => calculate(values, "quick")}
            />
          ) : (
            <DetailedMode
              key="detailed"
              calculate={(values) => calculate(values, "detailed")}
            />
          )}

          <div className="w-full p-4 bg-[#fdfdfd] dark:bg-[#202121] transition-colors duration-300 rounded-lg mt-10">
            <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] w-full bg-[#ffcc00] rounded-lg p-1 text-center mb-4">
              ผลลัพธ์
            </h1>
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
                    <h2 className="text-base md:text-xl md:w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      รายได้สุทธิต่อเดือน
                    </h2>
                    <h2 className="text-base md:text-xl md:w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.netMount.toLocaleString()} บาท
                    </h2>
                  </p>
                  <p className="flex flex-wrap justify-between pad-main">
                    <h2 className="text-base md:text-xl md:w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      รายได้สุทธิต่อปี
                    </h2>
                    <h2 className="text-base md:text-xl md:w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.netYearAfterTax.toLocaleString()} บาท
                    </h2>
                  </p>
                  <p className="flex flex-wrap justify-between pad-main text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                    <h2 className="text-base md:text-xl md:w-6/12 text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      ภาษีต่อปี
                    </h2>
                    <h2 className="text-base md:text-xl md:w-6/12 text-end text-[#3d3d3d] dark:text-[#f2f1f1] transition-colors duration-300">
                      {result.netTax.toLocaleString()} บาท
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
