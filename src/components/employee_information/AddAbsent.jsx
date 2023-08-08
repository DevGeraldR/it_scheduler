import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { db } from "../firebase/Firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useGlobal } from "../context/Context";
import { useNavigate } from "react-router-dom";

function AddAbsent() {
  const { employee } = useGlobal();
  const navigate = useNavigate();

  const [date, setDate] = useState({
    startDate: new Date(""),
    endDate: new Date(""),
  });

  const handleChangeAbsent = (newValue) => {
    setDate(newValue);
  };

  const handleClickSubmit = async () => {
    const employeeRef = doc(db, "Employees", employee.eid);
    await updateDoc(employeeRef, {
      absent: arrayUnion(date),
    });

    alert("Absent added");
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
              <p className="font-medium text-lg">Add Absent</p>
              <p>Please input all the details needed.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label>Absent Date</label>
                  <Datepicker
                    className="bg-black"
                    value={date}
                    onChange={handleChangeAbsent}
                  />
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

export default AddAbsent;
