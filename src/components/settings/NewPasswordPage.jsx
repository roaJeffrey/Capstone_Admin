import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../../appwrite/AppwriteConfig';

function NewPasswordPage() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
  
    const handleChangePassword = async (e) => {
      e.preventDefault();
  
      if (newPassword !== confirmPassword) {
        setMessage("New passwords do not match.");
        setIsSuccess(false);
        return;
      }
  
      try {
        await account.updatePassword(newPassword, oldPassword);
        setMessage("Password updated successfully!");
        setIsSuccess(true);
      } catch (error) {
        console.error("Error updating password:", error);
        setMessage("Failed to update password. Please check your old password.");
        setIsSuccess(false);
      }
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
              <Link to="/feedback" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                Feedback
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
        {/* Header */}
        <header className="flex items-center justify-between border-b-[1px] border-black pb-5 pl-5 pr-10">
          <div>
            <h3 className="text-gray-500">Welcome</h3>
            <h1 className="text-2xl font-bold">Change Password</h1>
          </div>
          <div className="text-3xl">
            <Link 
              to="/profile" 
              className="block p-4 bg-trasparent rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg"
            >
              👤
            </Link>
          </div>
        </header>
        
        {/* New Password */}
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-md">
                {message && (
                    <p
                        className={`text-center mb-4 text-sm font-medium ${
                            isSuccess ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {message}
                    </p>
                )}
                <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                            Old Password
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="p-3 text-white bg-custom-green rounded-md hover:bg-custom-green"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
};

export default NewPasswordPage
