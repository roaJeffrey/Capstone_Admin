import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AiOutlineLoading } from "react-icons/ai";

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
          <div className="flex flex-col justify-center items-center h-screen w-screen relative">
            {/* Loading spinner centered */}
            <div className="flex justify-center items-center mb-5">
              <AiOutlineLoading className="text-8xl text-gray-500 animate-spin" />
            </div>
      
            {/* Logo positioned at the bottom */}
            <div className="absolute bottom-10">
              <img
                src="/logo/Coffeebyte_Logolandscape.png"
                className="w-[15rem] h-auto"
                alt="Logo"
              />
            </div>
          </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};
