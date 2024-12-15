import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { databases } from "../../../appwrite/AppwriteConfig";
import { usePagecontext } from "../../layout/Pagecontext";
import Loader from "../../common/Loader";
import Page from "../../common/Page";
import Main from "../../common/Main";
import Section from "../../common/Section";
import Actiondropdown from "../../common/Actiondropdown";
import { FaTrash } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import Deletemodal from "../../common/Deletemodal";

function Leafscanpage() {
  const [loading, setLoading] = useState(false);
  const { setPageTitle, setPageDescription } = usePagecontext();
  const [scanImages, setScanImages] = useState([]);
  const [isActionOpen, setIsActionOpen] = useState(null); // Tracks which dropdown is open
  const [scanIdToDelete, setScanIdToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const databaseId = "673b418100295c788a93"; // Database ID
  const scanImageCollectionId = "673b41e20028c51fd641"; // Scan_Images ID

  // Header
  useEffect(() => {
    setPageTitle("Leaf Diseases");
    setPageDescription("View the types of leaf diseases.");
  }, [setPageTitle, setPageDescription]);

  // Fetch scan images
  useEffect(() => {
    const fetchScanImages = async () => {
      setLoading(true);

      try {
        const scanResponse = await databases.listDocuments(
          databaseId,
          scanImageCollectionId
        );
        const scanImagesData = scanResponse.documents;

        const imagesWithUserDetails = scanImagesData.map((image) => ({
          ...image,
          user: image.user || { firstname: "N/A", lastname: "" }, // Handle missing user data
          imageUrl: image.image.startsWith("data:")
            ? image.image // Use as-is if already includes MIME type prefix
            : `data:image/jpeg;base64,${image.image}`, // Add prefix if missing
        }));

        setScanImages(imagesWithUserDetails);
      } catch (error) {
        console.error("Failed to fetch scan images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanImages();
  }, []);

  const toggleActionDropdown = (scanId) => {
    // Close the dropdown if the same scan is clicked
    isActionOpen === scanId ? setIsActionOpen(null) : setIsActionOpen(scanId);
  };

  const handleDeleteClick = (scanId) => {
    setScanIdToDelete(scanId);
    setShowDeleteModal(true);
  };

  const deleteScan = async (scanId) => {
    try {
      await databases.deleteDocument(databaseId, scanImageCollectionId, scanId);
      setScanImages((prevImages) =>
        prevImages.filter((image) => image.$id !== scanId)
      );
      console.log("Scan deleted successfully.");
    } catch (error) {
      console.error("Failed to delete scan:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <Page>
      <Main>
        <Section title="Scan Images">
          {scanImages.length > 0 ? (
            <div className="table-container max-h-[450px] overflow-y-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="text-gray-500 border-b border-gray-300 text-left">
                    <th className="p-3">Image</th>
                    <th>Disease Name</th>
                    <th>Label</th>
                    <th>User</th>
                    <th>Date Scanned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scanImages.map((image) => (
                    <tr key={image.$id} className="border-b border-gray-300">
                      <td>
                        <img
                          src={image.imageUrl}
                          alt={image.diseasename || "No Image"}
                          className="w-20 lg:w-20 h-20 lg:h-30"
                        />
                      </td>
                      <td>{image.diseasename || "N/A"}</td>
                      <td>{image.label || "N/A"}</td>
                      <td>
                        {image.user.firstname} {image.user.lastname}
                      </td>
                      <td>{new Date(image.$createdAt).toLocaleDateString()}</td>
                      <td className="item-center z-50">
                        <Actiondropdown
                          isOpen={isActionOpen}
                          onToggle={toggleActionDropdown}
                          id={image.$id}
                          options={[
                            {
                              label: "View Image",
                              icon: FaImage,
                              onClick: () => navigate(`/leaf/view/${image.$id}`),
                              textColor: "text-gray-800",
                              hoverColor: "hover:bg-gray-200",
                            },
                            {
                              label: "Delete",
                              icon: FaTrash,
                              onClick: () => handleDeleteClick(image.$id),
                              textColor: "text-red-600",
                              hoverColor: "hover:bg-red-200",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Loader />
          )}
        </Section>
      </Main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <Deletemodal
          title="Delete scanned leaf data?"
          itemToDelete={scanIdToDelete}
          onConfirm={deleteScan}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Page>
  );
}

export default Leafscanpage;
