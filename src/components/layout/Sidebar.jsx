import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.js'; 
import { FaUserFriends, FaLeaf } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';
import { IoPower } from 'react-icons/io5';
import { FaChartSimple } from "react-icons/fa6";

const Sidebar = () => {
  const { logout } = useAuth(); // Use the logout function from AuthContext
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate('/'); // Redirect to the login page after successful logout
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <aside className="w-full lg:w-60 bg-custom-green text-white flex flex-col justify-between">
      <div>
        {/* Logo */}
        <img
          src="/logo/Coffeebyte_Logolandscape.png"
          className="w-[200px] h-auto flex ml-4 mr-4 mt-1"
          alt="Logo"
        />
        {/* Navigation Menu */}
        <nav className="mt-5 lg:ml-3">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `block p-4 flex rounded-l transition duration-300 ${isActive ? 'bg-gray-100 text-custom-green' : 'bg-custom-green text-white'}`
                }
              >
                <FaChartSimple className="mr-3 mt-1" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `block p-4 flex rounded-l transition duration-300 ${isActive ? 'bg-gray-100 text-custom-green' : 'bg-custom-green text-white'}`
                }
              >
                <FaUserFriends className="mr-4 mt-1" />
                User Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leaf"
                className={({ isActive }) =>
                  `block p-4 flex rounded-l transition duration-300 ${isActive ? 'bg-gray-100 text-custom-green' : 'bg-custom-green text-white'}`
                }
              >
                <FaLeaf className="mr-4 mt-1" />
                Leaf Disease
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/feedback"
                className={({ isActive }) =>
                  `block p-4 flex rounded-l transition duration-300 ${isActive ? 'bg-gray-100 text-custom-green' : 'bg-custom-green text-white'}`
                }
              >
                <MdFeedback className="mr-4 mt-1" />
                Feedback
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="block m-5 mb-8 p-3 flex bg-custom-green transition duration-300 border border-white rounded text-white hover:bg-red-500"
      >
        <IoPower className="mr-4 mt-1" />
        Log Out
      </button>
    </aside>
  );
};

export default Sidebar;
