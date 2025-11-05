import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function MainLayout() {
  return (
    <div className="w-full">
      <Header />
      <div className="px-20 mt-28 lg:mt-10 min-h-screen mb-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
