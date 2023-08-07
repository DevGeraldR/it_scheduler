import React from "react";
import ListEmployee from "./ListEmployee";

function EmployeesList({ employees }) {
  return (
    <table className="table w-full max-h-[500px]">
      <thead>
        <tr>
          <th className="text-center px-2 py-2 bg-black text-white sticky top-0">
            #
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Name
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            EID
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Leave
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Absent
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Schedule
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Shift
          </th>
          <th className="text-center px-2 py-2 bg-black text-white sticky top-0">
            Actions
          </th>
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
