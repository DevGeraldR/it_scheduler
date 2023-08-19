import React from "react";
import { useState, Fragment } from "react";
import { db } from "../firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";

function AddEmployee() {
  const [fullName, setFullName] = useState();
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  const [eid, setEID] = useState();
  const [schedule, setSchedule] = useState([]);
  const [shift, setShift] = useState("Morning");
  // State to keep track of the selected time
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("12:00");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState("");

  /***
   * Function to convert time to 12-hour format
    const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const timeObject = new Date(0, 0, 0, hours, minutes);
    return timeObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
   */

  // Event handler for when the user changes the time
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleShiftChange = (event) => {
    setShift(event.target.value);
  };
  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;

    // Case 1 : The user checks the box
    if (checked) {
      setSchedule((prevSchedule) => {
        // Sort the days in the order of Monday to Sunday
        const updatedSchedule = [...prevSchedule, value].sort((a, b) => {
          const order = { M: 1, T: 2, W: 3, TH: 4, F: 5, SAT: 6, SU: 7 };
          return order[a] - order[b];
        });
        return updatedSchedule;
      });
    }

    // Case 2: The user unchecks the box
    else {
      setSchedule((prevSchedule) => prevSchedule.filter((e) => e !== value));
    }
  };
  const handleClick = async () => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", eid);

    await setDoc(employeeRef, {
      fullName: fullName,
      eid: eid,
      position: position,
      schedule: schedule,
      shift: shift,
      startTime: startTime,
      endTime: endTime,
      leave: [],
      absent: [],
    });
    setIsLoading(false);
    setIsSuccessfulOpen(true);
  };

  return (
    <form
      className="flex flex-col min-h-full p-6 bg-gray-100 flex items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <div className="container max-w-screen-lg max-h-[900px] rounded-lg ">
        <div className="container max-w-screen-lg max-h-[900px] rounded-lg">
          <header className="bg-slate-900 p-3 rounded-t-lg">
            <div className="ml-5 text-gray-200 mx-auto max-w-screen-lg">
              <p className="font-bold text-white text-lg">Add Employee</p>
              <p>Please input all the employee's details</p>
            </div>
          </header>
          <div className="bg-white border border-slate-400 rounded-b-lg shadow-lg p-4 px-4 md:p-8 mb-6 ">
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label className="font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="font-bold">Employee ID</label>
                  <input
                    type="text"
                    required
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Employee ID"
                    value={eid}
                    onChange={(e) => {
                      setEID(e.target.value);
                    }}
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="font-bold"> Position</label>
                  <input
                    type="text"
                    required
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Position"
                    value={position}
                    onChange={(e) => {
                      setPosition(e.target.value);
                    }}
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="font-bold">Select Shift</label>{" "}
                  <select
                    id="shift"
                    value={shift}
                    type="combobox"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    onChange={handleShiftChange}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div className="md:col-span-5 mb-5 flex flex-col md:flex-row">
                  <div className="mb-2 md:mb-0">
                    <label className="font-bold">Start Time:</label>
                    <input
                      type="time"
                      id="startTime"
                      className="h-10 border mt-1 ml-2 rounded px-4 w-500 bg-gray-50"
                      value={startTime}
                      onChange={handleStartTimeChange}
                    />
                  </div>

                  <div className="md:ml-2">
                    <label className="font-bold">End Time:</label>
                    <input
                      type="time"
                      id="endTime"
                      className="h-10 border mt-1 ml-2 rounded px-4 w-500 bg-gray-50"
                      value={endTime}
                      onChange={handleEndTimeChange}
                    />
                  </div>
                </div>
                {/*To be optimized*/}
                <div className="md:col-span-5">
                  <label className="font-bold">Schedule</label>
                  <ul className="items-center w-full text-gray-500 bg-white sm:flex">
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="monday-checkbox-list"
                          type="checkbox"
                          className="w-4 h-4"
                          onChange={handleChange}
                          value="M"
                        />
                        <label
                          htmlFor="monday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Monday
                        </label>
                      </div>
                    </li>
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="tuesday-checkbox-list"
                          type="checkbox"
                          className="w-4 h-4"
                          onChange={handleChange}
                          value="T"
                        />
                        <label
                          htmlFor="tuesday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Tuesday
                        </label>
                      </div>
                    </li>
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="wednesday-checkbox-list"
                          type="checkbox"
                          onChange={handleChange}
                          value="W"
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="wednesday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Wednesday
                        </label>
                      </div>
                    </li>
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="thursday-checkbox-list"
                          type="checkbox"
                          onChange={handleChange}
                          value="TH"
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="thursday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Thursday
                        </label>
                      </div>
                    </li>
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="friday-checkbox-list"
                          type="checkbox"
                          onChange={handleChange}
                          value="F"
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="friday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Friday
                        </label>
                      </div>
                    </li>
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="saturday-checkbox-list"
                          type="checkbox"
                          onChange={handleChange}
                          value="SAT"
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="saturday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Saturday
                        </label>
                      </div>
                    </li>
                    <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="sunday-checkbox-list"
                          type="checkbox"
                          onChange={handleChange}
                          value="SU"
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="sunday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium "
                        >
                          Sunday
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex p-2  justify-center">
        {isLoading ? (
          <button
            disabled
            className=" mt-10 md:mt-0 bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-110 text-black hover:bg-yellow-500 focus-visible:ring-white inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <svg
              className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
            Loading...
          </button>
        ) : (
          <button
            type="submit"
            className="hover:text-white mt-10 md:mt-0 border border-slate-400 shadow-md border bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-bold  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add
          </button>
        )}
      </div>

      <Transition appear show={isSuccessfulOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setFullName("");
            setEID("");
            setShift("Morning");
            setSchedule([]);
            setStartTime("00:00");
            setEndTime("12:00");
            setIsSuccessfulOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform border border-slate-400 overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Success!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Employee added.</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="hover:text-white  bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110 border border-transparent bg-gray-100 px-4 py-2 text-sm font-bold  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setFullName("");
                        setEID("");
                        setIsSuccessfulOpen(false);
                      }}
                    >
                      Okay
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </form>
  );
}

export default AddEmployee;
