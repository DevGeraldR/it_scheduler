import React, { useState } from "react";
import { useGlobal } from "../context/Context";
import { db } from "../firebase/Firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { Transition, Dialog } from "@headlessui/react";
import { MdDelete } from "react-icons/md";

function ListLeave({ leave, index }) {
  const { employee, setEmployee } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClickRemove = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = async () => {
    setIsLoading(true);
    const date = {
      startDate: leave.startDate,
      endDate: leave.endDate,
      leaveType: leave.leaveType,
    };

    const employeeRef = doc(db, "employees", employee.eid);

    await updateDoc(employeeRef, {
      leave: arrayRemove(date),
    });

    const updatedLeaveList = employee.leave.filter(
      (item) => JSON.stringify(item) !== JSON.stringify(date)
    );

    setEmployee({ ...employee, leave: updatedLeaveList });
    setIsLoading(false);
    setShowConfirmDialog(false);
  };

  return (
    <tr key={index} className="bg-white border-b border-b-black ">
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className=" px-2 py-2">{leave.startDate}</td>
      <td className=" px-2 py-2">{leave.endDate}</td>
      <td className=" px-2 py-2">{leave.leaveType}</td>
      <td className="text-center  px-2 py-2">
        <div className="flex p-2  justify-center">
          <button
            className="pl-2 font-bold text-red hover:text-red-600 transition duration-300 ease-in-out transform  hover:scale-110"
            onClick={() => handleClickRemove()}
            title="Delete"
          >
            <MdDelete size={25} />
          </button>
          <Transition appear show={showConfirmDialog} as={React.Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
              onClose={() => {
                setShowConfirmDialog(false);
              }}
            >
              <Transition.Child
                as={React.Fragment}
                enter="transition-opacity ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="bg-white p-4 rounded shadow">
                  <p>Are you sure you want to remove this Leave?</p>
                  <div className="flex justify-end mt-4 space-x-1">
                    <button
                      className="hover:text-white mt-10 md:mt-0  bg-blue-300 w-[80px] rounded-md transition duration-300 ease-in-out transform hover:scale-100  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setShowConfirmDialog(false)}
                    >
                      Cancel
                    </button>
                    {isLoading ? (
                      <button
                        disabled
                        className="bg-red-100 text-red-900 hover:bg-red-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                        className="hover:text-white mt-10 md:mt-0  bg-red-300 w-[50px]l-[110px] rounded-md transition duration-300 ease-in-out transform hover:scale-100  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleConfirmRemove}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>
        </div>
      </td>
    </tr>
  );
}

export default ListLeave;
