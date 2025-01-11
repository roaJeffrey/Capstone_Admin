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
  const [activeTab, setActiveTab] = useState("Details"); // Track active tab

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

  const renderIntervention = (label) => {
    switch (label) {
      case "Low":
        return (
          <ul className="list-disc list-inside">
            <li>Conduct regular monitoring of the tree for early signs of disease progression.</li>
            <li>Apply organic or mild fungicides to affected areas to prevent further spread.</li>
            <li>Ensure optimal growing conditions by maintaining proper irrigation and nutrient levels.</li>
          </ul>
        );
      case "Mild":
        return (
          <ul className="list-disc list-inside">
            <li>Remove and dispose of affected leaves or branches to contain the spread.</li>
            <li>Increase the frequency of monitoring to detect further damage.</li>
            <li>Apply targeted fungicides or pest control measures as recommended for the specific disease.</li>
            <li>Enhance the tree’s health by supplementing with fertilizers and adjusting irrigation schedules.</li>
          </ul>
        );
      case "Moderate":
        return (
          <ul className="list-disc list-inside">
            <li>Prune heavily affected branches to reduce the disease load on the tree.</li>
            <li>Use systemic fungicides or treatments that penetrate the tree and target the disease internally.</li>
            <li>Implement stricter quarantine and sanitation measures in the surrounding area to prevent cross-contamination.</li>
            <li>Consult agricultural experts for advanced diagnostic tests and disease management advice.</li>
          </ul>
        );
      case "Severe":
        return (
          <ul className="list-disc list-inside">
            <li>Consider removing and safely disposing of the entire tree if the damage is beyond recovery to prevent the disease from spreading to nearby trees.</li>
            <li>Conduct soil testing and treatment to ensure the area is free of pathogens before replanting.</li>
            <li>Implement area-wide pest or disease control strategies, including crop rotation or planting resistant tree varieties.</li>
            <li>Collaborate with agricultural extension services or experts for long-term recovery plans for the farm.</li>
          </ul>
        );
      default:
        return <p className="text-gray-500">No intervention available for this label.</p>;
    }
  };

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

          {/* Right Side - Tabs */}
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className="pb-5 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">{leaf?.diseasename || "None"}</h2>
            </div>

            <div className="mb-5 border-b">
              <div className="flex space-x-4">
                {['Details', 'Intervention'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-medium ${
                      activeTab === tab
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-blue-500'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {activeTab === 'Details' && (
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
                  <div>
                    <p className="text-gray-500">Date Scanned:</p>
                    <p className="font-medium">
                      {leaf ? new Date(leaf.$createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Intervention' && leaf?.label && (
                <div>
                  {renderIntervention(leaf.label)}
                </div>
              )}
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
