import React from "react";
import ListEmployee from "./ListEmployee";

function EmployeesList({ employees }) {
  return (
    <table className="table w-full">
      <thead>
        <tr className="bg-black text-white sticky top-0 z-10">
          <th className="text-center px-2 py-2"> # </th>
          <th className="text-center px-2 py-2"> Name </th>
          <th className="text-center px-2 py-2"> EID </th>
          <th className="text-center px-2 py-2"> Position </th>
          <th className="text-center px-2 py-2"> Leave </th>
          <th className="text-center px-2 py-2"> Absent </th>
          <th className="text-center px-2 py-2"> Schedule </th>
          <th className="text-center px-2 py-2"> Shift </th>
          <th className="text-center px-2 py-2"> Actions </th>
        </tr>
      </thead>
      <tbody>
        {employees.length <= 0 ? (
          <tr>
            <td className="text-center p-5" colSpan="8">
              No employee
            </td>
          </tr>
        ) : (
          ""
        )}
        {employees.map((employee, index) => {
          return <ListEmployee key={index} employee={employee} index={index} />;
        })}
      </tbody>
    </table>
  );
}

export default EmployeesList;
