import React from "react";

const Page = ({ children }) => {
  return <div className="flex flex-col lg:flex-row h-screen">{children}</div>;
};

export default Page;
