import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import dayjs from "dayjs";
import { AiOutlineCloseCircle } from "react-icons/ai";
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
        employee.profilePath !== "/images/defaultAvatar.jpg"
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

  // Function to convert time to 12-hour format
  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const timeObject = new Date(0, 0, 0, hours, minutes);
    return timeObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col min-h-full p-6 flex items-center justify-center">
      <div className="container max-w-screen-lg rounded-lg ">
        <div className="container max-w-screen-lg rounded-lg">
          <header className="bg-slate-900 p-3 rounded-t-lg">
            <div className="ml-5 text-gray-200 mx-auto max-w-screen-lg">
              <p className="font-bold text-white text-lg">Full Details</p>
              <p>{employee.fullName} full information</p>
            </div>
          </header>
          <div className="bg-white border border-slate-400 rounded-b-lg shadow-lg p-4 px-4 md:p-8 ">
            <div className="flex gap-5 items-center lg:divide-x sm:w-1/2">
              <div className="flex gap-10 items-center lg:flex-row flex-col">
                <div className="w-96 sm:px-5 max-w-[300px]">
                  <img
                    className="border border-slate-200 w-28 h-28 rounded-full mx-auto"
                    src={employee.profileUrl}
                    alt="Profile"
                  />
                  <h2 className="font-bold text-center text-2xl font-semibold mt-2">
                    {employee.fullName}
                  </h2>
                  <p className="font-bold text-center text-black mt-1">
                    {employee.position}
                  </p>
                  <div className="font-bold flex justify-center mt-2">
                    <button
                      onClick={() =>
                        navigate("/homepage/employeeInformation/leave")
                      }
                      className="text-slate-900 hover:text-blue-500 mx-3"
                      title="Leave"
                    >
                      <TbCalendarTime size={25} />
                    </button>
                    <button
                      onClick={() =>
                        navigate("/homepage/employeeInformation/absent")
                      }
                      className="text-slate-900 hover:text-yellow-500 mx-3"
                      title="Absent"
                    >
                      <TbCalendarX size={25} />
                    </button>
                    <button
                      onClick={() => handleClickRemove(employee.eid)}
                      className="text-slate-900 hover:text-red-600 mx-3"
                      title="Delete"
                    >
                      <RiDeleteBin7Line size={25} />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-black mt-2">EID: {employee.eid}</p>
                    <p className="text-black mt-2">
                      Total Leave: {employee.leave ? employee.leave.length : 0}
                    </p>
                    <p className="text-black mt-2">
                      Total Absent:{" "}
                      {employee.absent ? employee.absent.length : 0}
                    </p>
                    <p className="text-black mt-2">
                      Schedule:{" "}
                      {employee.schedule.map((d) => {
                        return <span key={d}> {d}</span>;
                      })}
                    </p>
                    <p className="text-black mt-2">Shift: {employee.shift}</p>
                    <p className="text-black mt-2">
                      Start Time: {formatTimeTo12Hour(employee.startTime)}
                    </p>
                    <p className="text-black mt-2">
                      End Time: {formatTimeTo12Hour(employee.endTime)}
                    </p>
                  </div>
                </div>
                <div className="md:w-[600px] h-fit border border-slate-400 p-2">
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
                  <div className="font-bold grid grid-cols-7 ">
                    {days.map((day, index) => {
                      return (
                        <h1
                          key={index}
                          className="text-sm text-center h-14 w-30 grid place-content-center text-black select-none"
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
                                  ?.leaveType === "PLANNED"
                                  ? "bg-blue-500 text-blue-900 font-bold"
                                  : employee.leave[getIndex(employee, date)]
                                    ?.leaveType === "UNPLANNED"
                                    ? "bg-red-500 text-red-900 font-bold"
                                    : employee.absent?.some(
                                      (absent) =>
                                        absent.startDate <=
                                        date.format("YYYY-MM-DD") &&
                                        absent.endDate >=
                                        date.format("YYYY-MM-DD")
                                    )
                                      ? "bg-orange-500 text-orange-900 font-bold"
                                      : employee.schedule.includes(days[date.day()])
                                        ? "bg-green-500 text-green-900 font-bold"
                                        : "text-black",

                                today ? "border border-black" : "",

                                "h-10 w-10 rounded-full grid place-content-center hover:bg-blue-100 transition-all select-none"
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
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25"
                    onClose={() => {
                      setShowConfirmDialog(false);
                    }}
                  >
                    <div className="fixed inset-0 flex items-center justify-center">
                      <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="bg-white text-slate-900 font-bold  border border-slate-400 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                          <AiOutlineCloseCircle
                            size={70}
                            className="text-red-500 mb-2 mt-2"
                          />
                          <p>Are you sure you want to remove this Employee?</p>
                          <div className="flex justify-end mt-10 space-x-1">
                            <button
                              className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={() => setShowConfirmDialog(false)}
                            >
                              Cancel
                            </button>
                            {isLoading ? (
                              <button
                                disabled
                                className=" mt-10 md:mt-0 bg-red-400 transition duration-300 ease-in-out transform hover:scale-100 text-black hover:bg-red-500 focus-visible:ring-white inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                                className="hover:text-white bg-red-400 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={() =>
                                  handleConfirmRemove(employee.eid)
                                }
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </Transition.Child>
                    </div>
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
