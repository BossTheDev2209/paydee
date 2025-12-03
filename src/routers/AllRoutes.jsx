import MainLayout from "../layout/MainLayout";
import AboutUs from "../views/AboutUs.jsx";
import Financial from "../views/Financial.jsx";
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
      { path: "/saving-goal", element: <SavingGoal /> },
      { path: "/financial", element: <Financial /> },
      { path: "/policy", element: <Policy /> },
      { path: "/about-us", element: <AboutUs /> },
    ],
  },
];

export default allRoutes;
