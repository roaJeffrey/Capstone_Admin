import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { databases } from "../../appwrite/AppwriteConfig";
import {
  FaCommentDots,
  FaTrash,
  FaUser,
  FaUserFriends,
  FaLeaf,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { usePageContext } from "../layout/PageContext";
import Loader from "../common/Loader";

function FeedbackPage() {
  const navigate = useNavigate();
  const { setPageTitle, setPageDescription } = usePageContext();
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionOpen, setIsActionOpen] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // Header
  useEffect(() => {
    setPageTitle("Feedback");
    setPageDescription("View your employee's feedback.");
  }, [setPageTitle, setPageDescription]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await databases.listDocuments(
          "673b418100295c788a93", // Database ID
          "673b41eb00014cd85e47" // Feedback Collection ID
        );
        setFeedbackList(response.documents); // Store the full feedback data with users
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Delete a Feedback
  const deleteFeedback = async (feedbackId) => {
    try {
      await databases.deleteDocument(
        "673b418100295c788a93", // Database ID
        "673b41eb00014cd85e47", // Collection ID
        feedbackId // Feedback Document ID
      );
      setFeedbackList(feedbackList.filter((item) => item.$id !== feedbackId));
      alert("Feedback deleted successfully!");
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("Failed to delete feedback.");
    }
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const toggleActionDropdown = (feedbackId) => {
    // Close the dropdown if the same feedback is clicked, otherwise open it
    setIsActionOpen(isActionOpen === feedbackId ? null : feedbackId);
  };

  const handleDeleteClick = (userId) => {
    // Add the logic to delete the user
    console.log(`Delete user with ID: ${userId}`);
    // Perform the delete operation, such as calling an API or updating state
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content */}
      <main className="flex-1 pr-8 pl-8 pb-8 pt-5 bg-gray-100">
        <section className="bg-white rounded-lg shadow p-4 mt-2">
          <div className="flex justify-between items-center border-b-[1px] border-black pb-2 mb-2">
            <h1 className="text-base lg:text-lg font-bold">Feedback</h1>
          </div>

          {feedbackList.length > 0 ? (
            <>
              <div className="table-container max-h-[450px]">
                <table className="table-auto w-full">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr className="text-gray-500 border-b border-gray-300 text-left">
                      <th className="p-3">Name</th>
                      <th className="pl-5">Feedback</th>
                      <th className="pl-4">Time</th>
                      <th className="pl-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackList.map((feedback) => (
                      <tr key={feedback.$id}>
                        {/* User Name */}
                        <td className="border-b border-gray-300 p-3 align-text-middle">
                          {feedback.user
                            ? `${feedback.user.firstname} ${feedback.user.lastname}`
                            : "Anonymous"}
                        </td>

                        {/* Feedback Text */}
                        <td className="border-b border-gray-300 pl-5">
                          {feedback.feedbacktext.length > 50
                            ? `${feedback.feedbacktext.substring(0, 50)}...`
                            : feedback.feedbacktext}
                        </td>

                        {/* Time Created */}
                        <td className="border-b border-gray-300 pl-4">
                          {new Date(feedback.$createdAt).toLocaleDateString()}
                        </td>

                        {/* Action Dropdown */}
                        <td className="border-b border-gray-300 pl-4">
                          <div className="relative">
                            <button
                              onClick={() => toggleActionDropdown(feedback.$id)} // Use feedback.$id instead of user.$id
                              className="inline-flex items-center justify-center text-blue-500 px-5 py-1 rounded-md text-sm"
                            >
                              <BsThreeDots />
                            </button>
                            {isActionOpen === feedback.$id && ( // Show dropdown only if this feedback's id is open
                              <div className="absolute bg-white shadow-md rounded-md mt-2 p-2 w-[12em] border border-gray-300 z-20 right-[2rem]">
                                <button className="text-gray-800 text-left hover:bg-gray-200 px-4 py-2 rounded-md text-sm w-full flex items-center">
                                  <CgDetailsMore className="mr-3" />
                                  View Feedback
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteClick(feedback.$id)
                                  } // Use feedback.$id for deletion
                                  className="text-red-600 text-left hover:bg-red-200 px-4 py-2 rounded-md text-sm w-full flex items-center"
                                >
                                  <FaTrash className="mr-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </section>
      </main>
    </div>
  );
}

export default FeedbackPage;
