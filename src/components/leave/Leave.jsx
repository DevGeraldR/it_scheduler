import React from "react";
import LeavesList from "./LeavesList";
import { useGlobal } from "../context/Context";
import { useNavigate } from "react-router-dom";

function Leave() {
  const { employee } = useGlobal();
  const navigate = useNavigate();
  return (
    <div className="flex h-full justify-center bg-gray-100 px-2">
      <div className="flex flex-col overflow-hidden my-5 w-full bg-white p-5 rounded-xl shadow-lg text-gray-700">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <h1 className="font-bold text-xl italic block mb-0 leading-none pb-5">
            Leave
          </h1>
        </div>

        <div className="overflow-scroll">
          <LeavesList leaves={employee.leave} />
        </div>
        <div className="w-screen flex justify-center p-10 gap-5">
          <button
            onClick={() => navigate("/homepage/employeeInformation/")}
            className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={() =>
              navigate("/homepage/employeeInformation/leave/addLeave")
            }
            className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add Leave
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leave;
