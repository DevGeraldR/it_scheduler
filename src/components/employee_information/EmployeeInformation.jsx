import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import dayjs from "dayjs";
import { Dialog, Transition } from "@headlessui/react";
import { TbCalendarTime } from "react-icons/tb";
import { TbCalendarX } from "react-icons/tb";
import { RiDeleteBin7Line } from "react-icons/ri";
/**Calendar */
import { generateDate, months } from "./calendar";
import cn from "./cn";
import { deleteObject, ref } from "firebase/storage";

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
    const profileRef = ref(storage, employee.profilePath);

    try {
      await deleteDoc(employeeRef);
      // Call the parent's handler to remove the employee from the list

      // Delete the picture
      if (
        employee.profileUrl &&
        employee.profilePath !== "/images/defaultAvatar.png"
      ) {
        // Delete the file
        deleteObject(profileRef);
      }
      setIsLoading(false);
      setShowConfirmDialog(false);
      navigate("/homepage");
      // Close the confirmation dialog
    } catch (error) {
      console.log("Error removing employee:", error);
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
    <div className="flex flex-col min-h-full p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg max-h-[900px] rounded-lg ">
        <div className="container max-w-screen-lg max-h-[900px] rounded-lg">
          <header className="bg-slate-900 p-3 rounded-t-lg">
            <div className="ml-5 text-gray-200 mx-auto max-w-screen-lg">
              <p className="font-bold text-white text-lg">Full Details</p>
              <p>{employee.fullName} full information</p>
            </div>
          </header>
          <div className="bg-white border border-slate-400 rounded-b-lg shadow-lg p-4 px-4 md:p-8 ">
            <div className="flex gap-5 items-center lg:divide-x sm:w-1/2">
              <div className="flex gap-10 items-center lg:flex-row flex-col">
                <div className="border border-slate-200 h-fit w-96 sm:px-5 max-w-[300px] bg-white rounded-lg shadow-lg p-2">
                  <img
                    className="border border-slate-200 w-32 h-32 rounded-full mx-auto"
                    src={employee.profileUrl}
                    alt="Profile"
                  />
                  <h2 className="font-bold text-center text-2xl font-semibold mt-2">
                    {employee.fullName}
                  </h2>
                  <p className="font-bold text-center text-gray-600 mt-1">
                    {employee.position}
                  </p>
                  <div className="font-bold flex justify-center mt-2">
                    <button
                      onClick={() =>
                        navigate("/homepage/employeeInformation/leave")
                      }
                      className="text-slate-900 hover:text-cyan-600 mx-3"
                      title="Leave"
                    >
                      <TbCalendarTime size={25} />
                    </button>
                    <button
                      onClick={() =>
                        navigate("/homepage/employeeInformation/absent")
                      }
                      className="text-slate-900 hover:text-cyan-600 mx-3"
                      title="Absent"
                    >
                      <TbCalendarX size={25} />
                    </button>
                    <button
                      onClick={() => handleClickRemove(employee.eid)}
                      className="text-slate-900 hover:text-red-500 mx-3"
                      title="Delete"
                    >
                      <RiDeleteBin7Line size={25} />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600 mt-2">EID: {employee.eid}</p>
                    <p className="text-gray-600 mt-2">
                      Total Leave: {employee.leave ? employee.leave.length : 0}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Total Absent:{" "}
                      {employee.absent ? employee.absent.length : 0}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Schedule:{" "}
                      {employee.schedule.map((d) => {
                        return <span key={d}> {d}</span>;
                      })}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Shift: {employee.shift}
                    </p>
                  </div>
                </div>
                <div className="md:w-[600px] h-fit border border-slate-400  shadow-lg p-2">
                  <div className=" flex justify-between items-center">
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
                          className="text-sm text-center h-14 w-30 grid place-content-center text-gray-500 select-none"
                        >
                          {day}
                        </h1>
                      );
                    })}
                  </div>

                  <div className=" grid grid-cols-7">
                    {generateDate(today.month(), today.year()).map(
                      ({ date, today }, index) => {
                        return (
                          <div
                            key={index}
                            className="p-2 text-center h-14 grid place-content-center text-sm"
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


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeInformation;