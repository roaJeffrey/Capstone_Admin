import React from 'react';

const UserDelete = ({ userId, onDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this user?</h3>
        <button
          onClick={() => {
            onDelete(userId); // Call onDelete with userId when confirmed
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel} // Close the modal without deleting when Cancel is clicked
          className="px-4 py-2 ml-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserDelete;
