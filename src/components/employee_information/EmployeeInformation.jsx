import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import dayjs from "dayjs";
import { Dialog, Transition } from "@headlessui/react";

/**Calendar */
import { generateDate, months } from "./calendar";
import cn from "./cn";

function EmployeeInformation() {
  const { employee } = useGlobal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  /**Calendar */
  const days = ["SU", "M", "T", "W", "TH", "F", "SAT"];

  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  // eslint-disable-next-line
  const handleClickRemove = (eid) => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = async (eid) => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", eid);

    try {
      await deleteDoc(employeeRef);
      // Call the parent's handler to remove the employee from the list

      setIsLoading(false);
      setShowConfirmDialog(false);
      navigate("/homepage");
      // Close the confirmation dialog
    } catch (error) {
      console.error("Error removing employee:", error);
    }
  };

  const getIndex = (employee, date) => {
    const index = employee.leave?.findIndex(
      (leave) =>
        leave.startDate <= date.format("YYYY-MM-DD") &&
        leave.endDate >= date.format("YYYY-MM-DD")
    );

    return index;
  };

  return (
    <div className="overflow-scroll max-h-screen w-full pb-[60px] bg-gray-100 h-full">
      <div className="flex justify-center">
        <div className="m-5 w-full max-w-2xl bg-white p-5 rounded-xl shadow-lg">
          <div className="flex pb-5 gap-5 items-center lg:divide-x sm:w-1/2 justify-center flex-col mx-auto">
            <h1 className="text-2xl">Employee Details</h1>
            <div className="flex gap-10 items-center lg:flex-row flex-col">
              <div className="sm:w-96 sm:h-96 max-w-[300px]">
                <div className="flex justify-between items-center">
                  <h1 className="select-none font-semibold">
                    {months[today.month()]}, {today.year()}
                  </h1>
                  <div className="flex gap-10 items-center ">
                    <GrFormPrevious
                      className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                      onClick={() => {
                        setToday(today.month(today.month() - 1));
                      }}
                    />
                    <h1
                      className=" cursor-pointer hover:scale-105 transition-all"
                      onClick={() => {
                        setToday(currentDate);
                      }}
                    >
                      Today
                    </h1>
                    <GrFormNext
                      className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                      onClick={() => {
                        setToday(today.month(today.month() + 1));
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-7 ">
                  {days.map((day, index) => {
                    return (
                      <h1
                        key={index}
                        className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                      >
                        {day}
                      </h1>
                    );
                  })}
                </div>

                <div className=" grid grid-cols-7 ">
                  {generateDate(today.month(), today.year()).map(
                    ({ date, today }, index) => {
                      return (
                        <div
                          key={index}
                          className="p-2 text-center h-14 grid place-content-center text-sm border-t"
                        >
                          {/*Green color dates available manage here */}
                          <h1
                            className={cn(
                              employee.leave[getIndex(employee, date)]
                                ?.leaveType === "pl"
                                ? "bg-orange-100 text-orange-900 font-bold"
                                : employee.leave[getIndex(employee, date)]
                                    ?.leaveType === "ul"
                                ? "bg-red-100 text-red-900 font-bold"
                                : employee.absent?.some(
                                    (absent) =>
                                      absent.startDate <=
                                        date.format("YYYY-MM-DD") &&
                                      absent.endDate >=
                                        date.format("YYYY-MM-DD")
                                  )
                                ? "bg-violet-100 text-violet-900 font-bold"
                                : employee.schedule.includes(days[date.day()])
                                ? "bg-green-100 text-green-900 font-bold"
                                : "text-gray-400",

                              today ? "border border-black" : "",

                              "h-10 w-10 rounded-full grid place-content-center hover:bg-gray-200 transition-all select-none"
                            )}
                          >
                            {date.date()}
                          </h1>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <Transition appear show={showConfirmDialog} as={Fragment}>
  <Dialog
    as="div"
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    onClose={() => {
      setShowConfirmDialog(false);
    }}
  >
    <Transition.Child
      as={Fragment}
      enter="transition-opacity ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="bg-white p-4 rounded shadow">
        <p>Are you sure you want to remove this employee?</p>
        <div className="flex justify-end mt-4 space-x-1">
          <button
            className="bg-blue-100 text-blue-900 hover:bg-blue-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setShowConfirmDialog(false)}
          >
            Cancel
          </button>
          {isLoading ? (
            <button
              disabled
              className="bg-red-100 text-red-900 hover:bg-red-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-blue-900 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Removing...
            </button>
          ) : (
            <button
              className="bg-red-100 text-red-900 hover:bg-red-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => handleConfirmRemove(employee.eid)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </Transition.Child>
  </Dialog>
</Transition>

              <div className="h-96 w-96 sm:px-5 max-w-[280px]">
                <div className="pb-10">
                  <ul>
                    <li>Name: {employee.fullName}</li>
                    <li>EID: {employee.eid}</li>
                    <li>Shift: {employee.shift}</li>
                    <li>StartTime: {employee.startTime}</li>
                    <li>EndTime: {employee.endTime}</li>
                  </ul>
                </div>
                <div>
                  <div className="flex flex-row gap-1 my-3 w-full">
                    <button
                      onClick={() => navigate("/homepage")}
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Back
                    </button>
                    <button
                      onClick={() =>
                        navigate("/homepage/employeeInformation/leave")
                      }
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Leave
                    </button>
                    <button
                      onClick={() =>
                        navigate("/homepage/employeeInformation/absent")
                      }
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleClickRemove(employee.eid)}
		          
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeInformation;
