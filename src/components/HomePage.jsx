import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { account, databases } from "../appwrite/AppwriteConfig";
import { usePageContext } from "./layout/PageContext";
import { AiOutlineLoading } from "react-icons/ai";
import Loader from "./common/Loader";
import Box from "./common/Box";
import Section from "./common/Section";
import Main from "./common/Main";
import Page from "./common/Page";
import {
  userResponse,
  userRoleResponse,
  roleResponse,
  adminRoleId,
} from "../constants/constants";

const HomePage = () => {
  const { setPageTitle, setPageDescription } = usePageContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountRef = useRef(null);
  const [diseaseCounts, setDiseaseCounts] = useState({
    "coffee rust": 0,
    cercospora: 0,
    phoma: 0,
  });

  // Header
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const user = await account.get();
        const fullName = user.name || "Admin";
        setPageTitle(fullName || "Admin");
      } catch (error) {
        setPageTitle("Admin");
      }
    };

    fetchAdminDetails();
    setPageDescription("Management Dashboard");
  }, [setPageTitle, setPageDescription]);

  useEffect(() => {
    // Fetch user data with their roles
    const fetchUsers = async () => {
      setLoading(true);

      try {
        // Map role IDs to their role names
        const roleMap = roleResponse.documents.reduce((acc, role) => {
          acc[role.$id] = role.rolename;
          return acc;
        }, {});

        // Format Users with Role Data
        const formattedUsers = userResponse.documents.map((user) => {
          // Find matching User_Role entry for the user by Document/User ID
          const userRole = userRoleResponse.documents.find(
            (ur) => ur.user.$id === user.$id
          );

          // Extract the role name, if available
          const roleName = userRole?.role
            ? roleMap[userRole.role.$id] || "No Role Assigned"
            : "No Role Assigned";

          return {
            name: `${user.firstname} ${user.lastname}`,
            userRole: roleName,
            date: new Date(user.$createdAt).toLocaleDateString(),
            time: new Date(user.$createdAt).toLocaleTimeString(),
            status: user.status || "offline", // Default status to offline
            roleId: userRole?.role?.$id,
          };
        });

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users with roles:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch disease count data
    const fetchDiseaseCounts = async () => {
      try {
        const diseaseResponse = await databases.listDocuments(
          "673b418100295c788a93",
          "673b41e20028c51fd641"
        );

        // Count occurrences of each disease
        const counts = {
          "coffee rust": 0,
          cercospora: 0,
          phoma: 0,
        };

        diseaseResponse.documents.forEach((doc) => {
          const disease = doc.diseasename.toLowerCase();
          if (counts[disease] !== undefined) {
            counts[disease] += 1;
          }
        });

        setDiseaseCounts(counts);
      } catch (error) {
        console.error("Error fetching disease data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchDiseaseCounts();
  }, []);

  return (
    <Page>
      {/* Main Content */}
      <Main>
        {/* Leaf Count Section */}
        <section className="grid grid-cols-3 sm:grid-cols-3 gap-3 my-21 mb-5 ">
          {Object.entries(diseaseCounts).map(([disease, count]) => {
            const bgColors = {
              "coffee rust": "bg-custom-yellow shadow-md",
              cercospora: "bg-custom-teal shadow-md",
              phoma: "bg-custom-red shadow-md",
            };

            const bgColor = bgColors[disease] || "bg-gray-200";

            return <Box disease={disease} bgColor={bgColor} count={count} />;
          })}
        </section>

        {/* User Logged In Table */}
        <Section title="User Logged In">
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
                    <th>Role</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.roleId !== adminRoleId)
                    .map((user) => (
                      <tr key={`${user.name}-${user.date}`}>
                        <td className="p-3">{user.name}</td>
                        <td>{user.userRole}</td>
                        <td>{user.date}</td>
                        <td>{user.time}</td>
                        <td>
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              user.status === "online"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          <span className="ml-2">{user.status}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </Section>
      </Main>
    </Page>
  );
};

export default HomePage;
