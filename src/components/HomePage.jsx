import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../appwrite/AppwriteConfig';

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [diseaseCounts, setDiseaseCounts] = useState({
    healthy: 0,
    rust: 0,
    cercospora: 0,
    phoma: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all Users
        const userResponse = await databases.listDocuments('67270ce0001ca47b2525', '67276b5a0021e50d2930');

        // Fetch all User_Role entries
        const userRoleResponse = await databases.listDocuments('67270ce0001ca47b2525', '6728e5590018eaed4690');

        // Fetch all Roles
        const roleResponse = await databases.listDocuments('67270ce0001ca47b2525', '6728ea4e0038fc7f1530');

        // Map role IDs to their rolenames
        const roleMap = roleResponse.documents.reduce((acc, role) => {
          acc[role.$id] = role.rolename;
          return acc;
        }, {});

        // Build User data with Role
        const formattedUsers = userResponse.documents.map(user => {
          // Find matching User_Role entry for the user by Document/User ID (Array Form, not string)
          const userRole = userRoleResponse.documents.find(ur => ur.user[0].$id === user.$id);
          
          // Check if userRole is found and retrieve rolename from roleMap (Array Form, not string)
          const roleName = userRole && userRole.role[0] ? userRole.role[0].rolename : 'No Role Assigned';

          // The admin need to set the accounts for users
          return {
            name: `${user.firstname} ${user.lastname}`,
            userRole: roleName,
            date: new Date(user.$createdAt).toLocaleDateString(), // Needs to be accurate
            time: new Date(user.$createdAt).toLocaleTimeString(), // Needs to be accurate
            status: user.status || 'offline' // Still needs fixing
          };
        });

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users with roles:", error);
      }
    };

    const fetchDiseaseCounts = async () => {
      try {
        // Fetch data from Scan_Image collection
        const diseaseResponse = await databases.listDocuments('67270ce0001ca47b2525', '67270fbf000528e1f755');
        console.log("Scan Images:", diseaseResponse.documents);
    
        // Initialize counts for the specific diseases
        const counts = {
          healthy: 0,
          rust: 0,
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

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <h3 className="text-gray-500">Welcome</h3>
            <h1 className="text-2xl font-bold">Admin</h1>
          </div>
          <div className="text-3xl">👤</div>
        </header>

        {/* Leaf Count Section */}
        <section className="grid grid-cols-4 gap-2 my-8">
          <div className="bg-white rounded-lg shadow pr-8 pl-8 pb-8 pt-4 text-center">
            <p className="text-custom-green pb-3">Healthy</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.healthy}</h2>
          </div>
          <div className="bg-white rounded-lg shadow pr-8 pl-8 pb-8 pt-4 text-center">
            <p className="text-custom-green pb-3">Rust</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.rust}</h2>
          </div>
          <div className="bg-white rounded-lg shadow pr-8 pl-8 pb-8 pt-4 text-center">
            <p className="text-custom-green pb-3">Cercospora</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.cercospora}</h2>
          </div>
          <div className="bg-white rounded-lg shadow pr-8 pl-8 pb-8 pt-4 text-center">
            <p className="text-custom-green pb-3">Phoma</p>
            <h2 className="text-3xl font-semibold text-custom-brown">{diseaseCounts.phoma}</h2>
          </div>
        </section>

        {/* User Logged In Table */}
        <section className="bg-white rounded-lg shadow p-2">
          <h3 className="text-lg font-bold mb-2 border-b-[1px] border-black p-2">User Logged In</h3>
          <table className="w-full text-left">
            <thead className="text-gray-500">
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Role</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b">
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
        </section>
      </main>
    </div>
  );
};

export default Home;
