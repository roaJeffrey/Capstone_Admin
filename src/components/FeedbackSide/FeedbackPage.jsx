import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../../appwrite/AppwriteConfig';
import { FaCommentDots, FaTrash, FaUser, FaUserFriends, FaLeaf } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { IoPower } from "react-icons/io5";

function FeedbackPage() {
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const accountRef = useRef(null);
  
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

  const toggleAccountDropdown = () => {
      setIsAccountOpen(!isAccountOpen);
  };

  
  const logoutUser = async () => {
    try {
      // Delete the current session
      await account.deleteSession('current');
      // Navigate to the login page
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
                  className="block pl-4 pt-1 pb-1 flex bg-custom-green transition duration-300 text-white"
                >
                  <FaLeaf className="mr-4 mt-1"/>
                  Leaf Disease
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className="block p-4 bg-gray-100 flex rounded-l transition duration-300 text-custom-green"
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
              <h1 className="text-2xl font-bold">Feedback</h1>
              <h3 className="text-gray-500">View your employee's feedback.</h3> 
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
        
        <section className="bg-white rounded-lg shadow p-4 mt-10">
          <div className="p-2">
              <div className="space-y-4">
                  {/* Example blank review sections */}
                  {[...Array(3)].map((_, index) => (
                  <section
                      key={index}
                      className={'border rounded-lg p-4 shadow-md'}
                  >
                      <div className="flex justify-between items-center mb-2">
                      <div>
                          <h2 className="text-lg font-bold">Name Placeholder</h2>
                          <p className="text-sm text-gray-500">Date Placeholder</p>
                      </div>

                      </div>
                      <p className="text-gray-700 mb-4">Content Placeholder</p>
                      <div className="flex justify-between items-center text-gray-500 text-sm">
                      <div className="flex items-center space-x-2">
                          <FaCommentDots />
                          <span>Comments Placeholder</span>
                      </div>
                      <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 hover:text-green-500">
                          <FaCommentDots />
                          <span>Respond</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-red-500">
                          <FaTrash />
                          <span>Delete Review</span>
                          </button>
                      </div>
                      </div>
                  </section>
                  ))}
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FeedbackPage
