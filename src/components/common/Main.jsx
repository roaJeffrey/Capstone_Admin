import React from "react";

const Main = ({ children }) => {
  return (
    <main className="flex-1 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 pt-5 bg-gray-100">
      {children}
    </main>
  );
};

export default Main;
