import React, { useState, useEffect, useRef } from "react";
import { users, databases } from "../../appwrite/AppwriteConfig";
import { Query } from "appwrite";
import AddUserPage from "./AddUserPage";
import UserDelete from "./UserDelete";
import { usePageContext } from "../layout/PageContext";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { AiOutlineLoading } from "react-icons/ai";
import Section from "../common/Section";
import Main from "../common/Main";
import Page from "../common/Page";
import {
  userResponse,
  userRoleResponse,
  roleResponse,
  adminRoleId,
} from "../../constants/constants";
import { useNavigate } from "react-router-dom";

function UserPage() {
  // Open Navigate and Location
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const { setPageTitle, setPageDescription } = usePageContext();
  const [loading, setLoading] = useState(true);
  const [isActionOpen, setIsActionOpen] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  // Header
  useEffect(() => {
    setPageTitle("User Management");
    setPageDescription("Manage users and account permissions here.");
  }, [setPageTitle, setPageDescription]);

  // Function to refresh user list by fetching data again
  const refreshUserList = async () => {
    try {
      setLoading(true); // Start loading

      // Map role IDs to their rolenames
      const roleMap = roleResponse.documents.reduce((acc, role) => {
        acc[role.$id] = role.rolename; // Map role ID to role name
        return acc;
      }, {});

      console.log("Role Map:", roleMap);

      // Format Users with Role Data
      const formattedUsers = userResponse.documents.map((user) => {
        // Find matching User_Role entry for the user by Document/User ID
        const userRole = userRoleResponse.documents.find((ur) => {
          return ur.user.$id === user.$id;
        });

        console.log("User Role:", userRole);

        // If userRole is found, extract the role ID and use it to get the role name
        const roleName =
          userRole && userRole.role
            ? roleMap[userRole.role.$id] || "No Role Assigned"
            : "No Role Assigned";

        console.log("Role Name:", roleName);

        // Build the user data with the role
        return {
          name: `${user.firstname} ${user.lastname}`,
          userRole: roleName,
          date: new Date(user.$createdAt).toLocaleDateString(),
          time: new Date(user.$createdAt).toLocaleTimeString(),
          status: user.status || "offline",
          $id: user.$id, // Pass user ID to be used in dropdown or other logic
          roleId: userRole?.role?.$id,
        };
      });

      // Set User State
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
    /* return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }; */
  }, []);

  const addNewUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Add the new user to the existing list
  };

  const toggleActionDropdown = (userId) => {
    // Close the dropdown if the same user is clicked
    isActionOpen === userId ? setIsActionOpen(null) : setIsActionOpen(userId);
  };

  const deleteUser = async (userId) => {
    try {
      // Step 1: Delete from User collection
      await databases.deleteDocument(
        "673b418100295c788a93",
        "673b41c1003840fb1cd8",
        userId
      );
      console.log("User deleted from User collection");

      // Step 2: Query and delete documents from User_Role collection
      const userRoleDocs = await databases.listDocuments(
        "673b418100295c788a93",
        "673b41cc002db95aabfc",
        [Query.equal("user", userId)] // Query documents where 'user' equals userId
      );

      const deletePromises = userRoleDocs.documents.map((doc) =>
        databases.deleteDocument(
          "673b418100295c788a93",
          "673b41cc002db95aabfc",
          doc.$id
        )
      );
      await Promise.all(deletePromises); // Wait for all deletions to complete
      console.log("User roles deleted from User_Role collection");

      // Step 3: Delete user from Appwrite Auth (Users API)
      await users.delete(userId);
      console.log("User deleted from Appwrite Auth");

      // Step 4: Update local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.$id !== userId));
      console.log("User removed from local state");
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      // Step 5: Close the modal
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  return (
    <Page>
      {/* Main Content */}
      <Main>
        {/* All Users List */}
        <Section
          title="All Users"
          handleOpenModal={() => setIsAddUserOpen(!isAddUserOpen)}
        >
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
                  {users
                    .filter((user) => user.roleId !== adminRoleId)
                    .map((user) => (
                      <tr key={user.$id} className="border-b">
                        <td className="border-b border-gray-300 p-3 align-text-middle">
                          {user.name}
                        </td>
                        <td className="border-b border-gray-300 pl-5">
                          {user.userRole}
                        </td>
                        <td className="border-b border-gray-300 pl-5">
                          {new Date(user.date).toLocaleTimeString()}
                        </td>
                        <td className="border-b border-gray-300 pl-5">
                          {new Date(user.date).toLocaleDateString()}
                        </td>
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
                                <button
                                  onClick={() =>
                                    navigate(`/user/view/${user.$id}`)
                                  }
                                  className="text-gray-800 text-left hover:bg-gray-200 px-4 py-2 rounded-md text-sm w-full flex items-center"
                                >
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
        </Section>

        {/* Modal for confirming deletion */}
        {showDeleteModal && (
          <UserDelete
            userId={userIdToDelete} // Pass the userId of the user to delete
            onDelete={deleteUser} // Pass the deleteUser function
            setShowDeleteModal={setShowDeleteModal}
            onCancel={() => setShowDeleteModal(!showDeleteModal)} // Cancel function to close the modal
          />
        )}

        {/* Conditionally render the modal */}
        {isAddUserOpen && (
          <AddUserPage
            setIsAddUserOpen={() => setIsAddUserOpen(!isAddUserOpen)}
            addNewUser={addNewUser}
          />
        )}
      </Main>
    </Page>
  );
}

export default UserPage;
