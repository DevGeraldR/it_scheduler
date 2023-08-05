import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
function ListEmployee({ employee, index, onRemoveEmployee }) {
  const { setEmployee } = useGlobal();
  const navigate = useNavigate();

  const handleClickRemove = async (eid) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this employee?");
    if (confirmRemove) {
      const employeeRef = doc(db, "Employees", eid);

      try {
        await deleteDoc(employeeRef);
        // Call the parent's handler to remove the employee from the list
        onRemoveEmployee(eid);
      } catch (error) {
        console.error("Error removing employee:", error);
      }
    }
  };


  const handleClickEdit = () => {
    // Set the selected employee to the global state for editing
    setEmployee(employee);
    // Redirect to the EditEmployee page with the employee ID as a route parameter
    navigate(`/homepage/EditEmployee/${employee.eid}`);
  };

  return (
    <tr key={index} className="bg-white border-b border-b-black ">
      <td className="text-center px-2 py-2">{index + 1}</td>
      <td className=" px-2 py-2">{employee.fullName}</td>
      <td className=" px-2 py-2">{employee.eid}</td>
      <td className=" px-2 py-2">{employee.leaveCount}</td>
      <td className=" px-2 py-2">{employee.schedule}</td>
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
        <button
          className="text-green-600 pl-3 hover:text-green-900"
          onClick={handleClickEdit}
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

export default ListEmployee;
