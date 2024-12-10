import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import { databases } from "../../../appwrite/AppwriteConfig";
import Editusermodal from "./Editusermodal";
import { MdEdit } from "react-icons/md";

const Viewuserpage = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false); // State for the Edit popup

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await databases.listDocuments(
          "673b418100295c788a93", // Database ID
          "673b41c1003840fb1cd8", // User Collection ID
          [Query.equal("$id", user_id)]
        );

        if (userResponse.documents.length > 0) {
          setUser(userResponse.documents[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [user_id]);

  // Reload user data after editing
  const fetchUserData = async () => {
    try {
      const userResponse = await databases.listDocuments(
        "673b418100295c788a93",
        "673b41c1003840fb1cd8",
        [Query.equal("$id", user_id)]
      );

      if (userResponse.documents.length > 0) {
        setUser(userResponse.documents[0]);
      }
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading user details...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content */}
      <main className="flex-1 pr-4 pl-4 lg:pr-8 lg:pl-8 pb-8 pt-5 bg-gray-100">
        {/* User Header */}
        <div className="bg-custom-green p-6 rounded-lg shadow-md">
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-xl text-white font-semibold">{`${user.firstname} ${user.lastname}`}</h2>
              <p className="text-gray-200">User ID: {user.$id}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <button
              className="flex p-2 items-center justify-center text-custom-brown font-medium rounded hover:bg-gray-200"
              onClick={() => setIsEditUserOpen(true)}
            >
               <MdEdit className="mr-1" /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">First Name:</p>
              <p className="font-medium">{user.firstname}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Name:</p>
              <p className="font-medium">{user.lastname}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth:</p>
              <p className="font-medium">
                {user.birthdate
                  ? new Date(user.birthdate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Email Address:</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number:</p>
              <p className="font-medium">{user.phonenumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Created At:</p>
              <p className="font-medium">
                {new Date(user.$createdAt).toLocaleString()}
              </p>
            </div>
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
};

export default Viewuserpage;
