import React, { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";

const Actiondropdown = ({ options, onToggle, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent the event from reaching the document listener
    setIsOpen((prev) => !prev);
    if (onToggle) onToggle(id);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside both the button and dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      {/* Button to open/close dropdown */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="mx-5"
      >
        <BsThreeDots className="text-lg text-gray-700" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full bg-white shadow-md rounded-md p-2 w-[11em] border border-gray-300 z-50"
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={option.onClick}
              className={`${option.textColor} text-left ${option.hoverColor} px-3 py-2 rounded-md text-sm w-full flex items-center`}
            >
              <option.icon className="mr-3" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Actiondropdown;
