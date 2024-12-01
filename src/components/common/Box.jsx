import React from "react";

const Box = ({ disease, bgColor, count }) => {
  return (
    <div
      key={disease}
      className={`${bgColor} rounded-lg shadow p-4 text-center`}
    >
      <p className="text-white font-bold pb-3">
        {disease.charAt(0).toUpperCase() + disease.slice(1)}
      </p>
      <h2 className="text-3xl font-semibold text-white">{count}</h2>
    </div>
  );
};

export default Box;
