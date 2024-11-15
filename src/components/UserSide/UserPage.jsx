  import React, { useState, useEffect, useRef } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { account, databases } from '../../appwrite/AppwriteConfig';
  import AddUserPage from './AddUserPage';

  function UserPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const sortRef = useRef(null);
  
    // Function to refresh user list by fetching data again
    const refreshUserList = async () => {
      try {
        // Fetch all Users
        const userResponse = await databases.listDocuments('67270ce0001ca47b2525', '67276b5a0021e50d2930');
        console.log("Users:", userResponse.documents);
  
        // Fetch all User_Role entries
        const userRoleResponse = await databases.listDocuments('67270ce0001ca47b2525', '6728e5590018eaed4690');
        console.log("User Roles:", userRoleResponse.documents);
  
        // Fetch all Roles
        const roleResponse = await databases.listDocuments('67270ce0001ca47b2525', '6728ea4e0038fc7f1530');
        console.log("Roles:", roleResponse.documents);
  
        // Map role IDs to their rolenames
        const roleMap = roleResponse.documents.reduce((acc, role) => {
          acc[role.$id] = role.rolename;
          return acc;
        }, {});
        console.log("Role Map:", roleMap);
  
        // Build User data with Role
        const formattedUsers = userResponse.documents.map(user => {
          // Find matching User_Role entry for the user by Document/User ID (Array Form, not string)
          const userRole = userRoleResponse.documents.find(ur => ur.user[0].$id === user.$id);
          console.log("User Role:", userRole);
          
          // Check if userRole is found and retrieve rolename from roleMap (Array Form, not string)
          const roleName = userRole && userRole.role[0] ? userRole.role[0].rolename : 'No Role Assigned';
          console.log("Role Name:", roleName);
  
          // The admin needs to set the accounts for users
          return {
            name: `${user.firstname} ${user.lastname}`,
            userRole: roleName,
            date: new Date(user.$createdAt).toLocaleDateString(), // Needs to be accurate
            time: new Date(user.$createdAt).toLocaleTimeString(), // Needs to be accurate
            status: user.status || 'offline', // Still needs fixing
            $id: user.$id // Make sure to pass the user ID to be used in the dropdown toggle
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
    }, []);

    const addNewUser = (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]); // Add the new user to the existing list
    };
  
    // Toggle dropdown menu
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
        setIsActionOpen(null); // Reset to close all action dropdowns
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup event listener on component unmount
    useEffect(() => {
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const toggleSortDropdown = () => {
      setIsSortOpen(!isSortOpen);
      setIsActionOpen(null); // Close Action button when Sort button is opened
    };
  
    const toggleActionDropdown = (userId) => {
      setIsActionOpen(isActionOpen === userId ? null : userId);
      setIsSortOpen(false); // Close Sort button when Action button is opened
    };
  
    const handleOpenModal = () => {
      setIsAddUserOpen(true); // Open the modal
    };
    
    const handleCloseModal = () => {
      setIsAddUserOpen(false); // Close the modal
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

    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-60 bg-custom-green text-white flex flex-col justify-between p-5">
          <div>
            <h2 className="text-2xl font-bold">CoffeeByte</h2>
            <nav className="mt-14">
              <ul className="space-y-5">
                <li>
                  <Link to="/home" className="block p-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link to="/user" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                    User Management
                  </Link>
                </li>
                <li>
                  <Link to="/leaf" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                    Leaf Disease
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white">
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <button 
            onClick={logoutUser} 
            className="mt-auto py-2 border border-white rounded text-white"
          >
            Log Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100">
          {/* Header */}
          <header className="flex items-center justify-between border-b-[1px] border-black pb-5 pl-5 pr-10">
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <h3 className="text-gray-500">Manage users and account permissions here.</h3>
            </div>
            <div className="text-3xl">👤</div>
          </header>

          {/* All Users List */}
          <section className="bg-white rounded-lg shadow p-4 mt-10">
            <div className="flex justify-between items-center border-b-[1px] border-black pb-2 mb-2">
              <h3 className="text-lg font-bold">All Users</h3>
              <div className="flex space-x-4 items-center">

                {/* Search Button*/}
                <div className="flex items-center bg-white rounded-lg px-4 py-2 border">
                  <input
                    type="text"
                    placeholder="Search user..."
                    className="outline-none bg-transparent text-gray-700 placeholder-gray-500 w-64"
                  />
                </div>

                {/* Sort Button*/}
                <div className="relative" ref={sortRef}> 
                  <button
                    onClick={toggleSortDropdown}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition duration-300 border"
                  >
                    Sort
                  </button>

                  {isSortOpen && (
                    <div className="absolute bg-white right-1 shadow-md rounded-md mt-2 p-2 z-10 w-40">
                      <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                        Sort by Name
                      </button>
                      <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                        Sort by Time
                      </button>
                    </div>
                  )}
                </div>

                {/* Add User Button*/}
                <div>
                  <button 
                    onClick={handleOpenModal} 
                    className="px-6 py-2 bg-green-500 text-white rounded-lg">
                      Add User
                  </button>
                </div>
              </div>
            </div>

            {/* Table for User Data */}
            <div className="flex items-center justify-between p-2">
              <table className="w-full text-left">
                <thead className="text-gray-500">
                  <tr className="border-b">
                    <th className="py-2 pr-20">Name</th>
                    <th className="pr-10">Role</th>
                    <th>Last Active</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{user.name}</td>
                      <td>{user.userRole}</td>
                      <td>{user.date}</td>
                      <td>{user.date}</td>
                      <td className="px">
                        <button
                          onClick={() => toggleActionDropdown(user.$id)} // Use user.$id directly
                          className="inline-flex items-center justify-center text-blue-500 px-2 py-1 rounded-md text-sm"
                        >
                          <span className="text-gray-500">☰</span>
                        </button>
                        {isActionOpen === user.$id && ( // Check if user.$id matches
                          <div className="absolute right-20 bg-white shadow-md rounded-md mt-2 p-2 z-10">
                            <button className="text-gray-800 text-left hover:bg-gray-100 px-4 py-2 rounded-md text-sm w-full">
                              Edit
                            </button>
                            <button className="text-red-600 text-left hover:bg-red-100 px-4 py-2 rounded-md text-sm w-full">
                              Delete
                            </button>
                          </div>
                        )}
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
