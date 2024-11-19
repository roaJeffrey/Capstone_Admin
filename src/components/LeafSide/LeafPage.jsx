import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../../appwrite/AppwriteConfig';

function LeafPage() {
  const navigate = useNavigate();
  const [scanImages, setScanImages] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const databaseId = "673b418100295c788a93"; // Database ID
  const scanImageCollectionId = "673b41e20028c51fd641"; // Scan_Images ID
  const userCollectionId = "673b41c1003840fb1cd8"; // User ID

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
          imageUrl: image.image || "https://via.placeholder.com/150", // Handle missing image URL
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

  const logoutUser = async () => {
    try {
      await account.deleteSession('current');
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-custom-green text-white flex flex-col justify-between p-5">
        <div>
          <h2 className="text-2xl font-bold">CoffeeByte</h2>
          <nav className="mt-14">
            <ul className="space-y-5">
            <li>
              <Link to="/home" className="block p-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
              Overview
              </Link>
            </li>
            <li>
              <Link to="/user" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                User Management
              </Link>
            </li>
            <li>
              <Link to="/leaf" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                Leaf Disease
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white">
                Settings
              </Link>
            </li>
            </ul>
          </nav>
        </div>
        <button 
          onClick={logoutUser} 
          className="mt-auto py-2 border border-white rounded text-white"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <header className="flex items-center justify-between border-b-[1px] border-black pb-5 pl-5 pr-10">
          <div>
            <h1 className="text-2xl font-bold">Tree Condition</h1>
            <h3 className="text-gray-500">View the tree condition.</h3>
          </div>
          <div className="text-3xl">👤</div>
        </header>

        {/* Scan Images Table */}
        <section className="bg-white rounded-lg shadow p-4 mt-10">
          <div className="flex justify-between items-center border-b-[1px] border-black pb-2 mb-2">
            <h3 className="text-lg font-bold">Scan Images</h3>
            <div className="flex space-x-4 items-center">
              {/* Search Input */}
              <div className="flex items-center bg-white rounded-lg px-4 py-2 border">
                <input
                  type="text"
                  placeholder="Search user..."
                  className="outline-none bg-transparent text-gray-700 placeholder-gray-500 w-64"
                />
              </div>

              {/* Sort Button */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={toggleSortDropdown}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition duration-300 border"
                >
                  Sort
                </button>

                {isSortOpen && (
                  <div className="absolute bg-white right-1 shadow-md rounded-md mt-2 p-2 z-10 w-40">
                    <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                      Sort by Name
                    </button>
                    <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                      Sort by Time
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="table-auto w-full">
            <thead>
              <tr className="text-gray-500 border-b border-gray-300 text-left">
                <th className="pt-5 pb-5">Image</th>
                <th>Disease Name</th>
                <th>Severity</th>
                <th>Label</th>
                <th className="pl-5">User</th>
                <th>Date Scanned</th>
              </tr>
            </thead>
            <tbody>
              {scanImages.map((image) => (
                <tr key={image.$id}>
                  <td className="border-b border-gray-300">
                    <img
                      src={image.imageUrl}
                      alt={image.diseasename || "No Image"}
                      className="w-20 h-20 object-contain rounded"
                    />
                  </td>
                  <td className="border-b border-gray-300">{image.diseasename || "N/A"}</td>
                  <td className="border-b border-gray-300">{image.severity || "N/A"}</td>
                  <td className="border-b border-gray-300">{image.label || "N/A"}</td>
                  <td className="border-b border-gray-300 pl-5">
                    {image.user.firstname} {image.user.lastname}
                  </td>
                  <td className="border-b border-gray-300">
                    {new Date(image.$createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default LeafPage;
