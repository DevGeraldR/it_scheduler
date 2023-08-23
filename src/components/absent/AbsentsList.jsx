import React, { useState } from "react";
import ListAbsent from "./ListAbsent";
import { BiSortZA } from "react-icons/bi";
import { BiSortAZ } from "react-icons/bi";
import { TbArrowsSort } from "react-icons/tb";

function AbsentsList({ absents }) {
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
          <th className="text-center px-2 py-2">End Date</th>

          <th className="text-center px-2 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {absents.length <= 0 ? (
          <tr>
            <td className="text-center p-5" colSpan="8">
              No absent
            </td>
          </tr>
        ) : (
          ""
        )}
        {absents
          .sort((a, b) =>
            ascending
              ? a[sortBy] > b[sortBy]
                ? 1
                : -1
              : a[sortBy] > b[sortBy]
              ? -1
              : 1
          )
          .map((absent, index) => {
            return <ListAbsent key={index} absent={absent} index={index} />;
          })}
      </tbody>
    </table>
  );
}

export default AbsentsList;
