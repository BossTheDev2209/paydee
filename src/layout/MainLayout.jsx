import { Outlet } from "react-router-dom";
import Header from "./Header";
// import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="w-full">
      <Header />
      <div className="px-4 md:px-10 mt-28 lg:mt-10 min-h-screen mb-10">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
