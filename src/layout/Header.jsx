import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  const currentpPath = location.pathname;
  const toggleMenu = () => setOpen((prev) => !prev);
  const handleClick = () => {
    setOpen(false);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Salary After Tax", path: "/salary-aftertax" },
    { label: "Saving Goal", path: "/saving-goal" },
    { label: "Financial Profile", path: "/financial" },
  ];

  return (
    <div className="w-full">
      <section className="w-full bg-[#fdfdfd] shadow-sm shadow-[#ffcc00]/40 text-black h-38 flex flex-col justify-center lg:static">
        <div className="w-full hidden lg:flex p-4">
          <div className="w-6/12 flex gap-2 items-center">
            <div className="w-2/12 flex flex-col items-center rounded-lg">
              <h1 className="text-2xl font-bold">PayDee</h1>
              <p>เพย์ดี</p>
            </div>
          </div>

          {/* <div className="flex gap-4 items-center">
            <p>Collection</p>
            <p>New In</p>
            <p>About Us</p>
            <p>Sustainability</p>
          </div> */}

          <div className="w-6/12 flex gap-2 items-center justify-end">
          <button className="bg-[#f2f2f2] px-2 rounded-full"><i className="fa-solid fa-globe text-xl"></i></button>
          <button className="btn-base bg-[#f2f2f2]">about us</button>
          <Link to='/financial'> <button className="btn-base bg-[#ffcc00]">Financial Profile</button> </Link> 
          <button className="bg-[#f2f2f2] px-2 rounded-full"><i className="fa-solid fa-moon text-2xl"></i></button>
          </div>
        </div>

        {/* sm nav */}
        <div className="fixed top-0 bg-white z-50 flex items-center justify-between w-full gap-2 pr-2 lg:hidden p-4">
          <button onClick={toggleMenu} className="relative cursor-pointer">
            <div className="relative flex flex-col justify-between w-5 h-3 mt-1">
              <span
                className={`hamburger-menu ${
                  open ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`hamburger-menu ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`hamburger-menu ${
                  open ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </div>
          </button>

          <div className="flex flex-col items-center h-full">
            <h1 className="text-2xl font-bold">PayDee</h1>
            <p className="text-nowrap">calculator</p>
          </div>

          <div className="flex gap-4 items-center text-xl">
            <p>
              <i className="fa-solid fa-calculator"></i>
            </p>
            <p>
              <i className="fa-solid fa-sack-dollar"></i>
            </p>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 z-40 w-full h-full duration-300 ${
            open ? "translate-x-0" : "translate-x-full hidden"
          }`}
        >
          <div className="px-6 mt-[88px] space-y-4 text-lg text-black bg-white">
            {menuItems.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                onClick={handleClick}
                className={`cursor-pointer flex justify-center items-center h-10 rounded-xl hover:bg-white hover:border border-black ${
                  currentpPath === item.path ? "font-bold bg-white border" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
