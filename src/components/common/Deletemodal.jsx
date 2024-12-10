import React from "react";

const Deletemodal = ({ title, onConfirm, onCancel, itemToDelete }) => {
  const handleConfirm = () => {
    if (itemToDelete) {
      onConfirm(itemToDelete); // Pass the itemToDelete (feedback ID) to the onConfirm handler
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 ml-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deletemodal;
