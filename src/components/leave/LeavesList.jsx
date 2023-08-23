import React, { useState } from "react";
import ListLeave from "./ListLeave";
import { BiSortZA } from "react-icons/bi";
import { BiSortAZ } from "react-icons/bi";
import { TbArrowsSort } from "react-icons/tb";

function LeaveList({ leaves }) {
  const [sortBy, setSortBy] = useState("");
  const [ascending, setAscending] = useState(true);
  const [sorting, setSorting] = useState("");
  return (
    <table className="table w-full max-h-[500px]">
      <thead>
        <tr className="bg-black text-white sticky top-0 z-10">
          <th className="px-2 py-2">
            <div className="flex justify-between">
              <div></div> {/**For design */}
              <label
                type="button"
                htmlFor="sortingStartDate"
                className="cursor-pointer hover:text-yellow-400"
              >
                Start Date
              </label>
              <button
                type="button"
                id="sortingStartDate"
                className="hover:text-yellow-400"
                onClick={() => {
                  setSortBy("startDate");
                  setSorting("startDate");
                  setAscending(!ascending);
                }}
              >
                {sorting === "startDate" ? (
                  ascending ? (
                    <BiSortZA title="Z-A" />
                  ) : (
                    <BiSortAZ title="A-Z" />
                  )
                ) : (
                  <TbArrowsSort title="Sort" />
                )}
              </button>
            </div>
          </th>
          <th className="px-2 py-2 text-center">End Date</th>
          <th className="px-2 py-2 text-center">
            <div className="flex justify-between">
              <div></div> {/**For design */}
              <label
                type="button"
                htmlFor="sortingLeaveType"
                className="cursor-pointer hover:text-yellow-400"
              >
                Type
              </label>
              <button
                type="button"
                id="sortingLeaveType"
                className="hover:text-yellow-400"
                onClick={() => {
                  setSortBy("leaveType");
                  setSorting("leaveType");
                  setAscending(!ascending);
                }}
              >
                {sorting === "leaveType" ? (
                  ascending ? (
                    <BiSortZA title="Z-A" />
                  ) : (
                    <BiSortAZ title="A-Z" />
                  )
                ) : (
                  <TbArrowsSort title="Sort" />
                )}
              </button>
            </div>
          </th>
          <th className="text-center px-2 py-2 bg-black text-white sticky top-0">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {leaves.length <= 0 ? (
          <tr>
            <td className="text-center p-5" colSpan="8">
              No leave
            </td>
          </tr>
        ) : (
          ""
        )}
        {leaves
          .sort((a, b) =>
            ascending
              ? a[sortBy] > b[sortBy]
                ? 1
                : -1
              : a[sortBy] > b[sortBy]
              ? -1
              : 1
          )
          .map((leave, index) => {
            return <ListLeave key={index} leave={leave} index={index} />;
          })}
      </tbody>
    </table>
  );
}

export default LeaveList;
