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
  const [selectedDate, setSelectedDate] = useState(currentDate);
  // eslint-disable-next-line
  const handleClickRemove = async (eid) => {
    const confirm = window.confirm("Are you sure you want to remove employee?");
    if (confirm) {
      const employeeRef = doc(db, "Employees", eid);

      await deleteDoc(employeeRef);
      navigate("/homepage");
    }
  };

  return (
    <div className="overflow-scroll max-h-screen w-full pb-[60px] bg-gray-100 h-full">
      <div className="flex justify-center">
        <div className="m-5 w-full max-w-2xl bg-white p-5 rounded-xl shadow-lg">
          <div className="flex pb-5 gap-5 items-center lg:divide-x sm:w-1/2 justify-center flex-col mx-auto">
            <h1 className="text-2xl">Employee Details</h1>
            <div className="flex gap-10 items-center lg:flex-row flex-col">
              <div className="sm:w-96 sm:h-96 max-w-[270px]">
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
                              employee.schedule.includes(days[date.day()])
                                ? "text-green-500 font-bold"
                                : "text-gray-400",

                              today ? "bg-blue-600 text-white" : "",

                              employee.leave?.some(
                                (leave) =>
                                  leave.startDate <=
                                  date.format("YYYY-MM-DD") &&
                                  leave.endDate >= date.format("YYYY-MM-DD")
                              )
                                ? "text-red-500 font-bold"
                                : "text-gray-400",

                              selectedDate.toDate().toDateString() ===
                                date.toDate().toDateString()
                                ? "bg-black text-white"
                                : "",
                              "h-10 w-10 rounded-full grid place-content-center hover:bg-black transition-all cursor-pointer select-none"
                            )}
                            onClick={() => {
                              setSelectedDate(date);
                            }}
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
                  <h1 className="">
                    Status of {selectedDate.toDate().toDateString()}
                  </h1>
                  {employee.schedule.includes(days[selectedDate.day()]) ? (
                    <span>Work Day</span>
                  ) : employee.leave?.some(
                    (leave) =>
                      leave.startDate <= selectedDate.format("YYYY-MM-DD") &&
                      leave.endDate >= selectedDate.format("YYYY-MM-DD")
                  ) ? (
                    <div className="flex flex-col gap-2">
                      <ul>
                        <li>Leave Day</li>
                      </ul>
                    </div>
                  ) : (
                    <span>Rest Day</span>
                  )}

                  <div className="flex flex-row gap-2 my-3">
                    <button
                      onClick={() => navigate("/homepage")}
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => navigate("/homepage/addLeave")}
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Add Leave
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
