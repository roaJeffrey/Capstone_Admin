import React, { createContext, useState, useContext, useEffect } from 'react';
import { account } from '../appwrite/AppwriteConfig';
import { AiOutlineLoading } from "react-icons/ai";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the authenticated user
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks authentication errors

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userSession = await account.get(); // Fetch the current session
        setUser(userSession);
      } catch (err) {
        setUser(null); // No valid session
      } finally {
        setLoading(false); // Done checking
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password); // Create a session
      setUser(await account.get()); // Update user with current session info
      setError(null); // Clear errors
      return session;
    } catch (err) {
      setError('Invalid login credentials.'); // Set an error message
      throw err; // Re-throw for the caller to handle
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await account.deleteSession('current'); // Delete the current session
      setUser(null); // Clear the user state
    } catch (err) {
      setError('Failed to log out.'); // Set an error if logout fails
      throw err;
    }
  };

  // Context value to provide
  const value = {
    user, // The logged-in user
    setUser, // Ensure setUser is included in the context value
    login, // Login function
    logout, // Logout function
    loading, // Loading state
    error, // Error message
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex flex-col justify-center items-center h-screen w-screen relative">
          {/* Loading spinner centered */}
          <div className="flex justify-center items-center mb-5">
            <AiOutlineLoading className="text-8xl text-custom-green animate-spin" />
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
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
