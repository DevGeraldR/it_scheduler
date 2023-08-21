import React, { useState, Fragment } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { db } from "../firebase/Firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useGlobal } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineCheckCircle } from "react-icons/ai";
function AddLeave() {
  const { employee, setEmployee } = useGlobal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  const [leaveType, setLeaveType] = useState({ leaveType: "" });

  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  const handleChangeLeave = (newValue) => {
    setDate(newValue);
  };

  const handleClickSubmit = async () => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", employee.eid);
    await updateDoc(employeeRef, {
      leave: arrayUnion({ ...date, leaveType: leaveType }),
    });

    // Update the employee context
    const updatedLeaveList = [...employee.leave];
    updatedLeaveList.push({ ...date, leaveType: leaveType });
    setEmployee({ ...employee, leave: updatedLeaveList });

    setIsLoading(false);
    setIsSuccessfulOpen(true);
  };

  return (
    <form
      className="flex flex-col min-h-full p-6 bg-gray-100 flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleClickSubmit();
      }}
    >
      <div className="container max-w-screen-sm rounded-lg ">
        <div className="container max-w-screen-lg rounded-lg">
          <header className="bg-slate-900 p-3 rounded-t-lg">
            <div className="ml-5 text-gray-200 mx-auto max-w-screen-lg">
              <p className="font-bold text-white text-lg">Add Leave</p>
              <p>Please input all the details needed</p>
            </div>
          </header>
          <div className="bg-white border border-slate-400 rounded-b-lg shadow-lg p-4 px-4 md:p-8 mb-6 ">
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-4  text-sm grid-cols-1 md:grid-cols-5"></div>
              <div className="md:col-span-5 ">
                <label className="font-bold">Leave Date</label>
                <Datepicker
                  className="bg-black"
                  value={date}
                  onChange={handleChangeLeave}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div className="md:col-span-5 gap-3 flex flex-col">
                <label className="font-bold">Leave Type</label>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="ul"
                    name="leaveType"
                    value="UNPLANNED"
                    required
                    onChange={(e) => {
                      setLeaveType(e.target.value);
                    }}
                    checked={leaveType === "UNPLANNED"}
                  />
                  <label htmlFor="ul">UL</label>

                  <input
                    type="radio"
                    id="PL"
                    name="leaveType"
                    value="PLANNED"
                    onChange={(e) => {
                      setLeaveType(e.target.value);
                    }}
                    checked={leaveType === "PLANNED"}
                  />
                  <label htmlFor="PL">PL</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-5 text-right">
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
              enter="transition-opacity ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="transition-transform ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition-transform ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className="w-full border border-slate-400 max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all flex flex-col items-center justify-center"
                    static
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-gray-900 mb-2"
                    >
                      <AiOutlineCheckCircle
                        size={70}
                        className="text-green-500"
                      />
                      Success!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">
                        Leave has been added
                      </p>
                    </div>

                    <div className="mt-10">
                      <button
                        type="button"
                        className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-110 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setDate({
                            startDate: null,
                            endDate: null,
                          });
                          setLeaveType({ leaveType: "" });
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
        <div className="flex p-2 w-full justify-center gap-2">
          <button
            onClick={() => navigate("/homepage/employeeInformation/leave")}
            className="hover:text-white mt-10 md:mt-0  bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Back
          </button>
          {isLoading ? (
            <button
              disabled
              className=" mt-10 md:mt-0 bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-110 text-black hover:bg-yellow-500 focus-visible:ring-white inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
              Please wait...
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                date.startDate === null && date.endDate === null ? true : false
              }
              className={`${
                date.startDate === null && date.endDate === null
                  ? " bg-gray-200 w-[120px] mt-10 md:mt-0 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500"
                  : "hover:text-white mt-10 md:mt-0   bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              } inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default AddLeave;
