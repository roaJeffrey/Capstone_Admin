import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

const Loader = ({ color = "text-custom-green" }) => {
  return (
    // Loading indicator
    <div className="flex justify-center items-center h-32">
      <AiOutlineLoading className={`text-4xl ${color} animate-spin`} />
    </div>
  );
};

export default Loader;