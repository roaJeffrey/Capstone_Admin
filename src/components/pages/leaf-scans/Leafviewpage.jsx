import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import { databases } from "../../../appwrite/AppwriteConfig";
import { usePagecontext } from "../../layout/Pagecontext";
import { FaTrash } from "react-icons/fa";
import Main from "../../common/Main";
import Page from "../../common/Page";
import Loader from "../../common/Loader"; // Import the Loader component

const Leafviewpage = () => {
  const { setPageTitle, setPageDescription } = usePagecontext();
  const { leaf_id } = useParams();
  const [leaf, setLeaf] = useState(null);
  const [loading, setLoading] = useState(true); // Track the loading state

  // Header Setup
  useEffect(() => {
    setPageTitle("Leaf Diseases");
    setPageDescription("View the types of leaf diseases.");
  }, [setPageTitle, setPageDescription]);

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
              ? leafData.image.startsWith("data:")
                ? leafData.image // Use as-is if already includes MIME type prefix
                : `data:image/jpeg;base64,${leafData.image}` // Add prefix if missing
              : "https://via.placeholder.com/150", // Fallback image
          };

          setLeaf(leafWithImageUrl);
        }
      } catch (error) {
        console.error("Error fetching leaf:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchLeaf();
  }, [leaf_id]);

  return (
    <Page>
      <Main>
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Left Side - Image */}
          <div className="w-full md:w-1/2 bg-custom-green relative flex items-center justify-center p-6">
            {loading ? (
              <Loader color="text-white" />
            ) : (
              <img
                src={leaf?.imageUrl}
                alt={leaf?.diseasename || "No Image"}
                className="max-w-full h-auto rounded-xl shadow-xl border border-white object-contain"
              />
            )}
          </div>

          {/* Right Side - Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className="mb-5 pb-3 border-b">
              <h2 className="text-xl font-bold text-gray-800">{leaf?.diseasename || "None"}</h2>
              <p className="text-gray-600">
                <span className="font-medium">
                  {leaf ? new Date(leaf.$createdAt).toLocaleString() : "N/A"}
                </span>
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-gray-500">Severity:</p>
                <p className="font-medium">
                  {leaf?.severity ? parseFloat(leaf.severity).toFixed(2) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Label:</p>
                <p className="font-medium">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      leaf?.label === "Severe"
                        ? "bg-red-500"
                        : leaf?.label === "Moderate"
                        ? "bg-orange-500"
                        : leaf?.label === "Mild"
                        ? "bg-yellow-500"
                        : leaf?.label === "Low"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {leaf?.label || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-500">Employee:</p>
                <p className="font-medium">
                  {leaf?.user
                    ? `${leaf.user.firstname} ${leaf.user.lastname}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-auto flex justify-end">
              <button className="flex items-center text-red-500 font-medium p-2 rounded hover:bg-red-200">
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default Leafviewpage;
