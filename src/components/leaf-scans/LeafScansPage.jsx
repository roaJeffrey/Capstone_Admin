import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../appwrite/AppwriteConfig';
import { usePageContext } from '../layout/PageContext';

function LeafPage() {
  const navigate = useNavigate();
  const { setPageTitle, setPageDescription } = usePageContext();
  const [scanImages, setScanImages] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const sortRef = useRef(null);

  const databaseId = "673b418100295c788a93"; // Database ID
  const scanImageCollectionId = "673b41e20028c51fd641"; // Scan_Images ID
  const userCollectionId = "673b41c1003840fb1cd8"; // User ID

  // Header
  useEffect(() => {
    setPageTitle("Leaf Diseases");
      setPageDescription("View the types of leaf diseases.");
  }, [setPageTitle, setPageDescription]);
  

  useEffect(() => {
    const fetchScanImages = async () => {
      try {
        // Fetch scan images
        const scanResponse = await databases.listDocuments(databaseId, scanImageCollectionId);
        const scanImagesData = scanResponse.documents;
        console.log("Fetched Scan Images:", scanImagesData);

        // Merge user details into scan images
        const imagesWithUserDetails = scanImagesData.map((image) => ({
          ...image,
          user: image.user || { firstname: "N/A", lastname: "" }, // Handle missing user data
          imageUrl: image.image ? `data:image/jpeg;base64,${image.image}` : "https://via.placeholder.com/150", // Handle Base64 image data
        }));

        setScanImages(imagesWithUserDetails);
      } catch (error) {
        console.error("Failed to fetch scan images:", error);
      }
    };

    fetchScanImages();
  }, []);

  // Handle click outside dropdown to close
  const handleClickOutside = (event) => {
    if (sortRef.current && !sortRef.current.contains(event.target)) {
      setIsSortOpen(false);
    }
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setIsAccountOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSortDropdown = () => {
    setIsSortOpen(!isSortOpen);
  };
  
  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen">
  
      {/* Main Content */}
      <main className="flex-1 p-20 lg:pr-8 lg:pl-8 lg:pb-8 lg:pt-5 bg-gray-100">
  
        {/* Scan Images Table */}
        <section className="bg-white rounded-lg shadow p-4 mt-2">
          <div className="flex justify-between items-center border-b-[1px] border-black pb-2 mb-2">
            <h3 className="text-base lg:text-lg font-bold">Scan Images</h3>
          </div>
  
          {/* Table */}
          <div className="table-container max-h-[450px] overflow-y-auto">
            <table className="table-auto w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="text-gray-500 border-b border-gray-300 text-left">
                  <th className="pt-3 pb-3 pl-4">Image</th>
                  <th className="pl-4">Disease Name</th>
                  <th className="pl-4">Severity</th>
                  <th className="pl-4">Label</th>
                  <th className="pl-4">User</th>
                  <th className="pl-4">Date Scanned</th>
                </tr>
              </thead>
              <tbody>
                {scanImages.map((image) => (
                  <tr key={image.$id} className="hover:bg-gray-50 pb-10">
                    <td className="border-b border-gray-300 pl-4">
                      <img
                        src={image.imageUrl}
                        alt={image.diseasename || "No Image"}
                        className="w-16 lg:w-20 h-16 lg:h-20 object-contain rounded"
                      />
                    </td>
                    <td className="border-b border-gray-300 pl-4">{image.diseasename || "N/A"}</td>
                    <td className="border-b border-gray-300 pl-4">
                      {image.severity ? parseFloat(image.severity).toFixed(2) : "N/A"}
                    </td>
                    <td className="border-b border-gray-300 pl-4">{image.label || "N/A"}</td>
                    <td className="border-b border-gray-300 pl-4">
                      {image.user.firstname} {image.user.lastname}
                    </td>
                    <td className="border-b border-gray-300 pl-4">
                      {new Date(image.$createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}  

export default LeafPage;
