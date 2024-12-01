import React, { useState, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const AccountDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const accountRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener when dropdown is open
  React.useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={accountRef}>
      <button
        onClick={toggleDropdown}
        className="block p-3 mr-10 bg-white rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100"
      >
        <FaUser className="text-gray-600 text-2xl" />
      </button>
      
      {isDropdownOpen && (
        <div className="absolute bg-white right-10 top-16 shadow-md rounded-md p-2 w-80 border border-gray-300 z-20">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full ${isActive ? 'bg-gray-100 text-custom-green' : ''}`
            }
          >
            View Account
          </NavLink>
          <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
            Dark Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
