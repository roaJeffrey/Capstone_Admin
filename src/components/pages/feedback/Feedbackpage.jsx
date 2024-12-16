import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { databases } from "../../../appwrite/AppwriteConfig";
import Loader from "../../common/Loader";
import Page from "../../common/Page";
import Main from "../../common/Main";
import Section from "../../common/Section";
import Deletemodal from "../../common/Deletemodal";
import Actiondropdown from "../../common/Actiondropdown";
import { FaTrash } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";

function Feedbackpage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await databases.listDocuments(
          "673b418100295c788a93", // Database ID
          "673b41eb00014cd85e47" // Feedback Collection ID
        );
        setFeedbackList(response.documents);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const deleteFeedback = async (feedbackId) => {
    try {
      await databases.deleteDocument(
        "673b418100295c788a93", // Database ID
        "673b41eb00014cd85e47", // Feedback Collection ID
        feedbackId
      );
      setFeedbackList((prev) => prev.filter((item) => item.$id !== feedbackId));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const openDeleteModal = (feedbackId) => {
    setFeedbackIdToDelete(feedbackId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setFeedbackIdToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const viewFeedback = (feedback) => {
    navigate(`/feedback/view/${feedback.$id}`, { state: { feedback } });
  };

  return (
    <Page>
      <Main>
        <Section title="Feedback">
          {isLoading ? (
            <Loader />
          ) : (
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
                      <td className="border-b border-gray-300 p-3">
                        {feedback.user
                          ? `${feedback.user.firstname} ${feedback.user.lastname}`
                          : "Anonymous"}
                      </td>
                      <td className="border-b border-gray-300 pl-5">
                        {feedback.feedbacktext.length > 50
                          ? `${feedback.feedbacktext.substring(0, 50)}...`
                          : feedback.feedbacktext}
                      </td>
                      <td className="border-b border-gray-300 pl-4">
                        {new Date(feedback.$createdAt).toLocaleDateString()}
                      </td>
                      <td className="border-b border-gray-300 pl-4">
                        <Actiondropdown
                          options={[
                            {
                              label: "View Feedback",
                              icon: CgDetailsMore,
                              onClick: () => viewFeedback(feedback),
                              textColor: "text-gray-800",
                              hoverColor: "hover:bg-gray-200",
                            },
                            {
                              label: "Delete",
                              icon: FaTrash,
                              onClick: () => openDeleteModal(feedback.$id),
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
          )}
        </Section>
      </Main>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Deletemodal
          title="Delete feedback?"
          onConfirm={deleteFeedback} // Use deleteFeedback function for feedback deletion
          onCancel={closeDeleteModal} // Close the modal on cancel
          itemToDelete={feedbackIdToDelete} // Pass the feedback ID to be deleted
        />
      )}
    </Page>
  );
}

export default Feedbackpage;
