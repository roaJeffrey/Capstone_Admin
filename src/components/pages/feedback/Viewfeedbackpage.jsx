import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function ViewFeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract feedback data passed from Feedbackpage
  const feedback = location.state?.feedback;

  if (!feedback) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">
          No feedback selected. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold pb-3 mb-5 border-b">Feedback Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Information */}
            <div className="mb-3">
              <p className="text-xl font-bold font-semibold">
                {feedback.user
                  ? `${feedback.user.firstname} ${feedback.user.lastname}`
                  : "Anonymous"}
              </p>
              <p className="text-gray-700">
                {new Date(feedback.$createdAt).toLocaleDateString()} {", "}
                {new Date(feedback.$createdAt).toLocaleTimeString()}
              </p>
            </div>

            {/* Feedback Text */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-gray-500 font-semibold mb-2">Feedback Context:</h3>
              <p className="text-gray-700 border rounded p-4 bg-gray-50">
                {feedback.feedbacktext}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ViewFeedbackPage;
