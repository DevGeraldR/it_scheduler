import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function ListEmployee({ employee, index }) {
  const { setEmployee } = useGlobal();
  const navigate = useNavigate();

  const handleClickRemove = async (eid) => {
    const confirm = window.confirm("Are you sure you want to remove employee?");
    if (confirm) {
      const employeeRef = doc(db, "Employees", eid);

      await deleteDoc(employeeRef);
    }
  };

  return (
    <tr key={index} className="bg-white border-b border-b-black ">
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className=" px-2 py-2">{employee.fullName}</td>
      <td className=" px-2 py-2">{employee.eid}</td>
      <td className=" px-2 py-2">{employee.leaveCount}</td>
      <td className=" px-2 py-2">
        {employee.schedule.map((item) => (
          <span> {item}</span>
        ))}
      </td>
      <td className=" px-2 py-2">{employee.shift}</td>
      <td className="text-center  px-2 py-2">
        <button
          className="text-black text-blue-600 hover:text-blue-900"
          onClick={() => {
            setEmployee(employee);
            navigate("/homepage/employeeInformation");
          }}
        >
          Full Details
        </button>
        <button
          className="text-red-600 pl-3 hover:text-red-900"
          onClick={() => handleClickRemove(employee.eid)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default ListEmployee;
