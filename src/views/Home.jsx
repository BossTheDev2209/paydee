import { Link } from "react-router-dom";
import Salary from "../images/salary.png";
import Saving from "../images/saving.png";

export default function Home() {
  const calculator = [
    {
      id: 1,
      img: Salary,
      path: "/salary-aftertax",
      title: "Salary After Tax",
      details:
        "mockup detail - Easily estimate your mortgage payments with our intuitive calculator. Input loan details for instant insights.",
    },
    {
      id: 2,
      img: Saving,
      path: "/saving-goal",
      title: "Saving Goal",
      details:
        "mockup detail - Easily estimate your mortgage payments with our intuitive calculator. Input loan details for instant insights.",
    },
  ];

  return (
    <section className="w-full">
      <div className="flex flex-col items-center">
        <h2 className="w-fit font-semibold px-6 py-2 rounded-full bg-yellow-300">
          FINANCIAL CALCULATORS
        </h2>
        <p className="pt-8 text-center">
          Use our calculators to help improve your monthly budget, compare costs
          and plan your future.
        </p>
      </div>

      <div className="w-full mt-10 flex flex-wrap md:flex-nowrap">
        {calculator.map((item, idx) => (
          <div key={idx} className="">
            <Link to={item.path} className="w-full py-4 md:px-4 flex">
              <div className="w-full bg-amber-100 rounded-lg p-4">
                <img src={item.img} className="w-32 h-32" />
                <h2 className="pt-4 font-bold underline">{item.title}</h2>
                <p>{item.details}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
