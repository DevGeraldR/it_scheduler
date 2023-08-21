import React, { useState } from "react";
import { useGlobal } from "../context/Context";
import { db } from "../firebase/Firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { Transition, Dialog } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
function ListAbsent({ absent, index }) {
  const { employee, setEmployee } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClickRemove = () => {
    setShowConfirmDialog(true);
  };
  const handleConfirmRemove = async () => {
    setIsLoading(true);
    const date = {
      startDate: absent.startDate,
      endDate: absent.endDate,
    };

    const employeeRef = doc(db, "employees", employee.eid);

    await updateDoc(employeeRef, {
      absent: arrayRemove(date),
    });

    const updatedAbsentist = employee.absent.filter(
      (item) => JSON.stringify(item) !== JSON.stringify(date)
    );

    setEmployee({ ...employee, absent: updatedAbsentist });
    setIsLoading(false);
    setShowConfirmDialog(false);
  };

  return (
    <tr key={index} className="bg-white hover:bg-yellow-50">
      <td className="text-center px-2 py-2 border border-slate-400">
        {index + 1}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {absent.startDate}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {absent.endDate}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
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
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25"
            onClose={() => {
              setShowConfirmDialog(false);
            }}
          >
            <div className="fixed inset-0 flex items-center justify-center">
              <Transition.Child
                as={React.Fragment}
                enter="transition-opacity ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="bg-white text-slate-900 font-bold  border border-slate-400 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                  <AiOutlineCloseCircle
                    size={70}
                    className="text-red-500 mb-2 mt-2"
                  />
                  <p>Are you sure you want to remove this Absent?</p>
                  <div className="flex justify-end mt-10 space-x-1">
                    <button
                      className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-110 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                        className="hover:text-white bg-red-400 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-110 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleConfirmRemove}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </td>
    </tr>
  );
}

export default ListAbsent;
