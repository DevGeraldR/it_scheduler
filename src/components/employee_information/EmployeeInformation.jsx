import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import dayjs from "dayjs";

/**Calendar */
import { generateDate, months } from "./calendar";
import cn from "./cn";

function EmployeeInformation() {
  const { employee } = useGlobal();
  const navigate = useNavigate();

  /**Calendar */
  const days = ["SU", "M", "T", "W", "TH", "F", "SAT"];

  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  // eslint-disable-next-line
  const handleClickRemove = async (eid) => {
    const confirm = window.confirm("Are you sure you want to remove employee?");
    if (confirm) {
      const employeeRef = doc(db, "Employees", eid);

      await deleteDoc(employeeRef);
      navigate("/homepage");
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
