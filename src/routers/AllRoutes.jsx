import MainLayout from "../layout/MainLayout";
import Financial from "../views/Financial.jsx";
import Home from "../views/Home";
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
    ],
  },
];

export default allRoutes;
