import React from "react";
import ListLeave from "./ListLeave";

function LeaveList({ leaves }) {
  return (
    <table className="table w-full max-h-[500px]">
      <thead>
        <tr>
          <th className="text-center px-2 py-2 bg-black text-white sticky top-0">
            #
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Start Date
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            End Date
          </th>
          <th className="text-left px-2 py-2 bg-black text-white sticky top-0">
            Type
          </th>

          <th className="text-center px-2 py-2 bg-black text-white sticky top-0">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {leaves?.length <= 0 ? (
          <tr>
            <td className="text-center p-5" colSpan="8">
              No leave
            </td>
          </tr>
        ) : (
          ""
        )}
        {leaves?.map((leave, index) => {
          return <ListLeave key={index} leave={leave} index={index} />;
        })}
      </tbody>
    </table>
  );
}

export default LeaveList;
