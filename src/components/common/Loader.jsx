import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

const Loader = () => {
  return (
    // Loading indicator
    <div className="flex justify-center items-center h-32">
      <AiOutlineLoading className="text-4xl text-custom-green animate-spin" />
    </div>
  );
};

export default Loader;
