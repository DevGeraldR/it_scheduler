import React, {useState} from "react";
import { useGlobal } from "../context/Context";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function ListAbsent({ absent, index }) {
  const { employee, setEmployee } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  const handleClickRemove = async () => {
    setIsLoading(true);
    const date = {
      startDate: absent.startDate,
      endDate: absent.endDate,
    };

    const employeeRef = doc(db, "employees", employee.eid);

    await updateDoc(employeeRef, {
      absent: arrayRemove(date),
    });

    // Update the employee context
    const updatedAbsentList = [...employee.absent];
    updatedAbsentList.splice(updatedAbsentList.indexOf(date));
    setEmployee({ ...employee, absent: updatedAbsentList });
    setIsLoading(false);
  };

  return (
    <tr key={index} className="bg-white border-b border-b-black ">
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className=" px-2 py-2">{absent.startDate}</td>
      <td className=" px-2 py-2">{absent.endDate}</td>
      <td className="text-center  px-2 py-2">
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
            type="submit"
            className="bg-red-100 text-red-900 hover:bg-red-200 pl-3 pr-2 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={handleClickRemove}
          >
            Remove
          </button>
        )}
      </td>
    </tr>
  );
}

export default ListAbsent;
