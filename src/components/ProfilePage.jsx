import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases } from '../appwrite/AppwriteConfig';

function ProfilePage() {
    const navigate = useNavigate();

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
                  Home
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
                <Link to="/heatmap" className="block pl-2 pb-5 bg-custom-green transition duration-300 text-white border-b-[1px] border-white">
                  Heat Map
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
              <h1 className="text-2xl font-bold">Lorhem Ipsum</h1>
            </div>
            <div className="text-3xl">👤</div>
          </header>
          <p>PROFILE</p>
        </main>
      </div>
    );
  };

export default ProfilePage
