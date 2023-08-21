import React from "react";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/Context";
import Taskus_logo from "../Images/Taskus_logo.png";
import { AiFillHome } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
function NavBar() {
  const { logOut } = useGlobal();
  const handleLogout = async () => {
    await logOut().catch((error) => alert(error));
  };

  return (
    <nav className="w-full h-[70px] bg-slate-900 border-b border-b-blue-900 flex justify-between items-center px-4 mx-auto md:px-8">
      <div className="flex items-center">
        <img
          src={Taskus_logo}
          width="70px"
          height="50px"
          alt="Taskus Icon"
          className="ml-4"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/homepage"
          className="font-bold text-white hover:text-cyan-400 transition duration-300 ease-in-out transform hover:scale-110 flex flex-col items-center"
          title="Home"
        >
          <AiFillHome size={35} />
        </Link>

        <button
          onClick={handleLogout}
          className="font-bold   text-white hover:text-red-600 transition duration-300 ease-in-out transform  hover:scale-110 flex flex-col items-center"
          title="Logout"
        >
          <IoLogOut size={36} />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
