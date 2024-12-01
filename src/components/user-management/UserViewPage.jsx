import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import { databases } from "../../appwrite/AppwriteConfig";

const UserViewPage = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
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
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user_id]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-custom-green text-white py-8 px-6">
          <h1 className="text-3xl font-bold">{`${user.firstname} ${user.lastname}`}</h1>
          <p className="mt-1 text-sm opacity-75">User ID: {user.$id}</p>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailItem label="First Name" value={user.firstname} />
            <DetailItem label="Last Name" value={user.lastname} />
            <DetailItem label="Phone Number" value={user.phonenumber} />
            <DetailItem label="Email" value={user.email} />
            <DetailItem
              label="Birth Date"
              value={new Date(user.birthdate).toLocaleDateString()}
            />
            <DetailItem
              label="Created At"
              value={new Date(user.$createdAt).toLocaleString()}
            />
            <DetailItem
              label="Updated At"
              value={new Date(user.$updatedAt).toLocaleString()}
            />
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <ActionButton label="Delete User" color="red" />
            <ActionButton label="Edit User" color="blue" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for individual detail items
const DetailItem = ({ label, value }) => (
  <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value}</p>
  </div>
);

// Component for buttons
const ActionButton = ({ label, color }) => {
  const baseStyle = "py-2 px-6 rounded-lg shadow transition font-semibold";
  const colors = {
    red: "bg-red-600 text-white hover:bg-red-500",
    blue: "bg-blue-600 text-white hover:bg-blue-500",
  };

  return <button className={`${baseStyle} ${colors[color]}`}>{label}</button>;
};

export default UserViewPage;
