import React, { useState, Fragment } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { db } from "../firebase/Firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useGlobal } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

function AddAbsent() {
  const { employee, setEmployee } = useGlobal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  

  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  const handleChangeAbsent = (newValue) => {
    setDate(newValue);
  };

  const handleClickSubmit = async () => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", employee.eid);
    await updateDoc(employeeRef, {
      absent: arrayUnion(date),
    });

    // Update the employee context
    const updatedAbsentList = [...employee.absent];
    updatedAbsentList.push(date);
    setEmployee({ ...employee, absent: updatedAbsentList });

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
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Absent added.</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={() => {
                        // Reformat data
                        setDate({
                          startDate: null,
                          endDate: null,
                        });
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
          onClick={() => navigate("/homepage/employeeInformation/absent")}
          className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-flex justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Back
        </button>
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
                ? "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500"
                : "bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500"
            } inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          >
            Add
          </button>
        )}
      </div>
    </form>
  );
}

export default AddAbsent;
