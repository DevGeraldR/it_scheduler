import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useGlobal } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/Firebase";

function ListLeave({ leave, index }) {
  const { employee } = useGlobal();
  const navigate = useNavigate();

  const handleClickRemove = async () => {
    const date = {
      startDate: leave.startDate,
      endDate: leave.endDate,
      leaveType: leave.leaveType,
    };

    const employeeRef = doc(db, "Employees", employee.eid);

    await updateDoc(employeeRef, {
      leave: arrayRemove(date),
    });

    alert("Leave removed");
    navigate("/homepage"); // Change to /homepage/employeeInformation
  };

  return (
    <tr key={index} className="bg-white border-b border-b-black ">
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className=" px-2 py-2">{leave?.startDate}</td>
      <td className=" px-2 py-2">{leave?.endDate}</td>
      <td className=" px-2 py-2">{leave?.leaveType}</td>
      <td className="text-center  px-2 py-2">
        <button
          className="text-red-600 pl-3 hover:text-red-900"
          onClick={handleClickRemove}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default ListLeave;
