import React, { useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { db } from "../firebase/Firebase";
import { doc, updateDoc } from "firebase/firestore";

import { Dialog, Transition } from "@headlessui/react";

function EditEmployee() {
  const { employeeId } = useParams();
  const { employee, setEmployee } = useGlobal();
  const navigate = useNavigate();
  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const timeObject = new Date(0, 0, 0, hours, minutes);
    return timeObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(employee.fullName);
  const [schedule, setSchedule] = useState(employee.schedule);
  const [shift, setShift] = useState(employee.shift);
  const [startTime, setStartTime] = useState(employee.startTime);
  const [endTime, setEndTime] = useState(employee.endTime);

  const handleShiftChange = (e) => {
    setShift(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add the day to the schedule array
      setSchedule((prevSchedule) => {
        // Sort the days in the desired order (Monday to Sunday)
        const newSchedule = [...prevSchedule, value].sort((a, b) => {
          const days = ['M', 'T', 'W', 'TH', 'F', 'SAT', 'SU'];
          return days.indexOf(a) - days.indexOf(b);
        });
        return newSchedule;
      });
    } else {
      // Remove the day from the schedule array
      setSchedule((prevSchedule) => prevSchedule.filter((day) => day !== value));
    }
  };
  // Function to convert time to 12-hour format

  const handleEdit = async () => {
    setIsLoading(true);
    const employeeRef = doc(db, "Employees", employeeId);

    // Prepare the data to be updated
    const updatedData = {
      fullName: fullName,
      schedule: schedule,
      shift: shift,
    };

    // Only update the start time if it is edited
    if (startTime !== employee.startTime) {
      updatedData.startTime = formatTimeTo12Hour(startTime);
    } else {
      updatedData.startTime = employee.startTime;
    }

    // Only update the end time if it is edited
    if (endTime !== employee.endTime) {
      updatedData.endTime = formatTimeTo12Hour(endTime);
    } else {
      updatedData.endTime = employee.endTime;
    }

    await updateDoc(employeeRef, updatedData);

    setEmployee({
      ...employee,
      ...updatedData,
    });

    setIsLoading(false);
    setIsSuccessfulOpen(true);
  };

  return (
    <div>
      <form
        className="flex flex-col min-h-full p-6 bg-gray-100 flex items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleEdit();
        }}
      >
        <div className="container max-w-screen-lg max-h-[900px] overflow-scroll md:overflow-hidden">
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 ">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Edit Employee</p>
                <p>Edit the employee's details.</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5"></div>
                <div className="md:col-span-5">
                  <label>Full Name</label>
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
                  <label>Select Shift</label>{" "}
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
                <div className="md:col-span-5">
                  <label>Start Time:</label>{" "}
                  <input
                    type="time"
                    id="startTime"
                    className="h-10 border mt-1 rounded px-4 w-500 bg-gray-50"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />{" "}
                  <label>End Time:</label>{" "}
                  <input
                    type="time"
                    id="endTime"
                    className="h-10 border mt-1 rounded px-4 w-500 bg-gray-50"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
                <div className="md:col-span-5">
                  <label>Schedule</label>
                  <ul className="items-center w-full text-gray-500 bg-white sm:flex">
                    <li className="w-full border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="monday-checkbox-list"
                          type="checkbox"
                          className="w-4 h-4"
                          onChange={handleChange}
                          value="M"
                          checked={schedule.includes("M")}
                        />
                        <label
                          htmlFor="monday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Monday
                        </label>
                      </div>
                      <li className="w-full border border-gray-200">
                        <div className="flex items-center pl-3">
                          <input
                            id="tuesday-checkbox-list"
                            type="checkbox"
                            className="w-4 h-4"
                            onChange={handleChange}
                            value="T"
                            checked={schedule.includes("T")}
                          />
                          <label
                            for="tuesday-checkbox-list"
                            className="w-full py-3 ml-2 text-sm font-medium"
                          >
                            Tuesday
                          </label>
                        </div>
                      </li>
                      <li className="w-full border border-gray-200">
                        <div className="flex items-center pl-3">
                          <input
                            id="wednesday-checkbox-list"
                            type="checkbox"
                            onChange={handleChange}
                            value="W"
                            checked={schedule.includes("W")}
                            className="w-4 h-4"
                          />
                          <label
                            for="wednesday-checkbox-list"
                            className="w-full py-3 ml-2 text-sm font-medium"
                          >
                            Wednesday
                          </label>
                        </div>
                      </li>
                      <li className="w-full border border-gray-200">
                        <div className="flex items-center pl-3">
                          <input
                            id="thursday-checkbox-list"
                            type="checkbox"
                            onChange={handleChange}
                            value="TH"
                            checked={schedule.includes("TH")}
                            className="w-4 h-4"
                          />
                          <label
                            for="thursday-checkbox-list"
                            className="w-full py-3 ml-2 text-sm font-medium"
                          >
                            Thursday
                          </label>
                        </div>
                      </li>
                      <li className="w-full border border-gray-200">
                        <div className="flex items-center pl-3">
                          <input
                            id="friday-checkbox-list"
                            type="checkbox"
                            onChange={handleChange}
                            value="F"
                            checked={schedule.includes("F")}
                            className="w-4 h-4"
                          />
                          <label
                            for="friday-checkbox-list"
                            className="w-full py-3 ml-2 text-sm font-medium"
                          >
                            Friday
                          </label>
                        </div>
                      </li>
                      <li className="w-full border border-gray-200">
                        <div className="flex items-center pl-3">
                          <input
                            id="saturday-checkbox-list"
                            type="checkbox"
                            onChange={handleChange}
                            value="SAT"
                            checked={schedule.includes("SAT")}
                            className="w-4 h-4"
                          />
                          <label
                            for="saturday-checkbox-list"
                            className="w-full py-3 ml-2 text-sm font-medium"
                          >
                            Saturday
                          </label>
                        </div>
                      </li>
                      <li className="w-full border border-gray-200">
                        <div className="flex items-center pl-3">
                          <input
                            id="sunday-checkbox-list"
                            type="checkbox"
                            onChange={handleChange}
                            value="SU"
                            checked={schedule.includes("SU")}
                            className="w-4 h-4"
                          />
                          <label
                            for="sunday-checkbox-list"
                            className="w-full py-3 ml-2 text-sm font-medium "
                          >
                            Sunday
                          </label>
                        </div>
                      </li>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">

          <button
            onClick={() => navigate("/homepage")}
            className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Back
          </button>
          <div className="flex flex-row gap-2">
            {isLoading ? (
              <button
                disabled
                className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Success!
                      </Dialog.Title>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          onClick={() => {
                            navigate("/homepage");
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

        </div>
      </form>
    </div>
  );
}

export default EditEmployee;
