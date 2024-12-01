import React from "react";

const Section = ({ title = "Empty Title", handleOpenModal, children }) => {
  return (
    <section className="bg-white rounded-lg shadow p-4 mt-2">
      <div className="flex justify-between items-center border-b-[1px] border-black pb-2 mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex space-x-4 items-center">
          {/* Search Button */}
          {/* Uncomment if needed */}
          {/* <div className="flex items-center bg-white rounded-lg px-4 py-2 border">
                <input
                  type="text"
                  placeholder="Search user..."
                  className="outline-none bg-transparent text-gray-700 placeholder-gray-500 w-64"
                />
              </div> */}

          {/* Add User Button */}
          {handleOpenModal && (
            <div>
              <button
                onClick={handleOpenModal}
                className="px-6 py-2 bg-custom-brown text-white rounded-lg font-bold"
              >
                Add User
              </button>
            </div>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

export default Section;
