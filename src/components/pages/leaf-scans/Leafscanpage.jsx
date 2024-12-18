import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { databases } from "../../../appwrite/AppwriteConfig";
import { usePagecontext } from "../../layout/Pagecontext";
import Loader from "../../common/Loader";
import Page from "../../common/Page";
import Main from "../../common/Main";
import Section from "../../common/Section";
import Tablecontent from "../../common/Tablecontent";
import Actiondropdown from "../../common/Actiondropdown";
import { FaTrash } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import Deletemodal from "../../common/Deletemodal";
import { databaseId, scanImageCollectionId } from "../../../constants/constants";

function Leafscanpage() {
  const [loading, setLoading] = useState(false);
  const { setPageTitle, setPageDescription } = usePagecontext();
  const [scanImages, setScanImages] = useState([]);
  const [isActionOpen, setIsActionOpen] = useState(null);
  const [scanIdToDelete, setScanIdToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Header Setup
  useEffect(() => {
    setPageTitle("Leaf Diseases");
    setPageDescription("View the types of leaf diseases.");
  }, [setPageTitle, setPageDescription]);

  // Fetch Scanned Images
  useEffect(() => {
    const fetchScanImages = async () => {
      setLoading(true);
      try {
        const scanResponse = await databases.listDocuments(
          databaseId,
          scanImageCollectionId
        );

        const imagesWithDetails = scanResponse.documents.map((image) => ({
          ...image,
          user: image.user || { firstname: "N/A", lastname: "" },
          imageUrl: image.image.startsWith("data:")
            ? image.image
            : `data:image/jpeg;base64,${image.image}`,
        }));

        setScanImages(imagesWithDetails);
      } catch (error) {
        console.error("Failed to fetch scan images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanImages();
  }, []);

  // Dropdown and Delete Handlers
  const toggleActionDropdown = (scanId) => {
    setIsActionOpen((prev) => (prev === scanId ? null : scanId));
  };

  const handleDeleteClick = (scanId) => {
    setScanIdToDelete(scanId);
    setShowDeleteModal(true);
  };

  const deleteScan = async (scanId) => {
    try {
      await databases.deleteDocument(databaseId, scanImageCollectionId, scanId);
      setScanImages((prev) => prev.filter((image) => image.$id !== scanId));
      console.log("Scan deleted successfully.");
    } catch (error) {
      console.error("Failed to delete scan:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Table Columns
  const columns = ["Image", "Disease Name", "Label", "User", "Date Scanned", "Actions"];

  // Render Table Row
  const renderRow = (image) => (
    <>
      <td className="p-2 flex justify-center items-center">
        <img  y
          src={image.imageUrl}
          alt={image.diseasename || "No Image"}
          className="w-20 h-20 object-cover rounded"
        />
      </td>
      <td className="p-2">{image.diseasename || "N/A"}</td>
      <td className="p-2">
        <span
          className={`px-3 py-1 rounded-full text-white ${
            image.label === "Severe"
              ? "bg-red-500"
              : image.label === "Moderate"
              ? "bg-orange-500"
              : image.label === "Mild"
              ? "bg-yellow-500"
              : image.label === "Low"
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
        >
          {image.label || "N/A"}
        </span>
      </td>
      <td className="p-2">
        {image.user.firstname} {image.user.lastname}
      </td>
      <td className="p-2">{new Date(image.$createdAt).toLocaleDateString()}</td>
      <td className="p-2">
        <Actiondropdown
          isOpen={isActionOpen === image.$id}
          onToggle={() => toggleActionDropdown(image.$id)}
          options={[
            {
              label: "View Image",
              icon: FaImage,
              onClick: () => navigate(`/leaf/view/${image.$id}`),
            },
            {
              label: "Delete",
              icon: FaTrash,
              onClick: () => handleDeleteClick(image.$id),
              textColor: "text-red-600",
            },
          ]}
        />
      </td>
    </>
  );

  return (
    <Page>
      <Main>
        <Section title="Scanned Leaf Images">
          {loading ? (
            <Loader />
          ) : (
            <Tablecontent
              data={scanImages}
              columns={columns}
              renderRow={renderRow}
              isLoading={loading}
            />
          )}
        </Section>
      </Main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Deletemodal
          title="Delete this scanned leaf data?"
          itemToDelete={scanIdToDelete}
          onConfirm={() => deleteScan(scanIdToDelete)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Page>
  );
}

export default Leafscanpage;
