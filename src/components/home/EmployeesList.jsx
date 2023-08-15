import React from "react";
import ListEmployee from "./ListEmployee";

function EmployeesList({ employees }) {
  return (
    <table className="table w-full max-h-[500px]">
      <thead>
        <tr className="bg-slate-900 sticky top-0 z-10 border border-slate-400 top-0 rounded-xl">
          <th className="text-center px-2 py-2 text-white"> # </th>
          <th className="text-left px-2 py-2 text-white"> Name </th>
          <th className="text-left px-2 py-2 text-white"> EID </th>
          <th className="text-left px-1 py-2 text-white"> Leave </th>
          <th className="text-left px-2 py-2 text-white"> Absent </th>
          <th className="text-left px-2 py-2 text-white"> Schedule </th>
          <th className="text-left px-2 py-2 text-white"> Shift </th>
          <th className="text-center px-2 py-2 text-white"> Actions </th>
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
