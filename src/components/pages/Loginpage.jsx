import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.js';

function Loginpage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect to /home if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const loginUser = async () => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in. Please try again.');
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="flex justify-center items-center h-screen font-sans bg-gray-50">
      <div className="flex flex-col items-center w-1/2 p-8 border-r border-gray-200">
        <img src="/logo/Coffeebyte_Logoportrait.png" className="mx-auto" style={{ width: '20rem' }} />
      </div>

      <div className="flex flex-col text-left items-center w-1/2 p-8">
        <h2 className="text-3xl font-semibold text-custom-green mb-2">Welcome!</h2>
        <p className="text-black mb-6">Scan smarter, farm better</p>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              required
              className={`w-full px-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-green ${error ? "border-red-500" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-green ${error ? "border-red-500" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
            />
            <span 
              onClick={togglePasswordVisibility} 
              className="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            type="submit" 
            className="w-full mt-30 bg-custom-green text-white py-2 rounded hover:bg-green-800 transition-colors duration-200"
          >
            Login
          </button>

          <a href="#" className="flex justify-center text-sm text-custom-green hover:underline text-right block">
            Forgot Password?
          </a>

        </form>
      </div>
    </div>
  );
}

export default Loginpage;

