import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../../appwrite/AppwriteConfig';
import AddUserPage from './AddUserPage';
import { FaUser, FaUserFriends, FaLeaf } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { IoPower } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

function UserPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const sortRef = useRef(null);

    // Admin role ID (the role we want to hide)
  const adminRoleId = '673ee7be0020a2298fd1';

  // Function to refresh user list by fetching data again
  const refreshUserList = async () => {
    try {
      // Fetch all Users (Database, User)
      const userResponse = await databases.listDocuments('673b418100295c788a93', '673b41c1003840fb1cd8');
      console.log("Users:", userResponse.documents);

      // Fetch all User_Role entries (Database, User_Role)
      const userRoleResponse = await databases.listDocuments('673b418100295c788a93', '673b41cc002db95aabfc');
      console.log("User Roles:", userRoleResponse.documents);

      // Fetch all Roles (Database, Role)
      const roleResponse = await databases.listDocuments('673b418100295c788a93', '673b41d00018b34a286f');
      console.log("Roles:", roleResponse.documents);

      // Map role IDs to their rolenames
      const roleMap = roleResponse.documents.reduce((acc, role) => {
        acc[role.$id] = role.rolename; // Map role ID to role name
        return acc;
      }, {});

      console.log("Role Map:", roleMap);

      // Format Users with Role Data
      const formattedUsers = userResponse.documents.map(user => {
        // Find matching User_Role entry for the user by Document/User ID
        const userRole = userRoleResponse.documents.find(ur => {
          if (ur.user && Array.isArray(ur.user)) {
            return ur.user[0].$id === user.$id;
          }
        });

        console.log("User Role:", userRole);

        // If userRole is found, extract the role ID and use it to get the role name
        const roleName = userRole && userRole.role 
          ? roleMap[userRole.role.$id] || 'No Role Assigned'
          : 'No Role Assigned';

        console.log("Role Name:", roleName);

        // Build the user data with the role
        return {
          name: `${user.firstname} ${user.lastname}`,
          userRole: roleName,
          date: new Date(user.$createdAt).toLocaleDateString(),
          time: new Date(user.$createdAt).toLocaleTimeString(),
          status: user.status || 'offline',
          $id: user.$id, // Pass user ID to be used in dropdown or other logic
          roleId: userRole?.role?.$id
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users with roles:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    refreshUserList(); // Calling the refresh function

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addNewUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Add the new user to the existing list
  };

  // Toggle dropdown menu
  const handleClickOutside = (event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setIsAccountOpen(false);
    }
    if (sortRef.current && !sortRef.current.contains(event.target)) {
      setIsSortOpen(false);
    }
    setIsActionOpen(null); // Reset to close all action dropdowns
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

const toggleActionDropdown = (userId) => {
  // Close the dropdown if the same user is clicked
  if (isActionOpen === userId) {
    setIsActionOpen(null);
  } else {
    setIsActionOpen(userId);
  }
  setIsSortOpen(false);  // Close Sort dropdown when Action dropdown is toggled
};

  const handleOpenModal = () => {
    setIsAddUserOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

    const toggleSortDropdown = () => {
    setIsSortOpen(!isSortOpen);
  };

  // Logout function
  const logoutUser = async () => {
    try {
      // Delete the current session
      await account.deleteSession('current');
      // Navigate to the login page
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const deleteUser = async (userId) => {
    console.log('Deleting user with ID:', userId);  // Ensure the correct ID is passed
    try {
      // Call the deleteDocument API to remove the user from the collection
      await databases.deleteDocument('673b418100295c788a93', '673b41c1003840fb1cd8', userId);
      console.log('User deleted from Appwrite');
  
      // Update the state to remove the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.$id !== userId));
      console.log('User removed from local state');
    } catch (error) {
      console.error('Error deleting user:', error);  // Log any errors during deletion
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-60 bg-custom-green text-white flex flex-col justify-between">
        <div>
          <img
            src="/logo/Coffeebyte_Logolandscape.png"
            className="w-[200px] h-auto flex ml-4 mr-4 mt-1"
          />
          <nav className="mt-5 lg:ml-3">
            <ul className="space-y-5">
              <li>
                <Link
                  to="/home"
                  className="block pl-4 pt-1 pb-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <FaChartSimple className="mr-3 mt-1" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/user"
                  className="block p-4 bg-gray-100 flex rounded-l transition duration-300 text-custom-green"
                >
                  <FaUserFriends className="mr-4 mt-1" />
                  User Management
                </Link>
              </li>
              <li>
                <Link
                  to="/leaf"
                  className="block pl-4 pt-1 pb-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <FaLeaf className="mr-4 mt-1" />
                  Leaf Disease
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="block pl-4 pt-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <MdFeedback className="mr-4 mt-1" />
                  Feedback
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={logoutUser}
          className="block m-5 mb-8 p-3 flex bg-custom-green transition duration-300 border border-white rounded text-white hover:bg-red-500"
        >
          <IoPower className="mr-4 mt-1" />
          Log Out
        </button>
      </aside>
  
      {/* Main Content */}
      <main className="flex-1 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 pt-5 bg-gray-100">
        {/* Header */}
        <header className="relative flex flex-col lg:flex-row w-full items-start lg:items-center justify-between pb-5 pl-5 pr-10">
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200"></span>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">User Management</h1>
            <h3 className="text-gray-500 text-sm lg:text-base">Manage users and account permissions here.</h3>
          </div>
  
          {/* Account Button */}
          <div className="relative text-3xl" ref={accountRef}>
            <button
              onClick={toggleAccountDropdown}
              className="block p-3 bg-white rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100"
            >
              <FaUser className="text-gray-600 size-5" />
            </button>
            {isAccountOpen && (
              <div className="absolute bg-white right-0 lg:right-10 top-16 shadow-md rounded-md p-2 w-80">
                <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                  Manage Account
                </button>
                <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                  View Account
                </button>
                <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                  Dark Mode
                </button>
              </div>
            )}
          </div>
        </header>
  
        {/* All Users List */}
        <section className="bg-white rounded-lg shadow p-4 mt-10">
          <div className="flex justify-between items-center border-b-[1px] border-black pb-2 mb-2">
            <h3 className="text-lg font-bold">All Users</h3>
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
              <div>
                <button
                  onClick={handleOpenModal}
                  className="px-6 py-2 bg-custom-green text-white rounded-lg"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
  
          {/* Table for User Data */}
          <div className="relative max-h-[400px] overflow-y-auto scrollbar-hide hover:overflow-y-scroll">
            <table className="w-full text-left">
              <thead className="text-gray-500 sticky top-0 bg-white shadow-sm">
                <tr className="border-b">
                  <th className="py-2 pr-20">Name</th>
                  <th className="pr-10">Role</th>
                  <th>Last Active</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => user.roleId !== adminRoleId).map(user => (
                  <tr key={user.$id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td>{user.userRole}</td>
                    <td>{new Date(user.date).toLocaleTimeString()}</td>
                    <td>{new Date(user.date).toLocaleDateString()}</td>
                    <td>
                      <div className="relative">
                        <button
                          onClick={() => toggleActionDropdown(user.$id)}
                          className="inline-flex items-center justify-center text-blue-500 px-2 py-1 rounded-md text-sm"
                        >
                          <BsThreeDots />
                        </button>
                        {isActionOpen === user.$id && (
                          <div className="absolute bg-white shadow-md rounded-md mt-2 p-2 w-[10em] border border-gray-300">
                            <button
                              className="text-gray-800 text-left hover:bg-gray-200 px-4 py-2 rounded-md text-sm w-full flex items-center"
                            >
                              <MdEdit className="mr-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user.$id)}
                              className="text-red-600 text-left hover:bg-red-200 px-4 py-2 rounded-md text-sm w-full flex items-center"
                            >
                              <FaTrash className="mr-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
  
        {/* Conditionally render the modal */}
        {isAddUserOpen && <AddUserPage setIsAddUserOpen={setIsAddUserOpen} addNewUser={addNewUser} />}
      </main>
    </div>
  );
}

  export default UserPage;
