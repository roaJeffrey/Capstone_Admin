import React from "react";
import Loader from "./Loader";

function Tablecontent({ data, columns, renderRow, isLoading }) {
  return (
    <div className="overflow-y-auto" style={{ maxHeight: "450px" }}>
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-200 sticky top-0 z-30">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className="px-1 py-3 text-gray-700 font-semibold text-center whitespace-nowrap"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {isLoading ? (
            <Loader />
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.$id || index}
                className={`border-b text-center ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                {renderRow(item, index).props.children}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-5 text-center">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tablecontent;
