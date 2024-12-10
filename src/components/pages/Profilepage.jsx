import React, { useState, useEffect } from 'react';
import { account, databases } from '../../appwrite/AppwriteConfig';
import { usePagecontext } from '../layout/Pagecontext';
import { FaUser } from 'react-icons/fa';
import { Query } from 'appwrite';

function Profilepage() {
  const { setPageTitle, setPageDescription } = usePagecontext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Header setup
  useEffect(() => {
    setPageTitle("Profile");
    setPageDescription("Admin Details.");
  }, [setPageTitle, setPageDescription]);

  // Fetch the current logged-in user's details and their role
  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Get the logged-in user from Appwrite account service
      const currentUser = await account.get();
      const loggedInUserId = currentUser.$id;

      if (currentUser) {
        // Fetch the user data from the User collection using the logged-in user's UID
        const userDocResponse = await databases.listDocuments(
          '673b418100295c788a93', // Database ID
          '673b41c1003840fb1cd8', // User Collection ID
          [
            Query.equal('$id', [loggedInUserId]) // Using $id to query the User collection
          ]
        );

        if (userDocResponse.documents.length > 0) {
          const userDoc = userDocResponse.documents[0]; // Get the first document

          // Fetch the role document associated with the user from the User_Role collection
          const userRoleResponse = await databases.listDocuments(
            '673b418100295c788a93', // Database ID
            '673b41cc002db95aabfc', // User_Role Collection ID
            [
              Query.equal('user', [loggedInUserId]) // Match user field in User_Role collection
            ]
          );

          if (userRoleResponse.documents.length > 0) {
            const userRoleDoc = userRoleResponse.documents[0];

            // Here, we hardcode the role to 'Admin' as per your request
            const roleName = 'Admin';

            // Prepare user data with role name
            const userData = {
              id: currentUser.$id,
              name: `${userDoc.firstname || 'N/A'} ${userDoc.lastname || 'N/A'}`,
              phone: userDoc.phonenumber || 'N/A',
              email: userDoc.email || 'N/A',
              birthdate: userDoc.birthdate || 'N/A',
              role: roleName, // Directly set to 'Admin'
            };

            setUser(userData);
          } else {
            console.error("User Role document not found.");
          }
        } else {
          console.error("User document not found.");
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Loading state
  if (loading) {
    return <div></div>;
  }

  // No user found state
  if (!user) {
    return <div>No user found.</div>;
  }

  // Render the profile page
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content */}
      <main className="flex-1 pr-4 pl-4 lg:pr-8 lg:pl-8 pb-8 pt-5 bg-gray-100">
        {/* Profile Header */}
        <div className="bg-custom-green p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border">
              <FaUser className="text-gray-600 text-3xl" />
            </div>
            {/* Profile Info */}
            <div>
              <h2 className="text-xl text-white font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-white">{user.role}</p> {/* Role displayed here */}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <button className="text-orange-500 font-medium">Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">First Name</p>
              <p className="font-medium">{user.name.split(' ')[0]}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Name</p>
              <p className="font-medium">{user.name.split(' ')[1]}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium">{new Date(user.birthdate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profilepage;
