import React, { useState, useEffect } from "react";
import { client, databases } from "../../../appwrite/AppwriteConfig"; // Import client directly
import { Query } from "appwrite";
import Addusermodal from "./Addusermodal";
import { usePagecontext } from "../../layout/Pagecontext";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { AiOutlineLoading } from "react-icons/ai";
import Section from "../../common/Section";
import Main from "../../common/Main";
import Page from "../../common/Page";
import Actiondropdown from "../../common/Actiondropdown";
import Deletemodal from "../../common/Deletemodal";
import {
  userResponse,
  userRoleResponse,
  roleResponse,
  adminRoleId,
} from "../../../constants/constants";
import { useNavigate } from "react-router-dom";

function Userpage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { setPageTitle, setPageDescription } = usePagecontext();
  const [loading, setLoading] = useState(true);
  const [isActionOpen, setIsActionOpen] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    setPageTitle("User Management");
    setPageDescription("Manage users and account permissions here.");
  }, [setPageTitle, setPageDescription]);

  // Function to refresh the user list with roles
  const refreshUserList = async () => {
    try {
      setLoading(true); // Start loading

      // Map role IDs to their role names
      const roleMap = roleResponse.documents.reduce((acc, role) => {
        acc[role.$id] = role.rolename;
        return acc;
      }, {});

      // Format Users with Role Data
      const formattedUsers = userResponse.documents.map((user) => {
        const userRole = userRoleResponse.documents.find((ur) => ur.user.$id === user.$id);

        const roleName =
          userRole && userRole.role
            ? roleMap[userRole.role.$id] || "No Role Assigned"
            : "No Role Assigned";

        return {
          name: `${user.firstname} ${user.lastname}`,
          userRole: roleName,
          date: new Date(user.$createdAt).toLocaleDateString(),
          status: user.status || "offline",
          $id: user.$id, // Store user ID
          roleId: userRole?.role?.$id,
        };
      });

      setUsers(formattedUsers); // Set the user state with the formatted data
    } catch (error) {
      console.error("Error fetching users with roles:", error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    refreshUserList();
  }, []);

  // Add a new user and update the state immediately
  const addNewUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const toggleActionDropdown = (userId) => {
    setIsActionOpen(isActionOpen === userId ? null : userId);
  };

  const deleteUser = async (userId) => {
    try {
      // Delete from the User collection
      await databases.deleteDocument("673b418100295c788a93", "673b41c1003840fb1cd8", userId);

      // Query and delete the related User_Role entries
      const userRoleDocs = await databases.listDocuments(
        "673b418100295c788a93",
        "673b41cc002db95aabfc",
        [Query.equal("user", userId)]
      );

      const deletePromises = userRoleDocs.documents.map((doc) =>
        databases.deleteDocument("673b418100295c788a93", "673b41cc002db95aabfc", doc.$id)
      );
      await Promise.all(deletePromises); // Wait for all deletions

      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.$id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteModal(false); // Close the delete modal
    }
  };

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  // Real-time listener for new user additions
  useEffect(() => {
    const unsubscribe = client.subscribe("databases.673b418100295c788a93.collections.673b41c1003840fb1cd8.documents", (response) => {
      if (response.event === "database.documents.create") {
        // When a new user is added, refresh the user list
        console.log("Real-time event:", response);  // Check event payload
        refreshUserList();
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <Page>
      <Main>
        {/* User Management Section */}
        <Section title="All Users" handleOpenModal={() => setIsAddUserOpen(!isAddUserOpen)}>
          <div className="table-container max-h-[450px]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <AiOutlineLoading className="text-4xl text-custom-green mt-5 mb-5 animate-spin" />
              </div>
            ) : (
              <table className="table-auto w-full">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="text-gray-500 border-b border-gray-300 text-left">
                    <th className="p-3">Name</th>
                    <th>Role</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.roleId !== adminRoleId) // Filter out admins
                    .map((user) => (
                      <tr key={user.$id} className="border-b">
                        <td className="border-b border-gray-300 p-3 align-text-middle">
                          {user.name}
                        </td>
                        <td className="border-b border-gray-300">
                          {user.userRole}
                        </td>
                        <td className="border-b border-gray-300">
                          {new Date(user.date).toLocaleDateString()}
                        </td>
                        <td className="item-center">
                          <Actiondropdown
                            isOpen={isActionOpen === user.$id}
                            onToggle={toggleActionDropdown}
                            id={user.$id}
                            options={[
                              // {
                              //   label: "Edit",
                              //   icon: MdEdit,
                              //   onClick: () => {}, // Implement edit functionality here
                              //   textColor: "text-gray-800",
                              //   hoverColor: "hover:bg-gray-200",
                              // },
                              {
                                label: "View Details",
                                icon: CgDetailsMore,
                                onClick: () => navigate(`/user/view/${user.$id}`),
                                textColor: "text-gray-800",
                                hoverColor: "hover:bg-gray-200",
                              },
                              {
                                label: "Delete",
                                icon: FaTrash,
                                onClick: () => handleDeleteClick(user.$id),
                                textColor: "text-red-600",
                                hoverColor: "hover:bg-red-200",
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </Section>

        {/* Deletion Confirmation Modal */}
        {showDeleteModal && (
          <Deletemodal
            title="Delete user?"
            onConfirm={() => deleteUser(userIdToDelete)}
            onCancel={() => setShowDeleteModal(false)}
            itemToDelete={userIdToDelete}
          />
        )}

        {/* Add New User Modal */}
        {isAddUserOpen && (
          <Addusermodal
            setIsAddUserOpen={() => setIsAddUserOpen(!isAddUserOpen)}
            addNewUser={addNewUser}  // Pass the function to update user list
          />
        )}
      </Main>
    </Page>
  );
}

export default Userpage;
