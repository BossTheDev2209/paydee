import { Outlet } from "react-router-dom";
import Header from "./Header";
// import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="w-full">
      <Header />
      <div className="px-4 mt-24 md:mt-10 lg:mt-10 min-h-screen mb-10">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
