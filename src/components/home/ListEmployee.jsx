import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { PiFileTextFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
function ListEmployee({ employee, index, onRemoveEmployee }) {
  const { setEmployee } = useGlobal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClickRemove = (eid) => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = async (eid) => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", eid);

    try {
      await deleteDoc(employeeRef);
      // Call the parent's handler to remove the employee from the list

      setIsLoading(false);
      setShowConfirmDialog(false);
      onRemoveEmployee(eid);
      // Close the confirmation dialog
    } catch (error) {
      console.error("Error removing employee:", error);
    }
  };

  const handleClickEdit = () => {
    // Set the selected employee to the global state for editing
    setEmployee(employee);

    // Redirect to the EditEmployee page with the employee ID as a route parameter
    navigate(`/homepage/EditEmployee/${employee.eid}`);
  };

  return (
    <tr
      key={index}
      className="bg-white border border-slate-400 hover:bg-yellow-50"
    >
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className="text-center px-2 py-2">{employee.fullName}</td>
      <td className="text-center px-2 py-2">{employee.eid}</td>
      <td className="text-center px-2 py-2">
        {employee.leave ? employee.leave.length : 0}
      </td>
      <td className="text-center px-2 py-2">
        {employee.absent ? employee.absent.length : 0}
      </td>
      <td className="text-center px-2 py-2">
        {employee.schedule.map((d) => {
          return <span key={d}> {d}</span>;
        })}
      </td>
      <td className="text-center px-2 py-2">{employee.shift}</td>
      <td className="text-center flex px-2 py-2">
        <button
          className="m-auto font-bold text-blue hover:text-blue-600 transition duration-300 ease-in-out transform  hover:scale-110"
          onClick={() => {
            setEmployee(employee);
            navigate("/homepage/employeeInformation");
          }}
          title="Full Details"
        >
          <PiFileTextFill size={25} />
        </button>
        <button
          className="m-auto font-bold text-green hover:text-green-600 transition duration-300 ease-in-out transform  hover:scale-110"
          onClick={handleClickEdit}
          title="Edit"
        >
          <FaUserEdit size={25} />
        </button>
        <button
          className="m-auto font-bold text-red hover:text-red-600 transition duration-300 ease-in-out transform  hover:scale-110"
          onClick={() => handleClickRemove(employee.eid)}
          title="Delete"
        >
          <MdDelete size={25} />
        </button>
      </td>
      <Transition appear show={showConfirmDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClose={() => {
            setShowConfirmDialog(false);
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
            <div className="bg-white p-4 rounded shadow">
              <p>Are you sure you want to remove this employee?</p>
              <div className="flex justify-end mt-4 space-x-1">
                <button
                  className="bg-blue-100 text-blue-900 hover:bg-blue-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                    className="bg-red-100 text-red-900 hover:bg-red-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    onClick={() => handleConfirmRemove(employee.eid)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </tr>
  );
}

export default ListEmployee;
