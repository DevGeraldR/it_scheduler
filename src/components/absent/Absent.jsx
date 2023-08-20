import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import AbsentsList from "./AbsentsList";

function Absent() {
  const { employee } = useGlobal();
  const navigate = useNavigate();
  return (
    <div className="flex h-full bg-gray-200 justify-center px-2">
      <div className="flex flex-col overflow-hidden my-5 w-full bg-white p-5 rounded-xl shadow-lg text-gray-700 border border-slate-400">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="font-bold text-xl italic block mb-0 leading-none pb-5">
            Absent
          </h1>
        </div>

        <div className="overflow-scroll">
          <AbsentsList absents={employee.absent} />
        </div>
        <div className="w-screen flex justify-center p-10 gap-2">
          <button
            onClick={() => navigate("/homepage/employeeInformation/")}
            className="hover:text-white mt-10 md:mt-0  bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={() =>
              navigate("/homepage/employeeInformation/absent/addAbsent")
            }
            className="hover:text-white mt-10 md:mt-0  bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add Absent
          </button>
        </div>
      </div>
    </div>
  );
}

export default Absent;
