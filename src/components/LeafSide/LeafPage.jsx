import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../../appwrite/AppwriteConfig';
import { FaUser, FaUserFriends, FaLeaf } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { IoPower } from "react-icons/io5";

function LeafPage() {
  const navigate = useNavigate();
  const [scanImages, setScanImages] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
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
        <aside className="w-60 bg-custom-green text-white flex flex-col justify-between">
          <div>
          <img 
            src="/logo/Coffeebyte_Logolandscape.png"
            className="w-[200px] h-auto flex ml-4 mr-4 mt-1"
          />
          <nav className="mt-5 ml-3">
            <ul className="space-y-5">
              <li>
                <Link 
                  to="/home" 
                  className="block pl-4 pt-1 pb-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <FaChartSimple className="mr-3 mt-1"/>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/user" 
                  className="block pl-4 pt-1 pb-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <FaUserFriends className="mr-4 mt-1"/>
                  User Management
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaf" 
                  className="block p-4 bg-gray-100 flex rounded-l transition duration-300 text-custom-green"
                >
                  <FaLeaf className="mr-4 mt-1"/>
                  Leaf Disease
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className="block pl-4 pt-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <MdFeedback className="mr-4 mt-1"/>
                  Feedback
                </Link>
              </li>
              </ul>
            </nav>
          </div>
          <button 
            onClick={logoutUser} 
            className="block m-5 mb-8 p-3 flex bg-custom-green transition duration-300 border border-white rounded text-white hover:bg-red-500"
          >
            <IoPower className="mr-4 mt-1"/>
            Log Out
          </button>
        </aside>

      {/* Main Content */}
      <main className="flex-1 pr-8 pl-8 pb-8 pt-5 bg-gray-100">
        {/* Header */}
        <header className="relative flex w-full items-center justify-between pb-5 pl-5 pr-10">
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200 -ml-8 -mr-8"></span>
            <div>
              <h1 className="text-2xl font-bold">Leaf Diseases</h1>
              <h3 className="text-gray-500">View the types of leaf diseases found in the farm.</h3>
            </div>

            {/* Account Button*/}
            <div className="text-3xl" ref={accountRef}>
              <button
                onClick={toggleAccountDropdown}
                className="block p-3 bg-white rounded-full shadow-md flex items-center 
                justify-center transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100"
              >
                <FaUser className="text-gray-600 size-5" />
              </button>
            </div>
              {isAccountOpen && (
                <div className="absolute bg-white right-10 top-16 shadow-md rounded-md p-2 w-80">
                  <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                    Manage Account
                  </button>
                  <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                    View Account
                  </button>
                  <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm w-full">
                    Dark Mode
                  </button>
                </div>
              )}
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
              <div className="block" ref={sortRef}>
                <button
                  onClick={toggleSortDropdown}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition duration-300 border"
                >
                  Sort
                </button>

                {isSortOpen && (
                  <div className="absolute bg-white right-12 shadow-md rounded-md mt-2 p-2 z-10 w-40">
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
