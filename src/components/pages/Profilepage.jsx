import React, { useState, useEffect } from 'react';
import { account, databases } from '../../appwrite/AppwriteConfig';
import { usePagecontext } from '../layout/Pagecontext';
import Editusermodal from "../common/Editusermodal";
import { Query } from 'appwrite';
import { MdEdit } from "react-icons/md";

function Profilepage() {
  const { setPageTitle, setPageDescription } = usePagecontext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

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
              createdAt: userDoc.$createdAt, // Add createdAt field
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

  // Reload user data after editing
  const fetchUserData = async () => {
    try {
      const currentUser = await account.get();
      const loggedInUserId = currentUser.$id;

      const userDocResponse = await databases.listDocuments(
        '673b418100295c788a93',
        '673b41c1003840fb1cd8',
        [Query.equal('$id', [loggedInUserId])]
      );

      if (userDocResponse.documents.length > 0) {
        const userDoc = userDocResponse.documents[0];

        const userRoleResponse = await databases.listDocuments(
          '673b418100295c788a93',
          '673b41cc002db95aabfc',
          [Query.equal('user', [loggedInUserId])]
        );

        if (userRoleResponse.documents.length > 0) {
          const userRoleDoc = userRoleResponse.documents[0];

          const roleName = 'Admin';

          const userData = {
            id: currentUser.$id,
            name: `${userDoc.firstname || 'N/A'} ${userDoc.lastname || 'N/A'}`,
            phone: userDoc.phonenumber || 'N/A',
            email: userDoc.email || 'N/A',
            birthdate: userDoc.birthdate || 'N/A',
            role: roleName,
            createdAt: userDoc.$createdAt,
          };

          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading admin details...
        </p>
      </div>
    );
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
        <div className="bg-custom-green p-8 rounded-lg shadow-md">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl text-white font-semibold">{user.name}</h2>
                <p className="text-gray-200">{user.email}</p>
              </div>
              <button
                className="flex px-3 py-2 items-center justify-center text-custom-green bg-white font-medium rounded hover:bg-gray-100"
                onClick={() => setIsEditUserOpen(true)}
              >
                <MdEdit className="mr-1" /> Edit
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
          
          {/* Personal Information Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'First Name', value: user.name.split(' ')[0] },
              { label: 'Last Name', value: user.name.split(' ')[1] },
              { label: 'Date of Birth', value: user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A' },
              { label: 'Phone Number', value: user.phone },
              { label: 'Role', value: user.role },
              { label: 'Created At', value: new Date(user.createdAt).toLocaleString() }
            ].map((field, index) => (
              <div key={index}>
                <p>{field.label}:</p>
                <p className="font-medium bg-gray-100 pl-4 p-2 m-1 rounded-lg">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Edit User Popup */}
      {isEditUserOpen && (
        <Editusermodal
          user={user}
          setIsEditUserOpen={setIsEditUserOpen}
          fetchUserData={fetchUserData} // Reload user data after editing
        />
      )}
    </div>
  );
}

export default Profilepage;
