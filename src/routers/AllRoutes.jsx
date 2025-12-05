import AIPort from "@/views/AIPort";
import InvestmentInfo from "@/views/InvestmentInfo";
import MainLayout from "../layout/MainLayout";
import AboutUs from "../views/AboutUs.jsx";
import Financial from "../views/Financial.jsx";
import FinancialInsight from "../views/FinancialInsight.jsx";
import Home from "../views/Home";
import Policy from "../views/Policy.jsx";
import SalaryAfterTax from '../views/SalaryAfterTax.jsx';
import SavingGoal from '../views/SavingGoal.jsx';

const allRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/salary-aftertax", element: <SalaryAfterTax /> },
      { path: "/financial-insight", element: <FinancialInsight /> },
      { path: "/saving-goal", element: <SavingGoal /> },
      { path: "/financial", element: <Financial /> },
      { path: "/policy", element: <Policy /> },
      { path: "/terms-of-use", element: <Policy /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/ai-port", element: <AIPort /> },
      { path: "/investment-info", element: <InvestmentInfo /> },
    ],
  },
];

export default allRoutes;
