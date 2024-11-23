import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../appwrite/AppwriteConfig';
import { FaUser, FaUserFriends, FaLeaf } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { IoPower } from "react-icons/io5";

const HomePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const [diseaseCounts, setDiseaseCounts] = useState({
    healthy: 0,
    "coffee rust": 0,
    cercospora: 0,
    phoma: 0,
  });
  const [loading, setLoading] = useState(true);

  // Admin role ID
  const adminRoleId = '673ee7be0020a2298fd1';

  // const toggleDarkMode = () => {
  //   // Toggle the 'dark' class on the <html> element
  //   document.documentElement.classList.toggle('dark');

  //   // Save the current theme preference to localStorage
  //   if (document.documentElement.classList.contains('dark')) {
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     localStorage.setItem('theme', 'light');
  //   }
  // };

  // useEffect(() => {
  //   // Check if the user has a saved theme preference
  //   const savedTheme = localStorage.getItem('theme');
  //   if (savedTheme === 'dark') {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, []);


  // This can't redirect the user to the login page when there is an active session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession("current");
        if (!session) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all Users (Database, User)
        const userResponse = await databases.listDocuments('673b418100295c788a93', '673b41c1003840fb1cd8');

        // Fetch all User_Role entries (Database, User_Role)
        const userRoleResponse = await databases.listDocuments('673b418100295c788a93', '673b41cc002db95aabfc');

        // Fetch all Roles (Database, Role)
        const roleResponse = await databases.listDocuments('673b418100295c788a93', '673b41d00018b34a286f');

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

        console.log("userRoleResponse: ",userRoleResponse.documents);

        console.log("User ID in User Role:", userRole);

        // If userRole is found, extract the role ID and use it to get the role name
        const roleName = userRole && userRole.role 
          ? roleMap[userRole.role.$id] || 'No Role Assigned'
          : 'No Role Assigned';

        console.log("Role Name:", roleName);

          // The admin can see users login session
          return {
            name: `${user.firstname} ${user.lastname}`,
            userRole: roleName,
            date: new Date(user.$createdAt).toLocaleDateString(), // Needs to be accurate
            time: new Date(user.$createdAt).toLocaleTimeString(), // Needs to be accurate
            status: user.status || 'offline', // Still needs fixing
            roleId: userRole?.role?.$id
          };
        });

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users with roles:", error);
      }
    };

    const fetchDiseaseCounts = async () => {
      try {
        // Fetch data from Scan_Image database
        const diseaseResponse = await databases.listDocuments('673b418100295c788a93', '673b41e20028c51fd641');
        console.log("Scan Images:", diseaseResponse.documents);
    
        // Initialize counts for the specific diseases
        const counts = {
          healthy: 0,
          "coffee rust": 0,
          cercospora: 0,
          phoma: 0,
        };
    
        // Count occurrences of the specific diseases
        diseaseResponse.documents.forEach((doc) => {
          const disease = doc.diseasename.toLowerCase(); // Assuming 'diseasename' is the field in your collection
          if (counts[disease] !== undefined) {
            counts[disease] += 1;
          }
        });
    
        // Update state with the counts
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

  document.addEventListener("mousedown", handleClickOutside);


  // // Cleanup event listener on component unmount
  // useEffect(() => {
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };


  // Logout function
  const logoutUser = async () => {
    try {
      await account.deleteSession('current');
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
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
          <nav className="mt-5 ml-3">
            <ul className="space-y-5">
              <li>
                <Link 
                  to="/home" 
                  className="block p-4 bg-gray-100 flex rounded-l transition duration-300 text-custom-green"
                >
                  <FaChartSimple className="mr-4 mt-1"/>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/user" 
                  className="block pl-4 pt-1 pb-1 flex rounded-l bg-custom-green transition duration-300 text-white"
                >
                  <FaUserFriends className="mr-4 mt-1"/>
                  User Management
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaf" 
                  className="block pl-4 pt-1 pb-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <FaLeaf className="mr-4 mt-1"/>
                  Leaf Disease
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className="block pl-4 pt-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <MdFeedback className="mr-4 mt-1"/>
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
          <IoPower className="mr-4 mt-1"/>
          Log Out
        </button>
      </aside>
  
      {/* Main Content */}
      <main className="flex-1 pr-4 pl-4 lg:pr-8 lg:pl-8 pb-8 pt-5 bg-gray-100 overflow-auto">
        
        {/* Header */}
        <header className="relative flex flex-col lg:flex-row w-full items-start lg:items-center justify-between pb-5 pl-5 pr-10">
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200 -ml-5 -mr-5"></span>
          <div>
            <h3 className="text-gray-500">Welcome,</h3>
            <h1 className="text-2xl font-bold">Admin</h1>
          </div>
  
          {/* Account Button */}
          <div className="text-3xl" ref={accountRef}>
            <button
              onClick={toggleAccountDropdown}
              className="block p-3 bg-white rounded-full shadow-md flex items-center 
              justify-center transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100"
            >
              <FaUser className="text-gray-600 size-5" />
            </button>
          </div>
          {isAccountOpen && (
            <div className="absolute bg-white right-5 top-16 shadow-md rounded-md p-2 w-80 z-50">
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
        </header>
  
        {/* Leaf Count Section */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-8">
          <div className="bg-white rounded-lg shadow p-4 text-center pb-5">
            <p className="text-custom-green pb-3">Healthy</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.healthy}</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-custom-green pb-3">Coffee Rust</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts["coffee rust"]}</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-custom-green pb-3">Cercospora</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.cercospora}</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-custom-green pb-3">Phoma</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.phoma}</h2>
          </div>
        </section>
  
        {/* User Logged In Table */}
        <section className="bg-white rounded-lg shadow p-2">
          <h3 className="text-lg font-bold mb-2 border-b-[1px] border-black p-2">User Logged In</h3>
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
                {users.filter(user => user.roleId !== adminRoleId).map(user => (
                  <tr key={`${user.$id}-${user.name}`}>
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
        </section>
      </main>
    </div>
  );
  
}

export default HomePage;
