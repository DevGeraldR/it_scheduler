import React from "react";
import { useState } from "react";
import { db } from "../firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";

function AddEmployee() {
  const [fullName, setFullName] = useState();
  const [eid, setEID] = useState();
  const [schedule, setSchedule] = useState([]);
  const [shift, setShift] = useState('Morning');
  // State to keep track of the selected time
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('12:00');

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
      setSchedule([...schedule, value]);
    }

    // Case 2  : The user unchecks the box
    else {
      setSchedule(schedule.filter((e) => e !== value));
    }
  };

  const handleClick = async () => {
    const employeeRef = doc(db, "Employees", eid);

    await setDoc(employeeRef, {
      fullName: fullName,
      eid: eid,
      schedule: schedule,
      shift: shift,
      startTime: startTime,
      endTime: endTime,
    });

    alert("Employee Added");
    setFullName("");
    setEID("");
    setShift('Morning');
    setStartTime('00:00')
    setEndTime('12:00')
  };

  return (
    <form
      className="flex flex-col min-h-full p-6 bg-gray-100 flex items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <div className="container max-w-screen-lg max-h-[900px] overflow-scroll md:overflow-hidden">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 ">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-lg">Add Employee</p>
              <p>Please input all the employee's details.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
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
                  <label>Employee ID</label>
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
                  <label>Select Shift</label>
                  {' '}
                  <select
                    id="shift" value={shift}
                    type="combobox"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    onChange={handleShiftChange}>
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div className="md:col-span-5">
                  <label >Start Time:</label>
                  {' '}
                  <input
                    type="time"
                    id="startTime"
                    className="h-10 border mt-1 rounded px-4 w-500  bg-gray-50"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                  {' '}
                  <label >End Time:</label>
                  {' '}
                  <input
                    type="time"
                    id="endTime"
                    className="h-10 border mt-1 rounded px-4 w-500 bg-gray-50"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
                {/*To be optimized*/}
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
                        />
                        <label
                          for="monday-checkbox-list"
                          className="w-full py-3 ml-2 text-sm font-medium"
                        >
                          Monday
                        </label>
                      </div>
                    </li>
                    <li className="w-full border border-gray-200">
                      <div className="flex items-center pl-3">
                        <input
                          id="tuesday-checkbox-list"
                          type="checkbox"
                          className="w-4 h-4"
                          onChange={handleChange}
                          value="T"
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
                          value="S"
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-5 text-right">
        <button
          type="submit"
          className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Add
        </button>
      </div>
    </form>
  );

}

export default AddEmployee;
