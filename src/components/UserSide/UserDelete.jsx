import React from 'react';

const UserDelete = ({ userId, onDelete, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Are you sure you want to delete this user?</h3>
        <button onClick={() => onDelete(userId)}>Yes, Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default UserDelete;
