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
import TableContent from "../../common/Tablecontent"; // Import TableContent component
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

  // Table Columns
  const columns = ["Name", "Role", "Date Added", "Actions"];

  // Render Table Row
  const renderRow = (user) => (
    <>
      {/* Name */}
      <td className="p-2">{user.name}</td>

      {/* Role */}
      <td className="px-10">{user.userRole}</td>

      {/* Date Added */}
      <td className="px-2">{user.date}</td>

      {/* Actions */}
      <td className="px-2">
        <Actiondropdown
          isOpen={isActionOpen === user.$id}
          onToggle={() => toggleActionDropdown(user.$id)}
          id={user.$id}
          options={[
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
    </>
  );

  return (
    <Page>
      <Main>
        {/* User Management Section */}
        <Section title="All Users" handleOpenModal={() => setIsAddUserOpen(!isAddUserOpen)}>
          <TableContent
            data={users.filter((user) => user.roleId !== adminRoleId)} // Filter out admins
            columns={columns}
            isLoading={loading}  // Pass loading status to TableContent
            renderRow={renderRow}
          />
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
