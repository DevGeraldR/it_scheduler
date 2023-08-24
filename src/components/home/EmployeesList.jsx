import React, { useState } from "react";
import ListEmployee from "./ListEmployee";
import { BiSortZA } from "react-icons/bi";
import { BiSortAZ } from "react-icons/bi";
import { TbArrowsSort } from "react-icons/tb";

function EmployeesList({ employees }) {
  const [sortBy, setSortBy] = useState("");
  const [ascending, setAscending] = useState(false);
  const [sorting, setSorting] = useState("");

  return (
    <table className="table w-full">
      <thead>
        <tr className="bg-black text-white sticky top-0 z-10">
          <th className="text-center px-2 py-2"> EID </th>
          <th className="px-2 py-2">
            <div className="flex justify-between">
              <div></div> {/**For design */}
              <label
                type="button"
                htmlFor="sortingName"
                className="cursor-pointer hover:text-yellow-400"
              >
                Name
              </label>
              <button
                type="button"
                id="sortingName"
                className="hover:text-yellow-400"
                onClick={() => {
                  setAscending(!ascending);
                  setSortBy("fullName");
                  setSorting("fullName");
                }}
              >
                {sorting === "fullName" ? (
                  ascending ? (
                    <BiSortAZ title="A-Z" />
                  ) : (
                    <BiSortZA title="Z-A" />
                  )
                ) : (
                  <TbArrowsSort title="Sort" />
                )}
              </button>
            </div>
          </th>
          <th className="x-2 py-2">
            <div className="flex justify-between">
              <div></div> {/**For design */}
              <label
                type="button"
                htmlFor="sortingPosition"
                className="cursor-pointer hover:text-yellow-400"
              >
                Position
              </label>
              <button
                type="button"
                className="hover:text-yellow-400"
                id="sortingPosition"
                onClick={() => {
                  setSortBy("position");
                  setSorting("position");
                  setAscending(!ascending);
                }}
              >
                {sorting === "position" ? (
                  ascending ? (
                    <BiSortAZ title="A-Z" />
                  ) : (
                    <BiSortZA title="Z-A" />
                  )
                ) : (
                  <TbArrowsSort title="Sort" />
                )}
              </button>
            </div>
          </th>
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
            <td className="text-center p-5" colSpan="9">
              No employee
            </td>
          </tr>
        ) : (
          ""
        )}
        {employees
          .sort((a, b) =>
            ascending
              ? a[sortBy] > b[sortBy]
                ? 1
                : -1
              : a[sortBy] > b[sortBy]
              ? -1
              : 1
          )
          .map((employee, index) => {
            return (
              <ListEmployee key={index} employee={employee} index={index} />
            );
          })}
      </tbody>
    </table>
  );
}

export default EmployeesList;
