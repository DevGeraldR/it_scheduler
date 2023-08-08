import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { db } from "../firebase/Firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useGlobal } from "../context/Context";
import { useNavigate } from "react-router-dom";

function AddLeave() {
  const { employee } = useGlobal();
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState({ leaveType: "" });

  const [date, setDate] = useState({
    startDate: new Date(""),
    endDate: new Date(""),
  });

  const handleChangeLeave = (newValue) => {
    setDate(newValue);
  };

  const handleClickSubmit = async () => {
    const employeeRef = doc(db, "Employees", employee.eid);
    await updateDoc(employeeRef, {
      leave: arrayUnion({ ...date, leaveType: leaveType }),
    });

    alert("Leave added");
    navigate("/homepage"); // Change to /homepage/employeeInformation
  };

  return (
    <form
      className="flex flex-col min-h-full p-6 bg-gray-100 flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleClickSubmit();
      }}
    >
      <div className="container max-w-screen-lg">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-lg">Add Leave</p>
              <p>Please input all the details needed.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label>Leave Date</label>
                  <Datepicker
                    className="bg-black"
                    value={date}
                    onChange={handleChangeLeave}
                  />
                </div>
                <div className="md:col-span-5 gap-3 flex flex-col">
                  <label>Leave Type</label>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="ul"
                      name="leaveType"
                      value="ul"
                      required
                      onChange={(e) => {
                        setLeaveType(e.target.value);
                      }}
                      checked={leaveType === "ul"}
                    />
                    <label htmlFor="ul">UL</label>

                    <input
                      type="radio"
                      id="pl"
                      name="leaveType"
                      value="pl"
                      onChange={(e) => {
                        setLeaveType(e.target.value);
                      }}
                      checked={leaveType === "pl"}
                    />
                    <label htmlFor="pl">PL</label>
                  </div>
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

export default AddLeave;
