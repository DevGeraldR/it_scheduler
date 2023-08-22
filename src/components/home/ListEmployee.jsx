import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import { PiFileTextFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { deleteObject, ref } from "firebase/storage";
import { AiOutlineCloseCircle } from "react-icons/ai";
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
    const profileRef = ref(storage, employee.profilePath);

    try {
      await deleteDoc(employeeRef);
      // Call the parent's handler to remove the employee from the list

      // Delete the picture
      if (
        employee.profileUrl &&
        employee.profilePath !== "/images/defaultAvatar.jpg"
      ) {
        // Delete the file
        deleteObject(profileRef);
      }
      setIsLoading(false);
      setShowConfirmDialog(false);
      navigate("/homepage");
      // Close the confirmation dialog
    } catch (error) {
      console.log("Error removing employee:", error);
    }
  };

  const handleClickEdit = () => {
    // Set the selected employee to the global state for editing
    setEmployee(employee);

    // Redirect to the EditEmployee page with the employee ID as a route parameter
    navigate(`/homepage/EditEmployee/${employee.eid}`);
  };

  return (
    <tr key={index} className="bg-white hover:bg-yellow-50">
      <td className="text-center px-2 py-2 border border-slate-400">
        {index + 1}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.fullName}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.eid}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.position}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.leave ? employee.leave.length : 0}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.absent ? employee.absent.length : 0}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.schedule.map((d) => {
          return <span key={d}> {d}</span>;
        })}
      </td>
      <td className="text-center px-2 py-2 border border-slate-400">
        {employee.shift}
      </td>
      <td className="text-center py-2 border border-slate-400">
        <button
          className="pr-2 mfont-bold text-blue hover:text-blue-500 transition duration-300 ease-in-out transform  hover:scale-110"
          onClick={() => {
            setEmployee(employee);
            navigate("/homepage/employeeInformation");
          }}
          title="Full Details"
        >
          <PiFileTextFill size={25} />
        </button>
        <button
          className="px-1 font-bold text-green hover:text-yellow-500 transition duration-300 ease-in-out transform  hover:scale-110"
          onClick={handleClickEdit}
          title="Edit"
        >
          <FaUserEdit size={25} />
        </button>
        <button
          className="pl-2 font-bold text-red hover:text-red-600 transition duration-300 ease-in-out transform  hover:scale-110"
          onClick={() => handleClickRemove(employee.eid)}
          title="Delete"
        >
          <MdDelete size={25} />
        </button>
      </td>
      <Transition appear show={showConfirmDialog} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25"
            onClose={() => {
              setShowConfirmDialog(false);
            }}
          >
            <div className="fixed inset-0 flex items-center justify-center">
              <Transition.Child
                as={Fragment}
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
                  <p>Are you sure you want to remove this Employee?</p>
                  <div className="flex justify-end mt-10 space-x-1">
                    <button
                      className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setShowConfirmDialog(false)}
                    >
                      Cancel
                    </button>
                    {isLoading ? (
                      <button
                        disabled
                        className=" mt-10 md:mt-0 bg-red-400 transition duration-300 ease-in-out transform hover:scale-100 text-black hover:bg-red-500 focus-visible:ring-white inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                        className="hover:text-white bg-red-400 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => handleConfirmRemove(employee.eid)}     
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
    </tr>
  );
}

export default ListEmployee;
