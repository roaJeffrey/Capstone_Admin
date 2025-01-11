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
      <div className="absolute inset-0 bg-cover bg-center h-screen">
        <img src="/logo/Coffeebyte_bg.jpg" className="w-full h-full object-cover"/>
      </div>

      <div className="flex flex-col px-10 pb-8 shadow-lg border rounded-2xl border-white items-center w-1/8 z-10">
        <img src="/logo/Coffeebyte_Logolandscape.png" className="w-[15em]"/>
        <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>

        <form className="w-[300px] max-w-sm" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input
              type="email"
              id="email"
              placeholder=" "
              required
              className={`peer w-full px-4 pt-5 pb-2 text-white bg-custom-green border-b focus:outline-none focus:none ${ error ? "border-red-500" : "border-white-300" }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
            />
            <label
              htmlFor="email"
              className="absolute text-white text-sm transition-all duration-200 left-4 top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white-300 peer-focus:top-0 peer-focus:text-sm peer-focus:text-white-300"
            >
              Email
            </label>
          </div>

          <div className="relative w-full mt-3">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder=" "
              required
              className={`peer w-full px-4 pt-5 pb-2 text-white bg-custom-green border-b focus:outline-none focus:none ${ error ? "border-red-500" : "border-white-300" }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
            />
            <label
              htmlFor="password"
              className="absolute text-white text-sm transition-all duration-200 left-4 top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white-300 peer-focus:top-0 peer-focus:text-sm peer-focus:text-white-300"
            >
              Password
            </label>
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-8 transform -translate-y-1/2 cursor-pointer text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>


          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            type="submit" 
            className="w-full mt-20 bg-custom-brown text-white py-2 rounded hover:bg-amber-900 transition-colors duration-200"
          >
            Login
          </button>

          <a href="#" className="flex justify-center mt-5 text-sm text-white hover:underline text-right block">
            Forgot Password?
          </a>

        </form>
      </div>
    </div>
  );
}

export default Loginpage;

