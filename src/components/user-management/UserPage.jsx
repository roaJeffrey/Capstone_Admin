import React, { useState, useEffect, useRef } from 'react';
import { users, databases } from '../../appwrite/AppwriteConfig';
import { Query } from 'appwrite'; 
import AddUserPage from './AddUserPage';
import UserDelete from './UserDelete';
import { usePageContext } from '../layout/PageContext';
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { AiOutlineLoading } from "react-icons/ai";

function UserPage() {
  const [users, setUsers] = useState([]);
  const { setPageTitle, setPageDescription } = usePageContext();
  const [loading, setLoading] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const accountRef = useRef(null);
  const sortRef = useRef(null);

  // Admin role ID (the role we want to hide)
  const adminRoleId = '673ee7be0020a2298fd1';

  // Header
  useEffect(() => {
    setPageTitle("User Management");
      setPageDescription("Manage users and account permissions here.");
  }, [setPageTitle, setPageDescription]);

  // Function to refresh user list by fetching data again
  const refreshUserList = async () => {
    try {
      setLoading(true); // Start loading
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
          return ur.user.$id === user.$id;
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
    } finally {
      setLoading(false); // Set loading to false when done
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


  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

    const toggleSortDropdown = () => {
    setIsSortOpen(!isSortOpen);
  };


  const deleteUser = async (userId) => {
    try {
      // Step 1: Delete from User collection
      await databases.deleteDocument('673b418100295c788a93', '673b41c1003840fb1cd8', userId);
      console.log('User deleted from User collection');
  
      // Step 2: Query and delete documents from User_Role collection
      const userRoleDocs = await databases.listDocuments(
        '673b418100295c788a93',
        '673b41cc002db95aabfc',
        [Query.equal('user', userId)] // Query documents where 'user' equals userId
      );
  
      const deletePromises = userRoleDocs.documents.map(doc =>
        databases.deleteDocument('673b418100295c788a93', '673b41cc002db95aabfc', doc.$id)
      );
      await Promise.all(deletePromises); // Wait for all deletions to complete
      console.log('User roles deleted from User_Role collection');
  
      // Step 3: Delete user from Appwrite Auth (Users API)
      await users.delete(userId);
      console.log('User deleted from Appwrite Auth');
  
      // Step 4: Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.$id !== userId));
      console.log('User removed from local state');
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      // Step 5: Close the modal
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen">
  
      {/* Main Content */}
      <main className="flex-1 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 pt-5 bg-gray-100">
  
        {/* All Users List */}
        <section className="bg-white rounded-lg shadow p-4 mt-2">
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
                  className="px-6 py-2 bg-custom-brown text-white rounded-lg font-bold"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
  
          {/* Table for User Data */}
          <div className="table-container max-h-[450px]">
            {loading ? (
              // Display loading spinner while loading
              <div className="flex justify-center items-center h-full">
                <AiOutlineLoading className="text-4xl text-custom-green mt-5 mb-5 animate-spin" />
              </div>
            ) : (
              <table className="table-auto w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-gray-500 border-b border-gray-300 text-left">
                    <th className="p-3">Name</th>
                    <th className="pl-5">Role</th>
                    <th className="pl-5">Last Active</th>
                    <th className="pl-5">Date Added</th>
                    <th className="pl-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.roleId !== adminRoleId).map(user => (
                    <tr key={user.$id} className="border-b">
                      <td className="border-b border-gray-300 p-3 align-text-middle">{user.name}</td>
                      <td className="border-b border-gray-300 pl-5">{user.userRole}</td>
                      <td className="border-b border-gray-300 pl-5">{new Date(user.date).toLocaleTimeString()}</td>
                      <td className="border-b border-gray-300 pl-5">{new Date(user.date).toLocaleDateString()}</td>
                      <td className="border-b border-gray-300 pl-5">
                        <div className="relative">
                          <button
                            onClick={() => toggleActionDropdown(user.$id)}
                            className="inline-flex items-center justify-center text-blue-500 px-5 py-1 rounded-md text-sm"
                          >
                            <BsThreeDots />
                          </button>
                          {isActionOpen === user.$id && (
                            <div className="absolute bg-white shadow-md rounded-md mt-2 p-2 w-[10em] border border-gray-300 z-20 right-[3rem]">
                              <button className="text-gray-800 text-left hover:bg-gray-200 px-4 py-2 rounded-md text-sm w-full flex items-center">
                                <MdEdit className="mr-3" />
                                Edit
                              </button>
                              <button className="text-gray-800 text-left hover:bg-gray-200 px-4 py-2 rounded-md text-sm w-full flex items-center">
                                <CgDetailsMore className="mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user.$id)}
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
            )}
          </div>
        </section>

        {/* Modal for confirming deletion */}
        {showDeleteModal && (
          <UserDelete
            userId={userIdToDelete}  // Pass the userId of the user to delete
            onDelete={deleteUser}  // Pass the deleteUser function
            onCancel={handleCancelDelete}  // Cancel function to close the modal
          />
        )}
  
        {/* Conditionally render the modal */}
        {isAddUserOpen && <AddUserPage setIsAddUserOpen={setIsAddUserOpen} addNewUser={addNewUser} />}
      </main>
    </div>
  );
}

  export default UserPage;
