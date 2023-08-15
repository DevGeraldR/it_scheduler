import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function ListAbsent({ absent, index }) {
  const { employee } = useGlobal();
  const navigate = useNavigate();

  const handleClickRemove = async () => {
    const date = {
      startDate: absent.startDate,
      endDate: absent.endDate,
    };

    const employeeRef = doc(db, "employees", employee.eid);

    await updateDoc(employeeRef, {
      absent: arrayRemove(date),
    });

    alert("absent removed");
    navigate("/homepage"); // Change to /homepage/employeeInformation
  };

  return (
    <tr key={index} className="bg-white border-b border-b-black ">
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className=" px-2 py-2">{absent.startDate}</td>
      <td className=" px-2 py-2">{absent.endDate}</td>
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

export default ListAbsent;
