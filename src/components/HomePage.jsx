import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '../appwrite/AppwriteConfig';
import { usePageContext } from './layout/PageContext';
import { AiOutlineLoading } from "react-icons/ai";

const HomePage = () => {
  const { setPageTitle, setPageDescription } = usePageContext();
  const [users, setUsers] = useState([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const accountRef = useRef(null);
  const [diseaseCounts, setDiseaseCounts] = useState({
    "coffee rust": 0,
    cercospora: 0,
    phoma: 0,
  });

  // Admin role ID
  const adminRoleId = '673ee7be0020a2298fd1';

  
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
      try {
        // Fetch all Users (Database, User)
        const userResponse = await databases.listDocuments(
          '673b418100295c788a93', 
          '673b41c1003840fb1cd8'
        );

        // Fetch all User_Role entries (Database, User_Role)
        const userRoleResponse = await databases.listDocuments(
          '673b418100295c788a93', 
          '673b41cc002db95aabfc'
        );

        // Fetch all Roles (Database, Role)
        const roleResponse = await databases.listDocuments(
          '673b418100295c788a93', 
          '673b41d00018b34a286f'
        );

        // Map role IDs to their role names
        const roleMap = roleResponse.documents.reduce((acc, role) => {
          acc[role.$id] = role.rolename;
          return acc;
        }, {});

        // Format Users with Role Data
        const formattedUsers = userResponse.documents.map((user) => {
          // Find matching User_Role entry for the user by Document/User ID
          const userRole = userRoleResponse.documents.find((ur) => ur.user.$id === user.$id);

          // Extract the role name, if available
          const roleName = userRole?.role 
            ? roleMap[userRole.role.$id] || 'No Role Assigned'
            : 'No Role Assigned';

          return {
            name: `${user.firstname} ${user.lastname}`,
            userRole: roleName,
            date: new Date(user.$createdAt).toLocaleDateString(),
            time: new Date(user.$createdAt).toLocaleTimeString(),
            status: user.status || 'offline', // Default status to offline
            roleId: userRole?.role?.$id,
          };
        });

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users with roles:", error);
      }
    };

    // Fetch disease count data
    const fetchDiseaseCounts = async () => {
      try {
        const diseaseResponse = await databases.listDocuments(
          '673b418100295c788a93', 
          '673b41e20028c51fd641'
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

  // Toggle dropdown menu
  const handleClickOutside = (event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setIsAccountOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content */}
      <main className="flex-1 pr-4 pl-4 lg:pr-8 lg:pl-8 pb-8 pt-5 bg-gray-100">

        {/* Leaf Count Section */}
        <section className="grid grid-cols-3 sm:grid-cols-3 gap-3 my-21 mb-5 ">
              {Object.entries(diseaseCounts).map(([disease, count]) => {
                const bgColors = {
                  "coffee rust": "bg-custom-yellow shadow-md",
                  cercospora: "bg-custom-teal shadow-md",
                  phoma: "bg-custom-red shadow-md",
                };

                const bgColor = bgColors[disease] || "bg-gray-200";

                return (
                  <div
                    key={disease}
                    className={`${bgColor} rounded-lg shadow p-4 text-center`}
                  >
                    <p className="text-white font-bold pb-3">
                      {disease.charAt(0).toUpperCase() + disease.slice(1)}
                    </p>
                    <h2 className="text-3xl font-semibold text-white">
                      {count}
                    </h2>
                  </div>
                );
              })}
            </section>

        {/* User Logged In Table */}
        <section className="bg-white rounded-lg shadow p-2">
          <h3 className="text-lg font-bold mb-2 border-b-[1px] border-black p-2">User Logged In</h3>
          
          {loading ? (
            // Loading indicator
            <div className="flex justify-center items-center h-32">
              <AiOutlineLoading className="text-4xl text-custom-green animate-spin" />
            </div>
          ) : (
            // Table content
            <div className="overflow-auto max-h-64">
              <table className="w-full text-left">
                <thead className="text-gray-500 sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="py-2">Name</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.filter((user) => user.roleId !== adminRoleId).map((user) => (
                    <tr key={`${user.name}-${user.date}`}>
                      <td className="py-2">{user.name}</td>
                      <td>{user.userRole}</td>
                      <td>{user.date}</td>
                      <td>{user.time}</td>
                      <td>
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                        <span className="ml-2">{user.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
