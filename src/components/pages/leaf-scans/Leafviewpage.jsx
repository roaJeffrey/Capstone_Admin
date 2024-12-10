import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import { databases } from "../../../appwrite/AppwriteConfig";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Main from "../../common/Main";
import Page from "../../common/Page";

const Leafviewpage = () => {
  const { leaf_id } = useParams();
  const [leaf, setLeaf] = useState(null);

  useEffect(() => {
    const fetchLeaf = async () => {
      try {
        const leafResponse = await databases.listDocuments(
          "673b418100295c788a93",
          "673b41e20028c51fd641", // Your collection ID for leaf data
          [Query.equal("$id", leaf_id)]
        );

        if (leafResponse.documents.length > 0) {
          const leafData = leafResponse.documents[0];
          const leafWithImageUrl = {
            ...leafData,
            imageUrl: leafData.image
              ? `data:image/jpeg;base64,${leafData.image}`
              : "https://via.placeholder.com/150", // Fallback image
          };

          setLeaf(leafWithImageUrl);
        }
      } catch (error) {
        console.error("Error fetching leaf:", error);
      }
    };
    fetchLeaf();
  }, [leaf_id]);

  if (!leaf) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Loading leaf details...</p>
      </div>
    );
  }

  return (
    <Page>
      <Main>
        {/* Leaf Header */}
        <div className="bg-custom-green p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center">
              <img
                src={leaf.imageUrl} // Display the image without rounding
                alt={leaf.diseasename || "No Image"}
                className="w-20 max-w-full rounded-xl shadow-xl border border-white object-contain" // Ensure the image maintains its aspect ratio
              />
            </div>
            <div>
              <h2 className="text-xl text-white font-semibold">Leaf ID: {leaf.$id}</h2>
            </div>
          </div>
        </div>
  
        {/* Leaf Details */}
        <div className="bg-white mt-3 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Leaf Information</h3>
            <div className="flex space-x-2">
              <button className="flex p-2 items-center justify-center text-red-500 font-medium rounded hover:bg-red-200">
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Scan Date:</p>
              <p className="font-medium">{new Date(leaf.$createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Disease Detected:</p>
              <p className="font-medium">{leaf.diseasename ? leaf.diseasename : "None"}</p>
            </div>
            <div>
              <p className="text-gray-500">Severity:</p>
              <p className="font-medium">{leaf.severity ? parseFloat(leaf.severity).toFixed(2) : "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Label:</p>
              <p className="font-medium">{leaf.label || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Employee:</p>
              <p className="font-medium">{leaf.user ? `${leaf.user.firstname} ${leaf.user.lastname}` : "N/A"}</p>
            </div>
          </div>
        </div>
      </Main>
    </Page>
      
  ); 
};

export default Leafviewpage;
